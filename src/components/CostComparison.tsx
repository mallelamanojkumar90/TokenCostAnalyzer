import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getCostBreakdown, formatCurrency, getCostBadgeClass } from '../utils/tokenUtils';

interface CostComparisonProps {
  inputTokens: number;
  outputTokens: number;
}

export default function CostComparison({ inputTokens, outputTokens }: CostComparisonProps) {
  const costBreakdown = getCostBreakdown(inputTokens, outputTokens);

  // Data for bar chart
  const barChartData = costBreakdown.map(item => ({
    name: item.modelName,
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Cost Comparison Across Models
      </h2>

      {/* Cost Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {costBreakdown.map((cost) => (
          <div
            key={cost.modelName}
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ borderColor: cost.color }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {cost.modelName}
              </h3>
              <span className={`${getCostBadgeClass(cost.totalCost)} text-xs`}>
                {cost.totalCost < 0.01 ? 'Cheap' : cost.totalCost < 0.05 ? 'Moderate' : 'Expensive'}
              </span>
            </div>
            <div className="text-2xl font-bold mb-2" style={{ color: cost.color }}>
              {formatCurrency(cost.totalCost)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Input:</span>
                <span>{formatCurrency(cost.inputCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Output:</span>
                <span>{formatCurrency(cost.outputCost)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Cost Breakdown by Model
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Input Cost" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Output Cost" stackId="a" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Total Cost Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'rgba(31, 41, 55, 0.9)',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost Insights */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Cost Insights</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Cheapest option: <strong>{costBreakdown.reduce((min, c) => c.totalCost < min.totalCost ? c : min).modelName}</strong> at {formatCurrency(Math.min(...costBreakdown.map(c => c.totalCost)))}</li>
          <li>• Most expensive: <strong>{costBreakdown.reduce((max, c) => c.totalCost > max.totalCost ? c : max).modelName}</strong> at {formatCurrency(Math.max(...costBreakdown.map(c => c.totalCost)))}</li>
          <li>• Cost difference: {formatCurrency(Math.max(...costBreakdown.map(c => c.totalCost)) - Math.min(...costBreakdown.map(c => c.totalCost)))} ({((Math.max(...costBreakdown.map(c => c.totalCost)) / Math.min(...costBreakdown.map(c => c.totalCost)) - 1) * 100).toFixed(0)}% more)</li>
        </ul>
      </div>
    </div>
  );
}
