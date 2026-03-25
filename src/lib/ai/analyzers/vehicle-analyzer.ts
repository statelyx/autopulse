/**
 * AUTO PULSE — Vehicle Analyzer
 * Araç içgörüleri için AI analizi
 */

import type { VehicleInsight } from '../types';
import { HuggingFaceProvider } from '../providers/huggingface';

export class VehicleAnalyzer {
  private provider: HuggingFaceProvider;

  constructor() {
    this.provider = new HuggingFaceProvider();
  }

  async generateMarketInsight(vehicles: Array<{
    brand: string;
    model: string;
    year: number;
    price?: number;
    fuelType: string;
    horsepower?: number;
  }>): Promise<VehicleInsight[]> {
    const insights: VehicleInsight[] = [];

    // Elektrikli araç analizi
    const electricVehicles = vehicles.filter(v => v.fuelType === 'Electric');
    if (electricVehicles.length > 0) {
      const evRatio = (electricVehicles.length / vehicles.length) * 100;
      insights.push({
        id: crypto.randomUUID(),
        type: 'market',
        title: 'Elektrikli Araç Pazar Analizi',
        summary: `Envanterdeki ${electricVehicles.length} araçın %.1f'i elektrikli. ${this.getTopBrands(electricVehicles)} markaları lider.`,
        confidence: 85 + (evRatio > 30 ? 10 : 0),
        relatedVehicles: electricVehicles.slice(0, 3).map(v => this.getVehicleId(v)),
        impact: evRatio > 30 ? 'high' : 'medium',
        timestamp: new Date(),
      });
    }

    // Performans analizi
    const performanceVehicles = vehicles.filter(v => v.horsepower && v.horsepower > 500);
    if (performanceVehicles.length > 0) {
      const avgHp = Math.round(performanceVehicles.reduce((sum, v) => sum + (v.horsepower || 0), 0) / performanceVehicles.length);
      insights.push({
        id: crypto.randomUUID(),
        type: 'performance',
        title: 'Yüksek Performans Segmenti',
        summary: `${performanceVehicles.length} performans aracı bulunuyor. Ortalama ${avgHp} hp gücünde. ${this.getTopBrands(performanceVehicles)} öne çıkıyor.`,
        confidence: 90,
        relatedVehicles: performanceVehicles.slice(0, 3).map(v => this.getVehicleId(v)),
        impact: 'medium',
        timestamp: new Date(),
      });
    }

    // Fiyat analizi
    const pricedVehicles = vehicles.filter(v => v.price);
    if (pricedVehicles.length > 0) {
      const avgPrice = Math.round(pricedVehicles.reduce((sum, v) => sum + (v.price || 0), 0) / pricedVehicles.length);
      const luxuryVehicles = pricedVehicles.filter(v => v.price && v.price > avgPrice * 1.5);

      insights.push({
        id: crypto.randomUUID(),
        type: 'price',
        title: 'Fiyat Segmenti Analizi',
        summary: `Ortalama araç fiyatı $${avgPrice.toLocaleString()}. ${luxuryVehicles.length} lüks segment araç bulunuyor.`,
        confidence: 88,
        relatedVehicles: luxuryVehicles.slice(0, 3).map(v => this.getVehicleId(v)),
        impact: avgPrice > 100000 ? 'high' : 'medium',
        timestamp: new Date(),
      });
    }

    // Teknik trend analizi
    insights.push({
      id: crypto.randomUUID(),
      type: 'technical',
      title: 'Yakıt Türü Dağılımı',
      summary: this.generateFuelTypeInsight(vehicles),
      confidence: 95,
      relatedVehicles: vehicles.slice(0, 3).map(v => this.getVehicleId(v)),
      impact: 'low',
      timestamp: new Date(),
    });

    return insights;
  }

  async compareVehicles(vehicle1: any, vehicle2: any): Promise<string> {
    const comparisonText = `
      ${vehicle1.brand} ${vehicle1.model} (${vehicle1.year}): ${vehicle1.horsepower}hp, ${vehicle1.acceleration}s 0-100, ${vehicle1.fuelType}
      vs
      ${vehicle2.brand} ${vehicle2.model} (${vehicle2.year}): ${vehicle2.horsepower}hp, ${vehicle2.acceleration}s 0-100, ${vehicle2.fuelType}
    `;

    try {
      const summary = await this.provider.generateSummary(comparisonText);
      return summary;
    } catch (error) {
      // Fallback comparison
      return this.fallbackComparison(vehicle1, vehicle2);
    }
  }

  async predictPriceTrend(vehicles: Array<{ brand: string; model: string; year: number; price?: number }>): Promise<VehicleInsight> {
    const recentVehicles = vehicles.filter(v => v.year >= 2023);
    const avgPrice = recentVehicles.reduce((sum, v) => sum + (v.price || 0), 0) / recentVehicles.length;
    const premiumRatio = Math.round(recentVehicles.filter(v => (v.price || 0) > avgPrice * 1.5).length / recentVehicles.length * 100);

    return {
      id: crypto.randomUUID(),
      type: 'trend',
      title: 'Fiyat Tahmini',
      summary: `2023+ araçların ortalama fiyatı $${Math.round(avgPrice).toLocaleString()}. Premium segment %${premiumRatio} oranında.`,
      confidence: 75,
      relatedVehicles: recentVehicles.slice(0, 3).map(v => this.getVehicleId(v)),
      impact: 'medium',
      timestamp: new Date(),
    };
  }

  private getVehicleId(vehicle: any): string {
    return `${vehicle.brand.toLowerCase()}-${vehicle.model.toLowerCase().replace(/\s+/g, '-')}-${vehicle.year}`;
  }

  private getTopBrands(vehicles: any[]): string {
    const brandCount = new Map<string, number>();
    vehicles.forEach(v => {
      brandCount.set(v.brand, (brandCount.get(v.brand) || 0) + 1);
    });

    return Array.from(brandCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([brand]) => brand)
      .join(' ve ');
  }

  private generateFuelTypeInsight(vehicles: any[]): string {
    const fuelTypes = new Map<string, number>();
    vehicles.forEach(v => {
      fuelTypes.set(v.fuelType, (fuelTypes.get(v.fuelType) || 0) + 1);
    });

    const entries = Array.from(fuelTypes.entries()).sort((a, b) => b[1] - a[1]);
    return entries.map(([type, count]) => `${count} ${type}`).join(', ');
  }

  private fallbackComparison(v1: any, v2: any): string {
    const hpDiff = (v1.horsepower || 0) - (v2.horsepower || 0);
    const speedDiff = (v2.acceleration || 0) - (v1.acceleration || 0);

    let comparison = `${v1.brand} ${v1.model} `;
    if (hpDiff > 0) {
      comparison += `${hpDiff}hp daha güçlü`;
    } else if (hpDiff < 0) {
      comparison += `${Math.abs(hpDiff)}hp daha zayıf`;
    }

    if (speedDiff > 0) {
      comparison += ` ve ${speedDiff}s daha hızlanıyor`;
    } else if (speedDiff < 0) {
      comparison += ` ve ${Math.abs(speedDiff)}s daha yavaş hızlanıyor`;
    }

    return comparison;
  }
}
