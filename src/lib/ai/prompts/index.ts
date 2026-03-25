/**
 * AUTO PULSE — AI Prompt Templates
 * AI için kullanılan prompt şablonları
 */

import type { PromptTemplate } from '../types';

export const SENTIMENT_ANALYSIS_PROMPT: PromptTemplate = {
  name: 'sentiment-analysis',
  template: 'Analyze the sentiment of the following text: {text}',
  variables: ['text'],
};

export const ISSUE_CLASSIFICATION_PROMPT: PromptTemplate = {
  name: 'issue-classification',
  template: `Classify the following issue into one of these categories: {categories}.
Issue: {issue}
Respond with the category name and confidence score.`,
  variables: ['categories', 'issue'],
};

export const VEHICLE_COMPARISON_PROMPT: PromptTemplate = {
  name: 'vehicle-comparison',
  template: `Compare these two vehicles:
Vehicle A: {vehicleA}
Vehicle B: {vehicleB}
Provide a detailed comparison focusing on performance, value, and use case.`,
  variables: ['vehicleA', 'vehicleB'],
};

export const MARKET_INSIGHT_PROMPT: PromptTemplate = {
  name: 'market-insight',
  template: `Analyze the following vehicle market data and provide insights:
{vehicleData}
Focus on: market trends, price segments, and popular features.`,
  variables: ['vehicleData'],
};

export const REVIEW_SUMMARIZATION_PROMPT: PromptTemplate = {
  name: 'review-summarization',
  template: `Summarize the following vehicle review:
{review}
Create a concise summary highlighting key points about performance, comfort, and value.`,
  variables: ['review'],
};

export const RECOMMENDATION_PROMPT: PromptTemplate = {
  name: 'recommendation',
  template: `Based on the user's preferences: {preferences}
And available vehicles: {vehicles}
Recommend the top 3 vehicles with explanations.`,
  variables: ['preferences', 'vehicles'],
};

// Prompt builder fonksiyonları
export function buildPrompt(template: PromptTemplate, variables: Record<string, string>): string {
  let prompt = template.template;

  template.variables.forEach(variable => {
    const placeholder = `{${variable}}`;
    const value = variables[variable] || '';
    prompt = prompt.replace(new RegExp(placeholder, 'g'), value);
  });

  return prompt;
}

// Zero-shot classification için label generator
export function generateIssueLabels(): string[] {
  return [
    'performance',
    'ui/ux',
    'bug',
    'feature request',
    'security',
    'data quality',
    'integration',
    'documentation',
  ];
}

// Vehicle analysis için kategoriler
export function generateVehicleCategories(): string[] {
  return [
    'electric vehicle',
    'performance car',
    'luxury vehicle',
    'suv',
    'sports car',
    'family car',
    'hybrid vehicle',
  ];
}
