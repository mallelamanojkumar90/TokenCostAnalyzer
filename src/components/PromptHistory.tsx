import { Trash2, Clock, Check } from 'lucide-react';
import type { Prompt } from '../types';
import { formatCurrency, getCostBreakdown } from '../utils/tokenUtils';

interface PromptHistoryProps {
  prompts: Prompt[];
  selectedPrompts: string[];
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function PromptHistory({
  prompts,
  selectedPrompts,
  onToggleSelect,
  onDelete,
  onClearAll
}: PromptHistoryProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="card-premium p-6 fade-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-500/10 rounded-lg">
            <Clock className="w-6 h-6 text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400">
            Prompt History <span className="text-slate-400 opacity-50 ml-1">({prompts.length})</span>
          </h2>
        </div>
        <button
          onClick={onClearAll}
          className="btn-outline py-2 px-4 text-xs flex items-center space-x-2"
        >
          <Trash2 className="w-3 h-3 text-rose-500" />
          <span>Purge Vault</span>
        </button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {prompts.map((prompt) => {
          const isSelected = selectedPrompts.includes(prompt.id);
          const costs = getCostBreakdown(prompt.tokens, prompt.estimatedOutputTokens);
          const avgCost = costs.reduce((sum, c) => sum + c.totalCost, 0) / costs.length;

          return (
            <div
              key={prompt.id}
              className={`card-premium p-5 border-l-4 transition-all duration-300 ${
                isSelected
                  ? 'border-l-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20'
                  : 'border-l-slate-200 dark:border-l-slate-800 bg-white/30 hover:border-l-blue-400'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Selection Checkbox */}
                  <button
                    onClick={() => onToggleSelect(prompt.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 mt-1 ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/30'
                        : 'border-slate-300 dark:border-slate-700 hover:border-blue-500/50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 mb-3">
                      {prompt.text}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <span className="flex items-center space-x-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(prompt.timestamp)}</span>
                      </span>
                      <span className="px-2 py-1 bg-indigo-500/10 text-indigo-500 rounded-md">
                        {prompt.tokens.toLocaleString()} tokens
                      </span>
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-md">
                        {formatCurrency(avgCost)} avg
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDelete(prompt.id)}
                  className="flex-shrink-0 ml-3 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all duration-300"
                  aria-label="Delete prompt"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Cost breakdown */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                {costs.map((cost) => (
                  <div key={cost.modelName} className="space-y-1">
                    <div className="text-[9px] font-black uppercase text-slate-400 tracking-tighter truncate">{cost.modelName}</div>
                    <div className="text-sm font-bold font-mono" style={{ color: cost.color }}>
                      {formatCurrency(cost.totalCost)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedPrompts.length > 0 && (
        <div className="mt-6 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-between">
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
            <span className="mr-2">⚡</span>
            {selectedPrompts.length} prompt{selectedPrompts.length !== 1 ? 's' : ''} staged for comparative analysis
          </p>
        </div>
      )}
    </div>
  );
}
