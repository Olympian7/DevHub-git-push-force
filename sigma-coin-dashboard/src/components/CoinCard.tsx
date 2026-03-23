import { TrendingUp, TrendingDown, Minus, Zap, ChevronDown, ChevronUp, MessageSquare, Send } from "lucide-react";
import { Coin } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface CoinCardProps {
  coin: Coin;
}

export default function CoinCard({ coin }: CoinCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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
      layout
      transition={{ duration: 0.3 }}
      className="glass-card transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] group overflow-hidden"
    >
      <div className="p-6">
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
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs font-semibold text-accent-blue hover:text-white transition-colors"
            >
              {isExpanded ? 'LESS' : 'DETAILS'} 
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 bg-white/[0.02]"
          >
            <div className="p-6 space-y-4">
              <h4 className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Latest Alpha Signals</h4>
              
              {coin.scrapedPosts && coin.scrapedPosts.length > 0 ? (
                <div className="space-y-3">
                  {coin.scrapedPosts.map((post, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/5 text-xs">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2 text-white/30">
                          {post.platform === 'reddit' ? <MessageSquare size={12} /> : <Send size={12} />}
                          <span className="capitalize">{post.platform}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                          post.sentiment_label === 'positive' ? 'bg-accent-green/10 text-accent-green' : 
                          post.sentiment_label === 'negative' ? 'bg-accent-red/10 text-accent-red' : 
                          'bg-white/10 text-white/40'
                        }`}>
                          {post.sentiment_label}
                        </span>
                      </div>
                      <p className="text-white/60 line-clamp-3 italic leading-relaxed font-light">
                        "{post.text}"
                      </p>
                      <div className="mt-2 flex justify-between items-center text-[8px] text-white/20">
                          <span>Score: {post.sentiment_score}</span>
                          <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center bg-white/[0.03] rounded-xl border border-dashed border-white/10">
                  <p className="text-white/20 text-xs italic">Awaiting fresh signal data from scrapers...</p>
                  <p className="text-[8px] text-white/10 mt-1 uppercase tracking-widest">Run /scrape to update</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
