'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { SideNavBar, TopNavBar } from '@/components/dashboard';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useSavedVehicles } from '@/hooks/useLocalStorage';
import { useVehicle } from '@/hooks/useCatalog';
import { getBrandLogo } from '@/lib/data/logo-service';

export default function VehicleDetailPage() {
  const { language } = useLanguageTheme();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { vehicle, isLoading } = useVehicle(params?.id);
  const [savedVehicles, setSavedVehicles] = useSavedVehicles();

  const isSaved = vehicle ? savedVehicles.includes(vehicle.id) : false;

  const handleSave = () => {
    if (!vehicle) return;

    if (isSaved) {
      setSavedVehicles(savedVehicles.filter((id) => id !== vehicle.id));
      return;
    }

    setSavedVehicles([...savedVehicles, vehicle.id]);
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
                <span className="material-symbols-outlined text-on-surface/40 text-5xl">error</span>
              </div>
              <h2 className="font-headline text-2xl font-bold text-on-surface uppercase mb-4 text-center">
                {language === 'tr' ? 'Araç bulunamadı' : 'Vehicle not found'}
              </h2>
              <Link
                href="/inventory"
                className="px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all"
              >
                {language === 'tr' ? 'Envantere dön' : 'Back to inventory'}
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
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-8"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-label text-[10px] uppercase tracking-widest">
              {language === 'tr' ? 'Envantere dön' : 'Back'}
            </span>
          </Link>

          <div className="mb-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
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
                  <p className="font-body text-on-surface-variant/70 text-sm mt-1">
                    {vehicle.segment} · {vehicle.bodyType} · {vehicle.fuelType}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-surface-container text-on-surface font-label text-[10px] uppercase tracking-widest rounded-lg hover:bg-surface-container-high transition-all"
                >
                  <span className="material-symbols-outlined text-sm align-middle mr-1">
                    {isSaved ? 'bookmark_added' : 'bookmark'}
                  </span>
                  {isSaved ? (language === 'tr' ? 'Kaydedildi' : 'Saved') : (language === 'tr' ? 'Kaydet' : 'Save')}
                </button>
                <button
                  onClick={() => router.push(`/compare?add=${vehicle.id}`)}
                  className="px-4 py-2 bg-surface-container text-on-surface font-label text-[10px] uppercase tracking-widest rounded-lg hover:bg-surface-container-high transition-all"
                >
                  <span className="material-symbols-outlined text-sm align-middle mr-1">compare</span>
                  {language === 'tr' ? 'Karşılaştır' : 'Compare'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-on-surface-variant text-sm">
              <span className="px-3 py-1 bg-surface-container-lowest rounded-full font-label text-[10px] uppercase tracking-widest">
                {vehicle.year}
              </span>
              <span>•</span>
              <span>{vehicle.transmission}</span>
              <span>•</span>
              <span>Güven {vehicle.confidence}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-surface-container rounded-xl overflow-hidden h-96 flex items-center justify-center relative">
                <Image
                  src={getBrandLogo(vehicle.brandSlug)}
                  alt={vehicle.brand}
                  width={220}
                  height={220}
                  className="w-52 h-52 object-contain opacity-30"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-9xl text-on-surface/10">directions_car</span>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-6">
                <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-3">
                  {language === 'tr' ? 'Genel değerlendirme' : 'Overview'}
                </h3>
                <p className="font-body text-on-surface-variant">{vehicle.description}</p>
              </div>

              <div className="bg-surface-container-low rounded-xl p-6">
                <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-4">
                  {language === 'tr' ? 'Donanım ve öne çıkanlar' : 'Features'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {vehicle.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-primary-container/10 rounded-xl p-6 border border-primary-container/20">
                <div className="text-sm font-label uppercase tracking-widest text-primary-container mb-2">
                  {language === 'tr' ? 'Fiyat bandı' : 'Price'}
                </div>
                <div className="font-headline text-4xl font-black text-primary-container">
                  ${vehicle.price.toLocaleString()}
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-6">
                <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-4">
                  {language === 'tr' ? 'Teknik profil' : 'Specifications'}
                </h3>

                <div className="space-y-4">
                  {[
                    { label: language === 'tr' ? 'Güç' : 'Power', value: `${vehicle.horsepower} hp` },
                    { label: '0-100 km/s', value: `${vehicle.acceleration}s` },
                    { label: language === 'tr' ? 'Maksimum hız' : 'Top speed', value: `${vehicle.topSpeed} km/s` },
                    { label: language === 'tr' ? 'Yakıt' : 'Fuel', value: vehicle.fuelType },
                    { label: language === 'tr' ? 'Şanzıman' : 'Transmission', value: vehicle.transmission },
                    { label: language === 'tr' ? 'Kapı' : 'Doors', value: String(vehicle.doors) },
                    { label: language === 'tr' ? 'Koltuk' : 'Seats', value: String(vehicle.seats) },
                    { label: language === 'tr' ? 'Renk' : 'Color', value: vehicle.color },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-outline-variant/10 last:border-b-0">
                      <span className="text-on-surface-variant text-sm">{item.label}</span>
                      <span className="font-headline font-bold text-on-surface">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-6">
                <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-4">
                  {language === 'tr' ? 'Skorlar' : 'Scores'}
                </h3>
                <div className="space-y-3">
                  {Object.entries(vehicle.scores).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1 text-xs uppercase tracking-widest text-on-surface-variant">
                        <span>{key}</span>
                        <span>{value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-container-highest overflow-hidden">
                        <div className="h-full bg-primary-container" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
