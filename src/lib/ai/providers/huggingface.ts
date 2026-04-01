/**
 * AUTO PULSE - Hugging Face AI Provider
 * Sunucu tarafında çok anahtarlı Hugging Face erişimi ve güvenli fallback'ler
 */

import type {
  AIModel,
  AIProviderInterface,
  ChatMessage,
  ClassificationResult,
  SentimentResult,
} from '../types';

type SentimentPayload = Array<Array<{ label?: string; score?: number }>> | Array<{ label?: string; score?: number }>;
type ClassificationPayload = { labels?: string[]; scores?: number[] };
type SummaryPayload = Array<{ summary_text?: string }> | { summary_text?: string };
type TextGenerationPayload = Array<{ generated_text?: string }> | { generated_text?: string };
type ChatCompletionPayload = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export class HuggingFaceProvider implements AIProviderInterface {
  name = 'huggingface' as const;
  private baseUrl = 'https://api-inference.huggingface.co/models';
  private routerUrl = 'https://router.huggingface.co/v1/chat/completions';

  private getApiKey(modelType: AIModel) {
    if (modelType === 'zero-shot-classification') {
      return process.env.HF_ZEROSHOT_API_KEY || process.env.HUGGINGFACE_API_KEY || '';
    }

    if (modelType === 'summarization') {
      return process.env.HF_SUMMARIZATION_API_KEY || process.env.HUGGINGFACE_API_KEY || '';
    }

    return process.env.HF_FINEGRAINED_API_KEY || process.env.HUGGINGFACE_API_KEY || '';
  }

  isConfigured(): boolean {
    return Boolean(
      process.env.HF_FINEGRAINED_API_KEY ||
      process.env.HF_ZEROSHOT_API_KEY ||
      process.env.HF_SUMMARIZATION_API_KEY ||
      process.env.HUGGINGFACE_API_KEY,
    );
  }

  private getChatModel() {
    return process.env.HUGGINGFACE_CHAT_MODEL || 'Qwen/Qwen2.5-7B-Instruct-1M';
  }

  private getAtomicBaseUrl() {
    return (process.env.ATOMIC_CHAT_BASE_URL || '').replace(/\/$/, '');
  }

  private async fetchAPI(
    modelType: AIModel,
    modelId: string,
    payload: Record<string, unknown>,
  ): Promise<unknown> {
    const apiKey = this.getApiKey(modelType);

    if (!apiKey) {
      throw new Error('Hugging Face API anahtarı bulunamadı');
    }

    const response = await fetch(`${this.baseUrl}/${modelId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API hatası: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async analyzeSentiment(text: string): Promise<SentimentResult> {
    try {
      const result = await this.fetchAPI(
        'sentiment-analysis',
        'distilbert-base-uncased-finetuned-sst-2-english',
        { inputs: text },
      ) as SentimentPayload;

      const sentiment = Array.isArray(result[0]) ? result[0][0] : result[0];
      const label = String(sentiment?.label ?? '').toLowerCase();

      return {
        label: label === 'positive' ? 'positive' : label === 'negative' ? 'negative' : 'neutral',
        score: Number(sentiment?.score ?? 0.5),
      };
    } catch {
      return this.fallbackSentiment(text);
    }
  }

  async classifyText(text: string, labels: string[]): Promise<ClassificationResult[]> {
    try {
      const result = await this.fetchAPI(
        'zero-shot-classification',
        'facebook/bart-large-mnli',
        {
          inputs: text,
          parameters: {
            candidate_labels: labels,
          },
        },
      ) as ClassificationPayload;

      if (!Array.isArray(result.labels) || !Array.isArray(result.scores)) {
        throw new Error('Beklenmeyen sınıflandırma yanıtı');
      }

      return result.labels
        .map((label, index) => ({
          label,
          score: Number(result.scores?.[index] ?? 0),
        }))
        .sort((left, right) => right.score - left.score);
    } catch {
      return this.fallbackClassification(text, labels);
    }
  }

  async generateSummary(text: string): Promise<string> {
    try {
      const result = await this.fetchAPI(
        'summarization',
        'facebook/bart-large-cnn',
        {
          inputs: text,
          parameters: {
            max_length: 140,
            min_length: 40,
          },
        },
      ) as SummaryPayload;

      if (Array.isArray(result) && typeof result[0]?.summary_text === 'string') {
        return result[0].summary_text;
      }

      if (!Array.isArray(result) && typeof result.summary_text === 'string') {
        return result.summary_text;
      }

      throw new Error('Beklenmeyen özet yanıtı');
    } catch {
      return `${text.slice(0, 220).trim()}...`;
    }
  }

  async generateChatCompletion(messages: ChatMessage[]): Promise<string> {
    const atomicBaseUrl = this.getAtomicBaseUrl();

    if (atomicBaseUrl) {
      try {
        const atomicResponse = await this.generateAtomicChatCompletion(atomicBaseUrl, messages);
        if (atomicResponse) {
          return atomicResponse;
        }
      } catch {
        // Atomic yoksa veya hata verirse Hugging Face fallback'e düş.
      }
    }

    try {
      const routerResponse = await this.generateRouterChatCompletion(messages);
      if (routerResponse) {
        return routerResponse;
      }
    } catch {
      // Router başarısızsa text-generation fallback.
    }

    try {
      const generated = await this.fetchAPI(
        'text-generation',
        process.env.HUGGINGFACE_TEXT_MODEL || 'google/flan-t5-large',
        {
          inputs: messages.map((message) => `${message.role.toUpperCase()}: ${message.content}`).join('\n'),
          parameters: {
            max_new_tokens: 220,
            temperature: 0.3,
            return_full_text: false,
          },
        },
      ) as TextGenerationPayload;

      if (Array.isArray(generated) && typeof generated[0]?.generated_text === 'string') {
        return generated[0].generated_text.trim();
      }

      if (!Array.isArray(generated) && typeof generated.generated_text === 'string') {
        return generated.generated_text.trim();
      }
    } catch {
      // Son fallback aşağıda.
    }

    const userPrompt = [...messages].reverse().find((message) => message.role === 'user')?.content ?? '';
    return `${userPrompt.slice(0, 220).trim()} için net bir AI yanıtı üretilemedi. Marka, model, bütçe veya yakıt tipini daha açık yazarsan daha iyi filtreleyebilirim.`;
  }

  async extractFeatures(text: string): Promise<number[]> {
    try {
      const result = await this.fetchAPI(
        'feature-extraction',
        'sentence-transformers/all-MiniLM-L6-v2',
        { inputs: text },
      ) as unknown;

      return Array.isArray(result) ? result.flat(Infinity).map(Number) : [];
    } catch {
      return new Array(384).fill(0);
    }
  }

  private fallbackSentiment(text: string): SentimentResult {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'iyi', 'harika', 'mukemmel', 'sorunsuz'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'kotu', 'berbat', 'risk', 'ariza', 'gecikme'];

    const normalized = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const positiveCount = positiveWords.filter((word) => normalized.includes(word)).length;
    const negativeCount = negativeWords.filter((word) => normalized.includes(word)).length;

    if (positiveCount > negativeCount) {
      return { label: 'positive', score: 0.72 };
    }

    if (negativeCount > positiveCount) {
      return { label: 'negative', score: 0.74 };
    }

    return { label: 'neutral', score: 0.5 };
  }

  private fallbackClassification(text: string, labels: string[]): ClassificationResult[] {
    const normalized = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return labels
      .map((label) => {
        const labelWords = label
          .toLowerCase()
          .split(/[\s/-]+/)
          .filter(Boolean);
        const matchCount = labelWords.filter((word) => normalized.includes(word)).length;

        return {
          label,
          score: matchCount > 0 ? 0.6 + matchCount * 0.1 : 0.32,
        };
      })
      .sort((left, right) => right.score - left.score);
  }

  private async generateAtomicChatCompletion(baseUrl: string, messages: ChatMessage[]) {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.ATOMIC_CHAT_MODEL || 'default',
        temperature: 0.2,
        max_tokens: 260,
        messages,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Atomic chat hatası: ${response.status}`);
    }

    const data = await response.json() as ChatCompletionPayload;
    return data.choices?.[0]?.message?.content?.trim() || '';
  }

  private async generateRouterChatCompletion(messages: ChatMessage[]) {
    const token = process.env.HF_FINEGRAINED_API_KEY || process.env.HUGGINGFACE_API_KEY || '';

    if (!token) {
      throw new Error('Hugging Face chat token bulunamadı');
    }

    const response = await fetch(this.routerUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.getChatModel(),
        messages,
        temperature: 0.2,
        max_tokens: 260,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HF router chat hatası: ${response.status}`);
    }

    const data = await response.json() as ChatCompletionPayload;
    return data.choices?.[0]?.message?.content?.trim() || '';
  }
}
