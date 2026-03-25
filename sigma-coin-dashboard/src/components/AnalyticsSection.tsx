import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Coin, PredictionPoint, PredictionResult } from "../types";
import { fetchLiveCoins } from "../services/cryptoService";
import { fetchPrediction } from "../services/predictionService";

interface PriceSeriesRow {
  time: string;
  historical?: number;
  forecast?: number;
}

function formatLabel(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:00`;
}

function toPriceRows(historical: PredictionPoint[], forecast: PredictionPoint[]): PriceSeriesRow[] {
  return [
    ...historical.map((p) => ({ time: formatLabel(p.timestamp), historical: p.price })),
    ...forecast.map((p) => ({ time: formatLabel(p.timestamp), forecast: p.price })),
  ];
}

function toSentimentRows(historical: PredictionPoint[], forecast: PredictionPoint[]): Array<{ time: string; sentiment: number }> {
  return [...historical, ...forecast].map((p) => ({ time: formatLabel(p.timestamp), sentiment: p.sentiment }));
}

export default function AnalyticsSection() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoinId, setSelectedCoinId] = useState<string>("");
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const liveCoins = await fetchLiveCoins();
        if (!mounted) return;
        setCoins(liveCoins);

        const initialId = liveCoins[0]?.id;
        setSelectedCoinId(initialId || "");

        if (initialId) {
          const result = await fetchPrediction(initialId);
          if (!mounted) return;
          setPrediction(result);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Unable to load analytics");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedCoinId) return;
    let mounted = true;

    async function refreshPrediction() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchPrediction(selectedCoinId);
        if (mounted) {
          setPrediction(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Prediction service unavailable");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    refreshPrediction();
    const interval = window.setInterval(refreshPrediction, 60_000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [selectedCoinId]);

  const selectedCoin = useMemo(() => coins.find((c) => c.id === selectedCoinId), [coins, selectedCoinId]);
  const priceSeries = useMemo(
    () => (prediction ? toPriceRows(prediction.historical, prediction.predictedSeries) : []),
    [prediction]
  );
  const sentimentSeries = useMemo(
    () => (prediction ? toSentimentRows(prediction.historical, prediction.predictedSeries) : []),
    [prediction]
  );

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold">ML Forecasts</h2>
          <p className="text-white/40 text-sm">XGBoost short-horizon forecast and momentum projection.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs uppercase tracking-widest text-white/40">Asset</label>
          <select
            value={selectedCoinId}
            onChange={(e) => setSelectedCoinId(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
          >
            {coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.symbol} - {coin.name}
              </option>
            ))}
          </select>
          {prediction ? (
            <div className="text-xs px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-white/40">Trend:</span> <span className="font-semibold">{prediction.trend}</span>
              <span className="text-white/30"> | </span>
              <span className="text-white/40">Conf:</span> <span className="font-semibold">{Math.round(prediction.confidence * 100)}%</span>
            </div>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="glass-card p-6 mb-8 text-center text-white/60">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-display font-bold">Price Forecast</h3>
              <p className="text-white/40 text-sm">
                {selectedCoin ? `${selectedCoin.name} historical + ${prediction?.predictedSeries.length || 0} step forecast` : "ML projected price path"}
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-accent-blue/10 text-accent-blue text-[10px] font-bold rounded uppercase">Model</span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#151926', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#3B82F6' }}
                />
                <Line
                  type="monotone"
                  dataKey="historical"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={false}
                  animationDuration={1200}
                  name="Historical"
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#00FFAB"
                  strokeWidth={3}
                  strokeDasharray="6 4"
                  dot={false}
                  animationDuration={1500}
                  name="Forecast"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-display font-bold">Sentiment Projection</h3>
              <p className="text-white/40 text-sm">Model-derived sentiment from expected hourly returns</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-accent-green/10 text-accent-green text-[10px] font-bold rounded uppercase">Live</span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentimentSeries}>
                <defs>
                  <linearGradient id="colorSentimentProj" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FFAB" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00FFAB" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#151926', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#00FFAB' }}
                />
                <Area
                  type="monotone"
                  dataKey="sentiment"
                  stroke="#00FFAB"
                  fill="url(#colorSentimentProj)"
                  strokeWidth={3}
                  dot={false}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {loading ? <p className="text-center text-white/50 mt-6 text-sm">Refreshing ML forecasts...</p> : null}
    </section>
  );
}
