'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { SideNavBar, TopNavBar } from '@/components/dashboard';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useCatalog } from '@/hooks/useCatalog';
import { getBrandLogo } from '@/lib/data/logo-service';

function InventoryContent() {
  const { language } = useLanguageTheme();
  const searchParams = useSearchParams();
  const brand = searchParams.get('brand') ?? undefined;
  const q = searchParams.get('q') ?? undefined;
  const year = searchParams.get('year') ? Number(searchParams.get('year')) : undefined;

  const { vehicles, brands, stats, isLoading, error } = useCatalog({
    brand,
    q,
    year,
    limit: 120,
  });

  const activeBrand = brand ? brands.find((item) => item.slug === brand)?.name : null;

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-4">
          {language === 'tr' ? 'Araç Envanteri' : 'Vehicle Inventory'}
        </h1>
        <p className="font-body text-on-surface-variant text-lg">
          {language === 'tr'
            ? 'Canonical katalogdan beslenen dinamik otomotiv veri kümesini keşfet.'
            : 'Explore the dynamic automotive catalog.'}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        {activeBrand && (
          <span className="px-3 py-1 bg-primary-container/10 text-primary-container rounded-full font-label text-[10px] uppercase tracking-widest">
            {activeBrand}
          </span>
        )}
        {q && (
          <span className="px-3 py-1 bg-surface-container-highest text-on-surface rounded-full font-label text-[10px] uppercase tracking-widest">
            {q}
          </span>
        )}
        {(activeBrand || q || year) && (
          <Link href="/inventory" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
            {language === 'tr' ? 'Filtreleri temizle' : 'Clear filters'}
          </Link>
        )}
      </div>

      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: language === 'tr' ? 'Kayıt' : 'Vehicles', value: vehicles.length },
          { label: language === 'tr' ? 'Marka' : 'Brands', value: stats?.totalBrands ?? 0 },
          { label: language === 'tr' ? 'Elektrikli' : 'Electric', value: stats?.electricVehicles ?? 0 },
          { label: language === 'tr' ? 'Ortalama Fiyat' : 'Avg Price', value: `$${(stats?.avgPrice ?? 0).toLocaleString()}` },
        ].map((item) => (
          <div key={item.label} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
            <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
              {item.label}
            </div>
            <div className="font-headline text-2xl font-bold text-on-surface">{item.value}</div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-8 p-4 bg-error-container/10 border border-error-container/20 rounded-xl text-error">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="bg-surface-container rounded-xl p-6 animate-pulse">
              <div className="h-40 bg-surface-container-highest rounded-lg mb-4" />
              <div className="h-4 bg-surface-container-highest rounded w-3/4 mb-2" />
              <div className="h-3 bg-surface-container-highest rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-on-surface/40 text-5xl">search_off</span>
          </div>
          <h2 className="font-headline text-2xl font-bold text-on-surface uppercase mb-4 text-center">
            {language === 'tr' ? 'Araç bulunamadı' : 'No vehicles found'}
          </h2>
          <Link
            href="/inventory"
            className="px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all"
          >
            {language === 'tr' ? 'Tüm araçları gör' : 'View all vehicles'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Link key={vehicle.id} href={`/vehicle/${vehicle.id}`} className="group">
              <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/10 hover:border-primary-container/20 transition-all duration-300 h-full flex flex-col">
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

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-1 group-hover:text-primary transition-colors">
                        {vehicle.brand}
                      </h3>
                      <p className="font-body text-on-surface-variant text-sm">
                        {vehicle.model}
                      </p>
                      <p className="font-body text-on-surface-variant/70 text-xs mt-1">
                        {vehicle.segment} · {vehicle.bodyType} · {vehicle.fuelType}
                      </p>
                    </div>
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

                  <div className="mt-auto pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                    <p className="font-headline text-xl font-bold text-primary">
                      ${vehicle.price.toLocaleString()}
                    </p>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                      Güven {vehicle.confidence}%
                    </span>
                  </div>
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
        <Suspense fallback={<div className="max-w-7xl mx-auto px-8 py-12" />}>
          <InventoryContent />
        </Suspense>
      </main>
    </>
  );
}
