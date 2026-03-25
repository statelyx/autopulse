'use client';

/**
 * AUTO PULSE — AI Insights Page
 * Yapay zeka destekli otomotiv içgörüleri
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { getVehicles, getVehicleById } from '@/lib/data/vehicle-service';
import { getBrandLogo } from '@/lib/data/logo-service';
import { aiService } from '@/lib/ai';
import type { VehicleInsight } from '@/lib/ai/types';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function AIInsightsPage() {
  const { language } = useLanguageTheme();
  const [insights, setInsights] = useState<VehicleInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const vehicles = getVehicles();

  useEffect(() => {
    loadAIInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAIInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // AI servis ile insights oluştur
      const aiInsights = await aiService.generateMarketInsight(vehicles);
      setInsights(aiInsights);
    } catch (err) {
      console.error('AI insights yüklenirken hata:', err);
      setError(language === 'tr' ? 'AI analizi yüklenemedi' : 'Failed to load AI analysis');

      // Fallback: Statik insights
      setInsights([
        {
          id: crypto.randomUUID(),
          type: 'market',
          title: language === 'tr' ? 'Pazar Analizi Hazır' : 'Market Analysis Ready',
          summary: language === 'tr'
            ? `${vehicles.length} araçın analizi tamamlandı. ${vehicles.filter(v => v.fuelType === 'Electric').length} elektrikli araç buluyor.`
            : `Analysis of ${vehicles.length} vehicles completed. ${vehicles.filter(v => v.fuelType === 'Electric').length} electric vehicles found.`,
          confidence: 85,
          relatedVehicles: vehicles.slice(0, 3).map(v => v.id),
          impact: 'medium',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Vehicle stats
  const electricCount = vehicles.filter(v => v.fuelType === 'Electric').length;
  const performanceCount = vehicles.filter(v => v.horsepower && v.horsepower > 500).length;
  const avgPower = vehicles.length > 0
    ? Math.round(vehicles.reduce((sum, v) => sum + (v.horsepower || 0), 0) / vehicles.length)
    : 0;
  const avgPrice = vehicles.length > 0
    ? Math.round(vehicles.reduce((sum, v) => sum + (v.price || 0), 0) / vehicles.length)
    : 0;

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'market': return 'text-primary bg-primary-container/10';
      case 'technical': return 'text-secondary bg-secondary-container/10';
      case 'performance': return 'text-error bg-error-container/10';
      case 'price': return 'text-tertiary bg-tertiary-container/10';
      case 'trend': return 'text-primary-container bg-primary-container/10';
      default: return 'text-on-surface-variant bg-surface-container-highest';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-error';
      case 'medium': return 'text-primary-container';
      case 'low': return 'text-secondary-container';
      default: return 'text-on-surface-variant';
    }
  };

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-2">
                  {language === 'tr' ? 'Yapay Zeka Analizleri' : 'AI Insights'}
                </h1>
                <p className="font-body text-on-surface-variant text-lg">
                  {language === 'tr'
                    ? 'Makine öğrenmesi destekli otomotiv istihbaratı'
                    : 'Machine learning powered automotive intelligence'}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary-container/10 rounded-full">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
                <span className="font-label text-[10px] uppercase tracking-widest text-secondary-container">
                  {language === 'tr' ? 'Canlı Analiz' : 'Live Analysis'}
                </span>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8 p-4 bg-error-container/10 rounded-lg border border-error-container/20">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined">error</span>
                <span className="font-label text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Insights Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-surface-container-low rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-surface-container-highest rounded w-1/2 mb-4" />
                  <div className="h-4 bg-surface-container-highest rounded w-full mb-2" />
                  <div className="h-4 bg-surface-container-highest rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 hover:border-primary-container/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${getCategoryColor(insight.type)}`}>
                      {insight.type}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-headline text-sm font-bold text-primary-container">
                        {insight.confidence}%
                      </span>
                      <span className="material-symbols-outlined text-primary-container text-sm">
                        confidence
                      </span>
                    </div>
                  </div>

                  <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-3">
                    {insight.title}
                  </h3>

                  <p className="font-body text-on-surface-variant text-sm mb-4 leading-relaxed">
                    {insight.summary}
                  </p>

                  {/* Related Vehicles */}
                  {insight.relatedVehicles && insight.relatedVehicles.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {insight.relatedVehicles.slice(0, 3).map((vehicleId) => {
                          const vehicle = getVehicleById(vehicleId);
                          if (!vehicle) return null;
                          return (
                            <Link
                              key={vehicleId}
                              href={`/vehicle/${vehicleId}`}
                              className="inline-flex items-center gap-2 px-2 py-1 bg-surface-container-highest rounded text-[10px] hover:bg-surface-container transition-all group"
                            >
                              <Image
                                src={getBrandLogo(vehicle.brandSlug)}
                                alt={vehicle.brand}
                                width={16}
                                height={16}
                                className="w-4 h-4 object-contain"
                              />
                              <span className="font-label uppercase tracking-wider text-on-surface-variant group-hover:text-on-surface">
                                {vehicle.brand}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${getImpactColor(insight.impact)}`}>
                      {insight.impact} {language === 'tr' ? 'Etki' : 'Impact'}
                    </span>
                    <Link
                      href="/inventory"
                      className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors"
                    >
                      <span className="font-label text-[10px] uppercase tracking-widest font-bold">
                        {language === 'tr' ? 'Keşfet' : 'Explore'}
                      </span>
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vehicle Stats */}
          <div className="bg-surface-container-low rounded-xl p-8 border border-primary-container/20 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl font-bold text-on-surface uppercase">
                {language === 'tr' ? 'Araç Veri Analizi' : 'Vehicle Data Analysis'}
              </h2>
              <div className="flex items-center gap-8 text-sm text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    directions_car
                  </span>
                  <span>
                    {vehicles.length} {language === 'tr' ? 'Araç' : 'Vehicles'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container">
                    bolt
                  </span>
                  <span>
                    {electricCount} {language === 'tr' ? 'Elektrikli' : 'Electric'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container">
                    sports_score
                  </span>
                  <span>
                    {performanceCount} {language === 'tr' ? 'Performans' : 'Performance'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-surface-container-highest rounded-lg">
                <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  {language === 'tr' ? 'Ortalama Güç' : 'Avg Power'}
                </div>
                <p className="font-headline text-2xl font-bold text-primary-container">
                  {avgPower} hp
                </p>
              </div>
              <div className="p-4 bg-surface-container-highest rounded-lg">
                <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  {language === 'tr' ? 'Ortalama Hız' : 'Avg Speed'}
                </div>
                <p className="font-headline text-2xl font-bold text-secondary-container">
                  {vehicles.length > 0 ? Math.round(vehicles.reduce((sum, v) => sum + (v.acceleration || 0), 0) / vehicles.length * 10) / 10 : 0}s
                </p>
              </div>
              <div className="p-4 bg-surface-container-highest rounded-lg">
                <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  {language === 'tr' ? 'Ortalama Fiyat' : 'Avg Price'}
                </div>
                <p className="font-headline text-2xl font-bold text-primary">
                  ${avgPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-surface-container rounded-2xl p-8 border border-primary-container/20">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface uppercase mb-4">
                  {language === 'tr' ? 'Özel Analiz Oluştur' : 'Generate Custom Insight'}
                </h3>
                <p className="font-body text-on-surface-variant max-w-xl mb-6">
                  {language === 'tr'
                    ? 'Yapay zeka motorumuzu belirli araçları analiz etmek, modelleri karşılaştırmak veya piyasa trendlerini tahmin etmek için kullanın.'
                    : 'Use our AI engine to analyze specific vehicles, compare models, or predict market trends.'}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={loadAIInsights}
                    className="px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all active:scale-95"
                  >
                    {language === 'tr' ? 'Yenile' : 'Refresh'}
                  </button>
                  <Link
                    href="/compare"
                    className="px-6 py-3 bg-surface-container-low text-on-surface font-headline font-bold uppercase text-xs rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-all active:scale-95"
                  >
                    {language === 'tr' ? 'Karşılaştır' : 'Compare'}
                  </Link>
                </div>
              </div>
              <div className="w-20 h-20 rounded-full bg-primary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-container text-4xl">
                  auto_awesome
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
