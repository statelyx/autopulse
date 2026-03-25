/**
 * AUTO PULSE — Vehicle Data Normalizer
 * vehiclesdata.txt dosyasını parse eder ve normalize eder
 */

export interface ParsedBrand {
  name: string;
  slug: string;
  models: ParsedModel[];
  source: 'vehiclesdata.txt';
}

export interface ParsedModel {
  name: string;
  slug: string;
  brandName: string;
  source: 'vehiclesdata.txt';
}

/**
 * vehiclesdata.txt dosyasını normalize eder
 */
export function parseVehiclesData(content: string): ParsedBrand[] {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const brands: ParsedBrand[] = [];
  let currentBrand: ParsedBrand | null = null;

  for (const line of lines) {
    // Yorum satırlarını atla
    if (line.startsWith('Not:') || line.startsWith('DÜNYA')) {
      continue;
    }

    // Marka satırı (BÜYÜK HARF ile başlar ve - ile başlamaz)
    if (/^[A-ZÇĞÖŞÜ]/.test(line) && !line.startsWith('-')) {
      // Yeni marka
      if (currentBrand) {
        brands.push(currentBrand);
      }
      const brandName = line.toUpperCase().trim();
      currentBrand = {
        name: brandName,
        slug: slugify(brandName),
        models: [],
        source: 'vehiclesdata.txt',
      };
    } else if (line.startsWith('-')) {
      // Model satırı
      if (currentBrand) {
        const modelName = line.substring(1).trim();
        if (modelName) {
          currentBrand.models.push({
            name: modelName,
            slug: slugify(modelName),
            brandName: currentBrand.name,
            source: 'vehiclesdata.txt',
          });
        }
      }
    }
  }

  // Son markayı ekle
  if (currentBrand) {
    brands.push(currentBrand);
  }

  return brands;
}

/**
 * Slug oluşturucu
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9ğüşiöç]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

/**
 * Supabase için veri formatı
 */
export interface SupabaseBrand {
  name: string;
  slug: string;
  source: string;
}

export interface SupabaseModel {
  brand_slug: string;
  name: string;
  slug: string;
  source: string;
}

/**
 * Supabase import için veri hazırla
 */
export function prepareForSupabase(brands: ParsedBrand[]): {
  brands: SupabaseBrand[];
  models: SupabaseModel[];
} {
  const supabaseBrands: SupabaseBrand[] = [];
  const supabaseModels: SupabaseModel[] = [];

  for (const brand of brands) {
    supabaseBrands.push({
      name: brand.name,
      slug: brand.slug,
      source: brand.source,
    });

    for (const model of brand.models) {
      supabaseModels.push({
        brand_slug: brand.slug,
        name: model.name,
        slug: model.slug,
        source: model.source,
      });
    }
  }

  return { brands: supabaseBrands, models: supabaseModels };
}

/**
 * İstatistik
 */
export function getStats(brands: ParsedBrand[]): {
  totalBrands: number;
  totalModels: number;
  modelsPerBrand: Record<string, number>;
} {
  const stats = {
    totalBrands: brands.length,
    totalModels: brands.reduce((sum, b) => sum + b.models.length, 0),
    modelsPerBrand: {} as Record<string, number>,
  };

  for (const brand of brands) {
    stats.modelsPerBrand[brand.name] = brand.models.length;
  }

  return stats;
}
