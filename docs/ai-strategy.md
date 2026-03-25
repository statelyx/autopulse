# AUTO PULSE — AI Stratejisi

> **Son Güncelleme:** 25 Mart 2026

---

## AI Mimari Tasarımı

### 1. Genel Yaklaşım

AUTO PULSE, Hugging Face API kullanarak yapay zeka destekli otomotiv analizi sunar. Modüler mimari, farklı AI provider'larını desteklemek için tasarlanmıştır.

### 2. AI Servis Katmanları

```
src/lib/ai/
├── types.ts              # Tüm AI tipleri ve arayüzler
├── index.ts              # Ana export noktası ve AI servis singleton
├── providers/
│   └── huggingface.ts   # Hugging Face API implementasyonu
├── analyzers/
│   ├── issue-analyzer.ts # Issue analizi ve clustering
│   └── vehicle-analyzer.ts # Vehicle insights ve karşılaştırma
└── prompts/
    └── index.ts          # Prompt şablonları
```

---

## AI Provider'lar

### Hugging Face Provider

**Kullanılan Modeller:**
- **Sentiment Analysis:** `distilbert-base-uncased-finetuned-sst-2-english`
  - Kullanıcı yorumları ve issue açıklamaları için sentiment analizi
  - Positive/Negative/Neutral sınıflandırması

- **Zero-Shot Classification:** `facebook/bart-large-mnli`
  - Issue kategorizasyonu
  - Vehicle sınıflandırması
  - Custom label desteği

- **Summarization:** `facebook/bart-large-cnn`
  - Uzun metin özetleme
  - Review özetleri
  - Issue özetleri

- **Feature Extraction:** `sentence-transformers/all-MiniLM-L6-v2`
  - Metin vektörizasyonu (384 boyut)
  - Issue clustering için cosine similarity
  - Semantic search

### Fallback Mekanizması

AI API çağrıları başarısız olduğunda, otomatik fallback mekanizmaları devreye girer:

1. **Sentiment Fallback:** Keyword bazlı sentiment analizi
2. **Classification Fallback:** Keyword eşleşme bazlı sınıflandırma
3. **Summarization Fallback:** İlk 200 karakter kırpma
4. **Feature Extraction Fallback:** Sıfır vektör

---

## AI Analyzer'lar

### 1. Issue Analyzer

**Görevler:**
- Issue sentiment analizi
- Issue kategorizasyonu
- Öncelik belirleme (high/medium/low)
- Issue özetleme
- Anahtar kelime çıkarma
- Issue clustering (cosine similarity)

**Kullanım:**
```typescript
import { aiService } from '@/lib/ai';

// Tek issue analizi
const analysis = await aiService.analyzeIssue({
  title: 'Navigation system crashes',
  description: 'The nav system crashes intermittently...',
  category: 'bug'
});

// Çoklu issue analizi
const analyses = await aiService.analyzeMultipleIssues(issues);

// Issue clustering
const clusters = await aiService.clusterIssues(issues);
// Map: { 'cluster-1': [0, 3, 7], 'cluster-2': [1, 4], ... }
```

**Çıktı Formatı:**
```typescript
{
  sentiment: { label: 'negative', score: 0.89 },
  category: { label: 'bug', score: 0.92 },
  priority: 'high',
  summary: 'Navigation system experiences intermittent crashes...',
  keywords: ['navigation', 'crashes', 'intermittent']
}
```

### 2. Vehicle Analyzer

**Görevler:**
- Market insight generasyonu
- Vehicle karşılaştırma
- Fiyat trendi tahmini
- Performans analizi
- Elektrikli araç pazar analizi

**Kullanım:**
```typescript
import { aiService } from '@/lib/ai';

// Market insights
const insights = await aiService.generateMarketInsight(vehicles);
// [
//   { type: 'market', title: '...', summary: '...', confidence: 85, ... },
//   { type: 'performance', title: '...', summary: '...', confidence: 90, ... }
// ]

// Vehicle karşılaştırma
const comparison = await aiService.compareVehicles(vehicle1, vehicle2);
// "Porsche 911 is 50hp more powerful and accelerates 0.5s faster..."

// Fiyat trendi
const trend = await aiService.predictPriceTrend(vehicles);
```

**Insight Tipleri:**
- `market`: Pazar analizi
- `technical`: Teknik analiz
- `performance`: Performans analizi
- `price`: Fiyat analizi
- `trend`: Trend tahmini

---

## Prompt Şablonları

### Kullanılabilir Şablonlar

```typescript
import {
  SENTIMENT_ANALYSIS_PROMPT,
  ISSUE_CLASSIFICATION_PROMPT,
  VEHICLE_COMPARISON_PROMPT,
  MARKET_INSIGHT_PROMPT,
  REVIEW_SUMMARIZATION_PROMPT,
  RECOMMENDATION_PROMPT,
  buildPrompt
} from '@/lib/ai/prompts';

// Prompt oluştur
const prompt = buildPrompt(VEHICLE_COMPARISON_PROMPT, {
  vehicleA: 'Porsche 911 2024, 450hp, 3.5s',
  vehicleB: 'BMW M3 2024, 500hp, 3.8s'
});
```

### Issue Label'lar

```typescript
import { generateIssueLabels } from '@/lib/ai/prompts';

const labels = generateIssueLabels();
// ['performance', 'ui/ux', 'bug', 'feature request', 'security', ...]
```

