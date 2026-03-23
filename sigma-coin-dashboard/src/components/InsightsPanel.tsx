import { Terminal, Cpu } from "lucide-react";
import { mockInsights } from "../data/mockData";
import { motion } from "motion/react";

export default function InsightsPanel() {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Cpu className="text-accent-blue" size={20} />
        <h3 className="text-lg font-display font-bold">Sigma AI Insights</h3>
      </div>

      <div className="flex-1 space-y-6">
        {mockInsights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.2 }}
            className="relative"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-1 bg-accent-blue rounded-full" />
              <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest">{insight.author}</span>
              <span className="text-[10px] text-white/20 ml-auto">{insight.timestamp}</span>
            </div>
            <div className="bg-accent-blue/5 border-l-2 border-accent-blue p-4 rounded-r-xl">
              <p className="text-sm text-white/70 italic leading-relaxed">
                "{insight.text}"
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
          <Terminal size={14} className="text-white/40" />
          <div className="flex-1 h-4 bg-white/5 rounded animate-pulse" />
          <div className="w-2 h-4 bg-accent-blue animate-pulse" />
        </div>
      </div>
    </div>
  );
}
