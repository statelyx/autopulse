# AUTO PULSE — Deployment Akış Belgesi

> **Son Güncelleme:** 25 Mart 2026
> **Durum:** Aktif — Faz 3: Backend İskeleti
> **GitHub Repo:** https://github.com/statelyx/autopulse

---

## 🔗 Deployment Zinciri

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    AUTO PULSE — DEPLOYMENT AKIŞI (FAZ 3)                    │
└──────────────────────────────────────────────────────────────────────────────┘

  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
  │  LOCAL   │────▶│  GITHUB  │────▶│  VERCEL  │────▶│  RENDER  │────▶│  CANLI   │
  │  Dev     │     │  Repo    │     │  Frontend│     │  Backend │     │  Görünüm │
  └──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘
       │                │                │                │                │
   localhost:3000   Push Tetikler   Auto Build &     API Servisleri   Son Kullanıcı
   Hot Reload       CI/CD Başlar    Preview Deploy   Veritabanı       Erişimi
                        │                                │
                        └────────────────────────────────┘
                              Next.js API Routes
                        /health, /api/status, /api/env-check
```

---

## 📦 PROJE YAPISI — FAZ 3 GÜNCELLEMESİ

### ✅ Next.js API Routes Backend

| Bileşen | Durum | Not |
|---------|-------|-----|
| **Framework** | ✅ Next.js 16.2.1 | Vercel native destekler |
| **API Routes** | ✅ Aktif | `/api/health`, `/api/status`, `/api/env-check` |
| **Build Komutu** | ✅ `npm run build` | Standart Next.js build |
| **Output Mode** | ✅ `standalone` | Render için optimize |
| **TypeScript** | ✅ Strict Mode | Build time kontrol |
| **Node Version** | ✅ 20.x+ | package.json'da tanımlı |

### Backend Endpoint'leri (Faz 3)

```typescript
// API Route Handlers
src/app/api/
├── health/
│   └── route.ts          // GET /api/health — Render health check
└── api/
    ├── status/
    │   └── route.ts      // GET /api/status — Servis durumu
    └── env-check/
        └── route.ts      // GET /api/env-check — Environment kontrolü
```

---

## 1️⃣ LOCAL — Geliştirme Ortamı

### Başlatma
```bash
# Bağımlılıkları yükle
npm install

# Ortam değişkenlerini ayarla (.env.local gitignore'da)
cp .env.example .env.local

# Geliştirme sunucusu
npm run dev
```

### Health Check Test
```bash
# Terminal'de test et
curl http://localhost:3000/api/health

# Veya package script'i kullan
npm run health-check
```

---

## 2️⃣ GITHUB — Versiyon Kontrolü

### Repo Bilgileri
- **URL:** https://github.com/statelyx/autopulse
- **Ana Dal:** `main`
- **Koruma:** `main` dalı doğrudan push'a açık (tek geliştirici)

---

## 3️⃣ VERCEL — Frontend + API Deployment

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

```bash
# === SUPABASE ===
SUPABASE_URL=https://wyirdbekgwxqwhfwpxkj.supabase.co
SUPABASE_KEY=sb_publishable_1JdOGHA4rGi1EYsnrkGFHg_Ayq2iBG_
SUPABASE_ANON_KEY_LEGACY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_URL=https://wyirdbekgwxqwhfwpxkj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_... (server-side only)

# === HUGGING FACE AI ===
HF_FINEGRAINED_API_KEY=hf_...
HF_ZEROSHOT_API_KEY=hf_...
HF_SUMMARIZATION_API_KEY=hf_...
HUGGINGFACE_API_KEY=hf_...

# === NEXT.JS CORE ===
NEXT_PUBLIC_APP_URL=https://autopulse.vercel.app
```

---

## 4️⃣ RENDER — Next.js Backend Deployment

### Render Web Service Yapılandırması

| Ayar | Değer |
|------|-------|
| **Type** | Web Service |
| **Runtime** | Node 20.x |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |
| **Health Check Path** | `/api/health` |

### Environment Variables (Render Dashboard)

Vercel ile aynı değişkenleri Render'a da ekleyin.

### Render Deploy URL'leri

| Ortam | URL |
|-------|-----|
| **Production** | `https://auto-pulse.onrender.com` |
| **API Health** | `https://auto-pulse.onrender.com/api/health` |
| **Local** | `http://localhost:3000` |

---

## 5️⃣ CANLI GÖRÜNÜM

### URL'ler (Aktif)
| Ortam | URL |
|-------|-----|
| **Production (Vercel)** | `https://autopulse.vercel.app` |
| **Backend (Render)** | `https://auto-pulse.onrender.com` |
| **Local** | `http://localhost:3000` |

---

## 🔧 Sorun Giderme

### Build Hatası
```bash
# Lokal'de build test et
npm run build

# Type hatalarını kontrol et
npx tsc --noEmit
```

### Deploy Başarısız
1. Dashboard'dan build loglarını kontrol et
2. Ortam değişkenlerinin doğru ayarlandığından emin ol
3. Health check path: `/api/health`

---

## 📋 DEPLOYMENT CHECKLIST

### Pre-Deploy
- [ ] `.env.local` dosyası `.gitignore`'da
- [ ] `.env.example` güncel
- [ ] `npm run build` lokal'de başarıyla çalışıyor
- [ ] TypeScript hataları yok
- [ ] Health check endpoint çalışıyor

### Post-Deploy
- [ ] Production URL erişilebilir
- [ ] `/api/health` 200 OK dönüyor
- [ ] `/api/status` JSON dönüyor
- [ ] `/api/env-check` env var'ları raporluyor

---

> **Dil Kuralı:** Bu belge ve tüm deployment notları Türkçe tutulacaktır.
