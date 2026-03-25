import { PredictionResult, PredictionPoint, TrendLabel } from "../../types";
import { getCoins } from "../coinservice";

const DEFAULT_ML_URL = process.env.ML_PREDICT_URL || "http://127.0.0.1:8000/predict";

interface MlApiResponse {
  predictedPrice: number;
  trend: TrendLabel;
  confidence: number;
  historical: PredictionPoint[];
  predictedSeries: PredictionPoint[];
}

function toPredictionFallback(): PredictionResult {
  const now = Date.now();
  const historical: PredictionPoint[] = Array.from({ length: 30 }).map((_, idx) => {
    const t = new Date(now - (30 - idx) * 60_000).toISOString();
    return { timestamp: t, price: 100 + idx * 0.5, sentiment: 50 + Math.sin(idx / 5) * 10 };
  });
  const predictedSeries: PredictionPoint[] = Array.from({ length: 10 }).map((_, idx) => {
    const t = new Date(now + idx * 60_000).toISOString();
    return { timestamp: t, price: 100 + (30 + idx) * 0.5, sentiment: 55 };
  });
  return {
    predictedPrice: predictedSeries[predictedSeries.length - 1].price,
    trend: "Up",
    confidence: 0.4,
    historical,
    predictedSeries,
  };
}

export async function fetchPrediction(coinId?: string): Promise<PredictionResult> {
  try {
    const url = new URL(DEFAULT_ML_URL);
    if (coinId) url.searchParams.set("coinId", coinId);
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error(`ML service returned ${res.status}`);
    const body = (await res.json()) as MlApiResponse;
    if (!body || typeof body.predictedPrice !== "number") throw new Error("Invalid ML response");
    return body;
  } catch (err) {
    // Try a heuristic fallback based on current coin prices if available.
    try {
      const coins = await getCoins();
      const coin = coinId ? coins.find((c) => c.id === coinId || c.symbol.toLowerCase() === coinId.toLowerCase()) : coins[0];
      if (coin) {
        const now = Date.now();
        const historical: PredictionPoint[] = Array.from({ length: 30 }).map((_, idx) => {
          const t = new Date(now - (30 - idx) * 60_000).toISOString();
          const price = Number(coin.price);
          const jitter = (idx - 15) * 0.001 * price;
          return { timestamp: t, price: Math.max(0.0001, price + jitter), sentiment: coin.sentiment };
        });
        const predictedSeries: PredictionPoint[] = Array.from({ length: 10 }).map((_, idx) => {
          const t = new Date(now + idx * 60_000).toISOString();
          const price = Number(coin.price) * (1 + coin.change24h / 100) + idx * 0.001 * Number(coin.price);
          return { timestamp: t, price, sentiment: coin.sentiment };
        });
        return {
          predictedPrice: predictedSeries[predictedSeries.length - 1].price,
          trend: coin.change24h > 0.1 ? "Up" : coin.change24h < -0.1 ? "Down" : "Stable",
          confidence: 0.35,
          historical,
          predictedSeries,
        };
      }
    } catch (inner) {
      // ignore and fall through
    }
    return toPredictionFallback();
  }
}
