import { Save } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  tokens: number;
}

export default function PromptInput({ value, onChange, onSave, tokens }: PromptInputProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Enter Your Prompt
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {tokens.toLocaleString()} tokens
          </span>
        </div>
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type or paste your prompt here to analyze token usage and costs..."
        className="textarea-field min-h-[200px] font-mono text-sm"
        spellCheck={false}
      />
      
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Tip: Be concise and specific to minimize token usage
        </p>
        <button
          onClick={onSave}
          disabled={!value.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Save Prompt</span>
        </button>
      </div>
    </div>
  );
}
