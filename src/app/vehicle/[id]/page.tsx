'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { SideNavBar, TopNavBar } from '@/components/dashboard';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useSavedVehicles } from '@/hooks/useLocalStorage';
import { useVehicle } from '@/hooks/useCatalog';
import { getBrandLogo } from '@/lib/data/logo-service';
import { buildVehicleVisualReferences } from '@/lib/data/vehicle-visuals';

export default function VehicleDetailPage() {
  const { language } = useLanguageTheme();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { vehicle, isLoading } = useVehicle(params?.id);
  const [savedVehicles, setSavedVehicles] = useSavedVehicles();

  const isSaved = vehicle ? savedVehicles.includes(vehicle.id) : false;
  const visualReferences = vehicle ? buildVehicleVisualReferences(vehicle) : [];

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
        <main className="min-h-screen pt-16 md:ml-64">
          <div className="mx-auto max-w-7xl px-8 py-12">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-1/3 rounded bg-surface-container" />
              <div className="h-4 w-1/2 rounded bg-surface-container" />
              <div className="h-96 rounded-xl bg-surface-container" />
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
        <main className="min-h-screen pt-16 md:ml-64">
          <div className="mx-auto max-w-7xl px-8 py-12">
            <div className="flex flex-col items-center justify-center py-24">
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-surface-container-highest">
                <span className="material-symbols-outlined text-5xl text-on-surface/40">error</span>
              </div>
              <h2 className="mb-4 text-center font-headline text-2xl font-bold uppercase text-on-surface">
                {language === 'tr' ? 'Araç bulunamadı' : 'Vehicle not found'}
              </h2>
              <Link
                href="/inventory"
                className="rounded-lg bg-primary-container px-6 py-3 text-xs font-bold uppercase text-on-primary-fixed transition-all hover:brightness-110"
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

      <main className="min-h-screen pt-16 md:ml-64">
        <div className="mx-auto max-w-7xl px-8 py-12">
          <Link
            href="/inventory"
            className="mb-8 inline-flex items-center gap-2 text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-label text-[10px] uppercase tracking-widest">
              {language === 'tr' ? 'Envantere dön' : 'Back'}
            </span>
          </Link>

          <div className="mb-8 rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(255,176,0,0.14),transparent_24%),#14110f] p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-surface-container">
                  <Image
                    src={getBrandLogo(vehicle.brandSlug)}
                    alt={vehicle.brand}
                    width={64}
                    height={64}
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <div>
                  <h1 className="font-headline text-4xl font-black uppercase tracking-tight text-on-surface">
                    {vehicle.brand}
                  </h1>
                  <p className="mt-1 text-lg text-on-surface-variant">{vehicle.model}</p>
                  <p className="mt-2 text-sm text-on-surface-variant/70">
                    {vehicle.segment} · {vehicle.bodyType} · {vehicle.fuelType} · {vehicle.year}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-on-surface transition hover:bg-white/10"
                >
                  {isSaved ? (language === 'tr' ? 'Kaydedildi' : 'Saved') : (language === 'tr' ? 'Kaydet' : 'Save')}
                </button>
                <button
                  onClick={() => router.push(`/compare?add=${vehicle.id}`)}
                  className="rounded-full bg-primary-container px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-on-primary-fixed transition hover:brightness-105"
                >
                  {language === 'tr' ? 'Karşılaştır' : 'Compare'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="relative flex h-96 items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,#1c1712,#0f0d0b)]">
                <Image
                  src={getBrandLogo(vehicle.brandSlug)}
                  alt={vehicle.brand}
                  width={220}
                  height={220}
                  className="h-52 w-52 object-contain opacity-30"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-9xl text-on-surface/10">directions_car</span>
                </div>
                <div className="absolute bottom-6 left-6 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.25em] text-stone-300">
                  Güven {vehicle.confidence}%
                </div>
              </div>

              <div className="rounded-[28px] bg-surface-container-low p-6">
                <h3 className="mb-3 font-headline text-lg font-bold uppercase text-on-surface">
                  {language === 'tr' ? 'Genel değerlendirme' : 'Overview'}
                </h3>
                <p className="text-on-surface-variant">{vehicle.description}</p>
              </div>

              <div className="rounded-[28px] bg-surface-container-low p-6">
                <h3 className="mb-4 font-headline text-lg font-bold uppercase text-on-surface">
                  {language === 'tr' ? 'Donanım ve öne çıkanlar' : 'Features'}
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {vehicle.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] bg-surface-container-low p-6">
                <div className="mb-4">
                  <h3 className="font-headline text-lg font-bold uppercase text-on-surface">
                    {language === 'tr' ? 'Görsel referanslar' : 'Visual references'}
                  </h3>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {language === 'tr'
                      ? 'Google Görseller aramasına hızlı geçiş için örnek arama kartları.'
                      : 'Quick visual search prompts for Google Images.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {visualReferences.map((reference) => (
                    <a
                      key={reference.id}
                      href={reference.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-highest transition-all hover:border-primary-container/25"
                    >
                      <div className={`relative h-36 bg-gradient-to-br ${reference.accent}`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image
                            src={getBrandLogo(vehicle.brandSlug)}
                            alt={vehicle.brand}
                            width={88}
                            height={88}
                            className="h-20 w-20 object-contain opacity-25 transition-opacity group-hover:opacity-40"
                          />
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="font-headline text-sm font-bold uppercase text-on-surface">{reference.title}</div>
                        <div className="mt-2 text-xs text-on-surface-variant">{reference.query}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-primary-container/20 bg-primary-container/10 p-6">
                <div className="mb-2 text-sm uppercase tracking-widest text-primary-container">
                  {language === 'tr' ? 'Fiyat bandı' : 'Price'}
                </div>
                <div className="font-headline text-4xl font-black text-primary-container">
                  ${vehicle.price.toLocaleString()}
                </div>
              </div>

              <div className="rounded-[28px] bg-surface-container-low p-6">
                <h3 className="mb-4 font-headline text-lg font-bold uppercase text-on-surface">
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
                    <div key={item.label} className="flex items-center justify-between border-b border-outline-variant/10 py-2 last:border-b-0">
                      <span className="text-sm text-on-surface-variant">{item.label}</span>
                      <span className="font-headline font-bold text-on-surface">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] bg-surface-container-low p-6">
                <h3 className="mb-4 font-headline text-lg font-bold uppercase text-on-surface">
                  {language === 'tr' ? 'Skorlar' : 'Scores'}
                </h3>
                <div className="space-y-3">
                  {Object.entries(vehicle.scores).map(([key, value]) => (
                    <div key={key}>
                      <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-widest text-on-surface-variant">
                        <span>{key}</span>
                        <span>{value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-container-highest">
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
