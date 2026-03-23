import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { mockAlerts } from "../data/mockData";
import { motion } from "motion/react";

export default function AlertsPanel() {
  const getIcon = (type: string) => {
    switch (type) {
      case "danger": return <AlertCircle className="text-accent-red" size={20} />;
      case "success": return <CheckCircle2 className="text-accent-green" size={20} />;
      case "warning": return <AlertTriangle className="text-yellow-500" size={20} />;
      default: return <Info className="text-accent-blue" size={20} />;
    }
  };

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-bold">Live Alerts</h3>
        <span className="w-2 h-2 bg-accent-red rounded-full animate-pulse" />
      </div>

      <div className="space-y-4">
        {mockAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className="mt-1">{getIcon(alert.type)}</div>
            <div className="flex-1">
              <p className="text-sm text-white/80 mb-1 leading-relaxed">{alert.message}</p>
              <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{alert.timestamp}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-6 py-3 text-xs font-bold text-white/40 hover:text-white border border-dashed border-white/10 rounded-xl transition-all">
        VIEW ALERT HISTORY
      </button>
    </div>
  );
}
