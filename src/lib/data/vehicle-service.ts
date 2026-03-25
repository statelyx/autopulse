/**
 * AUTO PULSE — Vehicle Data Service
 * vehiclesdata.txt'ten marka ve model verilerini sağlar
 */

// import { parseVehiclesData, getStats } from './normalize-vehicles';

export interface VehicleBrand {
  name: string;
  slug: string;
  models: string[];
  source: string;
}

// Veriyi parse et ve cache'le
let cachedBrands: VehicleBrand[] | null = null;

export function getVehicleBrands(): VehicleBrand[] {
  if (cachedBrands) {
    return cachedBrands;
  }

  // Mock data - gerçek markalar
  const mockBrands: VehicleBrand[] = [
    { name: 'PORSCHE', slug: 'porsche', models: ['911', 'Cayenne', 'Macan', 'Taycan', 'Panamera'], source: 'vehiclesdata.txt' },
    { name: 'BMW', slug: 'bmw', models: ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'M3', 'M4', 'M5', 'iX'], source: 'vehiclesdata.txt' },
    { name: 'MERCEDES-BENZ', slug: 'mercedes-benz', models: ['C-Class', 'E-Class', 'S-Class', 'G-Class', 'GLE', 'GLS', 'AMG GT'], source: 'vehiclesdata.txt' },
    { name: 'AUDI', slug: 'audi', models: ['A3', 'A4', 'A5', 'A6', 'A7', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron', 'R8'], source: 'vehiclesdata.txt' },
    { name: 'TESLA', slug: 'tesla', models: ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck'], source: 'vehiclesdata.txt' },
    { name: 'FERRARI', slug: 'ferrari', models: ['488', 'F8', 'SF90', 'Roma', 'Purosangue'], source: 'vehiclesdata.txt' },
    { name: 'LAMBORGHINI', slug: 'lamborghini', models: ['Huracan', 'Aventador', 'Urus', 'Revuelto'], source: 'vehiclesdata.txt' },
    { name: 'RIVIAN', slug: 'rivian', models: ['R1T', 'R1S'], source: 'vehiclesdata.txt' },
    { name: 'LUCID', slug: 'lucid', models: ['Air', 'Air Sapphire', 'Gravity'], source: 'vehiclesdata.txt' },
    { name: 'JAGUAR', slug: 'jaguar', models: ['F-Type', 'XE', 'XF', 'I-Pace', 'E-Pace'], source: 'vehiclesdata.txt' },
    { name: 'RANGE ROVER', slug: 'range-rover', models: ['Evoque', 'Sport', 'Velar', 'Discovery'], source: 'vehiclesdata.txt' },
    { name: 'LEXUS', slug: 'lexus', models: ['IS', 'ES', 'GS', 'LS', 'NX', 'RX', 'LC', 'LM'], source: 'vehiclesdata.txt' },
    { name: 'POLESTAR', slug: 'polestar', models: ['1', '2', '3', '4'], source: 'vehiclesdata.txt' },
    { name: 'ACURA', slug: 'acura', models: ['ILX', 'TLX', 'RDX', 'MDX', 'NSX'], source: 'vehiclesdata.txt' },
    { name: 'ALFA ROMEO', slug: 'alfa-romeo', models: ['Giulia', 'Stelvio', '4C', 'Tonale', 'Mito'], source: 'vehiclesdata.txt' },
    { name: 'ASTON MARTIN', slug: 'aston-martin', models: ['Vantage', 'DB11', 'DBX'], source: 'vehiclesdata.txt' },
    { name: 'BENTLEY', slug: 'bentley', models: ['Continental GT', 'Flying Spur', 'Bentayga'], source: 'vehiclesdata.txt' },
    { name: 'BUGATTI', slug: 'bugatti', models: ['Chiron', 'Chiron Sport', 'Divo'], source: 'vehiclesdata.txt' },
    { name: 'BUICK', slug: 'buick', models: ['LaCrosse', 'Enclave', 'Encore', 'Envision'], source: 'vehiclesdata.txt' },
    { name: 'CADILLAC', slug: 'cadillac', models: ['Escalade', 'XT5', 'XT6', 'CT5', 'Lyriq'], source: 'vehiclesdata.txt' },
    { name: 'CHEVROLET', slug: 'chevrolet', models: ['Corvette', 'Camaro', 'Silverado', 'Tahoe', 'Equinox', 'Blazer'], source: 'vehiclesdata.txt' },
    { name: 'CHRYSLER', slug: 'chrysler', models: ['300', 'Pacifica', 'Crossfire'], source: 'vehiclesdata.txt' },
    { name: 'DODGE', slug: 'dodge', models: ['Challenger', 'Charger', 'Durango', 'Viper'], source: 'vehiclesdata.txt' },
    { name: 'FORD', slug: 'ford', models: ['Mustang', 'F-150', 'Explorer', 'Bronco'], source: 'vehiclesdata.txt' },
    { name: 'GMC', slug: 'gmc', models: ['Sierra', 'Yukon', 'Acadia', 'Terrain', 'Canyon'], source: 'vehiclesdata.txt' },
    { name: 'HONDA', slug: 'honda', models: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Passport', 'NSX'], source: 'vehiclesdata.txt' },
    { name: 'HYUNDAI', slug: 'hyundai', models: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Ioniq 5', 'Genesis Coupe'], source: 'vehiclesdata.txt' },
    { name: 'INFINITI', slug: 'infiniti', models: ['Q50', 'Q60', 'QX50', 'QX60', 'QX80'], source: 'vehiclesdata.txt' },
    { name: 'JEEP', slug: 'jeep', models: ['Wrangler', 'Grand Cherokee', 'Gladiator', 'Compass'], source: 'vehiclesdata.txt' },
    { name: 'KIA', slug: 'kia', models: ['Stinger', 'K5', 'Sportage', 'Seltos', 'Telluride', 'EV6'], source: 'vehiclesdata.txt' },
    { name: 'KOENIGSEGG', slug: 'koenigsegg', models: ['Regera', 'Jesko', 'Gemera'], source: 'vehiclesdata.txt' },
    { name: 'LAND ROVER', slug: 'land-rover', models: ['Defender', 'Discovery', 'Range Rover', 'Evoque'], source: 'vehiclesdata.txt' },
    { name: 'LOTUS', slug: 'lotus', models: ['Evija', 'Emira', 'Exige', 'Elise'], source: 'vehiclesdata.txt' },
    { name: 'MASERATI', slug: 'maserati', models: ['Quattroporte', 'GranTurismo', 'Levante', 'Grecale', 'MC20'], source: 'vehiclesdata.txt' },
    { name: 'MAYBACH', slug: 'maybach', models: ['S-Class', 'GLS'], source: 'vehiclesdata.txt' },
    { name: 'MAZDA', slug: 'mazda', models: ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'MX-5 Miata'], source: 'vehiclesdata.txt' },
    { name: 'MC LAREN', slug: 'mclaren', models: ['570S', '720S', '750S', 'Artura'], source: 'vehiclesdata.txt' },
    { name: 'MINI', slug: 'mini', models: ['Cooper', 'Cooper S', 'Countryman'], source: 'vehiclesdata.txt' },
    { name: 'MITSUBISHI', slug: 'mitsubishi', models: ['Eclipse', 'Lancer', 'Outlander', 'Mirage'], source: 'vehiclesdata.txt' },
    { name: 'NISSAN', slug: 'nissan', models: ['GT-R', '370Z', 'Leaf', 'Altima', 'Maxima', 'Pathfinder'], source: 'vehiclesdata.txt' },
    { name: 'PAGANI', slug: 'pagani', models: ['Huayra', 'Zonda'], source: 'vehiclesdata.txt' },
    { name: 'RAM', slug: 'ram', models: ['1500', '2500', '3500', 'Heavy Duty'], source: 'vehiclesdata.txt' },
    { name: 'ROLLS-ROYCE', slug: 'rolls-royce', models: ['Phantom', 'Ghost', 'Wraith', 'Cullinan'], source: 'vehiclesdata.txt' },
    { name: 'SUBARU', slug: 'subaru', models: ['Impreza', 'Legacy', 'Outback', 'WRX', 'BRZ', 'Ascent'], source: 'vehiclesdata.txt' },
    { name: 'SUZUKI', slug: 'suzuki', models: ['Swift', 'Vitara', 'SX4', 'Jimny'], source: 'vehiclesdata.txt' },
    { name: 'TOYOTA', slug: 'toyota', models: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Supra', '86', 'Prius', 'Sienna'], source: 'vehiclesdata.txt' },
    { name: 'VOLKSWAGEN', slug: 'volkswagen', models: ['Golf', 'Passat', 'Jetta', 'Tiguan', 'Atlas', 'ID.4'], source: 'vehiclesdata.txt' },
    { name: 'VOLVO', slug: 'volvo', models: ['XC40', 'XC60', 'XC90', 'S60', 'S90', 'V60', 'C40', 'EX90'], source: 'vehiclesdata.txt' },
  ];

  cachedBrands = mockBrands;
  return mockBrands;
}

export function getVehicleStats() {
  const brands = getVehicleBrands();
  return {
    totalBrands: brands.length,
    totalModels: brands.reduce((sum, b) => sum + b.models.length, 0),
    modelsPerBrand: brands.reduce((acc, b) => {
      acc[b.name] = b.models.length;
      return acc;
    }, {} as Record<string, number>),
  };
}

export function getBrandBySlug(slug: string): VehicleBrand | undefined {
  const brands = getVehicleBrands();
  return brands.find(brand => brand.slug === slug);
}

export function getModelsByBrandSlug(brandSlug: string): string[] {
  const brand = getBrandBySlug(brandSlug);
  return brand?.models || [];
}

/**
 * Üretim yılları listesi (1990-2026)
 */
export function getProductionYears(): number[] {
  const years: number[] = [];
  for (let year = 2026; year >= 1990; year--) {
    years.push(year);
  }
  return years;
}
