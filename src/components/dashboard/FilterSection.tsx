'use client';

/**
 * AUTO PULSE — FilterSection Component
 * Filter panel with manufacturer, model, and year range
 * Real vehicle data from vehiclesdata.txt
 */

import { useState, useEffect } from 'react';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useTranslation } from '@/lib/i18n/translations';
import { getVehicleBrands, getModelsByBrandSlug } from '@/lib/data/vehicle-service';

export function FilterSection() {
  const { language } = useLanguageTheme();
  const { t } = useTranslation(language);
  const [yearRange, setYearRange] = useState([1990, 2026]);
  const [brands, setBrands] = useState<Array<{name: string; slug: string}>>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    // Marka verisini yükle
    const vehicleBrands = getVehicleBrands();
    setBrands(vehicleBrands);
  }, []);

  // Marka seçildiğinde modelleri güncelle
  useEffect(() => {
    if (selectedBrand) {
      const brandModels = getModelsByBrandSlug(selectedBrand);
      setModels(brandModels);
    } else {
      setModels([]);
    }
  }, [selectedBrand]);

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
            className="w-full bg-surface-container-lowest border-none text-on-surface rounded-lg py-3 px-4 font-body text-sm focus:ring-1 focus:ring-primary-container"
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

        {/* Year Range */}
        <div className="lg:col-span-2 space-y-4 px-2">
          <div className="flex justify-between items-center">
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              {t('filterEpoch')}
            </label>
            <span className="text-primary text-xs font-headline font-bold tracking-widest">
              {yearRange[0]} — {yearRange[1]}
            </span>
          </div>
          <div className="relative w-full">
            <input
              className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container"
              min="1990"
              max="2026"
              type="range"
              value={yearRange[1]}
              onChange={(e) => setYearRange([1990, parseInt(e.target.value)])}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
