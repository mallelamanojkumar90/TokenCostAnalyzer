import { encode } from 'gpt-tokenizer';
import type { PromptIssue, CostBreakdown, ModelPricing } from '../types';
import { MODEL_PRICING, COST_THRESHOLDS } from './constants';

/**
 * Estimate token count for a given text
 * Uses gpt-tokenizer for accurate GPT-style tokenization
 */
export function estimateTokens(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  
  try {
    const tokens = encode(text);
    return tokens.length;
  } catch (error) {
    // Fallback to simple estimation if tokenizer fails
    console.warn('Tokenizer failed, using fallback estimation', error);
    return Math.ceil(text.length / 4);
  }
}

/**
 * Estimate output tokens based on input
 * Typically output is 1.5-2x the input for conversational responses
 */
export function estimateOutputTokens(inputTokens: number): number {
  return Math.ceil(inputTokens * 1.75);
}

/**
 * Calculate cost for a specific model
 */
export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  model: ModelPricing
): number {
  const inputCost = (inputTokens / 1000) * model.inputCostPer1K;
  const outputCost = (outputTokens / 1000) * model.outputCostPer1K;
  return inputCost + outputCost;
}

/**
 * Get cost breakdown for all models
 */
export function getCostBreakdown(
  inputTokens: number,
  outputTokens: number
): CostBreakdown[] {
  return MODEL_PRICING.map(model => {
    const inputCost = (inputTokens / 1000) * model.inputCostPer1K;
    const outputCost = (outputTokens / 1000) * model.outputCostPer1K;
    return {
      modelName: model.name,
      inputCost,
      outputCost,
      totalCost: inputCost + outputCost,
      color: model.color,
      provider: model.provider
    };
  });
}

/**
 * Get cost severity level
 */
export function getCostSeverity(cost: number): 'cheap' | 'moderate' | 'expensive' {
  if (cost <= COST_THRESHOLDS.cheap) return 'cheap';
  if (cost <= COST_THRESHOLDS.moderate) return 'moderate';
  return 'expensive';
}

/**
 * Get color based on cost severity
 */
export function getCostColor(cost: number): string {
  const severity = getCostSeverity(cost);
  switch (severity) {
    case 'cheap': return 'text-green-600 dark:text-green-400';
    case 'moderate': return 'text-yellow-600 dark:text-yellow-400';
    case 'expensive': return 'text-red-600 dark:text-red-400';
  }
}

/**
 * Get badge color based on cost severity
 */
export function getCostBadgeClass(cost: number): string {
  const severity = getCostSeverity(cost);
  switch (severity) {
    case 'cheap': return 'badge-green';
    case 'moderate': return 'badge-yellow';
    case 'expensive': return 'badge-red';
  }
}

/**
 * Detect repetition in text
 */
function detectRepetition(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  const wordCount = new Map<string, number>();
  
  words.forEach(word => {
    if (word.length > 3) { // Only count words longer than 3 chars
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    }
  });
  
  let repetitionScore = 0;
  wordCount.forEach(count => {
    if (count > 2) {
      repetitionScore += count - 2;
    }
  });
  
  return repetitionScore / words.length;
}

/**
 * Calculate verbosity score
 */
function calculateVerbosity(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return 0;
  
  const avgWordsPerSentence = text.split(/\s+/).length / sentences.length;
  
  // Sentences with more than 25 words are considered verbose
  return avgWordsPerSentence > 25 ? (avgWordsPerSentence - 25) / 10 : 0;
}

/**
 * Analyze prompt for issues and inefficiencies
 */
export function analyzePrompt(text: string, tokens: number): PromptIssue[] {
  const issues: PromptIssue[] = [];
  
  // Check for repetition
  const repetitionScore = detectRepetition(text);
  if (repetitionScore > 0.1) {
    issues.push({
      type: 'repetition',
      severity: repetitionScore > 0.2 ? 'high' : 'medium',
      message: 'Excessive word repetition detected',
      suggestion: 'Remove repeated words and phrases to reduce token count'
    });
  }
  
  // Check for verbosity
  const verbosityScore = calculateVerbosity(text);
  if (verbosityScore > 0.5) {
    issues.push({
      type: 'verbosity',
      severity: verbosityScore > 1 ? 'high' : 'medium',
      message: 'Prompt is overly verbose',
      suggestion: 'Use shorter, more concise sentences to reduce tokens'
    });
  }
  
  // Check for large token count
  if (tokens > 1000) {
    issues.push({
      type: 'large-tokens',
      severity: tokens > 2000 ? 'high' : 'medium',
      message: `Large token count (${tokens} tokens)`,
      suggestion: 'Consider breaking this into smaller prompts or removing unnecessary details'
    });
  }
  
  // Check for cost warnings
  const avgCost = getCostBreakdown(tokens, estimateOutputTokens(tokens))
    .reduce((sum, c) => sum + c.totalCost, 0) / MODEL_PRICING.length;
  
  if (avgCost > COST_THRESHOLDS.moderate) {
    issues.push({
      type: 'cost-warning',
      severity: avgCost > COST_THRESHOLDS.expensive ? 'high' : 'medium',
      message: `High estimated cost ($${avgCost.toFixed(4)} average)`,
      suggestion: 'Optimize prompt length to reduce costs'
    });
  }
  
  return issues;
}

/**
 * Generate optimization suggestions
 */
export function generateOptimizationSuggestions(text: string): string[] {
  const suggestions: string[] = [];
  
  // Check for common filler words
  const fillerWords = ['very', 'really', 'just', 'actually', 'basically', 'literally'];
  const hasFillers = fillerWords.some(word => 
    text.toLowerCase().includes(` ${word} `)
  );
  
  if (hasFillers) {
    suggestions.push('Remove filler words like "very", "really", "just", etc.');
  }
  
  // Check for redundant phrases
  if (text.includes('in order to')) {
    suggestions.push('Replace "in order to" with "to"');
  }
  
  if (text.includes('due to the fact that')) {
    suggestions.push('Replace "due to the fact that" with "because"');
  }
  
  // Check for passive voice indicators
  const passiveIndicators = ['is being', 'was being', 'has been', 'have been', 'will be'];
  const hasPassive = passiveIndicators.some(phrase => 
    text.toLowerCase().includes(phrase)
  );
  
  if (hasPassive) {
    suggestions.push('Consider using active voice instead of passive voice');
  }
  
  // Check for excessive punctuation
  if ((text.match(/[!?]/g) || []).length > 3) {
    suggestions.push('Reduce excessive punctuation marks');
  }
  
  // General suggestions
  if (text.length > 500) {
    suggestions.push('Break long prompts into smaller, focused requests');
    suggestions.push('Remove any redundant context or examples');
  }
  
  return suggestions;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  if (amount < 0.01) {
    return `$${amount.toFixed(6)}`;
  }
  return `$${amount.toFixed(4)}`;
}

/**
 * Format large numbers
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return num.toLocaleString();
}

/**
 * Calculate monthly cost projection
 */
export function calculateMonthlyProjection(
  costPerRequest: number,
  requestsPerDay: number
): number {
  return costPerRequest * requestsPerDay * 30;
}

/**
 * Export data as JSON
 */
export function exportAsJSON(data: any, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
