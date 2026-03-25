# AUTO PULSE — Deployment Akış Belgesi

> **Son Güncelleme:** 25 Mart 2026
> **Durum:** Aktif — Faz 2: Vercel Hazırlığı
> **GitHub Repo:** https://github.com/statelyx/autopulse

---

## 🔗 Deployment Zinciri

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    AUTO PULSE — DEPLOYMENT AKIŞI (FAZ 2)                    │
└──────────────────────────────────────────────────────────────────────────────┘

  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
  │  LOCAL   │────▶│  GITHUB  │────▶│  VERCEL  │────▶│  RENDER  │────▶│  CANLI   │
  │  Dev     │     │  Repo    │     │  Frontend│     │  Backend │     │  Görünüm │
  └──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘
       │                │                │                │                │
   localhost:3000   Push Tetikler   Auto Build &     API Servisleri   Son Kullanıcı
   Hot Reload       CI/CD Başlar    Preview Deploy   Veritabanı       Erişimi
```

---

## 📦 PROJE YAPISI — VERCEL UYGUNLUK

### ✅ Vercel için Uygun Yapı

| Bileşen | Durum | Not |
|---------|-------|-----|
| **Framework** | ✅ Next.js 16.2.1 | Vercel native destekler |
| **Build Komutu** | ✅ `npm run build` | Standart Next.js build |
| **Çıktı Dizini** | ✅ `.next` | Next.js default |
| **TypeScript** | ✅ Strict Mode | Build time kontrol |
| **Node Version** | ✅ 20.x compatible | package.json'da tanımlı |
| **Static Export** | ⚠️ Hybrid | SSR + SSG desteği |

### Vercel Otomatik Algılama

Vercel bu repo'yu import ettiğinde otomatik olarak:
- Framework'ü **Next.js** olarak tanımlar
- Build komutunu `npm run build` olarak ayarlar
- Output directory'yi `.next` olarak ayarlar
- Node.js versiyonunu otomatik algılar

---

## 1️⃣ LOCAL — Geliştirme Ortamı

### Başlatma
```bash
# Bağımlılıkları yükle
npm install

# Ortam değişkenlerini ayarla
cp .env.example .env.local

# Geliştirme sunucusu
npm run dev
```

### Geliştirme Kuralları
- **Port:** `localhost:3000`
- **Hot Reload:** Dosya değişikliklerinde otomatik yenileme
- **TypeScript:** Strict mod açık, hata varsa build olmaz
- **Linting:** Her commit öncesi `npm run lint` çalıştırılmalı

---

## 2️⃣ GITHUB — Versiyon Kontrolü

### Repo Bilgileri
- **URL:** https://github.com/statelyx/autopulse
- **Ana Dal:** `main`
- **Koruma:** `main` dalı doğrudan push'a açık (tek geliştirici)

### Git Akışı
```bash
# Değişiklikleri kontrol et
git status

# Tüm değişiklikleri ekle
git add .

# Anlamlı commit mesajı (Türkçe)
git commit -m "faz-X: yapılan işin kısa açıklaması"

# GitHub'a gönder
git push origin main
```

### Commit Mesajı Formatı
```
faz-X: kısa açıklama

- Detay 1
- Detay 2
```

---

## 3️⃣ VERCEL — Frontend Deployment

### Vercel Projesi Oluşturma Adımları

```
1. vercel.com → Dashboard → "Add New Project"
2. GitHub → statelyx/autopulse reposunu seç
3. Framework Preset: Next.js (otomatik)
4. Build & Output Settings: Default kabul et
5. Environment Variables: Aşağıdaki tabloya göre ekle
6. "Deploy" butonuna tıkla
```

### Yapılandırma

| Ayar | Değer |
|------|-------|
| **Framework** | Next.js |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |
| **Node.js Version** | 20.x |

### Ortam Değişkenleri (Vercel Dashboard)

Environment Variables → Production + Preview + Development için:

```bash
# === NEXT.JS CORE ===
NEXT_PUBLIC_APP_URL=https://autopulse.vercel.app

# === SUPABASE (Faz 9+) ===
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# === HUGGING FACE AI (Faz 7+) ===
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.3

# === RENDER BACKEND (Faz 2+) ===
RENDER_API_URL=https://autopulse-api.onrender.com
```

### Preview Deployments

| Özellik | Açıklama |
|---------|----------|
| **Oluşturma Zamanı** | Her push'ta otomatik |
| **URL Formatı** | `https://autopulse-[hash].vercel.app` |
| **Production'a Geçiş** | `main` dalına merge ile |
| **Lifetime** | 7 gün sonra silinir (pro) |

---

## 4️⃣ RENDER — Backend Servisleri (Faz 2+)

### Planlanan Servisler
| Servis | Teknoloji | Port |
|--------|-----------|------|
| **API Gateway** | NestJS / Fastify | 3001 |
| **AI Servisi** | Python FastAPI | 8000 |
| **Veritabanı** | PostgreSQL | 5432 |
| **Cache** | Redis | 6379 |

### Deploy Tetikleme
- GitHub'a push → Render auto-deploy
- Health check endpoint: `/api/health`

---

## 5️⃣ CANLI GÖRÜNÜM

### URL'ler (Planlanan)
| Ortam | URL |
|-------|-----|
| **Production** | `https://autopulse.vercel.app` |
| **Preview** | `https://autopulse-[hash].vercel.app` |
| **API** | `https://autopulse-api.onrender.com` |
| **Local** | `http://localhost:3000` |

---

## 🔧 Sorun Giderme

### Build Hatası
```bash
# Lokal'de build test et
npm run build

# Lint hatalarını kontrol et
npm run lint

# Type hatalarını kontrol et
npx tsc --noEmit
```

### Deploy Başarısız
1. Vercel Dashboard'dan build loglarını kontrol et
2. Ortam değişkenlerinin doğru ayarlandığından emin ol
3. `package.json` → `engines` alanını kontrol et

---

## 📋 VERCEL DEPLOYMENT CHECKLIST

### Pre-Deploy
- [ ] `.env.local` dosyası `.gitignore`'da
- [ ] `.env.example` güncel
- [ ] `npm run build` lokal'de başarıyla çalışıyor
- [ ] TypeScript hataları yok
- [ ] Lint hataları yok

### Vercel Dashboard
- [ ] Proje import edildi
- [ ] Framework: Next.js
- [ ] Build komutu: `npm run build`
- [ ] Environment variables eklendi
- [ ] Custom domain (opsiyonel)

### Post-Deploy
- [ ] Production URL erişilebilir
- [ ] Preview deploy çalışıyor
- [ ] Environment variables doğru yüklenmiş
- [ ] Statik varlıklar (logo, resim) yükleniyor

---

> **Dil Kuralı:** Bu belge ve tüm deployment notları Türkçe tutulacaktır.
