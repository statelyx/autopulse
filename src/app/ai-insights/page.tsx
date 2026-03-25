'use client';

/**
 * AUTO PULSE — AI Insights Page
 * Yapay zeka destekli otomotiv içgörüleri
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { getVehicles, getVehicleById } from '@/lib/data/vehicle-service';
import { getBrandLogo } from '@/lib/data/logo-service';
import Link from 'next/link';
import Image from 'next/image';

export default function AIInsightsPage() {
  const { language } = useLanguageTheme();

  const vehicles = getVehicles();

  // Gerçek araç verilerine dayalı insights
  const insights = [
    {
      id: 1,
      title: language === 'tr' ? 'Elektrikli Araç Pazarı Dönüşümü' : 'Electric Vehicle Market Shift',
      category: language === 'tr' ? 'Pazar Trendi' : 'Market Trend',
      confidence: 94,
      summary: language === 'tr'
        ? 'EV benimse oranları 2026 Q1\'de %23 artışla premium segment öncülük ediyor. Tesla Model S Plaid ve Porsche Taycan lider.'
        : 'EV adoption accelerated 23% in Q1 2026, with premium segment leading growth. Tesla Model S Plaid and Porsche Taycan leading.',
      vehicles: ['tesla-model-s-plaid-2024', 'porsche-taycan-2024'],
      impact: 'high',
    },
    {
      id: 2,
      title: language === 'tr' ? 'Hibrit Şanzıman Güvenilirliği' : 'Hybrid Powertrain Reliability',
      category: language === 'tr' ? 'Teknik Analiz' : 'Technical Analysis',
      confidence: 87,
      summary: language === 'tr'
        ? 'Termal yönetim sistemleri ile pil degradasyon oranları %15 iyileşti. Chevrolet Corvette E-Ray ve Toyota RAV4 Hybrid gösteriyor.'
        : 'Battery degradation rates improved by 15% with new thermal management systems. Chevrolet Corvette E-Ray and Toyota RAV4 Hybrid demonstrating.',
      vehicles: ['chevrolet-corvette-2024', 'toyota-rav4-2024'],
      impact: 'medium',
    },
    {
      id: 3,
      title: language === 'tr' ? 'Lüks Segment Değerlemesi' : 'Luxury Segment Valuation',
      category: language === 'tr' ? 'Fiyat Tahmini' : 'Price Forecast',
      confidence: 91,
      summary: language === 'tr'
        ? 'Klasik modeller %12 değer artışı gösteriyor, özellikle 1990\'lar Japon spor arabaları. Nissan GT-R ve Honda Civic Type R yatırım potansiyeli.'
        : 'Classic models showing 12% appreciation, particularly 1990s Japanese sports cars. Nissan GT-R and Honda Civic Type R showing investment potential.',
      vehicles: ['nissan-gtr-2024', 'honda-civic-2024'],
      impact: 'high',
    },
    {
      id: 4,
      title: language === 'tr' ? 'Performans Segment Rekabeti' : 'Performance Segment Competition',
      category: language === 'tr' ? 'Pazar Analizi' : 'Market Analysis',
      confidence: 88,
      summary: language === 'tr'
        ? 'Porsche 911 vs BMW M3 karşılaştırmasında Porsche fiyat performans oranında önde. Ferrari F8 ve Lamborghini Huracan ultra-lüks segmentte.'
        : 'Porsche 911 vs BMW M3 comparison shows Porsche leading in price-performance ratio. Ferrari F8 and Lamborghini Huracan dominating ultra-luxury segment.',
      vehicles: ['porsche-911-2024', 'bmw-m3-2024', 'ferrari-f8-2024', 'lamborghini-huracan-2024'],
      impact: 'high',
    },
    {
      id: 5,
      title: language === 'tr' ? 'Süper SUV Trendi' : 'Super SUV Trend',
      category: language === 'tr' ? 'Büyüme Analizi' : 'Growth Analysis',
      confidence: 92,
      summary: language === 'tr'
        ? 'Lamborghini Urus, Porsche Cayenne ve Audi e-tron GT segmenti domine ediyor. Ferrari Purosangue ve Aston Martin DBX katılıyor.'
        : 'Lamborghini Urus, Porsche Cayenne and Audi e-tron GT dominating segment. Ferrari Purosangue and Aston Martin DBX entering.',
      vehicles: ['lamborghini-huracan-2024', 'audi-etron-gt-2024'],
      impact: 'medium',
    },
  ];

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

          {/* Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 hover:border-primary-container/20 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {insight.category}
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
                {insight.vehicles && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {insight.vehicles.map((vehicleId) => {
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
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    insight.impact === 'high' ? 'text-error' : 'text-secondary-container'
                  }`}>
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
                    {vehicles.filter(v => v.fuelType === 'Electric').length} {language === 'tr' ? 'Elektrikli' : 'Electric'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container">
                    sports_score
                  </span>
                  <span>
                    {vehicles.filter(v => v.horsepower && v.horsepower > 500).length} {language === 'tr' ? 'Performans' : 'Performance'}
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
                  {Math.round(vehicles.reduce((sum, v) => sum + (v.horsepower || 0), 0) / vehicles.length)} hp
                </p>
              </div>
              <div className="p-4 bg-surface-container-highest rounded-lg">
                <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  {language === 'tr' ? 'Ortalama Hız' : 'Avg Speed'}
                </div>
                <p className="font-headline text-2xl font-bold text-secondary-container">
                  {Math.round(vehicles.reduce((sum, v) => sum + (v.acceleration || 0), 0) / vehicles.length * 10) / 10}s
                </p>
              </div>
              <div className="p-4 bg-surface-container-highest rounded-lg">
                <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  {language === 'tr' ? 'Ortalama Fiyat' : 'Avg Price'}
                </div>
                <p className="font-headline text-2xl font-bold text-primary">
                  ${Math.round(vehicles.reduce((sum, v) => sum + (v.price || 0), 0) / vehicles.length).toLocaleString()}
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
                  <Link
                    href="/inventory"
                    className="px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all active:scale-95"
                  >
                    {language === 'tr' ? 'Yeni Analiz' : 'New Analysis'}
                  </Link>
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
