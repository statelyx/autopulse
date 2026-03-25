# AUTO PULSE — Future Migration Plan

> **Son Güncelleme:** 25 Mart 2026

---

## VIN Entegrasyonu

### vPIC API Öncelikli Yaklaşım

**Neden vPIC?**
- **Resmi Kaynak:** NHTSA (National Highway Traffic Safety Administration) - ABD Hükümeti
- **Ücretsiz:** API key gerektirmez
- **Güvenilir:** Resmi devlet veritabanı
- **Kapsamlı:** 1981'den beri tüm ABD araçları
- **Rate Limit:** Cömert (binlerce çağrı/gün)

### Adapter Mimarisi

```
src/lib/adapters/vin-adapter.ts
├── VINProvider Interface
│   ├── decode(vin: string): Promise<VINDecodeResult>
│   └── isConfigured(): boolean
├── VPICProvider (Öncelikli)
│   ├── NHTSA vPIC API
│   ├── https://vpic.nhtsa.dot.gov/api/
│   └── API key gerektirmez
├── MockVINProvider (Fallback)
│   └── Test/Geliştirme için
└── VINAdapter (Ana Interface)
    ├── Provider zinciri
    ├── Otomatik fallback
    └── Validation
```

### Kullanım

```typescript
import { vinAdapter } from '@/lib/adapters/vin-adapter';

// VIN sorgula
const result = await vinAdapter.decode('WVWZZZ1JZKW123456');
// {
//   vin: 'WVWZZZ1JZKW123456',
//   make: 'Porsche',
//   model: '911 Carrera S',
//   year: 2024,
//   trim: 'Base',
//   bodyType: 'Coupe',
//   ...
// }
```

### Future Provider'lar

**Eklenbilecek Alternatifler:**

1. **CarFax API**
   - Kapsamlı araç geçmişi
   - Ücretli
   - North America odaklı

2. **AutoCheck API**
   - Experian hizmeti
   - Kaza ve hasar kayıtları
   - Ücretli

3. **VIN Decoder API**
   - Avrupa araçları için
   - Ücretsiz tier var
   - Global coverage

4. **European VIN Providers**
   - CarMD
   - VIN.info
   - Region-specific

---

## Supabase Migration Planı

### Mevcut Durum

**Kullanılan Veri Kaynakları:**
- ✅ vehiclesdata.txt → JSON → Supabase `vehicles` tablosu
- ✅ car-logos-dataset → Supabase `brands` tablosu
- ✅ Logo path → Supabase storage

### Migration Adımları

**1. Supabase Projesi Oluştur**
```bash
# Supabase CLI
supabase init
supabase start
```

**2. Database Schema**

```sql
-- Brands table
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_path TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE vehicles (
  id TEXT PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price INTEGER,
  fuel_type TEXT,
  transmission TEXT,
  horsepower INTEGER,
  acceleration DECIMAL(3,1),
  top_speed INTEGER,
  body_type TEXT,
  doors INTEGER,
  seats INTEGER,
  description TEXT,
  features JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_vehicles_brand ON vehicles(brand_id);
CREATE INDEX idx_vehicles_year ON vehicles(year);
CREATE INDEX idx_vehicles_fuel_type ON vehicles(fuel_type);
```

**3. Data Import**

```typescript
// scripts/import-vehicles.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Import brands
const importBrands = async () => {
  const brands = getBrands(); // vehiclesdata.txt'den
  for (const brand of brands) {
    await supabase.from('brands').insert(brand);
  }
};

// Import vehicles
const importVehicles = async () => {
  const vehicles = getVehicles(); // vehiclesdata.txt'den
  for (const vehicle of vehicles) {
    await supabase.from('vehicles').insert(vehicle);
  }
};
```

**4. RLS (Row Level Security)**

```sql
-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read vehicles" ON vehicles
  FOR SELECT TO public USING (true);

CREATE POLICY "Public read brands" ON brands
  FOR SELECT TO public USING (true);
```

---

## Authentication Entegrasyonu

### Supabase Auth

**Mevcut Durum:**
- ✅ Supabase client yapılandırılmış
- ✅ Auth context oluşturulmuş
- ⏳ Login/Register sayfaları placeholder

### Migration Steps

**1. Auth Provider Setup**

```typescript
// src/contexts/AuthContext.tsx
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return <AuthContext.Provider value={{ user, supabase }}>
    {children}
  </AuthContext.Provider>;
}
```

**2. Login Page**

