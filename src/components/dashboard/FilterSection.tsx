'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useTranslation } from '@/lib/i18n/translations';
import { useCatalog } from '@/hooks/useCatalog';

export function FilterSection() {
  const { language } = useLanguageTheme();
  const { t } = useTranslation(language);
  const router = useRouter();
  const { brands } = useCatalog({ limit: 12 });

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const productionYears = useMemo(
    () => Array.from({ length: 8 }, (_, index) => 2026 - index),
    [],
  );

  const models = useMemo(() => {
    return brands.find((brand) => brand.slug === selectedBrand)?.models ?? [];
  }, [brands, selectedBrand]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedModel) params.set('model', selectedModel);
    if (selectedYear) params.set('year', selectedYear);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-8 -mt-16 relative z-30 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-8 bg-surface-container-low/80 backdrop-blur-3xl rounded-2xl border border-outline-variant/10 shadow-2xl">
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant px-1">
            {t('filterManufacturer')}
          </label>
          <select
            className="w-full bg-surface-container-lowest border-none text-on-surface rounded-lg py-3 px-4 font-body text-sm focus:ring-1 focus:ring-primary-container"
            value={selectedBrand}
            onChange={(event) => {
              setSelectedBrand(event.target.value);
              setSelectedModel('');
              setSelectedYear('');
            }}
          >
            <option value="">{language === 'tr' ? 'Marka seç' : 'Select make'}</option>
            {brands.map((brand) => (
              <option key={brand.slug} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant px-1">
            {t('filterDesignation')}
          </label>
          <select
            className="w-full bg-surface-container-lowest border-none text-on-surface rounded-lg py-3 px-4 font-body text-sm focus:ring-1 focus:ring-primary-container disabled:opacity-50 disabled:cursor-not-allowed"
            value={selectedModel}
            onChange={(event) => {
              setSelectedModel(event.target.value);
              setSelectedYear('');
            }}
            disabled={!selectedBrand}
          >
            <option value="">
              {selectedBrand
                ? language === 'tr' ? 'Model seç' : 'Select model'
                : language === 'tr' ? 'Önce marka seç' : 'Select make first'}
            </option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant px-1">
            {t('filterEpoch')}
          </label>
          <select
            className="w-full bg-surface-container-lowest border-none text-on-surface rounded-lg py-3 px-4 font-body text-sm focus:ring-1 focus:ring-primary-container disabled:opacity-50 disabled:cursor-not-allowed"
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            disabled={!selectedModel}
          >
            <option value="">
              {selectedModel
                ? language === 'tr' ? 'Yıl seç' : 'Select year'
                : language === 'tr' ? 'Önce model seç' : 'Select model first'}
            </option>
            {productionYears.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant px-1 opacity-0">
            Action
          </label>
          <button
            onClick={handleSearch}
            className="w-full bg-primary-container text-on-primary-container font-headline font-bold uppercase text-xs rounded-lg py-3 px-4 hover:bg-primary-container/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            disabled={!selectedBrand}
          >
            {language === 'tr' ? 'Analiz et' : 'Analyze'}
          </button>
        </div>
      </div>
    </section>
  );
}
