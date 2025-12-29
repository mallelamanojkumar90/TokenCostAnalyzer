import { AlertTriangle, CheckCircle, Info, Lightbulb } from 'lucide-react';
import { analyzePrompt, generateOptimizationSuggestions } from '../utils/tokenUtils';

interface PromptAnalysisProps {
  text: string;
  tokens: number;
}

export default function PromptAnalysis({ text, tokens }: PromptAnalysisProps) {
  const issues = analyzePrompt(text, tokens);
  const suggestions = generateOptimizationSuggestions(text);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Prompt Analysis
      </h2>

      {/* Issues Section */}
      {issues.length > 0 ? (
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Detected Issues ({issues.length})</span>
          </h3>
          
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)} transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getSeverityIcon(issue.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {issue.message}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        issue.severity === 'high' 
                          ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                          : issue.severity === 'medium'
                          ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'
                          : 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                      }`}>
                        {issue.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      💡 {issue.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-300">
                Great job! No major issues detected
              </h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                Your prompt appears to be well-optimized
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Optimization Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <span>Optimization Suggestions</span>
          </h3>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="text-purple-500 font-bold">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* General Tips */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          📚 General Optimization Tips
        </h4>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Be specific and direct - avoid unnecessary context</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Use bullet points instead of long paragraphs</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Remove filler words and redundant phrases</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Use active voice instead of passive voice</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Test different phrasings to find the most efficient version</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
