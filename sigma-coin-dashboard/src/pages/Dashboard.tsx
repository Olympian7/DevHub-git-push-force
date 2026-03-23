import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import TrendingCoins from "../components/TrendingCoins";
import AnalyticsSection from "../components/AnalyticsSection";
import AlertsPanel from "../components/AlertsPanel";
import InsightsPanel from "../components/InsightsPanel";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main>
        <HeroSection />
        
        <TrendingCoins />
        
        <AnalyticsSection />
        
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <AlertsPanel />
          </div>
          <div className="lg:col-span-1">
            <InsightsPanel />
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-accent-blue rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">Σ</span>
          </div>
          <span className="font-display font-bold text-white/60">SIGMA COIN</span>
        </div>
        <div className="text-white/30 text-xs">
          © 2026 Sigma Intelligence Systems. All rights reserved.
        </div>
        <div className="flex gap-6 text-white/40 text-xs font-medium">
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">API Docs</a>
        </div>
      </footer>
    </div>
  );
}
