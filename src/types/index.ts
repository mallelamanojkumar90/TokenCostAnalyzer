export interface ModelPricing {
  name: string;
  inputCostPer1K: number;
  outputCostPer1K: number;
  color: string;
  provider: string;
}

export interface Prompt {
  id: string;
  text: string;
  timestamp: number;
  tokens: number;
  estimatedOutputTokens: number;
}

export interface CostBreakdown {
  modelName: string;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  color: string;
}

export interface PromptIssue {
  type: 'repetition' | 'verbosity' | 'large-tokens' | 'cost-warning';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
}

export interface UsageProjection {
  frequency: number; // per day
  monthlyCost: number;
  yearlyEstimate: number;
}

export interface ExamplePrompt {
  title: string;
  prompt: string;
  type: 'good' | 'bad';
  explanation: string;
  tokens?: number;
}
