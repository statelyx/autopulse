'use client';

/**
 * AUTO PULSE — Compare Page
 * Araç karşılaştırma - gerçek veri ile
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { getVehicleById, getVehicles } from '@/lib/data/vehicle-service';
import { getBrandLogo } from '@/lib/data/logo-service';
import { useCompareVehicles } from '@/hooks/useLocalStorage';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type ComparisonSlot = {
  id: number;
  vehicle: any;
};

function CompareContent({ searchParams }: { searchParams: ReturnType<typeof useSearchParams> }) {
  const { language } = useLanguageTheme();
  const router = useRouter();
  const [compareVehicleIds, setCompareVehicleIds] = useCompareVehicles();
  const [slots, setSlots] = useState<ComparisonSlot[]>([]);

  useEffect(() => {
    // URL'dan araç ekleme parametresini kontrol et
    const addVehicleId = searchParams.get('add');
    if (addVehicleId && !compareVehicleIds.includes(addVehicleId)) {
      const updated = [...compareVehicleIds, addVehicleId];
      setCompareVehicleIds(updated);
    }

    // Slot'ları doldur
    const vehicleSlots: ComparisonSlot[] = [];
    compareVehicleIds.slice(0, 3).forEach((id, index) => {
      const vehicle = getVehicleById(id);
      vehicleSlots.push({
        id: index + 1,
        vehicle,
      });
    });

    // Kalan slot'ları boş ekle
    while (vehicleSlots.length < 3) {
      vehicleSlots.push({
        id: vehicleSlots.length + 1,
        vehicle: null,
      });
    }

    setSlots(vehicleSlots);
  }, [compareVehicleIds, searchParams]);

  const removeVehicle = (slotId: number) => {
    const slotIndex = slotId - 1;
    if (slotIndex < compareVehicleIds.length) {
      const updated = compareVehicleIds.filter((_, i) => i !== slotIndex);
      setCompareVehicleIds(updated);
    }
  };

  const clearAll = () => {
    setCompareVehicleIds([]);
  };

  const filledSlots = slots.filter(s => s.vehicle).length;

  return (
    <>
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-2">
              {language === 'tr' ? 'Araç Karşılaştırma' : 'Compare Vehicles'}
            </h1>
            <p className="font-body text-on-surface-variant text-lg">
              {language === 'tr'
                ? 'Yan yana araç istihbaratı ve özellikleri'
                : 'Side-by-side vehicle intelligence and specifications'}
            </p>
          </div>
          {filledSlots > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-surface-container-low text-on-surface font-headline font-bold uppercase text-xs rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-all active:scale-95"
            >
              {language === 'tr' ? 'Tümünü Temizle' : 'Clear All'}
            </button>
          )}
        </div>

        {/* Comparison Slots */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10 hover:border-primary-container/20 transition-all"
            >
              {slot.vehicle ? (
                // Filled Slot
                <div className="h-full flex flex-col">
                  <div className="h-48 bg-surface-container-highest flex items-center justify-center relative">
                    <Image
                      src={getBrandLogo(slot.vehicle.brandSlug)}
                      alt={slot.vehicle.brand}
                      width={128}
                      height={128}
                      className="w-32 h-32 object-contain opacity-30"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-9xl text-on-surface/10">
                        directions_car
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => removeVehicle(slot.id)}
                        className="p-2 hover:bg-surface-container rounded-lg transition-colors"
                        title={language === 'tr' ? 'Kaldır' : 'Remove'}
                      >
                        <span className="material-symbols-outlined text-error">
                          close
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-1">
                        {slot.vehicle.brand}
                      </h3>
                      <p className="font-body text-sm text-on-surface-variant">
                        {slot.vehicle.model}
                      </p>
                      <p className="font-body text-xs text-on-surface-variant/60 mt-1">
                        {slot.vehicle.year}
                      </p>
                    </div>

                    {/* Specs */}
                    <div className="space-y-2 flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">{language === 'tr' ? 'Güç' : 'Power'}</span>
                        <span className="font-headline font-bold text-on-surface">{slot.vehicle.horsepower} hp</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">{language === 'tr' ? '0-100' : '0-100'}</span>
                        <span className="font-headline font-bold text-on-surface">{slot.vehicle.acceleration}s</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">{language === 'tr' ? 'Yakıt' : 'Fuel'}</span>
                        <span className="font-headline font-bold text-on-surface">{slot.vehicle.fuelType}</span>
                      </div>
                      {slot.vehicle.price && (
                        <div className="flex justify-between text-sm">
                          <span className="text-on-surface-variant">{language === 'tr' ? 'Fiyat' : 'Price'}</span>
                          <span className="font-headline font-bold text-primary">${slot.vehicle.price?.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-outline-variant/10">
                      <Link
                        href={`/vehicle/${slot.vehicle.id}`}
                        className="text-xs font-label uppercase tracking-widest text-primary hover:underline"
                      >
                        {language === 'tr' ? 'Detayları Gör' : 'View Details'}
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                // Empty Slot
                <div className="h-[500px] flex items-center justify-center">
                  <Link
                    href="/inventory"
                    className="text-center group"
                  >
                    <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center mx-auto mb-4 hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors">
                        add
                      </span>
                    </div>
                    <p className="font-headline text-sm font-bold text-on-surface uppercase mb-2">
                      {language === 'tr' ? 'Araç Ekle' : 'Add Vehicle'}
                    </p>
                    <p className="font-body text-xs text-on-surface-variant">
                      {language === 'tr' ? 'Slot' : 'Slot'} {slot.id} {language === 'tr' ? 'of 3' : 'of 3'}
                    </p>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Results */}
        {filledSlots >= 2 && (
          <div className="bg-surface-container-low rounded-xl p-8 border border-primary-container/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl font-bold text-on-surface uppercase">
                {language === 'tr' ? 'Karşılaştırma Sonuçları' : 'Comparison Results'}
              </h2>
              <span className="px-3 py-1 bg-primary-container/10 text-primary-container rounded-full font-label text-[10px] uppercase tracking-widest font-bold">
                {filledSlots} {language === 'tr' ? 'Araç' : 'Vehicles'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-surface-container-highest rounded-lg">
                <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  {language === 'tr' ? 'AI Analizi' : 'AI Analysis'}
                </div>
                <p className="font-body text-sm text-on-surface">
                  {filledSlots} {language === 'tr' ? 'araç için detaylı karşılaştırma hazır' : 'vehicles comparison ready'}
                </p>
              </div>
              <div className="p-4 bg-surface-container-highest rounded-lg">
                <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  {language === 'tr' ? 'Fiyat Farkı' : 'Price Delta'}
                </div>
                {filledSlots >= 2 && slots[0].vehicle?.price && slots[1].vehicle?.price && (
                  <p className="font-headline text-lg font-bold text-primary-container">
                    ${Math.abs((slots[0].vehicle.price || 0) - (slots[1].vehicle.price || 0)).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="p-4 bg-surface-container-highest rounded-lg">
                <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  {language === 'tr' ? 'Öneri' : 'Recommendation'}
                </div>
                <p className="font-body text-sm text-on-surface">
                  {filledSlots === 3
                    ? (language === 'tr' ? 'Tam analiz hazır' : 'Full analysis ready')
                    : (language === 'tr' ? 'Tam analiz için 3. aracı ekleyin' : 'Add 3rd vehicle for full analysis')
                  }
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button className="flex-1 px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all active:scale-95">
                {language === 'tr' ? 'Tam Rapor Oluştur' : 'Generate Full Report'}
              </button>
              <button className="px-6 py-3 bg-surface-container text-on-surface font-headline font-bold uppercase text-xs rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-all active:scale-95">
                {language === 'tr' ? 'Verileri Dışa Aktar' : 'Export Data'}
              </button>
            </div>
          </div>
        )}

        {/* Quick Add Suggestions */}
        {filledSlots < 3 && (
          <div className="mt-12">
            <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-6">
              {language === 'tr' ? 'Popüler Karşılaştırmalar' : 'Popular Comparisons'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { vehicles: ['Porsche 911', 'BMW M4', 'Mercedes AMG'], category: language === 'tr' ? 'Performans' : 'Performance' },
                { vehicles: ['Tesla Model S', 'Porsche Taycan', 'BMW iX'], category: language === 'tr' ? 'Elektrikli' : 'Electric' },
                { vehicles: ['Range Rover', 'Lexus LX', 'G-Class'], category: language === 'tr' ? 'Lüks SUV' : 'Luxury SUV' },
              ].map((suggestion) => (
                <Link
                  key={suggestion.category}
                  href="/inventory"
                  className="p-4 bg-surface-container rounded-lg border border-outline-variant/10 hover:border-primary-container/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {suggestion.category}
                    </span>
                    <span className="material-symbols-outlined text-primary">
                      add_circle
                    </span>
                  </div>
                  <div className="space-y-1">
                    {suggestion.vehicles.map((vehicle) => (
                      <div key={vehicle} className="font-body text-xs text-on-surface">
                        {vehicle}
                      </div>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function ComparePage() {
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
          <CompareContentWrapper />
        </Suspense>
      </main>
    </>
  );
}

function CompareContentWrapper() {
  const searchParams = useSearchParams();
  return <CompareContent searchParams={searchParams} />;
}

