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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Header */}
      <header className="card-premium sticky top-0 z-50 rounded-none border-x-0 border-t-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-2xl shadow-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                  Token Cost Analyzer
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Precision Prompt Engineering
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500/50 shadow-sm transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-6 h-6 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="w-6 h-6 text-slate-700 fill-slate-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section className="fade-up">
          <PromptInput
            value={currentPrompt}
            onChange={handlePromptChange}
            onSave={handleSavePrompt}
            tokens={currentTokens}
          />
        </section>

        {currentPrompt && (
          <>
            <section className="fade-up">
              <TokenStats
                inputTokens={currentTokens}
                outputTokens={currentOutputTokens}
              />
            </section>

            <section className="fade-up">
              <CostComparison
                inputTokens={currentTokens}
                outputTokens={currentOutputTokens}
              />
            </section>

            <section className="fade-up">
              <PromptAnalysis
                text={currentPrompt}
                tokens={currentTokens}
              />
            </section>

            <section className="fade-up">
              <UsageProjection
                inputTokens={currentTokens}
                outputTokens={currentOutputTokens}
              />
            </section>
          </>
        )}

        {prompts.length > 0 && (
          <section className="fade-up">
            <PromptHistory
              prompts={prompts}
              selectedPrompts={selectedPrompts}
              onToggleSelect={handleToggleSelect}
              onDelete={handleDeletePrompt}
              onClearAll={handleClearAll}
            />
          </section>
        )}

        {(currentPrompt || prompts.length > 0) && (
          <section className="fade-up">
            <ExportSection
              currentPrompt={currentPrompt}
              currentTokens={currentTokens}
              currentOutputTokens={currentOutputTokens}
              prompts={prompts}
              selectedPrompts={selectedPrompts}
            />
          </section>
        )}

        <section className="fade-up">
          <ExamplesSection onSelectExample={setCurrentPrompt} />
        </section>
      </main>

      {/* Footer */}
      <footer className="card-premium rounded-none border-x-0 border-b-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Built to optimize the future of AI workflows.
            </p>
            <div className="flex items-center space-x-6 text-xs font-bold uppercase tracking-widest text-slate-400">
              <span>Open Source</span>
              <span>•</span>
              <span>Privacy Focused</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
