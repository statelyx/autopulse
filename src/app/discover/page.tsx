'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { SideNavBar, TopNavBar } from '@/components/dashboard';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useCatalog } from '@/hooks/useCatalog';
import { getBrandLogo } from '@/lib/data/logo-service';
import { useTranslation } from '@/lib/i18n/translations';

export default function ExplorePage() {
  const { language } = useLanguageTheme();
  const { t } = useTranslation(language);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { brands, stats, isLoading } = useCatalog({ limit: 80 });

  const allBrands = useMemo(() => (
    brands.map((brand) => ({
      ...brand,
      logoPath: getBrandLogo(brand.slug),
    }))
  ), [brands]);

  const categories = [
    { id: 'all', name: language === 'tr' ? 'Tüm Markalar' : 'All Brands', icon: 'grid_view' },
    { id: 'premium', name: language === 'tr' ? 'Premium' : 'Premium', icon: 'diamond' },
    { id: 'electric', name: language === 'tr' ? 'Elektrikli' : 'Electric', icon: 'electric_car' },
    { id: 'performance', name: language === 'tr' ? 'Performans' : 'Performance', icon: 'sports_score' },
    { id: 'suv', name: 'SUV', icon: 'directions_car' },
  ];

  const filteredBrands = useMemo(() => {
    if (selectedCategory === 'all') return allBrands;

    return allBrands.filter((brand) => {
      const segment = brand.segment.toLowerCase();
      const models = brand.models.join(' ').toLowerCase();

      switch (selectedCategory) {
        case 'premium':
          return /premium|lüks|ultra|gran turismo|performans/.test(segment);
        case 'electric':
          return /elektrik/.test(segment) || /(ev|eq|e-tron|ioniq|taycan|model)/.test(models);
        case 'performance':
          return /performans|süper|hyper/.test(segment);
        case 'suv':
          return /(suv|x[1-9]\b|q[2-9]\b|cayenne|macan|rav4|defender|range rover)/.test(models);
        default:
          return true;
      }
    });
  }, [allBrands, selectedCategory]);

  const skeletonBrands = Array.from({ length: 18 }, (_, index) => ({ id: `brand-${index}` }));

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
                <span className="material-symbols-outlined text-sm">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          <div className="mb-8 bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <div>
                  <div className="font-headline text-2xl font-bold text-on-surface">
                    {isLoading ? '...' : filteredBrands.length}
                  </div>
                  <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {language === 'tr' ? 'Marka' : 'Brands'}
                  </div>
                </div>
                <div className="h-12 w-px bg-outline-variant/20" />
                <div>
                  <div className="font-headline text-2xl font-bold text-on-surface">
                    {isLoading ? '...' : filteredBrands.reduce((sum, brand) => sum + brand.models.length, 0)}
                  </div>
                  <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {language === 'tr' ? 'Model' : 'Models'}
                  </div>
                </div>
              </div>
              <div className="text-sm text-on-surface-variant">
                {stats?.electricVehicles ?? 0} {language === 'tr' ? 'elektrikli kayıt' : 'electric entries'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {(isLoading ? skeletonBrands : filteredBrands).map((brand) => (
              <div key={'slug' in brand ? brand.slug : brand.id}>
                {'slug' in brand ? (
                  <Link href={`/inventory?brand=${brand.slug}`} className="group">
                    <div className="h-36 bg-surface-container rounded-xl flex flex-col items-center justify-center border border-outline-variant/5 group-hover:bg-surface-container-high group-hover:border-primary-container/20 transition-all duration-300 relative overflow-hidden p-4">
                      <div className="absolute inset-0 bg-primary-container/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Image
                        src={brand.logoPath}
                        alt={brand.name}
                        width={64}
                        height={64}
                        className="relative z-10 w-16 h-16 object-contain group-hover:scale-110 transition-transform"
                      />
                      <p className="text-center font-label text-[10px] uppercase tracking-widest text-on-surface group-hover:text-primary transition-colors z-10 mt-3">
                        {brand.name}
                      </p>
                    </div>
                    <div className="mt-2 text-center">
                      <p className="font-body text-[10px] text-on-surface-variant/60">
                        {brand.models.length} {language === 'tr' ? 'model' : 'models'}
                      </p>
                      <p className="font-body text-[10px] text-on-surface-variant/50">
                        {brand.segment}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="animate-pulse">
                    <div className="h-36 bg-surface-container rounded-xl" />
                    <div className="h-3 bg-surface-container mt-2 rounded" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
