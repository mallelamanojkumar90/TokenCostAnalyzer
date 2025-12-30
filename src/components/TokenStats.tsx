import { ArrowRight, ArrowLeft } from 'lucide-react';

interface TokenStatsProps {
  inputTokens: number;
  outputTokens: number;
}

export default function TokenStats({ inputTokens, outputTokens }: TokenStatsProps) {
  const totalTokens = inputTokens + outputTokens;

  return (
    <div className="card-premium p-6 fade-up" style={{ animationDelay: '0.1s' }}>
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6">
        Token Breakdown
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Tokens */}
        <div className="stat-glow">
          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">Input Tokens</span>
            <ArrowRight className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold mb-1 relative z-10 text-slate-800 dark:text-white">
            {inputTokens.toLocaleString()}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 relative z-10 uppercase tracking-tighter">
            Your prompt
          </div>
        </div>

        {/* Output Tokens */}
        <div className="stat-glow" style={{ background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)' }}>
          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className="text-sm font-semibold text-purple-600 dark:text-purple-300">Output Tokens (Est.)</span>
            <ArrowLeft className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold mb-1 relative z-10 text-slate-800 dark:text-white">
            {outputTokens.toLocaleString()}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 relative z-10 uppercase tracking-tighter">
            Expected response
          </div>
        </div>

        {/* Total Tokens */}
        <div className="stat-glow" style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)' }}>
          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className="text-sm font-semibold text-pink-600 dark:text-pink-300">Total Tokens</span>
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1 relative z-10 text-slate-800 dark:text-white">
            {totalTokens.toLocaleString()}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 relative z-10 uppercase tracking-tighter">
            Combined usage
          </div>
        </div>
      </div>

      {/* Visual breakdown */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Token Distribution
          </span>
          <span className="text-sm font-mono font-medium text-slate-600 dark:text-slate-300">
            <span className="text-blue-500">{((inputTokens / totalTokens) * 100).toFixed(1)}%</span> 
            <span className="mx-2 opacity-30">/</span>
            <span className="text-purple-500">{((outputTokens / totalTokens) * 100).toFixed(1)}%</span>
          </span>
        </div>
        <div className="w-full h-3 bg-slate-200/50 dark:bg-slate-800/50 rounded-full overflow-hidden flex backdrop-blur-sm">
          <div 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 ease-out"
            style={{ width: `${(inputTokens / totalTokens) * 100}%` }}
          />
          <div 
            className="bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-700 ease-out"
            style={{ width: `${(outputTokens / totalTokens) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
