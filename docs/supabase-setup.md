# AUTO PULSE — Supabase Kurulum ve Entegrasyon

> **Son Güncelleme:** 25 Mart 2026
> **Durum:** Aktif — Faz 5

---

## 🔗 Supabase Bağlantısı

### Environment Variables

```bash
# Supabase (Zorunlu)
SUPABASE_URL=https://wyirdbekgwxqwhfwpxkj.supabase.co
SUPABASE_KEY=sb_publishable_1JdOGHA4rGi1EYsnrkGFHg_Ayq2iBG_
SUPABASE_ANON_KEY_LEGACY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Next.js Public (Client-side)
NEXT_PUBLIC_SUPABASE_URL=https://wyirdbekgwxqwhfwpxkj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-side (Opsiyonel - şu anda kullanılmıyor)
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
SUPABASE_SECRETKEY=sb_secret_...
```

---

## 📊 Veritabanı Tablo Yapısı

### 1. profiles
Kullanıcı profilleri (auth.users ile birebir)

| Column | Type | Açıklama |
|--------|------|----------|
| `id` | UUID (PK) | auth.users.id ile birebir |
| `email` | TEXT | E-posta adresi |
| `full_name` | TEXT | Tam ad |
| `avatar_url` | TEXT | Profil resmi URL |
| `created_at` | TIMESTAMPTZ | Oluşturma tarihi |
| `updated_at` | TIMESTAMPTZ | Güncelleme tarihi |

### 2. saved_vehicles
Kullanıcıların kaydettiği araçlar

| Column | Type | Açıklama |
|--------|------|----------|
| `id` | UUID (PK) | Benzersiz ID |
| `user_id` | UUID (FK) | profiles.id |
| `brand` | TEXT | Marka adı |
| `model` | TEXT | Model adı |
| `year` | INTEGER | Yıl |
| `notes` | TEXT | Kullanıcı notları |
| `created_at` | TIMESTAMPTZ | Oluşturma tarihi |

### 3. compare_lists
Karşılaştırma listeleri

| Column | Type | Açıklama |
|--------|------|----------|
| `id` | UUID (PK) | Benzersiz ID |
| `user_id` | UUID (FK) | profiles.id |
| `name` | TEXT | Liste adı |
| `created_at` | TIMESTAMPTZ | Oluşturma tarihi |
| `updated_at` | TIMESTAMPTZ | Güncelleme tarihi |

### 4. compare_list_items
Karşılaştırma listesi item'ları

| Column | Type | Açıklama |
|--------|------|----------|
| `id` | UUID (PK) | Benzersiz ID |
| `compare_list_id` | UUID (FK) | compare_lists.id |
| `brand` | TEXT | Marka adı |
| `model` | TEXT | Model adı |
| `year` | INTEGER | Yıl |
| `position` | INTEGER | Sıralama |
| `created_at` | TIMESTAMPTZ | Oluşturma tarihi |

### 5. vehicle_brands
Araç markaları

| Column | Type | Açıklama |
|--------|------|----------|
| `id` | UUID (PK) | Benzersiz ID |
| `name` | TEXT | Marka adı |
| `slug` | TEXT | URL için slug |
| `logo_url` | TEXT | Logo URL |
| `country` | TEXT | Menşei ülke |
| `founded_year` | INTEGER | Kuruluş yılı |
| `created_at` | TIMESTAMPTZ | Oluşturma tarihi |

### 6. vehicle_models
Araç modelleri

| Column | Type | Açıklama |
|--------|------|----------|
| `id` | UUID (PK) | Benzersiz ID |
| `brand_id` | UUID (FK) | vehicle_brands.id |
| `name` | TEXT | Model adı |
| `slug` | TEXT | URL için slug |
| `category` | TEXT | Kategori (SUV, Sedan, vb.) |
| `production_start` | INTEGER | Üretim başlangıç |
| `production_end` | INTEGER | Üretim bitiş |
| `created_at` | TIMESTAMPTZ | Oluşturma tarihi |

### 7. vehicle_years
Araç yılları

| Column | Type | Açıklama |
|--------|------|----------|
| `id` | UUID (PK) | Benzersiz ID |
| `model_id` | UUID (FK) | vehicle_models.id |
| `year` | INTEGER | Yıl |
| `generation` | TEXT | Nesil |
| `body_type` | TEXT | Gövde tipi |
| `created_at` | TIMESTAMPTZ | Oluşturma tarihi |

### 8. brand_logos
Marka logoları

| Column | Type | Açıklama |
|--------|------|----------|
| `id` | UUID (PK) | Benzersiz ID |
| `brand_id` | UUID (FK) | vehicle_brands.id |
| `url` | TEXT | Logo URL |
| `thumb_url` | TEXT | Thumbnail URL |
| `optimized_url` | TEXT | Optimize URL |
| `source_url` | TEXT | Kaynak URL |
| `created_at` | TIMESTAMPTZ | Oluşturma tarihi |

---

## 🔐 Auth Yapılandırması

### Email Auth
- **Provider:** Email/Password
- **Confirmation:** Email verification (opsiyonel)
- **Flow Type:** PKCE (browser)

### Guest Mode
Supabase yapılandırılmadığında uygulama "guest mode"da çalışır:
- Authentication yapılır
- Veri kaydetme yapılır
- Read-only deneyim sunulur

---

## 📁 Dosya Yapısı

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser client
│   │   ├── server.ts       # Server client
│   │   └── middleware.ts   # Next.js middleware
│   └── auth/
│       ├── auth.ts         # Auth helpers
│       └── route-guard.tsx # Route guard component
└── types/
    └── database.ts         # Database types
```

---

## 🚀 Kullanım

### Client-side
```typescript
import { supabase } from '@/lib/supabase/client';

const { data } = await supabase
  .from('vehicle_brands')
  .select('*');
```

### Server-side
```typescript
import { getServerClient } from '@/lib/supabase/server';

const supabase = getServerClient();
const { data } = await supabase!.from('profiles').select('*');
```

### Auth
```typescript
import { signIn, signUp, signOut } from '@/lib/auth/auth';

// Giriş
const result = await signIn(email, password);

// Kayıt
const result = await signUp(email, password, fullName);

// Çıkış
await signOut();
```

---

> **Dil Kuralı:** Bu belge Türkçe tutulmaktadır.
