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
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{payload[0].payload.frequency}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}/month
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Usage Projection
          </h2>
        </div>
        
        {/* Provider Filter Dropdown */}
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value as ProviderFilter)}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
          >
            {providers.map(provider => (
              <option key={provider} value={provider}>
                {provider === 'All' ? 'All Providers' : provider}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            ({costBreakdown.length} {costBreakdown.length === 1 ? 'model' : 'models'})
          </span>
        </div>
      </div>

      {/* Frequency Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select Usage Frequency
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {USAGE_FREQUENCIES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSelectedFrequency(value)}
              className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedFrequency === value
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cost Projections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {selectedCosts.map((cost) => (
          <div
            key={cost.modelName}
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105"
            style={{ borderColor: cost.color }}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">
              {cost.modelName}
            </h3>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Monthly</div>
                <div className="text-xl font-bold" style={{ color: cost.color }}>
                  ${cost.monthlyCost.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Yearly</div>
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  ${cost.yearlyCost.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projection Chart */}
      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Cost Projection by Usage
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="frequency" 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              label={{ value: 'Monthly Cost ($)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {costBreakdown.map((cost) => (
              <Line
                key={cost.modelName}
                type="monotone"
                dataKey={cost.modelName}
                stroke={cost.color}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Cost Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💰 Cost Savings</h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            By choosing the cheapest model ({selectedCosts.reduce((min, c) => c.monthlyCost < min.monthlyCost ? c : min).modelName}), 
            you could save up to <strong>${(Math.max(...selectedCosts.map(c => c.monthlyCost)) - Math.min(...selectedCosts.map(c => c.monthlyCost))).toFixed(2)}/month</strong> compared to the most expensive option.
          </p>
        </div>
        
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">📊 Annual Impact</h4>
          <p className="text-sm text-purple-800 dark:text-purple-200">
            At {selectedFrequency} requests/day, your annual costs would range from{' '}
            <strong>${Math.min(...selectedCosts.map(c => c.yearlyCost)).toFixed(2)}</strong> to{' '}
            <strong>${Math.max(...selectedCosts.map(c => c.yearlyCost)).toFixed(2)}</strong> depending on the model.
          </p>
        </div>
      </div>
    </div>
  );
}
