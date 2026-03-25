/**
 * AUTO PULSE — Logo Data Service
 * car-logos-dataset-master'ten logo eşleştirmeleri
 */

export interface BrandLogo {
  slug: string;
  logoPath: string;
  aliases?: string[];
}

// Mevcut logo dosyaları (public/brands/ klasöründen)
const availableLogos = [
  'abarth', 'acura', 'alfa-romeo', 'aston-martin', 'audi', 'audi-sport',
  'bentley', 'bmw', 'bmw-m', 'brabus', 'brilliance', 'bugatti', 'byd',
  'cadillac', 'chery', 'chevrolet', 'chevrolet-corvette', 'chrysler',
  'citroen', 'cupra', 'dacia', 'daewoo', 'daf', 'daihatsu', 'dodge',
  'dodge-viper', 'ds', 'ferrari', 'fiat', 'ford', 'ford-mustang',
  'gmc', 'honda', 'hummer', 'hupmobile', 'hyundai', 'infiniti',
  'isuzu', 'iveco', 'jaguar', 'jawa', 'jeep', 'kia', 'ktm', 'lada',
  'lagonda', 'lamborghini', 'lancia', 'land-rover', 'lexus', 'lincoln',
  'lotus', 'lynk-and-co', 'man', 'maserati', 'maybach', 'mazda',
  'mclaren', 'mercedes-amg', 'mercedes-benz', 'mg', 'mini', 'mitsubishi',
  'nissan', 'nissan-gt-r', 'opel', 'pagani', 'peugeot', 'pontiac',
  'porsche', 'proton', 'renault', 'rolls-royce', 'rover', 'saab',
  'scania', 'seat', 'skoda', 'smart', 'ssangyong', 'subaru', 'suzuki',
  'tata', 'tesla', 'toyota', 'volkswagen', 'volvo'
];

// Brand alias eşleşmeleri (marka isimleri -> logo dosyası)
const brandAliases: Record<string, string> = {
  // Mercedes variations
  'mercedes': 'mercedes-benz',
  'mercedes-benz': 'mercedes-benz',

  // Range Rover -> Land Rover
  'range-rover': 'land-rover',

  // Audi variations
  'audi-sport': 'audi-sport',
  'audi': 'audi',

  // BMW variations
  'bmw-m': 'bmw-m',
  'bmw': 'bmw',

  // Ford variations
  'ford': 'ford',

  // Chevrolet variations
  'chevrolet': 'chevrolet',

  // Dodge variations
  'dodge': 'dodge',

  // Nissan variations
  'nissan': 'nissan',

  // Toyota variations
  'toyota': 'toyota',

  // Volkswagen variations
  'volkswagen': 'volkswagen',
  'vw': 'volkswagen',

  // Porsche variations
  'porsche': 'porsche',

  // Ferrari variations
  'ferrari': 'ferrari',

  // Lamborghini variations
  'lamborghini': 'lamborghini',

  // Maserati variations
  'maserati': 'maserati',

  // Bentley variations
  'bentley': 'bentley',

  // Bugatti variations
  'bugatti': 'bugatti',

  // Rolls-Royce variations
  'rolls-royce': 'rolls-royce',

  // Aston Martin variations
  'aston-martin': 'aston-martin',

  // McLaren variations
  'mclaren': 'mclaren',

  // Lexus variations
  'lexus': 'lexus',

  // Infiniti variations
  'infiniti': 'infiniti',

  // Acura variations
  'acura': 'acura',

  // Cadillac variations
  'cadillac': 'cadillac',

  // Lincoln variations
  'lincoln': 'lincoln',

  // Jaguar variations
  'jaguar': 'jaguar',

  // Volvo variations
  'volvo': 'volvo',

  // Alfa Romeo variations
  'alfa-romeo': 'alfa-romeo',

  // Fiat variations
  'fiat': 'fiat',

  // Renault variations
  'renault': 'renault',

  // Peugeot variations
  'peugeot': 'peugeot',

  // Citroen variations
  'citroen': 'citroen',

  // Seat variations
  'seat': 'seat',

  // Skoda variations
  'skoda': 'skoda',

  // Mini variations
  'mini': 'mini',

  // Smart variations
  'smart': 'smart',

  // Chrysler variations
  'chrysler': 'chrysler',

  // Jeep variations
  'jeep': 'jeep',

  // GMC variations
  'gmc': 'gmc',

  // Honda variations
  'honda': 'honda',

  // Hyundai variations
  'hyundai': 'hyundai',

  // Kia variations
  'kia': 'kia',

  // Mazda variations
  'mazda': 'mazda',

  // Mitsubishi variations
  'mitsubishi': 'mitsubishi',

  // Subaru variations
  'subaru': 'subaru',

  // Suzuki variations
  'suzuki': 'suzuki',

  // Isuzu variations
  'isuzu': 'isuzu',

  // Daihatsu variations
  'daihatsu': 'daihatsu',

  // Dacia variations
  'dacia': 'dacia',

  // SsangYong variations
  'ssangyong': 'ssangyong',

  // Tata variations
  'tata': 'tata',

  // Rover variations
  'rover': 'rover',
  'buick': 'rover',
  'vauxhall': 'opel',

  // Saab variations
  'saab': 'saab',

  // Opel variations
  'opel': 'opel',

  // Pontiac variations
  'pontiac': 'pontiac',

  // Tesla variations
  'tesla': 'tesla',

  // Lucid (no logo, fallback)
  'lucid': 'fallback',

  // Rivian (no logo, fallback)
  'rivian': 'fallback',

  // Polestar (no logo, fallback)
  'polestar': 'fallback',

  // Lotus variations
  'lotus': 'lotus',

  // Pagani variations
  'pagani': 'pagani',

  // Koenigsegg (no logo, fallback)
  'koenigsegg': 'fallback',

  // Maybach variations
  'maybach': 'maybach',
};

/**
 * Brand slug'dan logo path'i döndürür
 * @param brandSlug - Marka slug'ı (örn: 'mercedes-benz', 'bmw')
 * @returns Logo path'i veya fallback
 */
export function getBrandLogo(brandSlug: string): string {
  if (!brandSlug) return '/brands/fallback.png';

  // Normalize: lowercase, trim
  const normalizedSlug = brandSlug.toLowerCase().trim();

  // Alias kontrolü
  const logoKey = brandAliases[normalizedSlug] || normalizedSlug;

  // Logo dosyası var mı?
  if (availableLogos.includes(logoKey)) {
    return `/brands/${logoKey}.png`;
  }

  // Fallback logo
  return '/brands/fallback.png';
}

/**
 * Marka listesi için logo eşleşmeleri
 * @param brands - Marka dizisi
 * @returns Logo path'leri eklenmiş marka dizisi
 */
export function getBrandsWithLogos<T extends { slug: string }>(
  brands: T[]
): Array<T & { logoPath: string }> {
  return brands.map(brand => ({
    ...brand,
    logoPath: getBrandLogo(brand.slug),
  }));
}

/**
 * Logo var mı kontrolü
 * @param brandSlug - Marka slug'ı
 * @returns Logo var mı?
 */
export function hasBrandLogo(brandSlug: string): boolean {
  if (!brandSlug) return false;

  const normalizedSlug = brandSlug.toLowerCase().trim();
  const logoKey = brandAliases[normalizedSlug] || normalizedSlug;

  return availableLogos.includes(logoKey);
}

/**
 * Tüm available logo isimleri
 */
export function getAvailableLogos(): string[] {
  return [...availableLogos];
}
