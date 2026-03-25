/**
 * AUTO PULSE — VIN Adapter Interface
 * VIN sorgulama için adapter katmanı
 *
 * FUTURE-READY MİMARİ
 * - vPIC API öncelikli (NHTSA resmi kaynak)
 * - Alternative provider'lar eklenebilir
 * - Mock data fallback
 * - Cache mekanizması hazır
 */

// VIN decoder sonucu
export interface VINDecodeResult {
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
  error?: string;
}

// VIN provider interface
export interface VINProvider {
  name: string;
  decode(vin: string): Promise<VINDecodeResult>;
  isConfigured(): boolean;
}

// vPIC API Provider (NHTSA - USA Government)
export class VPICProvider implements VINProvider {
  name = 'vpic';
  private baseUrl = 'https://vpic.nhtsa.dot.gov/api/';

  isConfigured(): boolean {
    return true; // vPIC API key gerektirmez
  }

  async decode(vin: string): Promise<VINDecodeResult> {
    try {
      const response = await fetch(
        `${this.baseUrl}vehicles/decodevinvalues/${vin}?format=json`
      );

      if (!response.ok) {
        throw new Error(`vPIC API error: ${response.statusText}`);
      }

      const data = await response.json();
      const results = data.Results;

      if (!results || results.length === 0) {
        return {
          vin,
          error: 'VIN bulunamadı veya geçersiz',
        };
      }

      // vPIC API'den değerleri çıkar
      const getValue = (variableId: string) => {
        const result = results.find((r: any) => r.VariableId === variableId);
        return result?.Value;
      };

      return {
        vin: getValue('VIN') || vin,
        make: getValue('Make'),
        model: getValue('Model'),
        year: getValue('ModelYear') ? parseInt(getValue('ModelYear')) : undefined,
        trim: getValue('Trim'),
        bodyType: getValue('BodyClass'),
        engine: getValue('EngineModel'),
        transmission: getValue('TransmissionStyle'),
        driveType: getValue('DriveType'),
        fuelType: getValue('FuelTypePrimary'),
        manufacturer: getValue('Manufacturer'),
        plant: getValue('PlantCountry'),
        series: getValue('Series'),
      };
    } catch (error) {
      console.error('vPIV API hatası:', error);
      return {
        vin,
        error: 'VIN sorgulaması başarısız',
      };
    }
  }
}

// Mock VIN Provider (Fallback)
export class MockVINProvider implements VINProvider {
  name = 'mock';

  isConfigured(): boolean {
    return true;
  }

  async decode(vin: string): Promise<VINDecodeResult> {
    // VIN validate et (17 karakter)
    if (vin.length !== 17) {
      return {
        vin,
        error: 'VIN 17 karakter olmalı',
      };
    }

    // Mock response
    return {
      vin,
      make: 'Porsche',
      model: '911 Carrera S',
      year: 2024,
      trim: 'Base',
      bodyType: 'Coupe',
      engine: '3.0L Flat-6 Turbo',
      transmission: 'Automatic',
      driveType: 'RWD',
      fuelType: 'Gasoline',
      manufacturer: 'Porsche AG',
      plant: 'Germany',
      series: '992',
    };
  }
}

// VIN Adapter (Ana interface)
export class VINAdapter {
  private providers: VINProvider[] = [
    new VPICProvider(),
    new MockVINProvider(), // Fallback
  ];

  async decode(vin: string): Promise<VINDecodeResult> {
    // VIN validate et
    const cleanVin = vin.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    if (cleanVin.length !== 17) {
      return {
        vin: cleanVin,
        error: 'VIN 17 karakter olmalı',
      };
    }

    // Her provider'ı sırayla dene
    for (const provider of this.providers) {
      try {
        if (!provider.isConfigured()) {
          continue;
        }

        const result = await provider.decode(cleanVin);

        if (!result.error) {
          return result;
        }
      } catch (error) {
        console.error(`${provider.name} hatası:`, error);
        continue;
      }
    }

    // Tüm provider'lar başarısız oldu
    return {
      vin: cleanVin,
      error: 'VIN sorgulaması başarısız. Lütfen daha sonra tekrar deneyin.',
    };
  }

  // VIN validate et
  validate(vin: string): boolean {
    const cleanVin = vin.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    return cleanVin.length === 17;
  }

  // VIN format (display için)
  format(vin: string): string {
    const cleanVin = vin.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    return cleanVin;
  }
}

// Singleton export
export const vinAdapter = new VINAdapter();
