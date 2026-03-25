'use client';

/**
 * AUTO PULSE — Inventory Page
 * Gerçek araç verileri ile envanter listesi
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';
import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { getVehicles, getVehicleBrands } from '@/lib/data/vehicle-service';
import { getBrandLogo } from '@/lib/data/logo-service';
import Link from 'next/link';
import Image from 'next/image';

function InventoryContent({ searchParams }: { searchParams: ReturnType<typeof useSearchParams> }) {
  const { language } = useLanguageTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [brands, setBrands] = useState<Array<{name: string; slug: string}>>([]);

  // URL params
  const brandParam = searchParams.get('brand');

  useEffect(() => {
    // Veriyi yükle
    const loadData = () => {
      setIsLoading(true);

      // Markaları yükle
      const vehicleBrands = getVehicleBrands();
      setBrands(vehicleBrands);

      // Araçları yükle (filtreli)
      const vehiclesData = getVehicles(brandParam ? { brand: brandParam } : undefined);
      setVehicles(vehiclesData);

      // Simulate loading
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    loadData();
  }, [brandParam]);

  // Aktif filtre bilgisi
  const activeFilter = useMemo(() => {
    if (brandParam) {
      const brand = getVehicleBrands().find(b => b.slug === brandParam);
      return brand?.name || '';
    }
    return '';
  }, [brandParam]);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-4">
          {language === 'tr' ? 'Araç Envanteri' : 'Vehicle Inventory'}
        </h1>
        <p className="font-body text-on-surface-variant text-lg">
          {language === 'tr'
            ? 'Otomotiv istihbarati veritabanımızı keşfedin'
            : 'Explore our comprehensive database of automotive intelligence'}
        </p>
      </div>

      {/* Aktif Filtre */}
      {activeFilter && (
        <div className="mb-6 flex items-center gap-3">
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            {language === 'tr' ? 'Filtre:' : 'Filter:'}
          </span>
          <span className="px-3 py-1 bg-primary-container/10 text-primary-container rounded-full font-label text-[10px] uppercase tracking-widest">
            {activeFilter}
          </span>
          <Link
            href="/inventory"
            className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            {language === 'tr' ? 'Temizle' : 'Clear'}
          </Link>
        </div>
      )}

      {/* İstatistik */}
      <div className="mb-8 flex items-center gap-8 text-sm text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            directions_car
          </span>
          <span>
            {vehicles.length} {language === 'tr' ? 'Araç' : 'Vehicles'}
          </span>
        </div>
      </div>

      {isLoading ? (
        // Loading State
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface-container rounded-xl p-6 animate-pulse">
              <div className="h-40 bg-surface-container-highest rounded-lg mb-4" />
              <div className="h-4 bg-surface-container-highest rounded w-3/4 mb-2" />
              <div className="h-3 bg-surface-container-highest rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-on-surface/40 text-5xl">
              search_off
            </span>
          </div>
          <h2 className="font-headline text-2xl font-bold text-on-surface uppercase mb-4 text-center">
            {language === 'tr' ? 'Araç Bulunamadı' : 'No Vehicles Found'}
          </h2>
          <p className="font-body text-on-surface-variant text-center max-w-md mb-8">
            {language === 'tr'
              ? 'Belirtilen kriterlere uygun araç bulunamadı. Lütfen filtreleri temizleyip tekrar deneyin.'
              : 'No vehicles found matching the specified criteria. Please clear filters and try again.'}
          </p>
          <Link
            href="/inventory"
            className="px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all active:scale-95"
          >
            {language === 'tr' ? 'Tüm Araçları Gör' : 'View All Vehicles'}
          </Link>
        </div>
      ) : (
        // Vehicle Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Link
              key={vehicle.id}
              href={`/vehicle/${vehicle.id}`}
              className="group"
            >
              <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/10 hover:border-primary-container/20 transition-all duration-300 h-full flex flex-col">
                {/* Vehicle Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-surface-container-highest to-surface-container flex items-center justify-center relative overflow-hidden">
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

                {/* Vehicle Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-1 group-hover:text-primary transition-colors">
                        {vehicle.brand}
                      </h3>
                      <p className="font-body text-on-surface-variant text-sm">
                        {vehicle.model}
                      </p>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-on-surface-variant/60">
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      <span className="text-xs font-label uppercase">
                        {vehicle.horsepower} hp
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant/60">
                      <span className="material-symbols-outlined text-sm">speed</span>
                      <span className="text-xs font-label uppercase">
                        {vehicle.acceleration}s
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  {vehicle.price && (
                    <div className="mt-auto pt-4 border-t border-outline-variant/10">
                      <p className="font-headline text-xl font-bold text-primary">
                        ${vehicle.price?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function InventoryPage() {
  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-surface-container rounded w-1/3" />
              <div className="h-4 bg-surface-container rounded w-1/2" />
            </div>
          </div>
        }>
          <InventoryContentWrapper />
        </Suspense>
      </main>
    </>
  );
}

function InventoryContentWrapper() {
  const searchParams = useSearchParams();
  return <InventoryContent searchParams={searchParams} />;
}
