# AUTO PULSE — Logo Kullanım Kılavuzu

## Logo Veri Kaynağı

**Kaynak:** `car-logos-dataset-master/car-logos-dataset-master/logos/optimized/`

**Toplam Logo:** 87 marka

**Kopyalama Hedefi:** `public/brands/`

## Logo Erişim Yöntemleri

### 1. Logo Service Kullanımı (Önerilen)

```typescript
import { getBrandLogo } from '@/lib/data/logo-service';

// Tek marka için logo
const logoPath = getBrandLogo('porsche'); // → '/brands/porsche.png'
const benzLogo = getBrandLogo('mercedes'); // → '/brands/mercedes-benz.png' (alias)
```

### 2. Marka Listesi ile Logo Entegrasyonu

```typescript
import { getBrandsWithLogos } from '@/lib/data/logo-service';

const brands = [
  { name: 'BMW', slug: 'bmw' },
  { name: 'Mercedes', slug: 'mercedes-benz' }
];

const brandsWithLogos = getBrandsWithLogos(brands);
// → [{ name: 'BMW', slug: 'bmw', logoPath: '/brands/bmw.png' }, ...]
```

### 3. React Component ile Kullanım

```tsx
import Image from 'next/image';
import { getBrandLogo } from '@/lib/data/logo-service';

function BrandCard({ brandSlug }) {
  return (
    <Image
      src={getBrandLogo(brandSlug)}
      alt={brandSlug}
      width={64}
      height={64}
      className="w-16 h-16 object-contain"
      onError={(e) => {
        // Logo yoksa icon göster
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const icon = target.parentElement?.querySelector('.fallback-icon');
        if (icon) (icon as HTMLElement).style.display = 'block';
      }}
    />
  );
}
```

## Alias Eşleşmeleri

Logo service, marka isimlerinin farklı varyasyonlarını otomatik olarak eşleştirir:

| Marka Slug | Logo Dosyası |
|-----------|-------------|
| `mercedes` | `mercedes-benz.png` |
| `range-rover` | `land-rover.png` |
| `vw` | `volkswagen.png` |
| `ford` | `ford.png` (ford-mustang yoksa) |

## Mevcut Logo Dosyaları

### Premium Markalar
- Ferrari, Lamborghini, McLaren, Porsche, Bugatti, Pagani, Koenigsegg (fallback)

### Alman Markalar
- BMW, BMW M, Mercedes-Benz, Mercedes-AMG, Audi, Audi Sport, Porsche, Volkswagen

### Japon Markalar
- Toyota, Honda, Nissan, Nissan GT-R, Mazda, Mitsubishi, Subaru, Suzuki, Lexus, Infiniti, Acura, Daihatsu, Isuzu

### Kore Markaları
- Hyundai, Kia, Genesis (fallback), SsangYong

### Amerikan Markaları
- Ford, Ford Mustang, Chevrolet, Chevrolet Corvette, Dodge, Dodge Viper, Cadillac, GMC, Chrysler, Jeep, Tesla, Lincoln, Buick (Rover fallback), Pontiac

### İngiliz Markalar
- Aston Martin, Bentley, Rolls-Royce, Jaguar, Land Rover, Range Rover (Land Rover), Lotus, McLaren, Mini

### İtalyan Markalar
- Ferrari, Lamborghini, Maserati, Alfa Romeo, Fiat, Lancia, Pagani

### Fransız Markalar
- Peugeot, Renault, Citroen, DS, Bugatti

### Diğer Markalar
- Volvo, Saab, Koenigsegg (fallback), Seat, Skoda, Cupra

## Fallback Mantığı

Logo bulunamazsa:

1. **Image onError** tetiklenir
2. **Logo gizlenir** (`display: none`)
3. **Directions_car icon** gösterilir

```tsx
<span className="material-symbols-outlined text-4xl">
  directions_car
</span>
```

## Logo Kontrol Fonksiyonları

```typescript
import { hasBrandLogo, getAvailableLogos } from '@/lib/data/logo-service';

// Logo var mı?
const hasPorsche = hasBrandLogo('porsche'); // true
const hasLucid = hasBrandLogo('lucid'); // false

// Tüm logo isimleri
const allLogos = getAvailableLogos();
// → ['abarth', 'acura', 'alfa-romeo', ...]
```

## Component Entegrasyonu

### QuickAccessGrid
```tsx
{displayBrands.map(brand => (
  <Link href={`/inventory?brand=${brand.slug}`}>
    <Image src={brand.logoPath} alt={brand.name} />
  </Link>
))}
```

### Discover Page
```tsx
{filteredBrands.map(brand => (
  <div className="brand-card">
    <Image src={brand.logoPath} alt={brand.name} />
    <p>{brand.name}</p>
  </div>
))}
```

### FilterSection (Gelecek Faz)
Marka seçildiğinde logo gösterilecek:
```tsx
{selectedBrand && (
  <Image
    src={getBrandLogo(selectedBrand)}
    alt={selectedBrand}
    width={32}
    height={32}
  />
)}
```

## Performans İpuçları

1. **Logo Path Cache:** `getBrandLogo` fonksiyonu cache'li, tekrarlayan çağrılar hızlı
2. **Image Optimization:** Next.js Image component otomatik optimizasyon yapar
3. **Lazy Loading:** Grid sayfalarında `loading="lazy"` kullanın
4. **Preload:** Kritik logolar için `<link rel="preload">` kullanın

## Gelecek Geliştirmeler

- [ ] Supabase integration (logo metadata)
- [ ] Logo variant'ları (dark/light mode)
- [ ] SVG format desteği
- [ ] Logo CDN entegrasyonu
- [ ] Marka renk kodları ile logo eşleşmesi

## Logo Dosya Ekleme

Yeni logo eklemek için:

1. Logo dosyasını `public/brands/` klasörüne kopyala
2. Dosya adını `availableLogos` dizisine ekle (`logo-service.ts`)
3. Gerekirse alias ekle (`brandAliases` objesi)
4. Test et: `getBrandLogo('new-brand')`

---

**Son Güncelleme:** Faz 11 - 25 Mart 2026
