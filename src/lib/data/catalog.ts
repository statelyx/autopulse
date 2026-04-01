import { promises as fs } from 'node:fs';
import path from 'node:path';

import { getServerClient } from '@/lib/supabase/server';
import { parseVehiclesData } from '@/lib/data/normalize-vehicles';
import { toTryPrice } from '@/lib/formatters/currency';

export type CatalogFuelType =
  | 'Benzin'
  | 'Dizel'
  | 'Elektrik'
  | 'Hibrit'
  | 'Plug-in Hibrit';

export type CatalogTransmission =
  | 'Otomatik'
  | 'Manuel'
  | 'CVT'
  | 'Çift Kavrama';

export type CatalogBodyType =
  | 'Sedan'
  | 'SUV'
  | 'Coupe'
  | 'Hatchback'
  | 'Cabrio'
  | 'Kamyonet'
  | 'Van'
  | 'Station Wagon';

export interface CatalogBrand {
  name: string;
  slug: string;
  models: string[];
  country: string;
  segment: string;
  foundedYear?: number;
  sources: string[];
}

export interface CatalogVehicle {
  id: string;
  brand: string;
  brandSlug: string;
  model: string;
  modelSlug: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: CatalogFuelType;
  transmission: CatalogTransmission;
  horsepower: number;
  acceleration: number;
  topSpeed: number;
  bodyType: CatalogBodyType;
  doors: number;
  seats: number;
  segment: string;
  color: string;
  description: string;
  features: string[];
  source: string[];
  confidence: number;
  priceSource?: 'estimated-try';
  scores: {
    reliability: number;
    market: number;
    innovation: number;
  };
}

export interface CatalogStats {
  totalBrands: number;
  totalModels: number;
  totalVehicles: number;
  electricVehicles: number;
  premiumVehicles: number;
  avgPrice: number;
}

export interface CatalogResponse {
  brands: CatalogBrand[];
  vehicles: CatalogVehicle[];
  featuredVehicles: CatalogVehicle[];
  stats: CatalogStats;
  sourceInfo: {
    primary: string[];
    secondary: string[];
  };
}

type CatalogCache = {
  brands: CatalogBrand[];
  vehicles: CatalogVehicle[];
} | null;

const BRAND_COUNTRY: Record<string, string> = {
  acura: 'Japonya',
  aion: 'Çin',
  'alfa-romeo': 'İtalya',
  alpine: 'Fransa',
  'aston-martin': 'Birleşik Krallık',
  audi: 'Almanya',
  bentley: 'Birleşik Krallık',
  bmw: 'Almanya',
  bugatti: 'Fransa',
  byd: 'Çin',
  cadillac: 'ABD',
  chevrolet: 'ABD',
  chrysler: 'ABD',
  cupra: 'İspanya',
  dodge: 'ABD',
  ferrari: 'İtalya',
  fiat: 'İtalya',
  ford: 'ABD',
  gmc: 'ABD',
  honda: 'Japonya',
  hyundai: 'Güney Kore',
  infiniti: 'Japonya',
  jaguar: 'Birleşik Krallık',
  jeep: 'ABD',
  kia: 'Güney Kore',
  lamborghini: 'İtalya',
  'land-rover': 'Birleşik Krallık',
  lexus: 'Japonya',
  lotus: 'Birleşik Krallık',
  lucid: 'ABD',
  maserati: 'İtalya',
  mazda: 'Japonya',
  mclaren: 'Birleşik Krallık',
  'mercedes-benz': 'Almanya',
  mini: 'Birleşik Krallık',
  mitsubishi: 'Japonya',
  nissan: 'Japonya',
  pagani: 'İtalya',
  porsche: 'Almanya',
  polestar: 'İsveç',
  renault: 'Fransa',
  rivian: 'ABD',
  'rolls-royce': 'Birleşik Krallık',
  subaru: 'Japonya',
  suzuki: 'Japonya',
  tesla: 'ABD',
  toyota: 'Japonya',
  volkswagen: 'Almanya',
  volvo: 'İsveç',
};

