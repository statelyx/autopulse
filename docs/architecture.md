# AUTO PULSE — Mimari Tasarım Belgesi

> **Son Güncelleme:** 25 Mart 2026
> **Versiyon:** 1.0.0
> **Durum:** Faz 1 — Repo İskeleti

---

## 1. Vizyon & Felsefe

Auto Pulse, **"Premium Otomotiv Intelligence"** konseptini hayata geçiren bir web platformudur.
Teknik araç verilerini, gerçek kullanıcı yorumlarını ve yapay zeka analizlerini tek bir çatı altında birleştirir.

### Tasarım İlkeleri
- **Data-Driven:** Tüm kararlar veriye dayanır
- **Future-Ready:** Mimari, gelecekteki genişlemelere açıktır
- **Premium UX:** Her piksel özenle tasarlanır
- **Performance-First:** Hız ve SEO önceliklidir

---

## 2. Teknoloji Kararları (Faz 1 — Serverless & Data-Driven)

| Katman | Teknoloji | Neden? |
|--------|-----------|--------|
| **Framework** | Next.js 14+ (App Router) | SSR/SSG desteği, SEO optimizasyonu, API Routes |
| **Dil** | TypeScript (Strict Mode) | Tip güvenliği, refactoring kolaylığı |
| **Stil** | Tailwind CSS + Framer Motion | Hızlı prototoplama, akıcı animasyonlar |
| **Bileşenler** | shadcn/ui (Custom) | Erişilebilir, tutarlı, özelleştirilebilir |
| **State** | Zustand | Minimal boilerplate, yüksek performans |
| **Veri** | Local JSON → Supabase | İlk fazda DB bağımlılığı yok |
| **Mimari** | Service-Adapter Pattern | Veri kaynağı değişikliği kolaylaştırır |

---

## 3. Service-Adapter Mimari Deseni

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  UI Layer   │────▶│  Service     │────▶│  Adapter        │
│  (React)    │     │  (Business   │     │  (Data Source)   │
│             │     │   Logic)     │     │                  │
└─────────────┘     └──────────────┘     └─────────────────┘
                          │                      │
                     VehicleService         LocalAdapter
                     AIService              SupabaseAdapter
                     ReviewService          NHTSAAdapter
```

### Avantajlar
- Veri kaynağı değiştiğinde sadece adapter değişir
- Business logic bağımsız kalır
- Test edilebilirlik artar

---

## 4. Veri Akışı

```
vehiclesdata.txt ──▶ scripts/normalize.ts ──▶ data/normalized/*.json
                                                      │
car-logos-dataset ──▶ scripts/import-logos.ts ──▶ Supabase Storage
                                                      │
                                              ┌───────┴───────┐
                                              │  LocalAdapter  │
                                              └───────┬───────┘
                                                      │
                                              ┌───────┴───────┐
                                              │ VehicleService │
                                              └───────┬───────┘
                                                      │
                                              ┌───────┴───────┐
                                              │   UI / Pages   │
                                              └───────────────┘
```

---

## 5. Renk Paleti & Tasarım Sistemi

| Token | Değer | Kullanım |
|-------|-------|----------|
| `--bg-primary` | `#0A0A0A` (Obsidian Black) | Ana arka plan |
| `--accent` | `#FFBF00` (Neon Amber) | Vurgu, CTA, hover |
| `--surface` | `#2D2D2D` (Graphite) | Kartlar, paneller |
| `--text-primary` | `#FFFFFF` | Ana metin |
| `--text-secondary` | `#9CA3AF` | İkincil metin |
| `--border` | `#374151` | Kenarlıklar |
| `--success` | `#10B981` | Başarı durumu |
| `--error` | `#EF4444` | Hata durumu |

---

## 6. Gelecek Planı (Faz 2+)

### Faz 2 — Backend Entegrasyonu
- **Backend:** NestJS / Fastify (Render üzerinde)
- **Veritabanı:** PostgreSQL (Prisma ORM) + Redis (Cache)
- **API:** RESTful + WebSocket (gerçek zamanlı bildirimler)

### Faz 7 — AI Katmanı
- **AI Servisi:** Python FastAPI mikroservisi
- **Görevler:** BullMQ iş kuyruğu
- **Analiz:** Araç karşılaştırma, fiyat tahmini, yorum özeti

---

## 7. Dil Kuralı

> **Bu projede tüm ajan çıktıları, geliştirme notları, görev açıklamaları ve teknik dokümantasyon her zaman Türkçe tutulacaktır.**
