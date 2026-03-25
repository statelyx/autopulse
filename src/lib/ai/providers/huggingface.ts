/**
 * AUTO PULSE — Hugging Face AI Provider
 * Hugging Face API entegrasyonu
 */

import type {
  AIProviderInterface,
  SentimentResult,
  ClassificationResult,
} from '../types';

export class HuggingFaceProvider implements AIProviderInterface {
  name = 'huggingface' as const;
  private apiKey: string;
  private baseUrl = 'https://api-inference.huggingface.co/models';

  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || '';
  }

  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  private async fetchAPI(model: string, inputs: any): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('Hugging Face API anahtarı bulunamadı');
    }

    try {
      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs }),
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API hatası: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Hugging Face API çağrısı başarısız:', error);
      throw error;
    }
  }

  async analyzeSentiment(text: string): Promise<SentimentResult> {
    try {
      const result = await this.fetchAPI('distilbert-base-uncased-finetuned-sst-2-english', {
        inputs: text,
      });

      // İlk sonucu al (positive/negative)
      const sentiment = result[0][0];
      return {
        label: sentiment.label.toLowerCase() === 'positive' ? 'positive' : 'negative',
        score: sentiment.score,
      };
    } catch (error) {
      // Fallback: Basit keyword bazlı sentiment
      return this.fallbackSentiment(text);
    }
  }

  async classifyText(text: string, labels: string[]): Promise<ClassificationResult[]> {
    try {
      const result = await this.fetchAPI('facebook/bart-large-mnli', {
        inputs: text,
        parameters: {
          candidate_labels: labels,
        },
      });

      return result.labels.map((label: string, index: number) => ({
        label,
        score: result.scores[index],
      })).sort((a: ClassificationResult, b: ClassificationResult) => b.score - a.score);
    } catch (error) {
      // Fallback: Basik keyword bazlı classification
      return this.fallbackClassification(text, labels);
    }
  }

  async generateSummary(text: string): Promise<string> {
    try {
      const result = await this.fetchAPI('facebook/bart-large-cnn', {
        inputs: text,
        parameters: {
          max_length: 150,
          min_length: 30,
        },
      });

      return result[0].summary_text;
    } catch (error) {
      // Fallback: İlk 200 karakter
      return text.substring(0, 200) + '...';
    }
  }

  async extractFeatures(text: string): Promise<number[]> {
    try {
      const result = await this.fetchAPI('sentence-transformers/all-MiniLM-L6-v2', {
        inputs: text,
      });

      return result;
    } catch (error) {
      // Fallback: Boş vektör
      return new Array(384).fill(0);
    }
  }

  private fallbackSentiment(text: string): SentimentResult {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'iyi', 'harika', 'mükemmel'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'kötü', 'berbat', 'değişik'];

    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) {
      return { label: 'positive', score: 0.7 };
    } else if (negativeCount > positiveCount) {
      return { label: 'negative', score: 0.7 };
    } else {
      return { label: 'neutral', score: 0.5 };
    }
  }

  private fallbackClassification(text: string, labels: string[]): ClassificationResult[] {
    const lowerText = text.toLowerCase();
    const scores = labels.map(label => {
      const labelWords = label.toLowerCase().split(' ');
      const matchCount = labelWords.filter(word => lowerText.includes(word)).length;
      return {
        label,
        score: matchCount > 0 ? 0.6 + (matchCount * 0.1) : 0.3,
      };
    });

    return scores.sort((a, b) => b.score - a.score);
  }
}
