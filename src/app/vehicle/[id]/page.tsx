'use client';

/**
 * AUTO PULSE — Vehicle Detail Page
 * Gerçek araç verileri ile detay sayfası
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { getVehicleById } from '@/lib/data/vehicle-service';
import { getBrandLogo } from '@/lib/data/logo-service';
import { useSavedVehicles } from '@/hooks/useLocalStorage';
import Link from 'next/link';
import Image from 'next/image';

export default function VehicleDetailPage() {
  const { language } = useLanguageTheme();
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedVehicles, setSavedVehicles] = useSavedVehicles();
  const [saving, setSaving] = useState(false);

  const isSaved = vehicle && savedVehicles.includes(vehicle.id);

  useEffect(() => {
    const loadVehicle = () => {
      setIsLoading(true);
      const vehicleData = getVehicleById(params.id as string);

      if (vehicleData) {
        setVehicle(vehicleData);
      }

      setIsLoading(false);
    };

    if (params.id) {
      loadVehicle();
    }
  }, [params.id]);

  const handleSave = () => {
    if (!vehicle) return;

    setSaving(true);

    if (isSaved) {
      // Remove from saved
      const updated = savedVehicles.filter(id => id !== vehicle.id);
      setSavedVehicles(updated);
    } else {
      // Add to saved
      const updated = [...savedVehicles, vehicle.id];
      setSavedVehicles(updated);
    }

    setSaving(false);
  };

  const handleCompare = () => {
    router.push(`/compare?add=${vehicle.id}`);
  };

  if (isLoading) {
    return (
      <>
        <TopNavBar />
        <SideNavBar />
        <main className="md:ml-64 pt-16 min-h-screen">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-surface-container rounded w-1/3" />
              <div className="h-4 bg-surface-container rounded w-1/2" />
              <div className="h-96 bg-surface-container rounded-xl" />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!vehicle) {
    return (
      <>
        <TopNavBar />
        <SideNavBar />
        <main className="md:ml-64 pt-16 min-h-screen">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-on-surface/40 text-5xl">
                  error
                </span>
              </div>
              <h2 className="font-headline text-2xl font-bold text-on-surface uppercase mb-4 text-center">
                {language === 'tr' ? 'Araç Bulunamadı' : 'Vehicle Not Found'}
              </h2>
              <p className="font-body text-on-surface-variant text-center max-w-md mb-8">
                {language === 'tr'
                  ? 'Aradığınız araç bulunamadı. Lütfen envanter sayfasından diğer araçları keşfedin.'
                  : 'The vehicle you are looking for could not be found. Please explore other vehicles in our inventory.'}
              </p>
              <Link
                href="/inventory"
                className="px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all active:scale-95"
              >
                {language === 'tr' ? 'Envantere Dön' : 'Back to Inventory'}
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Back Button */}
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-8"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-label text-[10px] uppercase tracking-widest">
              {language === 'tr' ? 'Geri Dön' : 'Back'}
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-surface-container rounded-xl flex items-center justify-center">
                  <Image
                    src={getBrandLogo(vehicle.brandSlug)}
                    alt={vehicle.brand}
                    width={64}
                    height={64}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <h1 className="font-headline text-3xl font-black text-on-surface uppercase tracking-tighter mb-1">
                    {vehicle.brand}
                  </h1>
                  <p className="font-body text-on-surface-variant text-lg">
                    {vehicle.model}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-surface-container text-on-surface font-label text-[10px] uppercase tracking-widest rounded-lg hover:bg-surface-container-high transition-all active:scale-95 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm align-middle mr-1">
                    {isSaved ? 'bookmark_added' : 'bookmark'}
                  </span>
                  {saving
                    ? (language === 'tr' ? 'Kaydediliyor...' : 'Saving...')
                    : (isSaved
                      ? (language === 'tr' ? 'Kaydedildi' : 'Saved')
                      : (language === 'tr' ? 'Kaydet' : 'Save')
                    )
                  }
                </button>
                <button
                  onClick={handleCompare}
                  className="px-4 py-2 bg-surface-container text-on-surface font-label text-[10px] uppercase tracking-widest rounded-lg hover:bg-surface-container-high transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm align-middle mr-1">
                    compare
                  </span>
                  {language === 'tr' ? 'Karşılaştır' : 'Compare'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-on-surface-variant text-sm">
              <span className="px-3 py-1 bg-surface-container-lowest rounded-full font-label text-[10px] uppercase tracking-widest">
                {vehicle.year}
              </span>
              <span>•</span>
              <span>{vehicle.bodyType}</span>
              <span>•</span>
              <span>{vehicle.fuelType}</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image & Description */}
            <div className="lg:col-span-2 space-y-6">
              {/* Vehicle Image */}
              <div className="bg-surface-container rounded-xl overflow-hidden h-96 flex items-center justify-center relative">
                <Image
                  src={getBrandLogo(vehicle.brandSlug)}
                  alt={vehicle.brand}
                  width={200}
                  height={200}
                  className="w-48 h-48 object-contain opacity-30"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-9xl text-on-surface/10">
                    directions_car
                  </span>
                </div>
              </div>

              {/* Description */}
              {vehicle.description && (
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-3">
                    {language === 'tr' ? 'Açıklama' : 'Description'}
                  </h3>
                  <p className="font-body text-on-surface-variant">
                    {vehicle.description}
                  </p>
                </div>
              )}

              {/* Features */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-4">
                    {language === 'tr' ? 'Özellikler' : 'Features'}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {vehicle.features.map((feature: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-on-surface-variant text-sm"
                      >
                        <span className="material-symbols-outlined text-primary text-sm">
                          check_circle
                        </span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Specs & Price */}
            <div className="space-y-6">
              {/* Price Card */}
              {vehicle.price && (
                <div className="bg-primary-container/10 rounded-xl p-6 border border-primary-container/20">
                  <div className="text-sm font-label uppercase tracking-widest text-primary-container mb-2">
                    {language === 'tr' ? 'Fiyat' : 'Price'}
                  </div>
                  <div className="font-headline text-4xl font-black text-primary-container">
                    ${vehicle.price?.toLocaleString()}
                  </div>
                </div>
              )}

              {/* Specifications */}
              <div className="bg-surface-container-low rounded-xl p-6">
                <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-4">
                  {language === 'tr' ? 'Teknik Özellikler' : 'Specifications'}
                </h3>

                <div className="space-y-4">
                  {vehicle.horsepower && (
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant text-sm">
                        {language === 'tr' ? 'Güç' : 'Horsepower'}
                      </span>
                      <span className="font-headline font-bold text-on-surface">
                        {vehicle.horsepower} hp
                      </span>
                    </div>
                  )}

                  {vehicle.acceleration && (
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant text-sm">
                        {language === 'tr' ? '0-100 km/h' : '0-100 km/h'}
                      </span>
                      <span className="font-headline font-bold text-on-surface">
                        {vehicle.acceleration}s
                      </span>
                    </div>
                  )}

                  {vehicle.topSpeed && (
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant text-sm">
                        {language === 'tr' ? 'Max Hız' : 'Top Speed'}
                      </span>
                      <span className="font-headline font-bold text-on-surface">
                        {vehicle.topSpeed} km/h
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant text-sm">
                      {language === 'tr' ? 'Yakıt' : 'Fuel Type'}
                    </span>
                    <span className="font-headline font-bold text-on-surface">
                      {vehicle.fuelType}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant text-sm">
                      {language === 'tr' ? 'Şanzıman' : 'Transmission'}
                    </span>
                    <span className="font-headline font-bold text-on-surface">
                      {vehicle.transmission}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant text-sm">
                      {language === 'tr' ? 'Kapı' : 'Doors'}
                    </span>
                    <span className="font-headline font-bold text-on-surface">
                      {vehicle.doors}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-on-surface-variant text-sm">
                      {language === 'tr' ? 'Koltuk' : 'Seats'}
                    </span>
                    <span className="font-headline font-bold text-on-surface">
                      {vehicle.seats}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
