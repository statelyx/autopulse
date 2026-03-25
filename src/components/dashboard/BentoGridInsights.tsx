'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { useCatalog } from '@/hooks/useCatalog';
import type { CatalogVehicle } from '@/lib/data/catalog';

type SummaryResponse = {
  summary: string;
  insights: string[];
  recommendations: string[];
};

export function BentoGridInsights() {
  const { featuredVehicles, isLoading } = useCatalog({ limit: 8 });
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const trendItems: Array<CatalogVehicle | { id: string }> = isLoading
    ? Array.from({ length: 3 }, (_, index) => ({ id: `trend-${index}` }))
    : featuredVehicles.slice(0, 3);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSummary() {
      try {
        const response = await fetch('/api/ai/summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: 'Öne çıkan pazar özeti',
            vehicleIds: featuredVehicles.slice(0, 4).map((vehicle) => vehicle.id),
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setSummary(data);
      } catch {
        setSummary(null);
      }
    }

    if (featuredVehicles.length > 0) {
      loadSummary();
    }

    return () => controller.abort();
  }, [featuredVehicles]);

  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-surface-container-low rounded-3xl overflow-hidden relative group h-[450px]">
          <img
            className="absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700"
            alt="Auto Pulse pazar özeti"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjQv1-Lcs1y3CmNDW013CcS4MupeA-4SYYeV2H_rFJJqtXVtCJRHyZp4kGzoVpOIm41YGlRfgYPE35i7f7BzcTCsikCO6ax8jYg4OGS0WbxMVWO0CF19ioVrMJ7fbkIy1QFEJLDfq148qZNwqyYkYfqlnv4NcpR75ozppZanLfA47-FuZTV7DhbHGCY6KW6DZjjAiD4l-k_E-8lbPCe3YDOomN1Bbzr7Ve0bp4-R7dQQJKPVVcXjKqUO4AVhb37ssvFXETYDgM6GI"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-12 w-full">
            <div className="flex items-center gap-2 text-primary-container mb-4">
              <span className="font-label text-[10px] uppercase tracking-widest font-bold">
                Canlı İçgörü
              </span>
              <span className="w-1 h-1 rounded-full bg-primary-container" />
              <span className="font-label text-[10px] uppercase tracking-widest font-bold">
                katalog + AI
              </span>
            </div>
            <h2 className="font-headline text-4xl font-black text-on-surface uppercase mb-6 leading-none">
              Gerçek veriyle <br /> pazar nabzı.
            </h2>
            <p className="font-body text-on-surface-variant max-w-lg mb-8 text-sm">
              {summary?.summary ?? 'Katalog özeti hazırlanıyor. Araç, segment, fiyat ve elektrifikasyon dağılımı derleniyor.'}
            </p>
            <Link href="/intelligence" className="flex items-center gap-2 group/btn">
              <span className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface group-hover/btn:text-primary transition-colors">
                Analizi aç
              </span>
              <span className="material-symbols-outlined text-sm text-primary">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div className="md:col-span-4 bg-surface-container-high/40 backdrop-blur-xl rounded-3xl p-8 border border-outline-variant/5">
          <h3 className="font-headline text-xl font-bold uppercase tracking-tight mb-8">
            Trend skorları
          </h3>

          <div className="space-y-6">
            {trendItems.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl">
                {'brand' in item ? (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 flex items-center justify-center text-primary-container font-headline font-bold">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <div className="text-xs font-bold font-headline uppercase">
                          {item.brand} {item.model}
                        </div>
                        <div className="text-[10px] text-on-surface-variant/40">
                          {item.segment} · {item.fuelType}
                        </div>
                      </div>
                    </div>
                    <div className="text-secondary-fixed-dim font-headline font-black text-xl">
                      {Math.round((item.scores.market + item.scores.innovation) / 20)}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-10 animate-pulse bg-surface-container rounded-lg" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-outline-variant/10 text-center">
            <Link
              href="/ai-insights"
              className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors"
            >
              Tüm metrikleri gör
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
