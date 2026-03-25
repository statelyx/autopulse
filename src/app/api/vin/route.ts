import { NextRequest, NextResponse } from 'next/server';

type VinPayload = {
  vin: string;
  make?: string;
  model?: string;
  year?: number;
  trim?: string;
  bodyType?: string;
  engine?: string;
  transmission?: string;
  driveType?: string;
  fuelType?: string;
  manufacturer?: string;
  plant?: string;
  series?: string;
  source: 'vpic' | 'fallback';
  confidence: number;
  error?: string;
};

const WMI_BRAND_MAP: Record<string, { make: string; manufacturer: string; country: string }> = {
  WBA: { make: 'BMW', manufacturer: 'BMW AG', country: 'Almanya' },
  WBS: { make: 'BMW M', manufacturer: 'BMW M GmbH', country: 'Almanya' },
  WDB: { make: 'Mercedes-Benz', manufacturer: 'Mercedes-Benz Group AG', country: 'Almanya' },
  WAU: { make: 'Audi', manufacturer: 'Audi AG', country: 'Almanya' },
  WP0: { make: 'Porsche', manufacturer: 'Porsche AG', country: 'Almanya' },
  WVG: { make: 'Volkswagen', manufacturer: 'Volkswagen AG', country: 'Almanya' },
  JTD: { make: 'Toyota', manufacturer: 'Toyota Motor Corporation', country: 'Japonya' },
  JHM: { make: 'Honda', manufacturer: 'Honda Motor Co.', country: 'Japonya' },
  JT8: { make: 'Lexus', manufacturer: 'Toyota Motor Corporation', country: 'Japonya' },
  KNM: { make: 'Renault Samsung', manufacturer: 'Renault Korea Motors', country: 'Güney Kore' },
  KNA: { make: 'Kia', manufacturer: 'Kia Corporation', country: 'Güney Kore' },
  KMH: { make: 'Hyundai', manufacturer: 'Hyundai Motor Company', country: 'Güney Kore' },
  SAL: { make: 'Land Rover', manufacturer: 'Jaguar Land Rover', country: 'Birleşik Krallık' },
  SCF: { make: 'Aston Martin', manufacturer: 'Aston Martin Lagonda', country: 'Birleşik Krallık' },
  '5YJ': { make: 'Tesla', manufacturer: 'Tesla, Inc.', country: 'ABD' },
  '7SA': { make: 'Tesla', manufacturer: 'Tesla, Inc.', country: 'ABD' },
  '1FA': { make: 'Ford', manufacturer: 'Ford Motor Company', country: 'ABD' },
  '1GC': { make: 'Chevrolet', manufacturer: 'General Motors', country: 'ABD' },
  '1G1': { make: 'Chevrolet', manufacturer: 'General Motors', country: 'ABD' },
};

const VIN_YEAR_MAP: Record<string, number> = {
  A: 2010,
  B: 2011,
  C: 2012,
  D: 2013,
  E: 2014,
  F: 2015,
  G: 2016,
  H: 2017,
  J: 2018,
  K: 2019,
  L: 2020,
  M: 2021,
  N: 2022,
  P: 2023,
  R: 2024,
  S: 2025,
  T: 2026,
  V: 2027,
};

function normalizeVin(rawVin: string) {
  return rawVin.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

async function decodeViaVPIC(vin: string): Promise<VinPayload | null> {
  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`,
      {
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const record = Array.isArray(data.Results) ? data.Results[0] : null;

    if (!record || (!record.Make && !record.Manufacturer)) {
      return null;
    }

    return {
      vin,
      make: record.Make || undefined,
      model: record.Model || undefined,
      year: record.ModelYear ? Number(record.ModelYear) : undefined,
      trim: record.Trim || undefined,
      bodyType: record.BodyClass || undefined,
      engine: record.EngineModel || undefined,
      transmission: record.TransmissionStyle || undefined,
      driveType: record.DriveType || undefined,
      fuelType: record.FuelTypePrimary || undefined,
      manufacturer: record.Manufacturer || undefined,
      plant: record.PlantCountry || undefined,
      series: record.Series || undefined,
      source: 'vpic',
      confidence: 96,
    };
  } catch {
    return null;
  }
}

function decodeFallback(vin: string): VinPayload {
  const wmi = vin.slice(0, 3);
  const yearCode = vin.charAt(9);
  const brand = WMI_BRAND_MAP[wmi];

  return {
    vin,
    make: brand?.make,
    manufacturer: brand?.manufacturer,
    model: brand?.make ? 'Model bilgisi ek kaynaktan çözümlenecek' : undefined,
    year: VIN_YEAR_MAP[yearCode],
    plant: brand?.country,
    source: 'fallback',
    confidence: brand ? 72 : 58,
    error: brand ? undefined : 'VIN için yalnızca temel WMI çözümlemesi yapılabildi.',
  };
}

async function resolveVin(vin: string) {
  const vpic = await decodeViaVPIC(vin);
  return vpic ?? decodeFallback(vin);
}

export async function GET(request: NextRequest) {
  const vin = normalizeVin(new URL(request.url).searchParams.get('vin') ?? '');

  if (vin.length !== 17) {
    return NextResponse.json(
      { error: 'VIN 17 karakter olmalıdır.' },
      { status: 400 },
    );
  }

  const result = await resolveVin(vin);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const vin = normalizeVin(body?.vin ?? '');

  if (vin.length !== 17) {
    return NextResponse.json(
      { error: 'VIN 17 karakter olmalıdır.' },
      { status: 400 },
    );
  }

  const result = await resolveVin(vin);
  return NextResponse.json(result);
}
