import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Filter } from 'lucide-react';
import { getCostBreakdown, formatCurrency } from '../utils/tokenUtils';

interface CostComparisonProps {
  inputTokens: number;
  outputTokens: number;
}

type ProviderFilter = 'All' | 'OpenAI' | 'Anthropic' | 'Google' | 'Groq';

export default function CostComparison({ inputTokens, outputTokens }: CostComparisonProps) {
  const [selectedProvider, setSelectedProvider] = useState<ProviderFilter>('All');
  
  const allCostBreakdown = getCostBreakdown(inputTokens, outputTokens);
  
  // Filter cost breakdown based on selected provider
  const costBreakdown = selectedProvider === 'All' 
    ? allCostBreakdown 
    : allCostBreakdown.filter(item => item.provider === selectedProvider);

  // Data for bar chart
  const barChartData = costBreakdown.map(item => ({
    name: item.modelName,
    provider: item.provider,
    'Input Cost': parseFloat(item.inputCost.toFixed(6)),
    'Output Cost': parseFloat(item.outputCost.toFixed(6)),
    'Total': parseFloat(item.totalCost.toFixed(6))
  }));

  // Data for pie chart
  const pieChartData = costBreakdown.map(item => ({
    name: item.modelName,
    value: parseFloat(item.totalCost.toFixed(6)),
    color: item.color
  }));

  const providers: ProviderFilter[] = ['All', 'OpenAI', 'Anthropic', 'Google', 'Groq'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="card-premium p-4 shadow-2xl border-blue-500/20">
          <p className="font-bold text-slate-900 dark:text-white mb-2 border-b border-slate-200 dark:border-slate-800 pb-1">
            {payload[0].payload.name}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4 py-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{entry.name}</span>
              <span className="text-sm font-bold font-mono" style={{ color: entry.color }}>
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-premium p-6 fade-up" style={{ animationDelay: '0.15s' }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Cost Comparison Across Models
        </h2>
        
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

      {/* Cost Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {costBreakdown.map((cost) => (
          <div
            key={cost.modelName}
            className="card-premium p-4 border-l-4 transition-all duration-300 hover:scale-[1.02] bg-white/30"
            style={{ borderLeftColor: cost.color }}
          >
            <div className="flex items-center justify-between mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <h3 className="truncate max-w-[120px]">
                {cost.modelName}
              </h3>
              <span className={cost.totalCost < 0.01 ? 'text-emerald-500' : cost.totalCost < 0.05 ? 'text-amber-500' : 'text-rose-500'}>
                {cost.totalCost < 0.01 ? 'Cheap' : cost.totalCost < 0.05 ? 'Moderate' : 'Expensive'}
              </span>
            </div>
            <div className="text-2xl font-black font-mono mb-4" style={{ color: cost.color }}>
              {formatCurrency(cost.totalCost)}
            </div>
            <div className="space-y-1 text-[10px] font-bold uppercase text-slate-500 opacity-60">
              <div className="flex justify-between">
                <span>Input</span>
                <span>{formatCurrency(cost.inputCost)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                <span>Output</span>
                <span>{formatCurrency(cost.outputCost)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-slate-100/50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">
            Input vs Output Weight
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip cursor={{ fill: 'rgba(56, 189, 248, 0.05)' }} content={<CustomTooltip />} />
                <Bar dataKey="Input Cost" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Output Cost" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-slate-100/50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">
            Market share per model
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : '$0.00'}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    backdropFilter: 'blur(8px)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cost Insights */}
      <div className="mt-8 p-6 bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl border border-blue-500/10">
        <h4 className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wider">
          <span className="mr-2">💡</span> Market Intelligence
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Cheapest Alpha</span>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{costBreakdown.reduce((min, c) => c.totalCost < min.totalCost ? c : min).modelName}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Premium Ceiling</span>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{costBreakdown.reduce((max, c) => c.totalCost > max.totalCost ? c : max).modelName}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Cost variance</span>
            <p className="text-sm font-bold text-rose-500 font-mono">+{((Math.max(...costBreakdown.map(c => c.totalCost)) / Math.min(...costBreakdown.map(c => c.totalCost)) - 1) * 100).toFixed(0)}% Delta</p>
          </div>
        </div>
      </div>
    </div>
  );
}
