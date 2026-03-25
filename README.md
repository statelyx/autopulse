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
| **Faz 2** | Veri Normalizasyonu & JSON Pipeline | ⏳ Bekliyor |
| **Faz 3** | Temel UI Bileşenleri & Tasarım Sistemi | ⏳ Bekliyor |
| **Faz 4** | Dashboard & Ana Sayfa | ⏳ Bekliyor |
| **Faz 5** | Araç Detay Sayfaları | ⏳ Bekliyor |
| **Faz 6** | Arama & Filtreleme | ⏳ Bekliyor |
| **Faz 7** | AI Entegrasyonu | ⏳ Bekliyor |
| **Faz 8** | Kullanıcı Yorumları | ⏳ Bekliyor |
| **Faz 9** | Supabase Entegrasyonu | ⏳ Bekliyor |
| **Faz 10** | Performans Optimizasyonu | ⏳ Bekliyor |
| **Faz 11** | SEO & Meta Veriler | ⏳ Bekliyor |
| **Faz 12** | Test & QA | ⏳ Bekliyor |
| **Faz 13** | Production Deploy | ⏳ Bekliyor |

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
