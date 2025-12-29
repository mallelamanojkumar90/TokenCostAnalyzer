import { ArrowRight, ArrowLeft } from 'lucide-react';

interface TokenStatsProps {
  inputTokens: number;
  outputTokens: number;
}

export default function TokenStats({ inputTokens, outputTokens }: TokenStatsProps) {
  const totalTokens = inputTokens + outputTokens;

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Token Breakdown
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Tokens */}
        <div className="stat-card from-blue-500 to-blue-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Input Tokens</span>
            <ArrowRight className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {inputTokens.toLocaleString()}
          </div>
          <div className="text-sm opacity-90">
            Your prompt
          </div>
        </div>

        {/* Output Tokens */}
        <div className="stat-card from-purple-500 to-purple-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Output Tokens (Est.)</span>
            <ArrowLeft className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {outputTokens.toLocaleString()}
          </div>
          <div className="text-sm opacity-90">
            Expected response
          </div>
        </div>

        {/* Total Tokens */}
        <div className="stat-card from-pink-500 to-pink-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Total Tokens</span>
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">
            {totalTokens.toLocaleString()}
          </div>
          <div className="text-sm opacity-90">
            Combined usage
          </div>
        </div>
      </div>

      {/* Visual breakdown */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Token Distribution
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {((inputTokens / totalTokens) * 100).toFixed(1)}% input / {((outputTokens / totalTokens) * 100).toFixed(1)}% output
          </span>
        </div>
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            style={{ width: `${(inputTokens / totalTokens) * 100}%` }}
          />
          <div 
            className="bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
            style={{ width: `${(outputTokens / totalTokens) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
