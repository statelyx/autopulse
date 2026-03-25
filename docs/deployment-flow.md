# AUTO PULSE — Deployment Akış Belgesi

> **Son Güncelleme:** 25 Mart 2026
> **Durum:** Aktif

---

## 🔗 Deployment Zinciri

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        AUTO PULSE — DEPLOYMENT AKIŞI                       │
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

### Yapılandırma
- **Framework:** Next.js (otomatik algılanır)
- **Build Komutu:** `npm run build`
- **Çıktı Dizini:** `.next`
- **Node.js Sürümü:** 20.x

### Ortam Değişkenleri (Vercel Dashboard)
```
NEXT_PUBLIC_APP_URL=https://autopulse.vercel.app
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Preview Deployments
- Her push'ta otomatik preview URL oluşturulur
- `main` dalına merge edilince production'a deploy edilir

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

> **Dil Kuralı:** Bu belge ve tüm deployment notları Türkçe tutulacaktır.
