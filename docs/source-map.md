# AUTO PULSE — Kaynak Haritası

> **Son Güncelleme:** 25 Mart 2026
> **Durum:** Aktif — Faz 6

---

## 📁 ZORUNLU KAYNAKLAR

Bu projede aşağıdaki kaynaklar **zorunlu** olarak kullanılacaktır.

---

## 1. vehiclesdata.txt

**Konum:** `/vehiclesdata.txt` (proje root)

**Açıklama:** Dünyadaki araç marka ve modellerinin A-Z listesi.

**Ana Kullanım Amacı:** Marka/Model verisinin birincil kaynağı.

**Beslediği Alanlar:**
- `vehicle_brands.name`
- `vehicle_brands.slug`
- `vehicle_models.name`
- `vehicle_models.slug`

**Veri Formatı:**
```
MARKA_ADI
- Model 1
- Model 2
```

**Import Yöntemi:**
1. Parse: `src/lib/data/normalize-vehicles.ts`
2. Convert: `ParsedBrand[]` → `SupabaseBrand[]` + `SupabaseModel[]`
3. Insert: Supabase API veya SQL dump

**İstatistik:**
- ~90+ marka
- ~1600+ model

---

## 2. car-logos-dataset-master/

**Konum:** `/car-logos-dataset-master/`

**Açıklama:** Marka logoları veri seti (GitHub'dan alınmış).

**Ana Kullanım Amacı:** Marka logolarının birincil kaynağı.

**Beslediği Alanlar:**
- `brand_logos.url`
- `brand_logos.thumb_url`
- `brand_logos.optimized_url`
- `brand_logos.source_url`

**Veri Formatı:**
```json
{
  "name": "Abarth",
  "slug": "abarth",
  "image": {
    "source": "https://www.carlogos.org/logo/Abarth-logo...",
    "thumb": "https://raw.githubusercontent.com/.../thumb/abarth.png",
    "optimized": "https://raw.githubusercontent.com/.../optimized/abarth.png",
    "original": "https://raw.githubusercontent.com/.../original/abarth.png"
  }
}
```

**Import Yöntemi:**
1. Parse: `car-logos-dataset-master/logos/data.json`
2. Match: Marka adını `vehicle_brands` ile eşleştir
3. Insert: `brand_logos` tablosuna

**İstatistik:**
- 100+ marka logosu
- Çoklu format (thumb, optimized, original)

---

## 3. stitch/

**Konum:** `/stitch/`

**Açıklama:** UI tasarım referansları ve mockup'lar.

**Ana Kullanım Amacı:** UI ve UX'in birincil referans kaynağı.

**Beslediği Alanlar:**
- UI Bileşenleri
- Tasarım sistemi
- Layout yapısı
- Renk paleti (zaten tanımlı: Obsidian Black + Neon Amber)

**Dosyalar:**
```
stitch/
├── auto_pulse_prd_architecture.html    # PRD
├── stitch/
│   ├── auto_pulse_dashboard/
│   │   ├── code.html                   # Dashboard HTML/CSS
│   │   └── screen.png                  # Dashboard görsel
│   └── obsidian_kinetic/
│       └── DESIGN.md                   # Tasarım sistemi
```

**Kullanım Yöntemi:**
- Görsel referans olarak
- CSS kod örnekleri için
- Layout yapısı için

---

## 🔗 Kaynak İlişkisi

```
┌─────────────────────────┐     ┌──────────────────────┐
│  vehiclesdata.txt       │────▶│ vehicle_brands        │
│  (Marka/Model)           │     │ vehicle_models        │
└─────────────────────────┘     └──────────────────────┘
                                          │
┌─────────────────────────┐             │
│ car-logos-dataset/      │─────────────┤
│ (Logolar)               │             │
└─────────────────────────┘             │
                                          ▼
                                ┌──────────────────────┐
                                │    UI Bileşenleri     │
                                └──────────────────────┘
                                          ▲
                                          │
                                ┌──────────────────────┐
                                │      stitch/          │
                                │  (UI Referans)        │
                                └──────────────────────┘
```

---

## 📋 Supabase Tablo Özeti

| Tablo | Kaynak | Durum |
|-------|--------|-------|
| `vehicle_brands` | vehiclesdata.txt | ✅ Planlandı |
| `vehicle_models` | vehiclesdata.txt | ✅ Planlandı |
| `vehicle_years` | Dinamik | ⏳ Gelecek |
| `brand_logos` | car-logos-dataset-master/ | ✅ Planlandı |

---

## 🚀 Import Sırası

1. **vehiclesdata.txt** → `vehicle_brands`, `vehicle_models`
2. **car-logos-dataset-master/** → `brand_logos`
3. **stitch/** → UI Bileşenleri (zaman içinde)

---

> **Dil Kuralı:** Bu belge Türkçe tutulmaktadır.
