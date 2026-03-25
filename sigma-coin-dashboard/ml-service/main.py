from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Literal

import httpx
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from xgboost import XGBRegressor

TrendLabel = Literal["Up", "Down", "Stable"]

COIN_MAP: dict[str, str] = {
    "btc": "bitcoin",
    "eth": "ethereum",
    "sol": "solana",
    "doge": "dogecoin",
    "shib": "shiba-inu",
    "pepe": "pepe",
}


class PredictionPoint(BaseModel):
    timestamp: str
    price: float
    sentiment: float


class PredictionResult(BaseModel):
    predictedPrice: float
    trend: TrendLabel
    confidence: float
    historical: list[PredictionPoint]
    predictedSeries: list[PredictionPoint]


@dataclass
class SeriesFrame:
    frame: pd.DataFrame
    original: pd.DataFrame


app = FastAPI(title="Sigma Coin ML Service", version="1.0.0")


def _normalize_coin(coin_id: str | None) -> str:
    if not coin_id:
        return "dogecoin"

    value = coin_id.strip().lower()
    if value.startswith("cg_"):
        value = value[3:]

    if value in COIN_MAP:
        return COIN_MAP[value]

    return value


async def _fetch_market_chart(coin_id: str, days: int = 7) -> pd.DataFrame:
    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"
    params = {"vs_currency": "usd", "days": str(days), "interval": "hourly"}
    timeout = httpx.Timeout(15.0, connect=5.0)

    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.get(url, params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail=f"CoinGecko returned {response.status_code}")

    payload = response.json()
    prices = payload.get("prices", [])
    if not prices:
        raise HTTPException(status_code=502, detail="CoinGecko response missing prices")

    rows = [
        {
            "timestamp": datetime.fromtimestamp(point[0] / 1000, tz=timezone.utc),
            "price": float(point[1]),
        }
        for point in prices
        if len(point) >= 2
    ]

    frame = pd.DataFrame(rows)
    frame = frame.drop_duplicates(subset=["timestamp"]).sort_values("timestamp").reset_index(drop=True)
    return frame


def _feature_engineering(frame: pd.DataFrame) -> SeriesFrame:
    work = frame.copy()
    work["lag_1"] = work["price"].shift(1)
    work["lag_3"] = work["price"].shift(3)
    work["lag_6"] = work["price"].shift(6)
    work["return_1"] = work["price"].pct_change(1).fillna(0.0)
    work["rolling_mean_6"] = work["price"].rolling(6).mean()
    work["rolling_std_6"] = work["price"].rolling(6).std().fillna(0.0)
    work["hour"] = work["timestamp"].dt.hour
    work["dow"] = work["timestamp"].dt.dayofweek

    engineered = work.dropna().reset_index(drop=True)
    if engineered.empty:
        raise HTTPException(status_code=500, detail="Not enough data points for feature engineering")

    return SeriesFrame(frame=engineered, original=work)


