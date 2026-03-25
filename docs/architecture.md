# AUTO PULSE — Mimari Tasarım Belgesi

> **Son Güncelleme:** 25 Mart 2026
> **Versiyon:** 1.0.0
> **Durum:** Faz 5 — Supabase Entegrasyonu

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

## 2. ZORUNLU KAYNAKLAR (RESMİ PROJE VERİLERİ)

Bu proje aşağıdaki yerel kaynakları **resmi veri kaynağı** olarak kullanır.
Bu kaynaklar opsiyonel değildir, değiştirilemez ve görmezden gelinemez.

### 🎨 stitch/ Klasörü
**UI & Tasarım Referansı**

```
stitch/
├── auto_pulse_prd_architecture.html    # PRD ve mimari dokümanı
├── stitch/
│   ├── auto_pulse_dashboard/
│   │   ├── code.html                   # Dashboard HTML/CSS referansı
│   │   └── screen.png                  # Dashboard görsel referansı
│   └── obsidian_kinetic/
│       └── DESIGN.md                   # Obsidian Kinetic tasarım sistemi
```

**Kural:** `stitch/` klasöründeki tasarım dosyaları **ANA UI REFERANSIDIR**.
Tüm UI bileşenleri bu referansa uygun olarak geliştirilmelidir.

### 🚗 vehiclesdata.txt
**Marka/Model/Yıl Ana Veri Kaynağı**

```
vehiclesdata.txt  # Ham araç marka/model listesi
```

**Kural:** `vehiclesdata.txt` **ANA VERİ KAYNAĞIDIR**.
Tüm marka, model ve yıl bilgileri bu dosyadan normalize edilip kullanılacaktır.

### 🏭 car-logos-dataset-master/ Klasörü
**Logo Ana Veri Kaynağı**

```
car-logos-dataset-master/
├── logos/
│   ├── data.json           # Tüm marka logo metadata
│   ├── thumb/              # Thumbnail logolar
│   ├── optimized/          # Optimize edilmiş logolar
│   └── original/           # Orijinal logolar
└── src/                    # Logo işleme script'leri
```

**Kural:** `car-logos-dataset-master/` **ANA LOGO KAYNAĞIDIR**.
Tüm marka logoları bu veri setinden alınacaktır.

---

## 3. Teknoloji Kararları

| Katman | Teknoloji | Neden? |
|--------|-----------|--------|
| **Framework** | Next.js 16+ (App Router) | SSR/SSG desteği, SEO optimizasyonu, API Routes |
| **Dil** | TypeScript (Strict Mode) | Tip güvenliği, refactoring kolaylığı |
| **Stil** | Tailwind CSS | Hızlı prototoplama, premium dark tema |
| **Auth** | Supabase Auth | Email authentication, guest mode |
| **Veri** | Supabase PostgreSQL | Relation database, real-time |
| **State** | React State | Basit state yönetimi |
| **AI** | Hugging Face | AI modelleri |

---

## 4. Supabase Entegrasyonu

### Client Structure
```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser client
│   │   ├── server.ts       # Server client (Service Role)
│   │   └── middleware.ts   # Next.js middleware
│   └── auth/
│       ├── auth.ts         # Auth helpers
│       └── route-guard.tsx # Route guard component
└── types/
    └── database.ts         # Database types
```

### Auth Flow
- **Email/Password:** Standard authentication
- **Guest Mode:** Supabase yoksa read-only experience
- **PKCE Flow:** Browser security için

---

## 5. Veritabanı Tablo Yapısı

### Core Tables
| Tablo | Açıklama |
|-------|----------|
| `profiles` | Kullanıcı profilleri |
| `saved_vehicles` | Kaydedilen araçlar |
| `compare_lists` | Karşılaştırma listeleri |
| `compare_list_items` | Karşılaştırma item'ları |
| `vehicle_brands` | Araç markaları |
| `vehicle_models` | Araç modelleri |
| `vehicle_years` | Araç yılları |
| `brand_logos` | Marka logoları |

Detaylı bilgi için [`docs/supabase-setup.md`](docs/supabase-setup.md)

---

## 6. Veri Akışı

```
┌─────────────────────┐     ┌──────────────────────┐
│  ZORUNLU KAYNAKLAR  │     │  Supabase Database   │
├─────────────────────┤     ├──────────────────────┤
│ vehiclesdata.txt    │────▶│ vehicle_brands       │
│ car-logos-dataset/  │────▶│ vehicle_models       │
│ stitch/ (UI Ref)    │     │ vehicle_years        │
└─────────────────────┘     │ brand_logos          │
                           └──────────────────────┘
                                    │
                           ┌────────▼────────┐
                           │ VehicleService  │
                           └────────┬────────┘
                                    │
                           ┌────────▼────────┐
                           │   UI / Pages    │
                           └─────────────────┘
```

---

## 7. Renk Paleti & Tasarım Sistemi

| Token | Değer | Kullanım |
|-------|-------|----------|
| `--obsidian` | `#0A0A0A` | Ana arka plan |
| `--graphite` | `#2D2D2D` | Kartlar, paneller |
| `--gray-cool` | `#9CA3AF` | İkincil metin |
| `--white` | `#FFFFFF` | Ana metin |
| `--amber` | `#FFBF00` | Vurgu, CTA, hover |

---

## 8. Dil Kuralı

> **Bu projede tüm ajan çıktıları, geliştirme notları, görev açıklamaları ve teknik dokümantasyon her zaman Türkçe tutulacaktır.**
