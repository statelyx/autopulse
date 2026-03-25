'use client';

/**
 * AUTO PULSE — Explore Page
 * Interactive brand and model exploration with real vehicle data from vehiclesdata.txt
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useTranslation } from '@/lib/i18n/translations';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { getVehicleBrands } from '@/lib/data/vehicle-service';

export default function ExplorePage() {
  const { language } = useLanguageTheme();
  const { t } = useTranslation(language);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Gerçek marka verisini yükle
  const allBrands = useMemo(() => getVehicleBrands(), []);

  const categories = [
    { id: 'all', name: language === 'tr' ? 'Tüm Markalar' : 'All Brands', icon: 'grid_view' },
    { id: 'performance', name: language === 'tr' ? 'Performans' : 'Performance', icon: 'sports_score' },
    { id: 'electric', name: language === 'tr' ? 'Elektrikli' : 'Electric', icon: 'electric_car' },
    { id: 'luxury', name: language === 'tr' ? 'Lüks' : 'Luxury', icon: 'diamond' },
    { id: 'suv', name: 'SUV', icon: 'directions_car' },
  ];

  // Kategori bazlı filtreleme (basit mantık - marka ismine göre)
  const filteredBrands = selectedCategory === 'all'
    ? allBrands
    : allBrands.filter(brand => {
        const name = brand.name.toLowerCase();
        // Basit kategorizasyon (gerçek uygulamada daha gelişmiş olabilir)
        switch (selectedCategory) {
          case 'performance':
            return ['porsche', 'ferrari', 'lamborghini', 'mclaren', 'audi', 'bmw'].some(p => name.includes(p));
          case 'electric':
            return ['tesla', 'rivian', 'polestar', 'lucid', 'nio', 'xpeng'].some(p => name.includes(p));
          case 'luxury':
            return ['bmw', 'mercedes', 'audi', 'lexus', 'range rover', 'jaguar'].some(p => name.includes(p));
          case 'suv':
            return ['range rover', 'porsche', 'bmw', 'mercedes', 'audi', 'lexus'].some(p => name.includes(p));
          default:
            return true;
        }
      });

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-4">
              {t('exploreTitle')}
            </h1>
            <p className="font-body text-on-surface-variant text-lg">
              {t('exploreSubtitle')}
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-headline font-bold uppercase text-xs transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary-container text-on-primary-fixed'
                    : 'bg-surface-container text-on-surface/60 hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {category.icon}
                </span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mb-8 bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div>
                  <div className="font-headline text-2xl font-bold text-on-surface">
                    {filteredBrands.length}
                  </div>
                  <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {language === 'tr' ? 'Marka' : 'Brands'}
                  </div>
                </div>
                <div className="h-12 w-px bg-outline-variant/20" />
                <div>
                  <div className="font-headline text-2xl font-bold text-on-surface">
                    {filteredBrands.reduce((sum, b) => sum + b.models.length, 0)}
                  </div>
                  <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {language === 'tr' ? 'Model' : 'Models'}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-surface-container-highest rounded-lg font-label text-[10px] uppercase tracking-widest text-on-surface hover:bg-surface-container transition-all">
                  {t('exploreSortAZ')}
                </button>
                <button className="px-4 py-2 bg-surface-container-highest rounded-lg font-label text-[10px] uppercase tracking-widest text-on-surface hover:bg-surface-container transition-all">
                  {t('exploreFilter')}
                </button>
              </div>
            </div>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredBrands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/inventory?brand=${brand.slug}`}
                className="group"
              >
                <div className="h-32 bg-surface-container rounded-xl flex flex-col items-center justify-center border border-outline-variant/5 group-hover:bg-surface-container-high group-hover:border-primary-container/20 transition-all duration-300 relative overflow-hidden p-4">
                  <div className="absolute inset-0 bg-primary-container/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors z-10">
                    directions_car
                  </span>
                  <p className="text-center font-label text-[10px] uppercase tracking-widest text-on-surface group-hover:text-primary transition-colors z-10 mt-2">
                    {brand.name}
                  </p>
                </div>
                <div className="mt-2 text-center">
                  <p className="font-body text-[10px] text-on-surface-variant/60">
                    {brand.models.length} {language === 'tr' ? 'model' : 'models'}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-surface-container-low text-on-surface font-headline font-bold uppercase text-xs rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-all active:scale-95">
              {t('exploreLoadMore')}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
