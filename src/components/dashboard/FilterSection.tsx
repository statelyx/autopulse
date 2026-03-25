'use client';

/**
 * AUTO PULSE — FilterSection Component
 * Filter panel with manufacturer, model, and year range
 * Real vehicle data from vehiclesdata.txt
 */

import { useState, useEffect, useMemo } from 'react';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useTranslation } from '@/lib/i18n/translations';
import { getVehicleBrands, getModelsByBrandSlug, getProductionYears } from '@/lib/data/vehicle-service';

export interface FilterState {
  brand: string;
  model: string;
  year: string;
}

export function FilterSection() {
  const { language } = useLanguageTheme();
  const { t } = useTranslation(language);

  // Filter state
  const [brands, setBrands] = useState<Array<{name: string; slug: string}>>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  // Üretim yılları (1990-2026)
  const productionYears = useMemo(() => getProductionYears(), []);

  // Filter state objesi - diğer bileşenlere taşımak için
  const filterState: FilterState = useMemo(() => ({
    brand: selectedBrand,
    model: selectedModel,
    year: selectedYear,
  }), [selectedBrand, selectedModel, selectedYear]);

  useEffect(() => {
    // Marka verisini yükle
    const vehicleBrands = getVehicleBrands();
    setBrands(vehicleBrands);
  }, []);

  // Marka seçildiğinde modelleri güncelle ve model seçimini sıfırla
  useEffect(() => {
    if (selectedBrand) {
      const brandModels = getModelsByBrandSlug(selectedBrand);
      setModels(brandModels);
      setSelectedModel(''); // Model seçimini sıfırla
      setSelectedYear(''); // Yıl seçimini sıfırla
    } else {
      setModels([]);
      setSelectedModel('');
      setSelectedYear('');
    }
  }, [selectedBrand]);

  // Model seçildiğinde yıl seçimini sıfırla
  useEffect(() => {
    if (selectedModel) {
      setSelectedYear('');
    }
  }, [selectedModel]);

  return (
    <section className="max-w-7xl mx-auto px-8 -mt-16 relative z-30 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-8 bg-surface-container-low/80 backdrop-blur-3xl rounded-2xl border border-outline-variant/10 shadow-2xl">
        {/* Manufacturer Select */}
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant px-1">
            {t('filterManufacturer')}
          </label>
          <select
            className="w-full bg-surface-container-lowest border-none text-on-surface rounded-lg py-3 px-4 font-body text-sm focus:ring-1 focus:ring-primary-container"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">{language === 'tr' ? 'Marka Seç' : 'Select Make'}</option>
            {brands.map((brand) => (
              <option key={brand.slug} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Model Select */}
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant px-1">
            {t('filterDesignation')}
          </label>
          <select
            className="w-full bg-surface-container-lowest border-none text-on-surface rounded-lg py-3 px-4 font-body text-sm focus:ring-1 focus:ring-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand}
          >
            <option value="">
              {selectedBrand
                ? language === 'tr' ? 'Model Seç' : 'Select Model'
                : language === 'tr'
                ? 'Önce Marka Seç'
                : 'Select Make First'}
            </option>
            {models.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Year Select */}
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant px-1">
            {t('filterEpoch')}
          </label>
          <select
            className="w-full bg-surface-container-lowest border-none text-on-surface rounded-lg py-3 px-4 font-body text-sm focus:ring-1 focus:ring-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={!selectedModel}
          >
            <option value="">
              {selectedModel
                ? language === 'tr' ? 'Yıl Seç' : 'Select Year'
                : selectedBrand
                ? language === 'tr'
                  ? 'Önce Model Seç'
                  : 'Select Model First'
                : language === 'tr'
                ? 'Önce Marka Seç'
                : 'Select Make First'}
            </option>
            {productionYears.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button / Action */}
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant px-1 opacity-0">
            Action
          </label>
          <button
            className="w-full bg-primary-container text-on-primary-container font-headline font-bold uppercase text-xs rounded-lg py-3 px-4 hover:bg-primary-container/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            disabled={!selectedYear}
          >
            {language === 'tr' ? 'ARA' : 'SEARCH'}
          </button>
        </div>
      </div>
    </section>
  );
}
