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
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <BookOpen className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Good vs Bad Prompts
        </h2>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Learn from examples of well-optimized and poorly-optimized prompts
      </p>

      {/* Filter Buttons */}
      <div className="flex space-x-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            filter === 'all'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All Examples
        </button>
        <button
          onClick={() => setFilter('good')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
            filter === 'good'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Good Examples</span>
        </button>
        <button
          onClick={() => setFilter('bad')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
            filter === 'bad'
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          <span>Bad Examples</span>
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
              className={`p-5 rounded-lg border-2 transition-all duration-300 hover:shadow-lg ${
                example.type === 'good'
                  ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10'
                  : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {example.type === 'good' ? (
                    <ThumbsUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <ThumbsDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {example.title}
                  </h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  example.type === 'good'
                    ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                    : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                }`}>
                  {tokens} tokens
                </span>
              </div>

              {/* Prompt */}
              <div className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap">
                  {example.prompt}
                </p>
              </div>

              {/* Explanation */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <strong>Why:</strong> {example.explanation}
              </p>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => onSelectExample(example.prompt)}
                  className="flex-1 btn-primary text-sm py-2"
                >
                  Use This Example
                </button>
                <button
                  onClick={() => handleCopy(example.prompt, exampleId)}
                  className="btn-secondary text-sm py-2 px-4 flex items-center space-x-2"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
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
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          📖 Key Takeaways
        </h4>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>• Good prompts are concise, specific, and well-structured</li>
          <li>• Bad prompts contain filler words, repetition, and unnecessary context</li>
          <li>• Optimizing your prompts can reduce costs by 50-80%</li>
          <li>• Use bullet points and clear formatting for better efficiency</li>
        </ul>
      </div>
    </div>
  );
}