def _confidence(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    if len(y_true) == 0:
        return 0.25

    error = np.abs((y_true - y_pred) / np.maximum(y_true, 1e-9))
    mape = float(np.mean(error))
    score = max(0.1, min(0.99, 1.0 - mape))
    return round(score, 3)


def _sentiment_from_return(price_return: float) -> float:
    base = 50.0 + price_return * 450.0
    return float(max(0.0, min(100.0, base)))


def _trend_from_change(change_ratio: float) -> TrendLabel:
    if change_ratio > 0.002:
        return "Up"
    if change_ratio < -0.002:
        return "Down"
    return "Stable"


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/predict", response_model=PredictionResult)
async def predict(
    coinId: str | None = Query(default=None),
    horizon: int = Query(default=12, ge=3, le=48),
) -> PredictionResult:
    normalized_coin = _normalize_coin(coinId)
    source = await _fetch_market_chart(normalized_coin, days=7)
    data = _feature_engineering(source)

    feature_cols = [
        "lag_1",
        "lag_3",
        "lag_6",
        "return_1",
        "rolling_mean_6",
        "rolling_std_6",
        "hour",
        "dow",
    ]

    train_size = max(20, int(len(data.frame) * 0.8))
    train = data.frame.iloc[:train_size]
    test = data.frame.iloc[train_size:]

    model = XGBRegressor(
        n_estimators=250,
        max_depth=4,
        learning_rate=0.05,
        subsample=0.9,
        colsample_bytree=0.9,
        objective="reg:squarederror",
        random_state=42,
    )

    model.fit(train[feature_cols], train["price"])

    if len(test) > 0:
        test_pred = model.predict(test[feature_cols])
        confidence = _confidence(test["price"].to_numpy(dtype=float), test_pred)
    else:
        confidence = 0.4

    latest = data.frame.iloc[-1].copy()
    recent_rows = data.frame.tail(48)

    historical: list[PredictionPoint] = []
    for _, row in recent_rows.iterrows():
        sentiment = _sentiment_from_return(float(row.get("return_1", 0.0)))
        historical.append(
            PredictionPoint(
                timestamp=row["timestamp"].isoformat(),
                price=round(float(row["price"]), 6),
                sentiment=round(sentiment, 2),
            )
        )

    predicted_series: list[PredictionPoint] = []
    predicted_prices: list[float] = []

    next_time = latest["timestamp"]
    for _ in range(horizon):
        next_time = next_time + timedelta(hours=1)

        features = pd.DataFrame(
            [
                {
                    "lag_1": float(latest["lag_1"]),
                    "lag_3": float(latest["lag_3"]),
                    "lag_6": float(latest["lag_6"]),
                    "return_1": float(latest["return_1"]),
                    "rolling_mean_6": float(latest["rolling_mean_6"]),
                    "rolling_std_6": float(latest["rolling_std_6"]),
                    "hour": float(next_time.hour),
                    "dow": float(next_time.dayofweek),
                }
            ]
        )

        predicted_price = float(model.predict(features)[0])
        predicted_prices.append(predicted_price)

        prev_price = float(latest["lag_1"])
        return_1 = (predicted_price - prev_price) / max(prev_price, 1e-9)

        sentiment = _sentiment_from_return(return_1)
        predicted_series.append(
            PredictionPoint(
                timestamp=next_time.isoformat(),
                price=round(predicted_price, 6),
                sentiment=round(sentiment, 2),
            )
        )

        lag_6 = float(latest["lag_3"])
        lag_3 = float(latest["lag_1"])
        lag_1 = predicted_price

        rolling_prices = [float(p.price) for p in (predicted_series[-6:] if len(predicted_series) >= 1 else [])]
        if len(rolling_prices) < 6:
            hist_tail = [float(p.price) for p in historical][-6 + len(rolling_prices) :]
            rolling_prices = hist_tail + rolling_prices

        rolling_mean_6 = float(np.mean(rolling_prices)) if rolling_prices else predicted_price
        rolling_std_6 = float(np.std(rolling_prices)) if rolling_prices else 0.0

        latest = pd.Series(
            {
                "timestamp": next_time,
                "price": predicted_price,
                "lag_1": lag_1,
                "lag_3": lag_3,
                "lag_6": lag_6,
                "return_1": return_1,
                "rolling_mean_6": rolling_mean_6,
                "rolling_std_6": rolling_std_6,
                "hour": next_time.hour,
                "dow": next_time.dayofweek,
            }
        )

    last_price = float(historical[-1].price) if historical else float(source.iloc[-1]["price"])
    predicted_price = predicted_series[-1].price if predicted_series else last_price
    change_ratio = (predicted_price - last_price) / max(last_price, 1e-9)
    trend = _trend_from_change(change_ratio)

    return PredictionResult(
        predictedPrice=round(predicted_price, 6),
        trend=trend,
        confidence=confidence,
        historical=historical,
        predictedSeries=predicted_series,
    )
