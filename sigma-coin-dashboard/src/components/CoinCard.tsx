import { TrendingUp, TrendingDown, Minus, Zap } from "lucide-react";
import { Coin } from "../types";
import { motion } from "motion/react";

interface CoinCardProps {
  coin: Coin;
}

export default function CoinCard({ coin }: CoinCardProps) {
  const isPositive = coin.change24h > 0;
  
  const getTrendIcon = () => {
    switch (coin.trend) {
      case "Spike": return <TrendingUp className="text-accent-green" size={16} />;
      case "Drop": return <TrendingDown className="text-accent-red" size={16} />;
      default: return <Minus className="text-white/40" size={16} />;
    }
  };

  const getSentimentColor = () => {
    if (coin.sentiment > 75) return "text-accent-green";
    if (coin.sentiment < 40) return "text-accent-red";
    return "text-accent-blue";
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -5 }}
      className="glass-card p-6 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-accent-blue/20 transition-colors overflow-hidden">
            {coin.image ? (
              <img src={coin.image} alt={coin.name} className="w-full h-full object-cover p-1" referrerPolicy="no-referrer" />
            ) : (
              <span className="font-bold text-lg">{coin.symbol[0]}</span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">{coin.name}</h3>
            <span className="text-white/40 text-xs uppercase tracking-wider">{coin.symbol}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
          {isPositive ? '+' : ''}{coin.change24h}%
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-white/40 mb-1 uppercase tracking-widest">
            <span>Sentiment Index</span>
            <span className={getSentimentColor()}>{coin.sentiment}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${coin.sentiment}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-full rounded-full ${coin.sentiment > 75 ? 'bg-accent-green' : coin.sentiment < 40 ? 'bg-accent-red' : 'bg-accent-blue'}`} 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[10px] text-white/40 uppercase block mb-1">Hype Velocity</span>
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className="text-sm font-medium">{coin.trend}</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[10px] text-white/40 uppercase block mb-1">Sigma Signal</span>
            <div className="flex items-center gap-2">
              <Zap className="text-accent-blue" size={14} />
              <span className="text-sm font-medium">{coin.signal}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
          <span className="text-xl font-display font-bold">{coin.price}</span>
          <button className="text-xs font-semibold text-accent-blue hover:text-white transition-colors">
            DETAILS →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
