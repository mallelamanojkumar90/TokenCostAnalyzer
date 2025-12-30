import { useState } from 'react';
import { BookOpen, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { EXAMPLE_PROMPTS } from '../data/examples';
import { estimateTokens } from '../utils/tokenUtils';

interface ExamplesSectionProps {
  onSelectExample: (text: string) => void;
}

export default function ExamplesSection({ onSelectExample }: ExamplesSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'good' | 'bad'>('all');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredExamples = EXAMPLE_PROMPTS.filter(example => 
    filter === 'all' || example.type === filter
  );

  return (
    <div className="card-premium p-6 fade-up" style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <BookOpen className="w-6 h-6 text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
          Good vs Bad Prompts
        </h2>
      </div>

      <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">
        Master the art of prompt engineering by comparing optimized vs inefficient patterns.
      </p>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border-2 ${
            filter === 'all'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-lg'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          All Examples
        </button>
        <button
          onClick={() => setFilter('good')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center space-x-2 border-2 ${
            filter === 'good'
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-500/50'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Optimized</span>
        </button>
        <button
          onClick={() => setFilter('bad')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center space-x-2 border-2 ${
            filter === 'bad'
              ? 'bg-rose-600 border-rose-600 text-white shadow-lg'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-rose-500/50'
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          <span>Inefficient</span>
        </button>
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExamples.map((example, index) => {
          const tokens = estimateTokens(example.prompt);
          const exampleId = `example-${index}`;
          const isCopied = copiedId === exampleId;

          return (
            <div
              key={index}
              className={`card-premium p-6 border-l-4 transition-all duration-300 hover:scale-[1.01] ${
                example.type === 'good'
                  ? 'border-l-emerald-500 bg-emerald-500/5'
                  : 'border-l-rose-500 bg-rose-500/5'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-tight text-sm">
                    {example.title}
                  </h3>
                </div>
                <span className={`status-pill ${
                  example.type === 'good' ? 'status-pill-green' : 'status-pill-amber'
                }`}>
                  {tokens} tokens
                </span>
              </div>

              <div className="mb-4 p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                <p className="text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                  {example.prompt}
                </p>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                <span className="font-black text-[10px] uppercase tracking-wider block mb-1 opacity-50">Rationale</span>
                {example.explanation}
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => onSelectExample(example.prompt)}
                  className="flex-1 btn-gradient text-xs py-2 px-3 rounded-lg"
                >
                  Apply Patterns
                </button>
                <button
                  onClick={() => handleCopy(example.prompt, exampleId)}
                  className="btn-outline text-xs py-2 px-4 flex items-center space-x-2 rounded-lg"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 p-6 bg-slate-100/50 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h4 className="flex items-center text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-[0.2em]">
          <span className="mr-3">🚀</span> High-Performance Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
            <li className="flex items-start"><span className="text-blue-500 mr-2">✦</span> Eliminate redundancy and filler phrases</li>
            <li className="flex items-start"><span className="text-blue-500 mr-2">✦</span> Define explicit roles and constraints</li>
          </ul>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
            <li className="flex items-start"><span className="text-blue-500 mr-2">✦</span> Use delimited structures (JSON, Markdown)</li>
            <li className="flex items-start"><span className="text-blue-500 mr-2">✦</span> Leverage few-shot examples for complex tasks</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
