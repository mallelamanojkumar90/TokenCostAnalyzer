import type { ModelPricing } from '../types';

export const MODEL_PRICING: ModelPricing[] = [
  // OpenAI Models
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
  
  // Anthropic Models
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
  },
  
  // Google Gemini Models
  {
    name: 'Gemini 1.5 Pro',
    inputCostPer1K: 0.00125,
    outputCostPer1K: 0.005,
    color: '#f59e0b',
    provider: 'Google'
  },
  {
    name: 'Gemini 1.5 Flash',
    inputCostPer1K: 0.000075,
    outputCostPer1K: 0.0003,
    color: '#14b8a6',
    provider: 'Google'
  },
  {
    name: 'Gemini 2.0 Flash',
    inputCostPer1K: 0.0,
    outputCostPer1K: 0.0,
    color: '#06b6d4',
    provider: 'Google'
  },
  
  // Groq Models (Grok)
  {
    name: 'Llama 3.1 70B (Groq)',
    inputCostPer1K: 0.00059,
    outputCostPer1K: 0.00079,
    color: '#ef4444',
    provider: 'Groq'
  },
  {
    name: 'Llama 3.1 8B (Groq)',
    inputCostPer1K: 0.00005,
    outputCostPer1K: 0.00008,
    color: '#f97316',
    provider: 'Groq'
  },
  {
    name: 'Mixtral 8x7B (Groq)',
    inputCostPer1K: 0.00024,
    outputCostPer1K: 0.00024,
    color: '#84cc16',
    provider: 'Groq'
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