### Vehicle Kategorileri

```typescript
import { generateVehicleCategories } from '@/lib/ai/prompts';

const categories = generateVehicleCategories();
// ['electric vehicle', 'performance car', 'luxury vehicle', 'suv', ...]
```

---

## Kullanım Senaryoları

### 1. Issues Sayfası

**Veri Akışı:**
```
Issues Page
    ↓
aiService.analyzeIssue() / analyzeMultipleIssues()
    ↓
Hugging Face API
    ↓
IssueAnalysis { sentiment, category, priority, summary, keywords }
    ↓
UI Rendering (Sentiment icon, Priority badge, Summary, Keywords)
```

**Gösterilen Bilgiler:**
- Sentiment skoru (positive/negative/neutral)
- Category (performance, ui/ux, bug, feature, security, data)
- Priority (high/medium/low)
- AI özeti
- Anahtar kelimeler
- Confidence skoru

### 2. AI Insights Sayfası

**Veri Akışı:**
```
AI Insights Page
    ↓
aiService.generateMarketInsight(vehicles)
    ↓
VehicleAnalyzer
    ↓
VehicleInsight[] { type, title, summary, confidence, relatedVehicles, impact }
    ↓
UI Rendering (Insight kartları, Vehicle badges, Confidence, Impact)
```

**Gösterilen Bilgiler:**
- Insight tipi (market, technical, performance, price, trend)
- Confidence skoru
- İlgili araçlar (marka logoları ile)
- Impact seviyesi (high/medium/low)
- Araç istatistikleri (ortalama güç, hız, fiyat)

---

## Environment Değişkenleri

### Gerekli Anahtarlar

`.env.local` dosyasında:

```bash
# HUGGING FACE AI
HUGGINGFACE_API_KEY=hf_your_api_key_here
```

### API Key Kontrolü

```typescript
import { aiService } from '@/lib/ai';

if (aiService.isConfigured()) {
  // AI servisi kullanılabilir
  const insights = await aiService.generateMarketInsight(vehicles);
} else {
  // Fallback: Statik veri
  console.warn('AI servisi yapılandırılmadı');
}
```

---

## Performans Optimizasyonları

### 1. Paralel Çağrılar

```typescript
// Birden fazla issue analizi paralel
const analyses = await Promise.all(
  issues.map(issue => aiService.analyzeIssue(issue))
);
```

### 2. Caching (Gelecek)

- API yanıtlarını cache'leme
-相同 query'ler için cache kullanımı
- TTL: 1 saat

### 3. Rate Limiting

- Hugging Face free tier: 1000 calls/month
- Optimize edilmiş çağrı sayısı
- Batch processing desteği

---

## Hata Yönetimi

### Try-Catch Pattern

```typescript
try {
  const insights = await aiService.generateMarketInsight(vehicles);
  setInsights(insights);
} catch (error) {
  console.error('AI insights yüklenirken hata:', error);
  // Fallback: Statik insights göster
  setInsights(getFallbackInsights());
}
```

### Kullanıcı Bildirimi

- Error state gösterimi
- "AI analizi yüklenemedi" mesajı
- Refresh butonu ile yeniden deneme

---

## Gelecek Geliştirmeler

### Kısa Vadede

- [ ] Custom model fine-tuning
- [ ] Multilingual support (TR/EN)
- [ ] Real-time streaming responses
- [ ] Image analysis (vehicle photos)
- [ ] Voice input support

### Orta Vadede

- [ ] User preference learning
- [ ] Personalized recommendations
- [ ] Advanced clustering algorithms
- [ ] Price prediction models
- [ ] Market trend forecasting

### Uzun Vadede

- [ ] Custom model deployment
- [ ] Edge AI (browser-based)
- [ ] Offline mode support
- [ ] Multi-provider support (OpenAI, Anthropic)
- [ ] AI chat interface

---

## Kaynaklar

### Dokümantasyon

- [Hugging Face API Docs](https://huggingface.co/docs/api-inference/index)
- [Model Hub](https://huggingface.co/models)
- [Transformers Library](https://huggingface.co/docs/transformers/index)

### Kullanılan Modeller

- [distilbert-base-uncased-finetuned-sst-2-english](https://huggingface.co/distilbert-base-uncased-finetuned-sst-2-english)
- [facebook/bart-large-mnli](https://huggingface.co/facebook/bart-large-mnli)
- [facebook/bart-large-cnn](https://huggingface.co/facebook/bart-large-cnn)
- [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)

---

## Sorun Giderme

### API Yanıt Vermiyor

**Sorun:** `Hugging Face API hatası: 503 Service Unavailable`

**Çözüm:**
- Model yükleniyor olabilir, tekrar deneyin
- Farklı model deneyin
- Fallback mekanizması kontrol edin

### Rate Limit

**Sorun:** `Rate limit exceeded`

**Çözüm:**
- API key limits kontrol edin
- Premium plan'a geçiş düşünün
- Cacheleme stratejisi uygulayın

### Zayıf Sonuçlar

**Sorun:** AI analizleri yetersiz

**Çözüm:**
- Prompt mühendisliği iyileştirin
- Daha fazla veri ile fine-tuning düşünün
- Fallback stratejilerini güçlendirin

---

*Bu dokümantasyon AUTO PULSE AI stratejisini açıklar. Sorular için team@autopulse.com*
