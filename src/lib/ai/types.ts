/**
 * AUTO PULSE — AI Types
 * AI servisi için tipler ve arayüzler
 */

// AI Provider tipleri
export type AIProvider = 'huggingface';

// AI model tipleri
export type AIModel =
  | 'sentiment-analysis'
  | 'zero-shot-classification'
  | 'feature-extraction'
  | 'text-generation'
  | 'summarization';

// Sentiment analiz sonucu
export interface SentimentResult {
  label: 'positive' | 'negative' | 'neutral';
  score: number;
}

// Zero-shot classification sonucu
export interface ClassificationResult {
  label: string;
  score: number;
}

// Issue analizi sonucu
export interface IssueAnalysis {
  sentiment: SentimentResult;
  category: ClassificationResult;
  priority: 'low' | 'medium' | 'high';
  summary: string;
  keywords: string[];
}

// Vehicle insight sonucu
export interface VehicleInsight {
  id: string;
  type: 'market' | 'technical' | 'performance' | 'price' | 'trend';
  title: string;
  summary: string;
  confidence: number;
  relatedVehicles: string[];
  impact: 'low' | 'medium' | 'high';
  timestamp: Date;
}

// AI Provider arayüzü
export interface AIProviderInterface {
  name: AIProvider;
  analyzeSentiment(text: string): Promise<SentimentResult>;
  classifyText(text: string, labels: string[]): Promise<ClassificationResult[]>;
  generateSummary(text: string): Promise<string>;
  extractFeatures(text: string): Promise<number[]>;
  isConfigured(): boolean;
}

// AI Analyzer arayüzü
export interface AIAnalyzer {
  name: string;
  analyze(data: any): Promise<any>;
}

// AI Prompt şablonları
export interface PromptTemplate {
  name: string;
  template: string;
  variables: string[];
}