```typescript
// src/app/auth/login/page.tsx
const handleLogin = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setError(error.message);
  } else {
    router.push('/dashboard');
  }
};
```

**3. Protected Routes**

```typescript
// Middleware
export { authMiddleware as middleware } from "@/lib/middleware/auth";
```

---

## Storage Entegrasyonu

### Vehicle Images

**Plan:**
```typescript
// Supabase Storage bucket: vehicle-images
const uploadVehicleImage = async (file: File, vehicleId: string) => {
  const { data, error } = await supabase.storage
    .from('vehicle-images')
    .upload(`${vehicleId}/${file.name}`, file);

  if (!error) {
    const { data: { publicUrl } } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(data.path);

    return publicUrl;
  }
};
```

### Brand Logos

**Current:** `/logos/{brandSlug}.png`
**Future:** Supabase Storage `brand-logos` bucket

---

## API Routes Migration

### Supabase Edge Functions

**Mevcut Next.js API Routes:**
- ✅ `/api/health` → Supabase Edge Function
- ✅ `/api/status` → Supabase Edge Function
- ✅ `/api/env-check` → Supabase Edge Function

**Plan:**

```typescript
// supabase/functions/health/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  return new Response(
    JSON.stringify({ status: 'healthy', timestamp: new Date() }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
```

---

## Performance Optimizasyonları

### 1. ISR (Incremental Static Regeneration)

```typescript
// Vehicle listesi için ISR
export const revalidate = 3600; // 1 saat

export default async function InventoryPage() {
  const vehicles = await getVehicles(); // ISR cache
  return <InventoryPage vehicles={vehicles} />;
}
```

### 2. SWR (Stale-While-Revalidate)

```typescript
// Client-side data fetching
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

function useVehicles() {
  const { data, error, isLoading } = useSWR('/api/vehicles', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 300000, // 5 dakika
  });

  return { vehicles: data, error, isLoading };
}
```

### 3. Image Optimization

```typescript
// Next.js Image + Supabase
import Image from 'next/image';

<Image
  src={vehicle.imageUrl}
  alt={vehicle.model}
  width={800}
  height={600}
  loader={({ src }) => {
    return `${supabase.storage.from('vehicle-images').getPublicUrl(src).data.publicUrl}`;
  }}
/>
```

---

## Monitoring & Analytics

### Supabase Analytics

**Built-in:**
- Database performance
- API usage
- Storage metrics
- Auth events

**Custom Events:**

```typescript
// Track page views
const trackPageView = (page: string) => {
  supabase.from('analytics').insert({
    event: 'page_view',
    page,
    user_id: user?.id,
    timestamp: new Date(),
  });
};
```

---

## Deployment

### Vercel + Supabase

**Environment Variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
HUGGINGFACE_API_KEY=your-hf-key
```

**Build Steps:**
```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Build
npm run build

# Deploy
vercel --prod
```

---

## Rollback Plan

### Geri Dönüş Stratejisi

**Eğer Supabase migration başarısız olursa:**

1. **Veri Katmanı:** vehiclesdata.txt'e dön
2. **Auth:** Mock auth kullan
3. **Storage:** Local logos kullan
4. **API:** Next.js API routes kullan

```typescript
// Fallback flag
const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

export const getVehicles = () => {
  if (USE_SUPABASE) {
    return getVehiclesFromSupabase();
  }
  return getVehiclesFromFile(); // vehiclesdata.txt
};
```

---

## Timeline

### Faz 16: Kullanıcı Yorumları
- [ ] Review system
- [ ] Rating system
- [ ] User profiles

### Faz 17: Performans Optimizasyonu
- [ ] ISR implementasyonu
- [ ] SWR implementasyonu
- [ ] Image optimization

### Faz 18: SEO & Meta Veriler
- [ ] Meta tags
- [ ] Open Graph
- [ ] Structured data

### Faz 19: Test & QA
- [ ] Unit tests
- [ ] E2E tests
- [ ] Performance tests

### Faz 20: Production Deploy
- [ ] Vercel deploy
- [ ] Supabase prod
- [ ] Monitoring setup

---

## Kaynaklar

### Dokümantasyon
- [Supabase Docs](https://supabase.com/docs)
- [vPIC API](https://vpic.nhtsa.dot.gov/api/)
- [Next.js 16](https://nextjs.org/docs)

### GitHub Repositories
- [supabase/supabase](https://github.com/supabase/supabase)
- [vercel/next.js](https://github.com/vercel/next.js)

---

*Bu migration planı AUTO PULSE'ın gelecek geliştirmeleri için yol haritasıdır.*
