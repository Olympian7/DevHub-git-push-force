import { useEffect, useState } from "react";
import { fetchLiveCoins, triggerScrape } from "../services/cryptoService";
import { Coin } from "../types";
import CoinCard from "./CoinCard";
import { motion } from "motion/react";
import { RefreshCw } from "lucide-react";

export default function TrendingCoins() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (forceScrape = false) => {
    if (forceScrape) setRefreshing(true);
    setLoading(true);
    setError(null);

    if (forceScrape) {
        await triggerScrape();
    }

    const liveData = await fetchLiveCoins();
    if (liveData.length > 0) {
      setCoins(liveData);
    } else if (coins.length === 0) {
      setError("Live market data is temporarily unavailable.");
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
    // Refresh every 60 seconds
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-display font-bold mb-2">Trending Assets</h2>
          <p className="text-white/40">Real-time hype tracking across social and market data.</p>
        </div>
        <button 
          onClick={() => loadData(true)}
          disabled={loading || refreshing}
          className="flex items-center gap-2 text-accent-blue text-sm font-semibold hover:underline disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading || refreshing ? "animate-spin" : ""} />
          {refreshing ? "Triggering AI Scrapers..." : "Refresh Live Data"}
        </button>
      </div>

      {error ? (
        <div className="glass-card p-6 text-center text-white/60">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coins.map((coin, index) => (
            <motion.div
              key={coin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <CoinCard coin={coin} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
