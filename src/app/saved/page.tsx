'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import { SideNavBar, TopNavBar } from '@/components/dashboard';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useCatalog } from '@/hooks/useCatalog';
import { useSavedVehicles } from '@/hooks/useLocalStorage';
import type { CatalogVehicle } from '@/lib/data/catalog';
import { getBrandLogo } from '@/lib/data/logo-service';

export default function SavedPage() {
  const { language } = useLanguageTheme();
  const [savedVehicles, setSavedVehicles] = useSavedVehicles();
  const { vehicles: catalogVehicles, isLoading } = useCatalog({ limit: 180 });

  const vehicles = useMemo(
    () => savedVehicles
      .map((id) => catalogVehicles.find((vehicle) => vehicle.id === id))
      .filter((vehicle): vehicle is CatalogVehicle => Boolean(vehicle)),
    [catalogVehicles, savedVehicles],
  );

  const handleRemove = (vehicleId: string) => {
    setSavedVehicles(savedVehicles.filter((id) => id !== vehicleId));
  };

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-2">
                {language === 'tr' ? 'Kaydedilen Araçlar' : 'Saved Vehicles'}
              </h1>
              <p className="font-body text-on-surface-variant text-lg">
                {language === 'tr'
                  ? 'Dinamik katalogdan seçtiğin araçlar burada toplanır.'
                  : 'Your saved vehicles are listed here.'}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`saved-skeleton-${index}`} className="bg-surface-container rounded-xl p-6 animate-pulse">
                  <div className="h-40 bg-surface-container-highest rounded-lg mb-4" />
                  <div className="h-4 bg-surface-container-highest rounded w-3/4 mb-2" />
                  <div className="h-3 bg-surface-container-highest rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-on-surface/40 text-5xl">bookmark</span>
              </div>
              <h2 className="font-headline text-2xl font-bold text-on-surface uppercase mb-4 text-center">
                {language === 'tr' ? 'Henüz kayıt yok' : 'No saved vehicles yet'}
              </h2>
              <Link
                href="/inventory"
                className="px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all"
              >
                {language === 'tr' ? 'Envantere git' : 'Go to inventory'}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10 hover:border-primary-container/20 transition-all group"
                >
                  <div className="h-40 bg-surface-container-highest flex items-center justify-center relative">
                    <Image
                      src={getBrandLogo(vehicle.brandSlug)}
                      alt={vehicle.brand}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain opacity-20 group-hover:opacity-40 transition-opacity"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-surface-container-lowest rounded-full font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                      {vehicle.year}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-1 group-hover:text-primary transition-colors">
                          {vehicle.brand}
                        </h3>
                        <p className="font-body text-sm text-on-surface-variant">{vehicle.model}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(vehicle.id)}
                        className="p-2 hover:bg-surface-container-highest rounded-lg transition-colors"
                        title={language === 'tr' ? 'Kaldır' : 'Remove'}
                      >
                        <span className="material-symbols-outlined text-error">bookmark_remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center gap-2 text-on-surface-variant/60">
                        <span className="material-symbols-outlined text-sm">bolt</span>
                        <span className="text-xs font-label uppercase">{vehicle.horsepower} hp</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant/60">
                        <span className="material-symbols-outlined text-sm">speed</span>
                        <span className="text-xs font-label uppercase">{vehicle.acceleration}s</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                      <Link
                        href={`/vehicle/${vehicle.id}`}
                        className="px-3 py-1 bg-surface-container-highest rounded text-[10px] font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container transition-all"
                      >
                        {language === 'tr' ? 'Detay' : 'Details'}
                      </Link>
                      <Link
                        href={`/compare?add=${vehicle.id}`}
                        className="px-3 py-1 bg-primary-container/10 rounded text-[10px] font-bold uppercase tracking-widest text-primary-container hover:bg-primary-container/20 transition-all"
                      >
                        {language === 'tr' ? 'Karşılaştır' : 'Compare'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
