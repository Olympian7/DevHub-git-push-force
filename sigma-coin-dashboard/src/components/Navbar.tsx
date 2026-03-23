import { ReactNode } from "react";
import { LayoutDashboard, TrendingUp, Bell, Lightbulb, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <span className="text-white font-bold text-xl">Σ</span>
          </div>
          <span className="text-2xl font-display font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent tracking-tight">
            SIGMA COIN
          </span>
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <NavLink icon={<TrendingUp size={18} />} label="Trends" />
          <NavLink icon={<Bell size={18} />} label="Alerts" />
          <NavLink icon={<Lightbulb size={18} />} label="Insights" />
        </div>

        {/* Right: Status & Profile */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-accent-green/10 border border-accent-green/20 rounded-full">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
            <span className="text-accent-green text-xs font-medium uppercase tracking-wider">Live</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <User size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ icon, label, active = false }: { icon: ReactNode; label: string; active?: boolean }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
        active ? "text-accent-blue" : "text-white/60 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </a>
  );
}
