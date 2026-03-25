<p align="center">
  <img src="public/autopulse-logo.svg" alt="Auto Pulse Logo" width="200" />
</p>

<h1 align="center">🏎️ AUTO PULSE</h1>

<p align="center">
  <strong>Premium Otomotiv Intelligence Platformu</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Framer_Motion-Animasyonlar-FF0050?style=for-the-badge&logo=framer" alt="Framer Motion" />
</p>

---

## 🎯 Ürün Vizyonu

**Auto Pulse**; teknik araç verilerini, gerçek kullanıcı yorumlarını ve yapay zeka analizlerini bir araya getiren **Premium Otomotiv Intelligence** platformudur.

Apple, Porsche ve Lucid estetiğini, Fintech dashboard fonksiyonelliği ile birleştirerek kullanıcılara benzersiz bir deneyim sunar.

### Temel Özellikler
- 🔍 **Akıllı Araç Arama** — Marka, model, yıl bazlı premium arama deneyimi
- 📊 **Detaylı Teknik Veriler** — Motor, performans, güvenlik ve donanım bilgileri
- 🤖 **AI Destekli Analizler** — Yapay zeka ile araç karşılaştırma ve öneriler
- 💬 **Kullanıcı Yorumları** — Gerçek sahip deneyimleri ve puanlamalar
- 🎨 **Premium UI/UX** — Obsidian Black tema, Neon Amber vurgular, akıcı animasyonlar

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji | Açıklama |
|--------|-----------|----------|
| **Framework** | Next.js 14+ (App Router) | SEO ve performans odaklı |
| **Dil** | TypeScript (Strict Mode) | Tip güvenliği ve ölçeklenebilirlik |
| **Stil** | Tailwind CSS + Framer Motion | Premium animasyonlar |
| **Bileşenler** | shadcn/ui (Customized) | Tutarlı ve kaliteli UI |
| **State** | Zustand | Hafif global state yönetimi |
| **Veri** | Supabase + Local JSON | Esnek veri katmanı |
| **Mimari** | Service-Adapter Pattern | API geçişine hazır |

---

## 📁 Klasör Yapısı

```
auto-pulse/
├── src/
│   ├── app/                    # Next.js App Router (Sayfalar & Route'lar)
│   │   ├── api/                # API Endpoint'leri (Faz 3)
│   │   │   ├── health/         # Health check endpoint
│   │   │   └── api/            # Status ve env-check endpoint'leri
│   │   ├── page.tsx            # Ana sayfa
│   │   └── layout.tsx          # Root layout
│   ├── components/             # UI Bileşenleri
│   │   ├── shared/             # Ortak bileşenler (Button, Input, Modal)
│   │   ├── vehicle/            # Araç bileşenleri (Card, Specs, AI Summary)
│   │   ├── search/             # Premium arama & otomatik tamamlama
│   │   └── layout/             # Navigation, Footer, Hero
│   ├── lib/                    # Core Mantık
│   │   ├── adapters/           # Veri kaynağı adaptörleri
│   │   ├── services/           # İş mantığı servisleri
│   │   ├── utils/              # Yardımcı fonksiyonlar
│   │   └── constants/          # Sabitler & yapılandırma
│   └── types/                  # Global TypeScript tanımları
├── data/                       # Statik Veri Katmanı
│   ├── raw/                    # Ham veri dosyaları
│   ├── normalized/             # Normalize edilmiş JSON verileri
│   └── reviews/                # Kullanıcı yorumları & AI analizleri
├── public/                     # Statik varlıklar
│   └── brands/                 # Marka logoları (SVG)
├── scripts/                    # Yardımcı scriptler (veri dönüşümü vb.)
├── docs/                       # Proje dokümantasyonu
├── stitch/                     # Tasarım referansları & mockup'lar
├── car-logos-dataset-master/   # Araç logo veri seti (kaynak)
└── vehiclesdata.txt            # Ham araç marka/model listesi
```

---

## 🚀 Deployment Akışı

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  LOCAL   │───▶│  GITHUB  │───▶│  VERCEL  │───▶│  RENDER  │───▶│  CANLI   │
│  Dev     │    │  Repo    │    │  Preview │    │  Backend │    │  Görünüm │
│          │    │          │    │  & Prod  │    │  (API)   │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │               │
  npm run dev    git push       Auto Deploy     API Servisi     Kullanıcı
  localhost:3000  main branch   CI/CD Pipeline  Veritabanı      Erişimi
```

### Adım Adım
1. **Local** → `npm run dev` ile geliştirme ortamında çalıştır
2. **GitHub** → `git push` ile değişiklikleri repoya gönder
3. **Vercel** → Push sonrası otomatik build & deploy (Frontend)
4. **Render** → Backend API servisleri (Faz 2+)
5. **Canlı** → Kullanıcıların erişebildiği production ortamı

---

## ⚡ Vercel Deployment

### Vercel Projesi Oluşturma

1. **Vercel Dashboard**'a git: [vercel.com](https://vercel.com)
2. **"Import Project"** → GitHub repo'sunu seç: `statelyx/autopulse`
3. **Framework Preset**: Next.js (otomatik algılanır)
4. **Build Komutu**: `npm run build`
5. **Çıktı Dizini**: `.next`

### Vercel Ortam Değişkenleri

Vercel Dashboard → Settings → Environment Variables alanına aşağıdaki değişkenleri ekle:

| Değişken | Değer | Ortam |
|----------|-------|-------|
| `NEXT_PUBLIC_APP_URL` | `https://autopulse.vercel.app` | Production |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL'si | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role | Production |
| `HUGGINGFACE_API_KEY` | Hugging Face token | Production |
| `RENDER_API_URL` | Backend API URL | All |

