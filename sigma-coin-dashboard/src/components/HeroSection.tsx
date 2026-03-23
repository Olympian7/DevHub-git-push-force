import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-blue/20 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-green/10 blur-[100px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
            Decode the <span className="bg-gradient-to-r from-accent-blue to-accent-green bg-clip-text text-transparent">Hype.</span><br />
            Predict the <span className="bg-gradient-to-r from-accent-green to-accent-blue bg-clip-text text-transparent">Move.</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            The ultimate crypto intelligence platform powered by Sigma AI. 
            Real-time sentiment analysis, hype velocity tracking, and predictive signals.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-accent-blue hover:bg-blue-600 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]">
              Start Analyzing
            </button>
            <button className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all">
              View Signals
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
