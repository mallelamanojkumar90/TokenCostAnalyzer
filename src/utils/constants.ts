import type { ModelPricing } from '../types';

export const MODEL_PRICING: ModelPricing[] = [
  {
    name: 'GPT-4',
    inputCostPer1K: 0.03,
    outputCostPer1K: 0.06,
    color: '#10b981',
    provider: 'OpenAI'
  },
  {
    name: 'GPT-3.5-turbo',
    inputCostPer1K: 0.0015,
    outputCostPer1K: 0.002,
    color: '#3b82f6',
    provider: 'OpenAI'
  },
  {
    name: 'Claude Sonnet',
    inputCostPer1K: 0.003,
    outputCostPer1K: 0.015,
    color: '#8b5cf6',
    provider: 'Anthropic'
  },
  {
    name: 'Claude Haiku',
    inputCostPer1K: 0.00025,
    outputCostPer1K: 0.00125,
    color: '#ec4899',
    provider: 'Anthropic'
  }
];

export const COST_THRESHOLDS = {
  cheap: 0.01,      // Green
  moderate: 0.05,   // Yellow
  expensive: 0.1    // Red
};

export const USAGE_FREQUENCIES = [
  { label: '10 times/day', value: 10 },
  { label: '50 times/day', value: 50 },
  { label: '100 times/day', value: 100 },
  { label: '500 times/day', value: 500 },
  { label: '1000 times/day', value: 1000 }
];
