'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { SideNavBar, TopNavBar } from '@/components/dashboard';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useCatalog } from '@/hooks/useCatalog';
import { useCompareVehicles } from '@/hooks/useLocalStorage';
import { getBrandLogo } from '@/lib/data/logo-service';
import { formatTryPrice } from '@/lib/formatters/currency';

function CompareContent() {
  const { language } = useLanguageTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [compareVehicleIds, setCompareVehicleIds] = useCompareVehicles();
  const { vehicles: catalogVehicles } = useCatalog({ limit: 180 });
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    const addVehicleId = searchParams.get('add');
    if (addVehicleId && !compareVehicleIds.includes(addVehicleId)) {
      setCompareVehicleIds([...compareVehicleIds, addVehicleId].slice(0, 3));
    }
  }, [compareVehicleIds, searchParams, setCompareVehicleIds]);

  const slots = useMemo(() => {
    const selected = compareVehicleIds
      .slice(0, 3)
      .map((id) => catalogVehicles.find((vehicle) => vehicle.id === id) ?? null);

    while (selected.length < 3) selected.push(null);
    return selected;
  }, [catalogVehicles, compareVehicleIds]);

  const filledSlots = slots.filter(Boolean);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSummary() {
      if (filledSlots.length < 2) {
        setSummary(null);
        return;
      }

      try {
        const response = await fetch('/api/ai/summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: 'Araç karşılaştırma özeti',
            vehicleIds: filledSlots.map((vehicle) => vehicle!.id),
          }),
          signal: controller.signal,
        });

        if (!response.ok) return;
        const data = await response.json();
        setSummary(data.summary ?? null);
      } catch {
        setSummary(null);
      }
    }

    loadSummary();
    return () => controller.abort();
  }, [filledSlots]);

  const removeVehicle = (slotIndex: number) => {
    setCompareVehicleIds(compareVehicleIds.filter((_, index) => index !== slotIndex));
  };

  const clearAll = () => setCompareVehicleIds([]);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-2">
            {language === 'tr' ? 'Araç Karşılaştırma' : 'Compare Vehicles'}
          </h1>
          <p className="font-body text-on-surface-variant text-lg">
            {language === 'tr'
              ? 'Dinamik katalog üzerinden yan yana teknik ve AI özeti.'
              : 'Dynamic side-by-side comparison.'}
          </p>
        </div>
        {filledSlots.length > 0 && (
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-surface-container-low text-on-surface font-headline font-bold uppercase text-xs rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-all"
          >
            {language === 'tr' ? 'Tümünü temizle' : 'Clear all'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {slots.map((vehicle, index) => (
          <div
            key={vehicle ? vehicle.id : `slot-${index}`}
            className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10 hover:border-primary-container/20 transition-all"
          >
            {vehicle ? (
              <div className="h-full flex flex-col">
                <div className="h-48 bg-surface-container-highest flex items-center justify-center relative">
                  <Image
                    src={getBrandLogo(vehicle.brandSlug)}
                    alt={vehicle.brand}
                    width={128}
                    height={128}
                    className="w-32 h-32 object-contain opacity-30"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-9xl text-on-surface/10">directions_car</span>
                  </div>
                  <button
                    onClick={() => removeVehicle(index)}
                    className="absolute top-4 right-4 p-2 hover:bg-surface-container rounded-lg transition-colors"
                    title={language === 'tr' ? 'Kaldır' : 'Remove'}
                  >
                    <span className="material-symbols-outlined text-error">close</span>
                  </button>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-1">
                      {vehicle.brand}
                    </h3>
                    <p className="font-body text-sm text-on-surface-variant">{vehicle.model}</p>
                    <p className="font-body text-xs text-on-surface-variant/60 mt-1">{vehicle.year}</p>
                  </div>

                  <div className="space-y-2 flex-1">
                    {[
                      { label: language === 'tr' ? 'Güç' : 'Power', value: `${vehicle.horsepower} hp` },
                      { label: '0-100', value: `${vehicle.acceleration}s` },
                      { label: language === 'tr' ? 'Yakıt' : 'Fuel', value: vehicle.fuelType },
                      { label: language === 'tr' ? 'Fiyat' : 'Price', value: formatTryPrice(vehicle.price) },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">{item.label}</span>
                        <span className="font-headline font-bold text-on-surface">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-outline-variant/10">
                    <Link href={`/vehicle/${vehicle.id}`} className="text-xs font-label uppercase tracking-widest text-primary hover:underline">
                      {language === 'tr' ? 'Detayları gör' : 'View details'}
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[500px] flex items-center justify-center">
                <Link href="/inventory" className="text-center group">
                  <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center mx-auto mb-4 hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors">add</span>
                  </div>
                  <p className="font-headline text-sm font-bold text-on-surface uppercase mb-2">
                    {language === 'tr' ? 'Araç ekle' : 'Add vehicle'}
                  </p>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {filledSlots.length >= 2 && (
        <div className="bg-surface-container-low rounded-xl p-8 border border-primary-container/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl font-bold text-on-surface uppercase">
              {language === 'tr' ? 'Karşılaştırma sonucu' : 'Comparison result'}
            </h2>
            <span className="px-3 py-1 bg-primary-container/10 text-primary-container rounded-full font-label text-[10px] uppercase tracking-widest font-bold">
              {filledSlots.length} {language === 'tr' ? 'araç' : 'vehicles'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-surface-container-highest rounded-lg">
              <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                AI özeti
              </div>
              <p className="font-body text-sm text-on-surface">
                {summary ?? 'Karşılaştırma özeti hazırlanıyor.'}
              </p>
            </div>
            <div className="p-4 bg-surface-container-highest rounded-lg">
              <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                Fiyat farkı
              </div>
              <p className="font-headline text-lg font-bold text-primary-container">
                {formatTryPrice(Math.abs((filledSlots[0]?.price ?? 0) - (filledSlots[1]?.price ?? 0)))}
              </p>
            </div>
            <div className="p-4 bg-surface-container-highest rounded-lg">
              <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                Öneri
              </div>
              <p className="font-body text-sm text-on-surface">
                {filledSlots.length === 3
                  ? 'Üçlü karşılaştırma tam analiz için hazır.'
                  : 'Daha iyi kıyas için üçüncü aracı ekle.'}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => router.push('/ai-insights')}
              className="flex-1 px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all"
            >
              {language === 'tr' ? 'AI raporuna git' : 'Open AI report'}
            </button>
            <button
              onClick={() => router.push('/inventory')}
              className="px-6 py-3 bg-surface-container text-on-surface font-headline font-bold uppercase text-xs rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-all"
            >
              {language === 'tr' ? 'Yeni araç ekle' : 'Add another'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <Suspense fallback={<div className="max-w-7xl mx-auto px-8 py-12" />}>
          <CompareContent />
        </Suspense>
      </main>
    </>
  );
}
