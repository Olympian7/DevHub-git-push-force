import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { mockChartData } from "../data/mockData";

export default function AnalyticsSection() {
  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Trend Chart */}
        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-display font-bold">Sentiment Trend</h3>
              <p className="text-white/40 text-sm">Aggregated market mood over 24h</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-accent-blue/10 text-accent-blue text-[10px] font-bold rounded uppercase">24H</span>
              <span className="px-2 py-1 bg-white/5 text-white/40 text-[10px] font-bold rounded uppercase">7D</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#ffffff20" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151926', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#3B82F6' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sentiment" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSentiment)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Signal Volume Chart */}
        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-display font-bold">Signal Volume</h3>
              <p className="text-white/40 text-sm">AI-generated trade signals frequency</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-accent-green/10 text-accent-green text-[10px] font-bold rounded uppercase">Live</span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#ffffff20" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#151926', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#00FFAB' }}
                />
                <Bar 
                  dataKey="volume" 
                  fill="#00FFAB" 
                  radius={[4, 4, 0, 0]} 
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
