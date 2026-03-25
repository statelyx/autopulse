'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { SideNavBar, TopNavBar } from '@/components/dashboard';
import { useCatalog } from '@/hooks/useCatalog';

type SummaryResponse = {
  summary: string;
  insights: string[];
  recommendations: string[];
};

export default function AIInsightsPage() {
  const { vehicles, stats } = useCatalog({ limit: 24 });
  const [report, setReport] = useState<SummaryResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadReport() {
      try {
        const response = await fetch('/api/ai/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: 'Detaylı AI içgörü özeti',
            vehicleIds: vehicles.slice(0, 8).map((vehicle) => vehicle.id),
          }),
          signal: controller.signal,
        });

        if (!response.ok) return;
        setReport(await response.json());
      } catch {
        setReport(null);
      }
    }

    if (vehicles.length > 0) {
      loadReport();
    }

    return () => controller.abort();
  }, [vehicles]);

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-2">
              AI Analizleri
            </h1>
            <p className="font-body text-on-surface-variant text-lg">
              Hugging Face destekli özet motoru ve katalog sinyalleri burada birleşiyor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Araç', value: vehicles.length },
              { label: 'Marka', value: stats?.totalBrands ?? 0 },
              { label: 'Elektrikli', value: stats?.electricVehicles ?? 0 },
              { label: 'Premium', value: stats?.premiumVehicles ?? 0 },
            ].map((item) => (
              <div key={item.label} className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  {item.label}
                </div>
                <div className="font-headline text-2xl font-bold text-on-surface">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-low rounded-xl p-8 border border-primary-container/20 mb-8">
            <h2 className="font-headline text-2xl font-bold text-on-surface uppercase mb-4">
              Yönetici Özeti
            </h2>
            <p className="font-body text-on-surface mb-6">
              {report?.summary ?? 'AI raporu hazırlanıyor.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  İçgörüler
                </div>
                {(report?.insights ?? []).map((item) => (
                  <div key={item} className="text-sm text-on-surface-variant mb-2">• {item}</div>
                ))}
              </div>
              <div>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  Öneriler
                </div>
                {(report?.recommendations ?? []).map((item) => (
                  <div key={item} className="text-sm text-on-surface-variant mb-2">• {item}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.slice(0, 9).map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicle/${vehicle.id}`}
                className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 hover:border-primary-container/20 transition-all"
              >
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  {vehicle.segment}
                </div>
                <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-2">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <p className="font-body text-on-surface-variant text-sm mb-3">
                  {vehicle.year} · {vehicle.fuelType} · {vehicle.bodyType}
                </p>
                <div className="text-sm text-primary">
                  Güven {vehicle.confidence}% · Pazar {vehicle.scores.market}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