const BRAND_SEGMENT: Record<string, string> = {
  porsche: 'Performans',
  ferrari: 'Süper Spor',
  lamborghini: 'Süper Spor',
  mclaren: 'Süper Spor',
  bugatti: 'Hypercar',
  pagani: 'Hypercar',
  bentley: 'Ultra Lüks',
  'rolls-royce': 'Ultra Lüks',
  'aston-martin': 'Gran Turismo',
  lotus: 'Hafif Performans',
  tesla: 'Elektrikli Premium',
  rivian: 'Elektrikli Macera',
  lucid: 'Elektrikli Lüks',
  polestar: 'Elektrikli Performans',
  byd: 'Elektrikli / Hibrit',
  toyota: 'Kitle Pazarı',
  volkswagen: 'Kitle Pazarı',
  ford: 'Kitle Pazarı',
  bmw: 'Premium',
  audi: 'Premium',
  'mercedes-benz': 'Premium',
  lexus: 'Premium',
};

const PREMIUM_BRANDS = new Set([
  'aston-martin',
  'audi',
  'bentley',
  'bmw',
  'bugatti',
  'cadillac',
  'ferrari',
  'jaguar',
  'lamborghini',
  'land-rover',
  'lexus',
  'lotus',
  'lucid',
  'maserati',
  'mclaren',
  'mercedes-benz',
  'pagani',
  'porsche',
  'polestar',
  'rolls-royce',
  'tesla',
]);

const ELECTRIC_BRANDS = new Set([
  'aion',
  'byd',
  'lucid',
  'nio',
  'polestar',
  'rivian',
  'tesla',
  'xpeng',
]);

const COLORS = [
  'Obsidyen Siyah',
  'Grafit Gri',
  'Buz Beyazı',
  'Neon Bakır',
  'Kobalt Mavi',
  'Kum Beji',
  'Meteor Gümüş',
  'Volkan Kırmızısı',
];

const FEATURE_LIBRARY: Record<string, string[]> = {
  Elektrik: ['800V hızlı şarj mimarisi', 'rejeneratif fren yönetimi', 'ısı pompası'],
  Hibrit: ['karma sürüş optimizasyonu', 'şehir içi enerji geri kazanımı', 'akıllı güç dağıtımı'],
  'Plug-in Hibrit': ['harici şarj desteği', 'karma menzil analizi', 'EV öncelikli sürüş modu'],
  SUV: ['adaptif sürüş modu', 'yüksek oturma pozisyonu', 'geniş bagaj hacmi'],
  Coupe: ['sürüş modu seçici', 'performans diferansiyeli', 'aktif aerodinami'],
  Sedan: ['yol sesi izolasyonu', 'şerit takip desteği', 'uzun yol konfor paketi'],
  Hatchback: ['kompakt gövde yönetimi', 'şehir içi park desteği', 'esnek bagaj düzeni'],
  Cabrio: ['rüzgar kırıcı', 'çok katmanlı tavan izolasyonu', 'ısıtmalı koltuk'],
};

const VEHICLE_OVERRIDES: Record<string, Partial<CatalogVehicle>> = {
  'porsche|911': {
    bodyType: 'Coupe',
    fuelType: 'Benzin',
    transmission: 'Çift Kavrama',
    horsepower: 450,
    price: 188000,
    acceleration: 3.5,
    topSpeed: 308,
    segment: 'İkon Performans',
    description: '911, günlük kullanımı bozmadan yüksek sürüş hassasiyeti sunan ikonik performans çizgisini korur.',
  },
  'porsche|taycan': {
    bodyType: 'Sedan',
    fuelType: 'Elektrik',
    transmission: 'Otomatik',
    horsepower: 680,
    price: 182000,
    acceleration: 3.1,
    topSpeed: 260,
    segment: 'Elektrikli Performans',
  },
  'tesla|model-s': {
    bodyType: 'Sedan',
    fuelType: 'Elektrik',
    horsepower: 840,
    price: 109000,
    acceleration: 2.4,
    topSpeed: 322,
    segment: 'Elektrikli Premium',
  },
  'tesla|model-y': {
    bodyType: 'SUV',
    fuelType: 'Elektrik',
    horsepower: 460,
    price: 54000,
    acceleration: 4.8,
    topSpeed: 217,
  },
  'bmw|m3': {
    bodyType: 'Sedan',
    fuelType: 'Benzin',
    transmission: 'Otomatik',
    horsepower: 510,
    price: 99000,
    acceleration: 3.6,
    topSpeed: 290,
    segment: 'Performans Sedan',
  },
  'audi|r8': {
    bodyType: 'Coupe',
    fuelType: 'Benzin',
    transmission: 'Çift Kavrama',
    horsepower: 610,
    price: 168000,
    acceleration: 3.1,
    topSpeed: 331,
  },
  'toyota|rav4': {
    bodyType: 'SUV',
    fuelType: 'Hibrit',
    horsepower: 222,
    price: 39000,
    acceleration: 7.8,
    topSpeed: 180,
  },
  'ford|mustang': {
    bodyType: 'Coupe',
    fuelType: 'Benzin',
    transmission: 'Manuel',
    horsepower: 486,
    price: 64000,
    acceleration: 4.2,
    topSpeed: 268,
  },
};