> **ÖNEMLİ:** `NEXT_PUBLIC_*` öneki olan değişkenler client-side erişilebilir. Gizli anahtarlar asla bu önekle başlamamalı.

### Preview Deployments

- Her PR ve push'ta otomatik preview URL oluşturulur
- Preview URL'ler: `https://autopulse-[hash].vercel.app`
- `main` dalına merge ile production'a deploy

---

## 🔌 API Endpoint'leri

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/health` | GET | Health check — Render için |
| `/api/status` | GET | Servis durumu ve entegrasyon bilgileri |
| `/api/env-check` | GET | Environment değişkeni kontrolü (maskeli) |

### Örnek Çıktı

```bash
# Health Check
curl https://autopulse.vercel.app/api/health
# {"status":"ok","service":"auto-pulse","timestamp":"2026-03-25T..."}

# API Status
curl https://autopulse.vercel.app/api/status
# {"service":"auto-pulse-api","integrations":{...}}

# Env Check
curl https://autopulse.vercel.app/api/env-check
# {"summary":{"total":18,"present":15,"missing":3},...}
```

---

## 🛣️ Uygulama Route'ları

| Route | Açıklama |
|-------|----------|
| `/` | Ana Sayfa — Hero bölümü ve quick actions |
| `/dashboard` | Dashboard — İstatistikler ve özet |
| `/discover` | Keşfet — Marka ve modeller |
| `/search` | Araç Arama — Gelişmiş arama |
| `/compare` | Karşılaştır — Araç karşılaştırma |
| `/issues` | Sorunlar — Bilinen araç sorunları |
| `/saved` | Kayıtlı — Kaydedilen araçlar |
| `/vin` | VIN Sorgu — Şasi numarası sorgulama |
| `/about` | Hakkında — Proje bilgileri |
| `/auth/login` | Giriş — Kullanıcı girişi |
| `/auth/register` | Kayıt — Yeni hesap oluşturma |

---

## 🏁 Hızlı Başlangıç

```bash
# Repoyu klonla
git clone https://github.com/statelyx/autopulse.git
cd autopulse

# Bağımlılıkları yükle
npm install

# Ortam değişkenlerini ayarla
cp .env.example .env.local

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

---

## 🎨 Tasarım Sistemi

| Öğe | Değer | Kullanım |
|-----|-------|----------|
| **Obsidian Black** | `#0A0A0A` | Ana arka plan |
| **Neon Amber** | `#FFBF00` | Vurgu & CTA |
| **Graphite** | `#2D2D2D` | Kartlar & yüzeyler |
| **Cool Gray** | `#9CA3AF` | İkincil metinler |
| **Pure White** | `#FFFFFF` | Birincil metinler |

---

## 📋 Geliştirme Fazları

| Faz | Açıklama | Durum |
|-----|----------|-------|
| **Faz 1** | Repo İskeleti & İlk Push | ✅ Tamamlandı |
| **Faz 2** | Vercel Hazırlığı & Deployment Planı | ✅ Tamamlandı |
| **Faz 3** | Render Uyumlu Backend İskeleti | ✅ Tamamlandı |
| **Faz 4** | Next.js Temel Uygulama İskeleti / Premium Shell | ✅ Tamamlandı |
| **Faz 5** | Araç Veri Yapısı & Entegrasyon | ⏳ Bekliyor |
| **Faz 6** | Arama & Filtreleme Sistemi | ⏳ Bekliyor |
| **Faz 7** | Araç Detay Sayfaları | ⏳ Bekliyor |
| **Faz 8** | AI Entegrasyonu | ⏳ Bekliyor |
| **Faz 9** | Kullanıcı Yorumları | ⏳ Bekliyor |
| **Faz 10** | Supabase Entegrasyonu | ⏳ Bekliyor |
| **Faz 11** | Performans Optimizasyonu | ⏳ Bekliyor |
| **Faz 12** | SEO & Meta Veriler | ⏳ Bekliyor |
| **Faz 13** | Test & QA | ⏳ Bekliyor |
| **Faz 14** | Production Deploy | ⏳ Bekliyor |

---

## 🌍 Dil Kuralı

> **Bu projede tüm ajan çıktıları, geliştirme notları, görev açıklamaları ve teknik dokümantasyon her zaman Türkçe tutulacaktır.**

---

## 📜 Lisans

Bu proje **özel lisans** altındadır. Tüm hakları saklıdır.

---

<p align="center">
  <strong>Auto Pulse</strong> — Premium Otomotiv Intelligence
  <br />
  <sub>statelyx tarafından geliştirilmektedir.</sub>
</p>
