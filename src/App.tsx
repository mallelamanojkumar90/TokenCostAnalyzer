import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import PromptInput from './components/PromptInput';
import TokenStats from './components/TokenStats';
import CostComparison from './components/CostComparison';
import PromptAnalysis from './components/PromptAnalysis';
import UsageProjection from './components/UsageProjection';
import PromptHistory from './components/PromptHistory';
import ExamplesSection from './components/ExamplesSection';
import ExportSection from './components/ExportSection';
import type { Prompt } from './types';
import { estimateTokens, estimateOutputTokens } from './utils/tokenUtils';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);

  // Load dark mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    } else {
      // Check system preference
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Load saved prompts
  useEffect(() => {
    const saved = localStorage.getItem('prompts');
    if (saved) {
      try {
        setPrompts(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved prompts', e);
      }
    }
  }, []);

  // Save prompts
  useEffect(() => {
    if (prompts.length > 0) {
      localStorage.setItem('prompts', JSON.stringify(prompts));
    }
  }, [prompts]);

  const handlePromptChange = (text: string) => {
    setCurrentPrompt(text);
  };

  const handleSavePrompt = () => {
    if (!currentPrompt.trim()) return;

    const tokens = estimateTokens(currentPrompt);
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      text: currentPrompt,
      timestamp: Date.now(),
      tokens,
      estimatedOutputTokens: estimateOutputTokens(tokens)
    };

    setPrompts(prev => [newPrompt, ...prev]);
    setCurrentPrompt('');
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
    setSelectedPrompts(prev => prev.filter(pid => pid !== id));
  };

  const handleToggleSelect = (id: string) => {
    setSelectedPrompts(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all prompts?')) {
      setPrompts([]);
      setSelectedPrompts([]);
      localStorage.removeItem('prompts');
    }
  };

  const currentTokens = estimateTokens(currentPrompt);
  const currentOutputTokens = estimateOutputTokens(currentTokens);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Token Cost Analyzer
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Optimize your prompts, minimize your costs
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-6 h-6 text-yellow-500" />
              ) : (
                <Moon className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Prompt Input Section */}
        <section className="animate-fade-in">
          <PromptInput
            value={currentPrompt}
            onChange={handlePromptChange}
            onSave={handleSavePrompt}
            tokens={currentTokens}
          />
        </section>

        {/* Token Stats */}
        {currentPrompt && (
          <section className="animate-slide-up">
            <TokenStats
              inputTokens={currentTokens}
              outputTokens={currentOutputTokens}
            />
          </section>
        )}

        {/* Cost Comparison */}
        {currentPrompt && (
          <section className="animate-slide-up">
            <CostComparison
              inputTokens={currentTokens}
              outputTokens={currentOutputTokens}
            />
          </section>
        )}

        {/* Prompt Analysis */}
        {currentPrompt && (
          <section className="animate-slide-up">
            <PromptAnalysis
              text={currentPrompt}
              tokens={currentTokens}
            />
          </section>
        )}

        {/* Usage Projection */}
        {currentPrompt && (
          <section className="animate-slide-up">
            <UsageProjection
              inputTokens={currentTokens}
              outputTokens={currentOutputTokens}
            />
          </section>
        )}

        {/* Prompt History */}
        {prompts.length > 0 && (
          <section className="animate-slide-up">
            <PromptHistory
              prompts={prompts}
              selectedPrompts={selectedPrompts}
              onToggleSelect={handleToggleSelect}
              onDelete={handleDeletePrompt}
              onClearAll={handleClearAll}
            />
          </section>
        )}

        {/* Export Section */}
        {(currentPrompt || prompts.length > 0) && (
          <section className="animate-slide-up">
            <ExportSection
              currentPrompt={currentPrompt}
              currentTokens={currentTokens}
              currentOutputTokens={currentOutputTokens}
              prompts={prompts}
              selectedPrompts={selectedPrompts}
            />
          </section>
        )}

        {/* Examples Section */}
        <section className="animate-slide-up">
          <ExamplesSection onSelectExample={setCurrentPrompt} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            Built to help developers understand the financial impact of prompt engineering
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
