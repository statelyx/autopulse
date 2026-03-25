/**
 * AUTO PULSE — Issue Analyzer
 * Kullanıcı sorunları için AI analizi
 */

import type { IssueAnalysis } from '../types';
import { HuggingFaceProvider } from '../providers/huggingface';

export class IssueAnalyzer {
  private provider: HuggingFaceProvider;

  constructor() {
    this.provider = new HuggingFaceProvider();
  }

  async analyzeIssue(issue: {
    title: string;
    description: string;
    category?: string;
  }): Promise<IssueAnalysis> {
    const text = `${issue.title}. ${issue.description}`;

    // Paralel analizi çalıştır
    const [sentiment, categories] = await Promise.all([
      this.provider.analyzeSentiment(text),
      this.provider.classifyText(text, [
        'performance',
        'ui/ux',
        'bug',
        'feature',
        'security',
        'data',
      ]),
    ]);

    // Öncelik belirleme
    const priority = this.calculatePriority(sentiment, categories[0]);

    // Özet oluştur
    const summary = await this.provider.generateSummary(text);

    // Anahtar kelimeler çıkar
    const keywords = this.extractKeywords(text);

    return {
      sentiment,
      category: categories[0],
      priority,
      summary,
      keywords,
    };
  }

  async analyzeMultipleIssues(issues: Array<{
    title: string;
    description: string;
    category?: string;
  }>): Promise<IssueAnalysis[]> {
    return Promise.all(issues.map(issue => this.analyzeIssue(issue)));
  }

  async clusterIssues(issues: Array<{ title: string; description: string }>): Promise<Map<string, number[]>> {
    // Her issue için feature extraction
    const features = await Promise.all(
      issues.map(issue => this.provider.extractFeatures(`${issue.title}. ${issue.description}`))
    );

    // Basit clustering: Cosine similarity
    const clusters = new Map<string, number[]>();
    const threshold = 0.8;

    for (let i = 0; i < issues.length; i++) {
      let clustered = false;

      for (const [clusterId, indices] of clusters.entries()) {
        const representativeIdx = indices[0];
        const similarity = this.cosineSimilarity(features[i], features[representativeIdx]);

        if (similarity > threshold) {
          indices.push(i);
          clustered = true;
          break;
        }
      }

      if (!clustered) {
        clusters.set(`cluster-${clusters.size + 1}`, [i]);
      }
    }

    return clusters;
  }

  private calculatePriority(
    sentiment: { label: string; score: number },
    category: { label: string; score: number }
  ): 'low' | 'medium' | 'high' {
    // Negative sentiment + bug/security = high priority
    if (sentiment.label === 'negative' && ['bug', 'security'].includes(category.label)) {
      return 'high';
    }

    // Negative sentiment = medium priority
    if (sentiment.label === 'negative') {
      return 'medium';
    }

    // Feature request = low priority
    if (category.label === 'feature') {
      return 'low';
    }

    return 'medium';
  }

  private extractKeywords(text: string): string[] {
    // Basik keyword extraction
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const stopWords = ['this', 'that', 'with', 'from', 'have', 'been', 'were', 'when', 'bu', 'şu', 'için'];

    const frequency = new Map<string, number>();
    words.forEach(word => {
      if (!stopWords.includes(word)) {
        frequency.set(word, (frequency.get(word) || 0) + 1);
      }
    });

    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (magnitudeA * magnitudeB);
  }
}
