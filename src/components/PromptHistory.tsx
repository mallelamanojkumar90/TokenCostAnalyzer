import { Trash2, Clock, Check } from 'lucide-react';
import type { Prompt } from '../types';
import { formatCurrency, getCostBreakdown, getCostBadgeClass } from '../utils/tokenUtils';

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
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Prompt History ({prompts.length})
        </h2>
        <button
          onClick={onClearAll}
          className="btn-secondary text-sm flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {prompts.map((prompt) => {
          const isSelected = selectedPrompts.includes(prompt.id);
          const costs = getCostBreakdown(prompt.tokens, prompt.estimatedOutputTokens);
          const avgCost = costs.reduce((sum, c) => sum + c.totalCost, 0) / costs.length;

          return (
            <div
              key={prompt.id}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                  {/* Checkbox */}
                  <button
                    onClick={() => onToggleSelect(prompt.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
                      {prompt.text}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(prompt.timestamp)}</span>
                      </span>
                      <span className="font-mono">
                        {prompt.tokens.toLocaleString()} tokens
                      </span>
                      <span className={getCostBadgeClass(avgCost)}>
                        Avg: {formatCurrency(avgCost)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => onDelete(prompt.id)}
                  className="flex-shrink-0 ml-3 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                  aria-label="Delete prompt"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Cost breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                {costs.map((cost) => (
                  <div
                    key={cost.modelName}
                    className="text-xs"
                  >
                    <div className="text-gray-600 dark:text-gray-400">{cost.modelName}</div>
                    <div className="font-semibold" style={{ color: cost.color }}>
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
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>{selectedPrompts.length}</strong> prompt{selectedPrompts.length !== 1 ? 's' : ''} selected for comparison
          </p>
        </div>
      )}
    </div>
  );
}
