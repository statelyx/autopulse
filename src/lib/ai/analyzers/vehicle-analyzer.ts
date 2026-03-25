import type { VehicleInsight } from '../types';
import { HuggingFaceProvider } from '../providers/huggingface';

type BasicVehicle = {
  brand: string;
  model: string;
  year: number;
  price?: number;
  fuelType: string;
  horsepower?: number;
  acceleration?: number;
};

export class VehicleAnalyzer {
  private provider: HuggingFaceProvider;

  constructor() {
    this.provider = new HuggingFaceProvider();
  }

  async generateMarketInsight(vehicles: BasicVehicle[]): Promise<VehicleInsight[]> {
    const insights: VehicleInsight[] = [];

    const electricVehicles = vehicles.filter((vehicle) => vehicle.fuelType === 'Elektrik' || vehicle.fuelType === 'Electric');
    if (electricVehicles.length > 0) {
      const evRatio = (electricVehicles.length / vehicles.length) * 100;
      insights.push({
        id: crypto.randomUUID(),
        type: 'market',
        title: 'Elektrikli Araç Pazar Analizi',
        summary: `Listelenen ${electricVehicles.length} araç elektrikli. Lider markalar: ${this.getTopBrands(electricVehicles)}.`,
        confidence: Math.round(85 + (evRatio > 30 ? 10 : 0)),
        relatedVehicles: electricVehicles.slice(0, 3).map((vehicle) => this.getVehicleId(vehicle)),
        impact: evRatio > 30 ? 'high' : 'medium',
        timestamp: new Date(),
      });
    }

    const performanceVehicles = vehicles.filter((vehicle) => (vehicle.horsepower ?? 0) > 500);
    if (performanceVehicles.length > 0) {
      const avgHp = Math.round(
        performanceVehicles.reduce((sum, vehicle) => sum + (vehicle.horsepower ?? 0), 0) / performanceVehicles.length,
      );
      insights.push({
        id: crypto.randomUUID(),
        type: 'performance',
        title: 'Yüksek Performans Segmenti',
        summary: `${performanceVehicles.length} araç 500 hp üstünde. Ortalama güç ${avgHp} hp.`,
        confidence: 90,
        relatedVehicles: performanceVehicles.slice(0, 3).map((vehicle) => this.getVehicleId(vehicle)),
        impact: 'medium',
        timestamp: new Date(),
      });
    }

    const pricedVehicles = vehicles.filter((vehicle) => typeof vehicle.price === 'number');
    if (pricedVehicles.length > 0) {
      const avgPrice = Math.round(
        pricedVehicles.reduce((sum, vehicle) => sum + (vehicle.price ?? 0), 0) / pricedVehicles.length,
      );
      const luxuryVehicles = pricedVehicles.filter((vehicle) => (vehicle.price ?? 0) > avgPrice * 1.5);

      insights.push({
        id: crypto.randomUUID(),
        type: 'price',
        title: 'Fiyat Segmenti Analizi',
        summary: `Ortalama fiyat $${avgPrice.toLocaleString()}. Lüks bantta ${luxuryVehicles.length} araç var.`,
        confidence: 88,
        relatedVehicles: luxuryVehicles.slice(0, 3).map((vehicle) => this.getVehicleId(vehicle)),
        impact: avgPrice > 100000 ? 'high' : 'medium',
        timestamp: new Date(),
      });
    }

    insights.push({
      id: crypto.randomUUID(),
      type: 'technical',
      title: 'Yakıt Türü Dağılımı',
      summary: this.generateFuelTypeInsight(vehicles),
      confidence: 95,
      relatedVehicles: vehicles.slice(0, 3).map((vehicle) => this.getVehicleId(vehicle)),
      impact: 'low',
      timestamp: new Date(),
    });

    return insights;
  }

  async compareVehicles(vehicle1: BasicVehicle, vehicle2: BasicVehicle): Promise<string> {
    const comparisonText = [
      `${vehicle1.brand} ${vehicle1.model} (${vehicle1.year}): ${(vehicle1.horsepower ?? 0)} hp, ${(vehicle1.acceleration ?? 0)} sn, ${vehicle1.fuelType}`,
      `${vehicle2.brand} ${vehicle2.model} (${vehicle2.year}): ${(vehicle2.horsepower ?? 0)} hp, ${(vehicle2.acceleration ?? 0)} sn, ${vehicle2.fuelType}`,
    ].join('\n');

    try {
      return await this.provider.generateSummary(comparisonText);
    } catch {
      return this.fallbackComparison(vehicle1, vehicle2);
    }
  }

  async predictPriceTrend(
    vehicles: Array<{ brand: string; model: string; year: number; price?: number }>,
  ): Promise<VehicleInsight> {
    const recentVehicles = vehicles.filter((vehicle) => vehicle.year >= 2023);
    const avgPrice = recentVehicles.reduce((sum, vehicle) => sum + (vehicle.price ?? 0), 0) / Math.max(recentVehicles.length, 1);
    const premiumRatio = Math.round(
      recentVehicles.filter((vehicle) => (vehicle.price ?? 0) > avgPrice * 1.5).length / Math.max(recentVehicles.length, 1) * 100,
    );

    return {
      id: crypto.randomUUID(),
      type: 'trend',
      title: 'Fiyat Tahmini',
      summary: `2023+ araçların ortalama fiyatı $${Math.round(avgPrice).toLocaleString()}. Premium oranı %${premiumRatio}.`,
      confidence: 75,
      relatedVehicles: recentVehicles.slice(0, 3).map((vehicle) => this.getVehicleId(vehicle)),
      impact: 'medium',
      timestamp: new Date(),
    };
  }

  private getVehicleId(vehicle: { brand: string; model: string; year: number }) {
    return `${vehicle.brand.toLowerCase()}-${vehicle.model.toLowerCase().replace(/\s+/g, '-')}-${vehicle.year}`;
  }

  private getTopBrands(vehicles: BasicVehicle[]) {
    const brandCount = new Map<string, number>();
    vehicles.forEach((vehicle) => {
      brandCount.set(vehicle.brand, (brandCount.get(vehicle.brand) ?? 0) + 1);
    });

    return Array.from(brandCount.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 2)
      .map(([brand]) => brand)
      .join(' ve ');
  }

  private generateFuelTypeInsight(vehicles: BasicVehicle[]) {
    const fuelTypes = new Map<string, number>();
    vehicles.forEach((vehicle) => {
      fuelTypes.set(vehicle.fuelType, (fuelTypes.get(vehicle.fuelType) ?? 0) + 1);
    });

    return Array.from(fuelTypes.entries())
      .sort((left, right) => right[1] - left[1])
      .map(([type, count]) => `${count} ${type}`)
      .join(', ');
  }

  private fallbackComparison(vehicle1: BasicVehicle, vehicle2: BasicVehicle) {
    const hpDiff = (vehicle1.horsepower ?? 0) - (vehicle2.horsepower ?? 0);
    const accelerationDiff = (vehicle2.acceleration ?? 0) - (vehicle1.acceleration ?? 0);

    let output = `${vehicle1.brand} ${vehicle1.model} `;
    if (hpDiff > 0) output += `${hpDiff} hp daha güçlü`;
    if (hpDiff < 0) output += `${Math.abs(hpDiff)} hp daha zayıf`;

    if (accelerationDiff > 0) output += ` ve ${accelerationDiff.toFixed(1)} sn daha hızlı`;
    if (accelerationDiff < 0) output += ` ve ${Math.abs(accelerationDiff).toFixed(1)} sn daha yavaş`;

    return output;
  }
}
