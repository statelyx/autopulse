'use client';

/**
 * AUTO PULSE — QuickAccessGrid Component
 * Market Clusters grid with real brand data from vehiclesdata.txt
 */

import { useState, useEffect } from 'react';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useTranslation } from '@/lib/i18n/translations';
import { getVehicleBrands } from '@/lib/data/vehicle-service';
import { getBrandLogo } from '@/lib/data/logo-service';
import Link from 'next/link';
import Image from 'next/image';

export function QuickAccessGrid() {
  const { language } = useLanguageTheme();
  const { t } = useTranslation(language);
  const [displayBrands, setDisplayBrands] = useState<Array<{name: string; slug: string; logoPath: string}>>([]);

  useEffect(() => {
    // İlk 18 markayı göster
    const allBrands = getVehicleBrands();
    const brandsWithLogos = allBrands.slice(0, 18).map(brand => ({
      ...brand,
      logoPath: getBrandLogo(brand.slug),
    }));
    setDisplayBrands(brandsWithLogos);
  }, []);

  return (
    <div className="mt-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-headline text-2xl font-bold uppercase tracking-tighter">
          {t('sectionMarketClusters')}
        </h2>
        <Link
          href="/explore"
          className="text-secondary-fixed-dim font-label text-[10px] uppercase tracking-widest hover:underline underline-offset-8 transition-all"
        >
          {t('sectionExpandTaxonomy')}
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {displayBrands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/inventory?brand=${brand.slug}`}
            className="group"
          >
            <div className="h-24 bg-surface-container rounded-xl flex items-center justify-center border border-outline-variant/5 group-hover:bg-surface-container-high group-hover:border-primary-container/20 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-primary-container/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              {/* Brand Logo */}
              <Image
                src={brand.logoPath}
                alt={brand.name}
                width={48}
                height={48}
                className="relative z-10 w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                onError={(e) => {
                  // Fallback to icon if logo fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const icon = target.parentElement?.querySelector('.material-symbols-outlined');
                  if (icon) (icon as HTMLElement).style.display = 'block';
                }}
              />
              <span
                className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors hidden"
                data-icon="directions_car"
              >
                directions_car
              </span>
            </div>
            <p className="text-center font-label text-[10px] uppercase tracking-widest mt-3 text-on-surface-variant group-hover:text-on-surface transition-colors">
              {brand.name}
            </p>
          </Link>
        ))}
      </div>

      {/* İstatistik */}
      <div className="mt-8 flex items-center justify-center gap-8 text-sm text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            directions_car
          </span>
          <span>
            {getVehicleBrands().length} {language === 'tr' ? 'Marka' : 'Brands'}
          </span>
        </div>
        <div className="w-px h-4 bg-outline-variant/20" />
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-container">
            category
          </span>
          <span>
            {getVehicleBrands().reduce((sum, b) => sum + b.models.length, 0)} {language === 'tr' ? 'Model' : 'Models'}
          </span>
        </div>
      </div>
    </div>
  );
}
