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

export interface Vehicle {
  id: string;
  brand: string;
  brandSlug: string;
  model: string;
  year: number;
  price?: number;
  mileage?: number;
  fuelType: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid';
  transmission: 'Automatic' | 'Manual' | 'CVT' | 'DSG' | 'PDK';
  horsepower?: number;
  acceleration?: number; // 0-100 km/h
  topSpeed?: number; // km/h
  bodyType: 'Sedan' | 'SUV' | 'Coupe' | 'Hatchback' | 'Convertible' | 'Truck' | 'Van' | 'Wagon';
  doors: number;
  seats: number;
  color?: string;
  description?: string;
  features?: string[];
  imageUrl?: string;
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

/**
 * Gerçek araç verileri (örnek)
 */
let cachedVehicles: Vehicle[] | null = null;

export function getVehicles(filters?: {
  brand?: string;
  model?: string;
  year?: number;
  fuelType?: Vehicle['fuelType'];
  bodyType?: Vehicle['bodyType'];
}): Vehicle[] {
  if (cachedVehicles) {
    return filterVehicles(cachedVehicles, filters);
  }

  // Örnek gerçek araç verileri
  const mockVehicles: Vehicle[] = [
    // Porsche
    {
      id: 'porsche-911-2024',
      brand: 'PORSCHE',
      brandSlug: 'porsche',
      model: '911 Carrera S',
      year: 2024,
      price: 185000,
      mileage: 0,
      fuelType: 'Gasoline',
      transmission: 'PDK',
      horsepower: 443,
      acceleration: 3.5,
      topSpeed: 308,
      bodyType: 'Coupe',
      doors: 2,
      seats: 4,
      color: 'GT Silver Metallic',
      description: 'İkonik 911, mükemmel performans ve günlük kullanılabilirliğin dengesi.',
      features: ['Sport Chrono Package', 'Bose Sound System', 'Navigation', 'Heated Seats'],
    },
    {
      id: 'porsche-taycan-2024',
      brand: 'PORSCHE',
      brandSlug: 'porsche',
      model: 'Taycan Turbo S',
      year: 2024,
      price: 195000,
      mileage: 0,
      fuelType: 'Electric',
      transmission: 'Automatic',
      horsepower: 750,
      acceleration: 2.8,
      topSpeed: 260,
      bodyType: 'Sedan',
      doors: 4,
      seats: 4,
      color: 'Frozen Berry Metallic',
      description: 'Tamamen elektrikli Porsche, sıfır emisyon ve ultra hızlı şarj.',
      features: ['Performance Battery Plus', 'Porsche Electric Sport Sound', 'Matrix LED Headlights'],
    },
    // BMW
    {
      id: 'bmw-m3-2024',
      brand: 'BMW',
      brandSlug: 'bmw',
      model: 'M3 Competition',
      year: 2024,
      price: 95000,
      mileage: 0,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      horsepower: 503,
      acceleration: 3.5,
      topSpeed: 290,
      bodyType: 'Sedan',
      doors: 4,
      seats: 5,
      color: 'Isle of Man Green',
      description: 'M3 Competition, pist performansını günlük yola getiriyor.',
      features: ['M Driver\'s Package', 'Carbon Fiber Bucket Seats', 'M Sport Exhaust'],
    },
    {
      id: 'bmw-ix-2024',
      brand: 'BMW',
      brandSlug: 'bmw',
      model: 'iX xDrive50',
      year: 2024,
      price: 90000,
      mileage: 0,
      fuelType: 'Electric',
      transmission: 'Automatic',
      horsepower: 523,
      acceleration: 4.6,
      topSpeed: 200,
      bodyType: 'SUV',
      doors: 4,
      seats: 5,
      color: 'Phytonic Blue',
      description: 'BMW\'nin tamamen elektrikli SUV\'u, uzun menzil ve lüks konfor.',
      features: ['Glass Control', 'Curved Display', 'Bowers & Wilkins Sound System'],
    },
    // Mercedes-Benz
    {
      id: 'mercedes-amg-gt-2024',
      brand: 'MERCEDES-BENZ',
      brandSlug: 'mercedes-benz',
      model: 'AMG GT',
      year: 2024,
      price: 140000,
      mileage: 0,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      horsepower: 577,
      acceleration: 3.2,
      topSpeed: 315,
      bodyType: 'Coupe',
      doors: 2,
      seats: 4,
      color: 'designo Diamond White Bright',
      description: 'AMG GT, performans ve elegansın mükemmel birleşimi.',
      features: ['AMG Performance Exhaust', 'AMG Track Pace', 'Burmester Sound System'],
    },
    // Tesla
    {
      id: 'tesla-model-s-2024',
      brand: 'TESLA',
      brandSlug: 'tesla',
      model: 'Model S Plaid',
      year: 2024,
      price: 110000,
      mileage: 0,
      fuelType: 'Electric',
      transmission: 'Automatic',
      horsepower: 1020,
      acceleration: 2.1,
      topSpeed: 322,
      bodyType: 'Sedan',
      doors: 4,
      seats: 5,
      color: 'Red Multi-Coat',
      description: 'Dünyanın en hızlı üretilen arabası, 3 motorlu tri-motor.',
      features: ['Autopilot', 'Full Self-Driving Capability', 'Yoke Steering'],
    },
    {
      id: 'tesla-model-y-2024',
      brand: 'TESLA',
      brandSlug: 'tesla',
      model: 'Model Y Long Range',
      year: 2024,
      price: 52000,
      mileage: 0,
      fuelType: 'Electric',
      transmission: 'Automatic',
      horsepower: 460,
      acceleration: 4.8,
      topSpeed: 217,
      bodyType: 'SUV',
      doors: 4,
      seats: 5,
      color: 'Pearl White Multi-Coat',
      description: 'En çok satan Tesla, pratiklik ve menzil dengesi.',
      features: ['Autopilot', 'Premium Interior', 'Tow Hitch'],
    },
    // Ferrari
    {
      id: 'ferrari-f8-2024',
      brand: 'FERRARI',
      brandSlug: 'ferrari',
      model: 'F8 Tributo',
      year: 2024,
      price: 280000,
      mileage: 0,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      horsepower: 710,
      acceleration: 2.9,
      topSpeed: 340,
      bodyType: 'Coupe',
      doors: 2,
      seats: 2,
      color: 'Rosso Corsa',
      description: 'F8 Tributo, Ferrari\'nin V8 motorlu efsanesi.',
      features: ['Carbon Fiber Driver Zone', 'Front Lift System', 'Premium Sound System'],
    },
    // Lamborghini
    {
      id: 'lamborghini-huracan-2024',
      brand: 'LAMBORGHINI',
      brandSlug: 'lamborghini',
      model: 'Huracan EVO',
      year: 2024,
      price: 270000,
      mileage: 0,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      horsepower: 640,
      acceleration: 2.9,
      topSpeed: 325,
      bodyType: 'Coupe',
      doors: 2,
      seats: 2,
      color: 'Verde Mantis',
      description: 'Huracan EVO, naturally aspirated V10 motor.',
      features: ['Lamborghini Dinamica Veicolo Integrata', 'Magnetic Suspension', 'Apple CarPlay'],
    },
    // Audi
    {
      id: 'audi-r8-2024',
      brand: 'AUDI',
      brandSlug: 'audi',
      model: 'R8 V10 Performance',
      year: 2024,
      price: 165000,
      mileage: 0,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      horsepower: 602,
      acceleration: 3.1,
      topSpeed: 330,
      bodyType: 'Coupe',
      doors: 2,
      seats: 2,
      color: 'Mythos Black',
      description: 'R8 V10, Audi\'nin bayrak gemisi.',
      features: ['Quattro AWD', 'Bang & Olufsen Sound', 'Audi Virtual Cockpit'],
    },
    {
      id: 'audi-etron-gt-2024',
      brand: 'AUDI',
      brandSlug: 'audi',
      model: 'e-tron GT',
      year: 2024,
      price: 105000,
      mileage: 0,
      fuelType: 'Electric',
      transmission: 'Automatic',
      horsepower: 522,
      acceleration: 3.9,
      topSpeed: 250,
      bodyType: 'Sedan',
      doors: 4,
      seats: 5,
      color: 'Tactical Green',
      description: 'Tamamen elektrikli gran turismo.',
      features: ['Matrix LED Headlights', 'Quattro AWD', 'Bang & Olufsen Premium Sound'],
    },
    // Toyota
    {
      id: 'toyota-supra-2024',
      brand: 'TOYOTA',
      brandSlug: 'toyota',
      model: 'GR Supra',
      year: 2024,
      price: 58000,
      mileage: 0,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      horsepower: 382,
      acceleration: 3.9,
      topSpeed: 250,
      bodyType: 'Coupe',
      doors: 2,
      seats: 2,
      color: 'Stratosphere Blue',
      description: 'GR Supra, drifting için tasarlandı.',
      features: ['Performance Exhaust', 'Navigation', 'JBL Sound System'],
    },
    {
      id: 'toyota-rav4-2024',
      brand: 'TOYOTA',
      brandSlug: 'toyota',
      model: 'RAV4 Hybrid',
      year: 2024,
      price: 33000,
      mileage: 0,
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      horsepower: 219,
      acceleration: 7.8,
      topSpeed: 180,
      bodyType: 'SUV',
      doors: 4,
      seats: 5,
      color: 'Celestial Silver',
      description: 'En çok satan hybrid SUV.',
      features: ['Toyota Safety Sense', 'Panoramic Roof', 'Wireless Charging'],
    },
    // Honda
    {
      id: 'honda-civic-2024',
      brand: 'HONDA',
      brandSlug: 'honda',
      model: 'Civic Type R',
      year: 2024,
      price: 45000,
      mileage: 0,
      fuelType: 'Gasoline',
      transmission: 'Manual',
      horsepower: 315,
      acceleration: 4.9,
      topSpeed: 275,
      bodyType: 'Hatchback',
      doors: 4,
      seats: 5,
      color: 'Championship White',
      description: 'FWD hot hatch kralı.',
      features: ['Brembo Brakes', 'Honda LogR Data Logger', 'Bose Sound System'],
    },
    // Ford
    {
      id: 'ford-mustang-2024',
      brand: 'FORD',
      brandSlug: 'ford',
      model: 'Mustang Dark Horse',
      year: 2024,
      price: 62000,
      mileage: 0,
      fuelType: 'Gasoline',
      transmission: 'Manual',
      horsepower: 500,
      acceleration: 4.1,
      topSpeed: 270,
      bodyType: 'Coupe',
      doors: 2,
      seats: 4,
      color: 'Blue Ember Metallic',
      description: 'Mustang Dark Horse, track-ready performance.',
      features: ['Performance Package', 'Brembo Brakes', 'Active Valve Exhaust'],
    },
    // Chevrolet
    {
      id: 'chevrolet-corvette-2024',
      brand: 'CHEVROLET',
      brandSlug: 'chevrolet',
      model: 'Corvette E-Ray',
      year: 2024,
      price: 110000,
      mileage: 0,
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      horsepower: 655,
      acceleration: 2.5,
      topSpeed: 290,
      bodyType: 'Coupe',
      doors: 2,
      seats: 2,
      color: 'Hyper Green',
      description: 'İlk hibrit Corvette, elektrik destekli performans.',
      features: ['Z51 Performance Package', 'Front Lift', 'Bose Performance System'],
    },
    // Hyundai
    {
      id: 'hyundai-ioniq5-2024',
      brand: 'HYUNDAI',
      brandSlug: 'hyundai',
      model: 'Ioniq 5 Limited',
      year: 2024,
      price: 52000,
      mileage: 0,
      fuelType: 'Electric',
      transmission: 'Automatic',
      horsepower: 320,
      acceleration: 4.5,
      topSpeed: 185,
      bodyType: 'SUV',
      doors: 4,
      seats: 5,
      color: 'Digital Teal',
      description: 'Retro-futuristik tasarım, ultra hızlı DC şarj.',
      features: ['Vehicle-to-Load', 'Holographic Rear View Mirror', 'Premium Sound'],
    },
    // Kia
    {
      id: 'kia-ev6-2024',
      brand: 'KIA',
      brandSlug: 'kia',
      model: 'EV6 GT',
      year: 2024,
      price: 63000,
      mileage: 0,
      fuelType: 'Electric',
      transmission: 'Automatic',
      horsepower: 576,
      acceleration: 3.4,
      topSpeed: 260,
      bodyType: 'SUV',
      doors: 4,
      seats: 5,
      color: 'Yacht Blue',
      description: 'Kia\'nin performans elektrikli SUV\'u.',
      features: ['GT Mode', '21" Wheels', 'Meridian Sound System'],
    },
    // Volvo
    {
      id: 'volvo-xc90-2024',
      brand: 'VOLVO',
      brandSlug: 'volvo',
      model: 'XC90 T8 AWD',
      year: 2024,
      price: 75000,
      mileage: 0,
      fuelType: 'Plug-in Hybrid',
      transmission: 'Automatic',
      horsepower: 455,
      acceleration: 5.0,
      topSpeed: 230,
      bodyType: 'SUV',
      doors: 4,
      seats: 7,
      color: 'Onyx Black',
      description: 'Lüks 7 kişilik plug-in hybrid SUV.',
      features: ['Bowers & Wilkins Sound', 'Nappa Leather', 'Orrefors Crystal Gear Shifter'],
    },
    // Nissan
    {
      id: 'nissan-gtr-2024',
      brand: 'NISSAN',
      brandSlug: 'nissan',
      model: 'GT-R NISMO',
      year: 2024,
      price: 125000,
      mileage: 0,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      horsepower: 600,
      acceleration: 2.7,
      topSpeed: 315,
      bodyType: 'Coupe',
      doors: 2,
      seats: 4,
      color: 'Bayside Blue',
      description: 'Godzilla returns, NISMO tuned.',
      features: ['Carbon Fiber Spoiler', 'Recaro Seats', 'NISMO-tuned Suspension'],
    },
  ];

  cachedVehicles = mockVehicles;
  return filterVehicles(mockVehicles, filters);
}

function filterVehicles(vehicles: Vehicle[], filters?: {
  brand?: string;
  model?: string;
  year?: number;
  fuelType?: Vehicle['fuelType'];
  bodyType?: Vehicle['bodyType'];
}): Vehicle[] {
  if (!filters) return vehicles;

  return vehicles.filter(vehicle => {
    if (filters.brand && vehicle.brandSlug !== filters.brand) return false;
    if (filters.model && !vehicle.model.toLowerCase().includes(filters.model.toLowerCase())) return false;
    if (filters.year && vehicle.year !== filters.year) return false;
    if (filters.fuelType && vehicle.fuelType !== filters.fuelType) return false;
    if (filters.bodyType && vehicle.bodyType !== filters.bodyType) return false;
    return true;
  });
}

export function getVehicleById(id: string): Vehicle | undefined {
  const vehicles = getVehicles();
  return vehicles.find(v => v.id === id);
}

export function getVehiclesByBrand(brandSlug: string): Vehicle[] {
  return getVehicles({ brand: brandSlug });
}

export function getVehiclesByModel(model: string): Vehicle[] {
  return getVehicles({ model });
}
