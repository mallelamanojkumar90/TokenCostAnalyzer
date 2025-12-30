import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Filter } from 'lucide-react';
import { getCostBreakdown, calculateMonthlyProjection } from '../utils/tokenUtils';
import { USAGE_FREQUENCIES } from '../utils/constants';

interface UsageProjectionProps {
  inputTokens: number;
  outputTokens: number;
}

type ProviderFilter = 'All' | 'OpenAI' | 'Anthropic' | 'Google' | 'Groq';

export default function UsageProjection({ inputTokens, outputTokens }: UsageProjectionProps) {
  const [selectedFrequency, setSelectedFrequency] = useState(100); // Default: 100 times/day
  const [selectedProvider, setSelectedProvider] = useState<ProviderFilter>('All');

  const allCostBreakdown = getCostBreakdown(inputTokens, outputTokens);
  
  // Filter cost breakdown based on selected provider
  const costBreakdown = selectedProvider === 'All' 
    ? allCostBreakdown 
    : allCostBreakdown.filter(item => item.provider === selectedProvider);

  // Generate projection data for chart
  const projectionData = [1, 10, 50, 100, 500, 1000].map(frequency => {
    const dataPoint: any = { frequency: `${frequency}/day` };
    
    costBreakdown.forEach(cost => {
      const monthlyCost = calculateMonthlyProjection(cost.totalCost, frequency);
      dataPoint[cost.modelName] = parseFloat(monthlyCost.toFixed(2));
    });
    
    return dataPoint;
  });

  // Calculate costs for selected frequency
  const selectedCosts = costBreakdown.map(cost => ({
    ...cost,
    monthlyCost: calculateMonthlyProjection(cost.totalCost, selectedFrequency),
    yearlyCost: calculateMonthlyProjection(cost.totalCost, selectedFrequency) * 12
  }));

  const providers: ProviderFilter[] = ['All', 'OpenAI', 'Anthropic', 'Google', 'Groq'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="card-premium p-4 shadow-2xl border-blue-500/20">
          <p className="font-bold text-slate-900 dark:text-white mb-2 border-b border-slate-200 dark:border-slate-800 pb-1">{payload[0].payload.frequency}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4 py-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{entry.name}</span>
              <span className="text-sm font-bold font-mono" style={{ color: entry.color }}>
                ${entry.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-premium p-6 fade-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Usage Projection
          </h2>
        </div>
        
        {/* Provider Filter Dropdown */}
        <div className="flex items-center space-x-3 bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <Filter className="w-4 h-4 text-slate-500 ml-2" />
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value as ProviderFilter)}
            className="bg-transparent border-none text-slate-700 dark:text-slate-200 text-sm font-semibold focus:ring-0 cursor-pointer pr-8"
          >
            {providers.map(provider => (
              <option key={provider} value={provider}>
                {provider === 'All' ? 'All Providers' : provider}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Frequency Selector */}
      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
          Select Usage Frequency
        </label>
        <div className="flex flex-wrap gap-2">
          {USAGE_FREQUENCIES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSelectedFrequency(value)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border-2 ${
                selectedFrequency === value
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-400/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cost Projections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {selectedCosts.map((cost) => (
          <div
            key={cost.modelName}
            className="card-premium p-4 border-l-4 transition-all duration-300 hover:scale-[1.02] bg-white/30"
            style={{ borderLeftColor: cost.color }}
          >
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3 opacity-70">
              {cost.modelName}
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Monthly</div>
                <div className="text-2xl font-black font-mono" style={{ color: cost.color }}>
                  ${cost.monthlyCost.toFixed(2)}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[10px] font-bold uppercase text-slate-400">Yearly Impact</div>
                <div className="text-lg font-bold text-slate-700 dark:text-slate-300 font-mono">
                  ${cost.yearlyCost.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projection Chart */}
      <div className="bg-slate-100/50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">
          Scalability analysis
        </h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
              <XAxis 
                dataKey="frequency" 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                iconType="circle"
                formatter={(value) => <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{value}</span>}
              />
              {costBreakdown.map((cost) => (
                <Line
                  key={cost.modelName}
                  type="monotone"
                  dataKey={cost.modelName}
                  stroke={cost.color}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={1500}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl border border-blue-500/10">
          <h4 className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">
            <span className="mr-2">💰</span> Optimization Strategy
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Switching to <span className="font-bold text-blue-500">{selectedCosts.reduce((min, c) => c.monthlyCost < min.monthlyCost ? c : min).modelName}</span> could 
            save you <span className="font-mono font-bold text-blue-600 dark:text-blue-400">${(Math.max(...selectedCosts.map(c => c.monthlyCost)) - Math.min(...selectedCosts.map(c => c.monthlyCost))).toFixed(2)}/month</span>.
          </p>
        </div>
        
        <div className="p-5 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-2xl border border-indigo-500/10">
          <h4 className="flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-wider">
            <span className="mr-2">📊</span> Macro Outlook
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            At current volume, projected annual expenditure ranges between 
            <span className="font-mono font-bold text-indigo-500"> ${Math.min(...selectedCosts.map(c => c.yearlyCost)).toFixed(2)}</span> and  
            <span className="font-mono font-bold text-indigo-500"> ${Math.max(...selectedCosts.map(c => c.yearlyCost)).toFixed(2)}</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