const SOURCE_INFO = {
  primary: [
    'vehiclesdata.txt',
    'car-logos-dataset',
    'open-vehicle-db',
    'vehicle-make-model-data',
    'automotive-model-year-data',
    'Auto-Cars-Makes-And-Models',
  ],
  secondary: [
    'vpic-api',
    'vininfo',
    'python-libvin',
    'simple-icons',
    'devicon',
  ],
};

function hashText(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function pickFrom<T>(list: T[], seed: number) {
  return list[seed % list.length];
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function slugToLabel(slug: string) {
  return slug
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

function detectBodyType(modelName: string): CatalogBodyType {
  const normalized = modelName.toLowerCase();
  if (/(roadster|spyder|spider|cabrio|convertible)/.test(normalized)) return 'Cabrio';
  if (/(wagon|touring|estate|avant|variant|shooting brake)/.test(normalized)) return 'Station Wagon';
  if (/(van|transit|caravelle|sprinter)/.test(normalized)) return 'Van';
  if (/(pickup|ranger|f-150|silverado|ram|hilux|gladiator)/.test(normalized)) return 'Kamyonet';
  if (/(suv|cross|sportage|tucson|rav4|x[1-9]\b|q[2-9]\b|gle|gls|cx-|defender|discovery|range rover|escape|kodiaq|tiguan|macan|cayenne|urus)/.test(normalized)) return 'SUV';
  if (/(coupe|911|supra|mustang|camaro|f-type|r8|gt-r|huracan|aventador|roma|corvette|m4|amg gt)/.test(normalized)) return 'Coupe';
  if (/(civic|golf|focus|swift|yaris|208|i20|clio|megane|a3|1 series|cooper)/.test(normalized)) return 'Hatchback';
  return 'Sedan';
}

function detectFuelType(brandSlug: string, modelName: string, seed: number): CatalogFuelType {
  const normalized = modelName.toLowerCase();
  if (ELECTRIC_BRANDS.has(brandSlug)) return 'Elektrik';
  if (/(ev|e-tron|taycan|ioniq|leaf|eq|electric|bev|model [syx3]|cybertruck)/.test(normalized)) return 'Elektrik';
  if (/(hybrid|phev|plug-in)/.test(normalized)) return normalized.includes('plug') || normalized.includes('phev') ? 'Plug-in Hibrit' : 'Hibrit';
  if (/(diesel|tdi|dci|hdi|bluehdi|multijet|crdi)/.test(normalized)) return 'Dizel';

  const hybridBiasBrands = new Set(['toyota', 'lexus', 'kia', 'hyundai', 'honda', 'byd']);
  if (hybridBiasBrands.has(brandSlug) && seed % 5 === 0) return 'Hibrit';
  if (seed % 11 === 0) return 'Dizel';
  return 'Benzin';
}

function detectTransmission(fuelType: CatalogFuelType, bodyType: CatalogBodyType, brandSlug: string, seed: number): CatalogTransmission {
  if (fuelType === 'Elektrik') return 'Otomatik';
  if (['porsche', 'ferrari', 'lamborghini', 'mclaren', 'audi'].includes(brandSlug) || bodyType === 'Coupe') {
    return seed % 3 === 0 ? 'Manuel' : 'Çift Kavrama';
  }
  if (seed % 6 === 0) return 'CVT';
  return 'Otomatik';
}

function determineSegment(brandSlug: string, bodyType: CatalogBodyType, fuelType: CatalogFuelType, horsepower: number) {
  if (BRAND_SEGMENT[brandSlug]) return BRAND_SEGMENT[brandSlug];
  if (fuelType === 'Elektrik' && horsepower > 450) return 'Elektrikli Performans';
  if (bodyType === 'SUV' && horsepower > 320) return 'Performans SUV';
  if (horsepower > 500) return 'Yüksek Performans';
  if (bodyType === 'Hatchback') return 'Kompakt';
  return 'Ana Akım';
}

function buildFeatures(bodyType: CatalogBodyType, fuelType: CatalogFuelType, brandSlug: string, seed: number) {
  const featurePool = [
    ...(FEATURE_LIBRARY[bodyType] ?? []),
    ...(FEATURE_LIBRARY[fuelType] ?? []),
  ];

  if (PREMIUM_BRANDS.has(brandSlug)) {
    featurePool.push('yüksek çözünürlüklü sürücü ekranı', 'çevresel görüş desteği');
  }

  const rotated = [...featurePool];
  rotated.push(pickFrom(COLORS, seed).toLowerCase() + ' iç trim paketi');

  return Array.from(new Set(rotated)).slice(0, 4);
}

function buildDescription(brand: string, model: string, segment: string, fuelType: CatalogFuelType, bodyType: CatalogBodyType) {
  return `${brand} ${model}, ${segment.toLowerCase()} odağını ${fuelType.toLowerCase()} altyapı ve ${bodyType.toLowerCase()} gövde karakteriyle birleştiren veri-tabanlı katalog kaydıdır.`;
}

function buildScores(brandSlug: string, fuelType: CatalogFuelType, horsepower: number, seed: number) {
  const reliabilityBase = PREMIUM_BRANDS.has(brandSlug) ? 74 : 78;
  const innovationBase = fuelType === 'Elektrik' ? 88 : 70;

  return {
    reliability: clamp(reliabilityBase + (seed % 19) - Math.floor(horsepower / 110), 54, 96),
    market: clamp(65 + (seed % 28) + (PREMIUM_BRANDS.has(brandSlug) ? 5 : 0), 50, 97),
    innovation: clamp(innovationBase + (seed % 17), 58, 99),
  };
}

function deriveVehicleFromModel(brand: CatalogBrand, modelName: string): CatalogVehicle {
  const modelSlug = modelName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const seed = hashText(`${brand.slug}:${modelSlug}`);
  const year = 2020 + (seed % 7);
  const bodyType = detectBodyType(modelName);
  const fuelType = detectFuelType(brand.slug, modelName, seed);
  const premiumMultiplier = PREMIUM_BRANDS.has(brand.slug) ? 2.1 : 1;
  const priceBase = bodyType === 'SUV' ? 36000 : 30000;
  const fuelPremium = fuelType === 'Elektrik' ? 18000 : fuelType === 'Plug-in Hibrit' ? 12000 : fuelType === 'Hibrit' ? 7000 : 0;
  const performancePremium = PREMIUM_BRANDS.has(brand.slug) ? 40000 : 0;
  const price = Math.round((priceBase + fuelPremium + performancePremium + (seed % 26000)) * premiumMultiplier);
  const horsepower = clamp(
    Math.round(
      (fuelType === 'Elektrik' ? 220 : 150) +
      (bodyType === 'SUV' ? 35 : 0) +
      (PREMIUM_BRANDS.has(brand.slug) ? 120 : 0) +
      (seed % 220),
    ),
    95,
    1020,
  );
  const acceleration = Number(clamp(8.6 - horsepower / 160 + (seed % 14) / 10, 2.4, 12.0).toFixed(1));
  const topSpeed = clamp(Math.round(155 + horsepower / 2.8), 165, 340);
  const transmission = detectTransmission(fuelType, bodyType, brand.slug, seed);
  const seats = bodyType === 'Coupe' ? 4 : bodyType === 'Cabrio' ? 4 : bodyType === 'Van' ? 7 : bodyType === 'Kamyonet' ? 5 : 5;
  const doors = bodyType === 'Coupe' || bodyType === 'Cabrio' ? 2 : 4;
  const segment = determineSegment(brand.slug, bodyType, fuelType, horsepower);
  const scores = buildScores(brand.slug, fuelType, horsepower, seed);
  const key = `${brand.slug}|${modelSlug}`;
  const override = VEHICLE_OVERRIDES[key] ?? {};

  const vehicle: CatalogVehicle = {
    id: `${brand.slug}-${modelSlug}-${year}`,
    brand: brand.name,
    brandSlug: brand.slug,
    model: modelName,
    modelSlug,
    year,
    price,
    mileage: Math.round((seed % 90000) / 10) * 10,
    fuelType,
    transmission,
    horsepower,
    acceleration,
    topSpeed,
    bodyType,
    doors,
    seats,
    segment,
    color: pickFrom(COLORS, seed),
    description: buildDescription(brand.name, modelName, segment, fuelType, bodyType),
    features: buildFeatures(bodyType, fuelType, brand.slug, seed),
    source: [...brand.sources],
    confidence: clamp(72 + (seed % 24), 72, 96),
    priceSource: 'estimated-try',
    scores,
  };

  return {
    ...vehicle,
    ...override,
    price: toTryPrice(Number(override.price ?? vehicle.price)),
    features: override.features ?? vehicle.features,
    source: Array.from(new Set([...(override.source ?? []), ...vehicle.source])),
    scores: override.scores ?? vehicle.scores,
    description: override.description ?? vehicle.description,
  };
}

async function readVehiclesDataFile() {
  const filePath = path.join(process.cwd(), 'vehiclesdata.txt');
  return fs.readFile(filePath, 'utf8');
}

async function readSupabaseBrands(): Promise<CatalogBrand[] | null> {
  const client = getServerClient();
  if (!client) {
    return null;
  }

  try {
    const [{ data: brandRows, error: brandError }, { data: modelRows, error: modelError }] = await Promise.all([
      client.from('vehicle_brands').select('name, slug, country, founded_year'),
      client.from('vehicle_models').select('name, slug, brand_slug'),
    ]);

    if (brandError || modelError || !brandRows || !modelRows) {
      return null;
    }

    const modelMap = new Map<string, string[]>();
    for (const row of modelRows as Array<{ name: string; brand_slug: string }>) {
      if (!modelMap.has(row.brand_slug)) {
        modelMap.set(row.brand_slug, []);
      }
      modelMap.get(row.brand_slug)?.push(row.name);
    }

    return (brandRows as Array<{ name: string; slug: string; country?: string; founded_year?: number }>).map((row) => ({
      name: row.name,
      slug: row.slug,
      models: Array.from(new Set(modelMap.get(row.slug) ?? [])).sort((left, right) => left.localeCompare(right)),
      country: row.country ?? BRAND_COUNTRY[row.slug] ?? 'Bilinmiyor',
      segment: BRAND_SEGMENT[row.slug] ?? 'Supabase Kaynağı',
      foundedYear: row.founded_year,
      sources: ['supabase', 'vehiclesdata.txt'],
    }));
  } catch {
    return null;
  }
}

function mergeBrands(primary: CatalogBrand[], secondary: CatalogBrand[]) {
  const merged = new Map<string, CatalogBrand>();

  for (const brand of [...primary, ...secondary]) {
    const current = merged.get(brand.slug);
    if (!current) {
      merged.set(brand.slug, {
        ...brand,
        models: [...brand.models].sort((left, right) => left.localeCompare(right)),
      });
      continue;
    }

    merged.set(brand.slug, {
      ...current,
      name: current.name || brand.name,
      country: current.country !== 'Bilinmiyor' ? current.country : brand.country,
      segment: current.segment !== 'Ana Akım' ? current.segment : brand.segment,
      foundedYear: current.foundedYear ?? brand.foundedYear,
      models: Array.from(new Set([...current.models, ...brand.models])).sort((left, right) => left.localeCompare(right)),
      sources: Array.from(new Set([...current.sources, ...brand.sources])),
    });
  }

  return Array.from(merged.values()).sort((left, right) => left.name.localeCompare(right.name));
}

async function buildCatalog() {
  const fileContent = await readVehiclesDataFile();
  const parsedBrands = parseVehiclesData(fileContent);
  const brandsFromFile: CatalogBrand[] = parsedBrands.map((brand) => ({
    name: brand.name,
    slug: brand.slug,
    models: brand.models.map((model) => model.name),
    country: BRAND_COUNTRY[brand.slug] ?? 'Bilinmiyor',
    segment: BRAND_SEGMENT[brand.slug] ?? 'Ana Akım',
    sources: ['vehiclesdata.txt'],
  }));

  const brands = mergeBrands(brandsFromFile, (await readSupabaseBrands()) ?? []);
  const vehicles = brands.flatMap((brand) => brand.models.map((modelName) => deriveVehicleFromModel(brand, modelName)));

  return {
    brands,
    vehicles: vehicles.sort((left, right) => {
      const scoreDelta = (right.scores.market + right.scores.innovation) - (left.scores.market + left.scores.innovation);
      if (scoreDelta !== 0) {
        return scoreDelta;
      }
      return right.year - left.year;
    }),
  };
}

async function getCachedCatalog() {
  const existing = (globalThis as typeof globalThis & { __AUTO_PULSE_CATALOG__?: CatalogCache }).__AUTO_PULSE_CATALOG__;
  if (existing) return existing;

  const built = await buildCatalog();
  (globalThis as typeof globalThis & { __AUTO_PULSE_CATALOG__?: CatalogCache }).__AUTO_PULSE_CATALOG__ = built;
  return built;
}

export async function getCatalogData(filters?: {
  brand?: string;
  model?: string;
  year?: number;
  q?: string;
  limit?: number;
  id?: string;
}) {
  const built = (globalThis as typeof globalThis & { __AUTO_PULSE_CATALOG__?: CatalogCache }).__AUTO_PULSE_CATALOG__;
  const { brands, vehicles } = built ?? await getCachedCatalog();

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (filters?.id && vehicle.id !== filters.id) return false;
    if (filters?.brand && vehicle.brandSlug !== filters.brand) return false;
    if (filters?.year && vehicle.year !== filters.year) return false;
    if (filters?.model) {
      const target = filters.model.toLowerCase();
      if (!vehicle.model.toLowerCase().includes(target) && vehicle.modelSlug !== target) return false;
    }
    if (filters?.q) {
      const query = filters.q.toLowerCase();
      const haystack = [
        vehicle.brand,
        vehicle.model,
        vehicle.segment,
        vehicle.fuelType,
        vehicle.bodyType,
      ].join(' ').toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  const limitedVehicles = filters?.limit ? filteredVehicles.slice(0, filters.limit) : filteredVehicles;
  const featuredVehicles = vehicles.slice(0, 8);
  const stats: CatalogStats = {
    totalBrands: brands.length,
    totalModels: brands.reduce((sum, brand) => sum + brand.models.length, 0),
    totalVehicles: vehicles.length,
    electricVehicles: vehicles.filter((vehicle) => vehicle.fuelType === 'Elektrik').length,
    premiumVehicles: vehicles.filter((vehicle) => PREMIUM_BRANDS.has(vehicle.brandSlug)).length,
    avgPrice: Math.round(vehicles.reduce((sum, vehicle) => sum + vehicle.price, 0) / Math.max(vehicles.length, 1)),
  };

  return {
    brands,
    vehicles: limitedVehicles,
    featuredVehicles,
    stats,
    sourceInfo: SOURCE_INFO,
  } satisfies CatalogResponse;
}

export async function getVehicleById(id: string) {
  const { vehicles } = await getCatalogData({ id });
  return vehicles[0] ?? null;
}

export function buildFallbackIssueCandidates(vehicles: CatalogVehicle[]) {
  return vehicles.slice(0, 6).map((vehicle, index) => {
    const isElectric = vehicle.fuelType === 'Elektrik';
    const severity = vehicle.horsepower > 500 ? 'high' : index % 3 === 0 ? 'medium' : 'low';

    return {
      id: `${vehicle.id}-issue`,
      title: `${vehicle.brand} ${vehicle.model} için ${isElectric ? 'şarj eğrisi' : 'bakım maliyeti'} takibi`,
      description: isElectric
        ? `${vehicle.year} ${vehicle.brand} ${vehicle.model} için uzun yol DC şarj eğrisinde sıcaklık kaynaklı verim düşüşü riski değerlendiriliyor.`
        : `${vehicle.year} ${vehicle.brand} ${vehicle.model} için kullanım profiline bağlı fren, soğutma ve aktarma organı bakım maliyeti yükselme eğilimi gösteriyor.`,
      category: isElectric ? 'enerji' : 'bakım',
      priority: severity,
      reference: `${vehicle.segment} · ${vehicle.fuelType} · ${vehicle.year}`,
      vehicleId: vehicle.id,
    };
  });
}

export function buildCatalogSummary(vehicles: CatalogVehicle[]) {
  const electricCount = vehicles.filter((vehicle) => vehicle.fuelType === 'Elektrik').length;
  const performanceCount = vehicles.filter((vehicle) => vehicle.horsepower >= 450).length;
  const suvCount = vehicles.filter((vehicle) => vehicle.bodyType === 'SUV').length;

  return {
    electricCount,
    performanceCount,
    suvCount,
    premiumCount: vehicles.filter((vehicle) => PREMIUM_BRANDS.has(vehicle.brandSlug)).length,
  };
}

export function getBrandDisplayName(brands: CatalogBrand[], slug: string) {
  return brands.find((brand) => brand.slug === slug)?.name ?? slugToLabel(slug);
}
