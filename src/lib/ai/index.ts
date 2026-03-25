/**
 * AUTO PULSE — AI Service Index
 * Tüm AI servisleri için ana export noktası
 */

// Providers
export { HuggingFaceProvider } from './providers/huggingface';

// Analyzers
export { IssueAnalyzer } from './analyzers/issue-analyzer';
export { VehicleAnalyzer } from './analyzers/vehicle-analyzer';

// Prompts
export {
  SENTIMENT_ANALYSIS_PROMPT,
  ISSUE_CLASSIFICATION_PROMPT,
  VEHICLE_COMPARISON_PROMPT,
  MARKET_INSIGHT_PROMPT,
  REVIEW_SUMMARIZATION_PROMPT,
  RECOMMENDATION_PROMPT,
  buildPrompt,
  generateIssueLabels,
  generateVehicleCategories,
} from './prompts';

// Types
export type {
  AIProvider,
  AIModel,
  SentimentResult,
  ClassificationResult,
  IssueAnalysis,
  VehicleInsight,
  AIProviderInterface,
  AIAnalyzer,
  PromptTemplate,
} from './types';

// AI Service singleton
import { HuggingFaceProvider } from './providers/huggingface';
import { IssueAnalyzer } from './analyzers/issue-analyzer';
import { VehicleAnalyzer } from './analyzers/vehicle-analyzer';

type IssueInput = { title: string; description: string; category?: string };
type ClusterInput = { title: string; description: string };
type VehicleInput = { brand: string; model: string; year: number; price?: number; fuelType: string; horsepower?: number; acceleration?: number };

class AIService {
  private static instance: AIService;
  private provider: HuggingFaceProvider;
  private issueAnalyzer: IssueAnalyzer;
  private vehicleAnalyzer: VehicleAnalyzer;

  private constructor() {
    this.provider = new HuggingFaceProvider();
    this.issueAnalyzer = new IssueAnalyzer();
    this.vehicleAnalyzer = new VehicleAnalyzer();
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Provider methods
  getProvider() {
    return this.provider;
  }

  isConfigured(): boolean {
    return this.provider.isConfigured();
  }

  // Issue analysis
  async analyzeIssue(issue: IssueInput) {
    return this.issueAnalyzer.analyzeIssue(issue);
  }

  async analyzeMultipleIssues(issues: IssueInput[]) {
    return this.issueAnalyzer.analyzeMultipleIssues(issues);
  }

  async clusterIssues(issues: ClusterInput[]) {
    return this.issueAnalyzer.clusterIssues(issues);
  }

  // Vehicle analysis
  async generateMarketInsight(vehicles: VehicleInput[]) {
    return this.vehicleAnalyzer.generateMarketInsight(vehicles);
  }

  async compareVehicles(vehicle1: VehicleInput, vehicle2: VehicleInput) {
    return this.vehicleAnalyzer.compareVehicles(vehicle1, vehicle2);
  }

  async predictPriceTrend(vehicles: Array<{ brand: string; model: string; year: number; price?: number }>) {
    return this.vehicleAnalyzer.predictPriceTrend(vehicles);
  }
}

export const aiService = AIService.getInstance();
