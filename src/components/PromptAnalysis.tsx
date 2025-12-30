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
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'medium':
        return <Info className="w-5 h-5 text-amber-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-l-rose-500 bg-rose-500/5';
      case 'medium':
        return 'border-l-amber-500 bg-amber-500/5';
      default:
        return 'border-l-emerald-500 bg-emerald-500/5';
    }
  };

  return (
    <div className="card-premium p-6 fade-up" style={{ animationDelay: '0.2s' }}>
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-6">
        Prompt Analysis
      </h2>

      {/* Issues Section */}
      {issues.length > 0 ? (
        <div className="space-y-6 mb-8">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-2 uppercase tracking-widest">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Detected Issues ({issues.length})</span>
          </h3>
          
          <div className="space-y-4">
            {issues.map((issue, index) => (
              <div
                key={index}
                className={`card-premium p-5 border-l-4 ${getSeverityColor(issue.severity)} transition-all duration-300 hover:translate-x-1`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-0.5">
                    {getSeverityIcon(issue.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {issue.message}
                      </h4>
                      <span className={`status-pill ${
                        issue.severity === 'high' 
                          ? 'status-pill-amber bg-rose-500/10 text-rose-500' // Using amber logic with rose colors
                          : issue.severity === 'medium'
                          ? 'status-pill-amber'
                          : 'status-pill-green'
                      } text-[10px]`}>
                        {issue.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      <span className="text-indigo-500 mr-1">✦</span> {issue.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-8 p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tight">
                Optimized Configuration
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                No structural vulnerabilities detected.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Optimization Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-2 uppercase tracking-widest">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Optimization Roadmap</span>
          </h3>
          
          <div className="bg-slate-100/50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <ul className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-300 font-medium"
                >
                  <span className="text-blue-500 font-black mt-0.5">•</span>
                  <span className="leading-relaxed">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* General Tips */}
      <div className="p-6 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-2xl border border-indigo-500/10">
        <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 mb-4 uppercase tracking-[0.2em]">
          Core principles
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
          {[
            "Be specific and direct",
            "Use bullet points over prose",
            "Eliminate redundant phrasings",
            "Favor active voice",
            "Iterative testing recommended"
          ].map((tip, i) => (
            <div key={i} className="flex items-center space-x-2 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
              <div className="w-1 h-1 bg-indigo-500 rounded-full" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
