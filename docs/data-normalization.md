# AUTO PULSE — Veri Normalizasyonu

> **Son Güncelleme:** 25 Mart 2026
> **Durum:** Aktif — Faz 6

---

## 📊 vehiclesdata.txt Analizi

### Dosya Yapısı

```
MARKA_ADI (BÜYÜK HARF)
- Model 1
- Model 2
- Model 3
```

### Örnek Veri

```
ACURA
- CL
- EL
- ILX
- Integra
- Legend
- MDX
- NSX
```

### İstatistikler

| Metrik | Değer |
|--------|-------|
| **Toplam Marka** | ~90+ |
| **Toplam Model** | ~1600+ |
| **Kaynak** | vehiclesdata.txt |
| **Format** | Plain Text (A-Z sıralı) |

---

## 🔄 Normalizasyon Süreci

### 1. Parse

```typescript
// vehiclesdata.txt → ParsedBrand[]
const brands = parseVehiclesData(content);
```

### 2. Slug Oluşturma

```typescript
// "ALFA ROMEO" → "alfa-romeo"
// "Maserati Quattroporte" → "maserati-quattroporte"
```

### 3. Supabase Formatına Dönüştürme

```typescript
// ParsedBrand[] → { brands: SupabaseBrand[], models: SupabaseModel[] }
const { brands, models } = prepareForSupabase(brands);
```

---

## 📋 Supabase Tablo Yapısı

### vehicle_brands

| Column | Type | Açıklama |
|--------|------|----------|
| `id` | UUID (PK) | Otomatik |
| `name` | TEXT | Marka adı (örn: "ACURA") |
| `slug` | TEXT | URL için (örn: "acura") |
| `source` | TEXT | "vehiclesdata.txt" |
| `created_at` | TIMESTAMPTZ | Otomatik |

### vehicle_models

| Column | Type | Açıklama |
|--------|------|----------|
| `id` | UUID (PK) | Otomatik |
| `brand_slug` | TEXT (FK) | Marka slug (brands.slug) |
| `name` | TEXT | Model adı (örn: "Integra") |
| `slug` | TEXT | URL için (örn: "integra") |
| `source` | TEXT | "vehiclesdata.txt" |
| `created_at` | TIMESTAMPTZ | Otomatik |

### vehicle_years

| Column | Type | Açıklama |
|--------|------|----------|
| `id` | UUID (PK) | Otomatik |
| `brand_slug` | TEXT | Marka slug |
| `model_slug` | TEXT | Model slug |
| `year` | INTEGER | Yıl (2000-2026) |
| `created_at` | TIMESTAMPTZ | Otomatik |

---

## 🔧 Import Stratejisi

### Adım 1: SQL Seed

```sql
-- vehicle_brands tablosu
CREATE TABLE IF NOT EXISTS vehicle_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'vehiclesdata.txt',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- vehicle_models tablosu
CREATE TABLE IF NOT EXISTS vehicle_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_slug TEXT NOT NULL REFERENCES vehicle_brands(slug),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  source TEXT DEFAULT 'vehiclesdata.txt',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_slug, slug)
);

-- Indexler
CREATE INDEX idx_vehicle_models_brand_slug ON vehicle_models(brand_slug);
```

### Adım 2: JSON Import

1. `vehiclesdata.txt` → Parse → JSON
2. JSON → Supabase (via API veya SQL dump)

### Adım 3: Validation

- Marka sayısı: ~90+
- Model sayısı: ~1600+
- Duplicate kontrolü

---

## 📁 Dosya Yapısı

```
src/lib/data/
└── normalize-vehicles.ts    # Parser ve normalizer

scripts/
└── import-vehicles.ts       # Import script (gelecek faz)

data/
└── normalized/
    ├── brands.json          # Normalize edilmiş markalar
    └── models.json          # Normalize edilmiş modeller
```

---

## 🔗 Kaynak Haritası

| Kaynak | Hedef Tablo | Alanlar |
|--------|-------------|---------|
| `vehiclesdata.txt` | `vehicle_brands` | name, slug, source |
| `vehiclesdata.txt` | `vehicle_models` | brand_slug, name, slug, source |

---

> **Dil Kuralı:** Bu belge Türkçe tutulmaktadır.
