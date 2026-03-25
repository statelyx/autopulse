'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useTranslation } from '@/lib/i18n/translations';
import { getBrandLogo } from '@/lib/data/logo-service';
import { useCatalog } from '@/hooks/useCatalog';

export function QuickAccessGrid() {
  const { language } = useLanguageTheme();
  const { t } = useTranslation(language);
  const { brands, stats, isLoading } = useCatalog({ limit: 18 });

  const displayBrands = brands.slice(0, 18).map((brand) => ({
    ...brand,
    logoPath: getBrandLogo(brand.slug),
  }));
  const skeletonBrands = Array.from({ length: 12 }, (_, index) => ({ id: `brand-skeleton-${index}` }));

  return (
    <div className="mt-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-headline text-2xl font-bold uppercase tracking-tighter">
          {t('sectionMarketClusters')}
        </h2>
        <Link
          href="/discover"
          className="text-secondary-fixed-dim font-label text-[10px] uppercase tracking-widest hover:underline underline-offset-8 transition-all"
        >
          {t('sectionExpandTaxonomy')}
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {(isLoading ? skeletonBrands : displayBrands).map((brand) => (
          <div key={'slug' in brand ? brand.slug : brand.id}>
            {'slug' in brand ? (
              <Link href={`/inventory?brand=${brand.slug}`} className="group">
                <div className="h-24 bg-surface-container rounded-xl flex items-center justify-center border border-outline-variant/5 group-hover:bg-surface-container-high group-hover:border-primary-container/20 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary-container/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Image
                    src={brand.logoPath}
                    alt={brand.name}
                    width={48}
                    height={48}
                    className="relative z-10 w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <p className="text-center font-label text-[10px] uppercase tracking-widest mt-3 text-on-surface-variant group-hover:text-on-surface transition-colors">
                  {brand.name}
                </p>
              </Link>
            ) : (
              <div className="animate-pulse">
                <div className="h-24 bg-surface-container rounded-xl" />
                <div className="h-3 bg-surface-container mt-3 rounded" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-8 text-sm text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">directions_car</span>
          <span>{stats?.totalBrands ?? 0} {language === 'tr' ? 'Marka' : 'Brands'}</span>
        </div>
        <div className="w-px h-4 bg-outline-variant/20" />
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-container">category</span>
          <span>{stats?.totalModels ?? 0} {language === 'tr' ? 'Model' : 'Models'}</span>
        </div>
      </div>
    </div>
  );
}
