import { Save } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  tokens: number;
}

export default function PromptInput({ value, onChange, onSave, tokens }: PromptInputProps) {
  return (
    <div className="card-premium p-6 fade-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Enter Your Prompt
        </h2>
        <div className="flex items-center space-x-2">
          <span className="status-pill-blue font-mono">
            {tokens.toLocaleString()} tokens
          </span>
        </div>
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type or paste your prompt here to analyze token usage and costs..."
        className="input-premium min-h-[200px] font-mono text-sm resize-none"
        spellCheck={false}
      />
      
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Tip: Be concise and specific to minimize token usage
        </p>
        <button
          onClick={onSave}
          disabled={!value.trim()}
          className="btn-gradient disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Save Prompt</span>
        </button>
      </div>
    </div>
  );
}
