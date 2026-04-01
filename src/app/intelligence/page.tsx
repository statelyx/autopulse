'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { SideNavBar, TopNavBar } from '@/components/dashboard';
import { useCatalog } from '@/hooks/useCatalog';
import { formatTryPrice } from '@/lib/formatters/currency';

type IssueResponse = {
  issues: Array<{
    id: string;
    title: string;
    description: string;
    reference: string;
    analysis: {
      priority: 'low' | 'medium' | 'high';
      summary: string;
    };
  }>;
};

type SummaryResponse = {
  summary: string;
  insights: string[];
  recommendations: string[];
};

export default function IntelligencePage() {
  const { vehicles, stats } = useCatalog({ limit: 40 });
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [issues, setIssues] = useState<IssueResponse['issues']>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const [summaryResponse, issuesResponse] = await Promise.all([
          fetch('/api/ai/summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: 'İstihbarat merkezi özeti',
              vehicleIds: vehicles.slice(0, 6).map((vehicle) => vehicle.id),
            }),
            signal: controller.signal,
          }),
          fetch('/api/ai/issues', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ limit: 4 }),
            signal: controller.signal,
          }),
        ]);

        if (summaryResponse.ok) {
          setSummary(await summaryResponse.json());
        }

        if (issuesResponse.ok) {
          const issuePayload = await issuesResponse.json();
          setIssues(issuePayload.issues ?? []);
        }
      } catch {
        setSummary(null);
        setIssues([]);
      }
    }

    if (vehicles.length > 0) {
      load();
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
            <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-4">
              Yapay Zeka İstihbarat Merkezi
            </h1>
            <p className="font-body text-on-surface-variant text-lg">
              Canlı katalog, issue sinyalleri ve özet analizi tek panelde.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {[
              { label: 'Toplam kayıt', value: vehicles.length },
              { label: 'Elektrikli araç', value: stats?.electricVehicles ?? 0 },
              { label: 'Ortalama fiyat', value: formatTryPrice(stats?.avgPrice ?? 0) },
            ].map((item) => (
              <div key={item.label} className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  {item.label}
                </div>
                <div className="font-headline text-3xl font-bold text-on-surface">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-low rounded-xl p-8 border border-primary-container/20 mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl font-bold text-on-surface uppercase">
                Özet rapor
              </h2>
              <Link href="/ai-insights" className="text-xs uppercase tracking-widest text-primary hover:underline">
                Detaylı AI sayfası
              </Link>
            </div>
            <p className="font-body text-on-surface mb-6">
              {summary?.summary ?? 'Özet hazırlanıyor.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  İçgörüler
                </div>
                <div className="space-y-2">
                  {(summary?.insights ?? []).map((item) => (
                    <div key={item} className="text-sm text-on-surface-variant">• {item}</div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  Sonraki adımlar
                </div>
                <div className="space-y-2">
                  {(summary?.recommendations ?? []).map((item) => (
                    <div key={item} className="text-sm text-on-surface-variant">• {item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 hover:border-primary-container/20 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {issue.reference}
                  </span>
                  <span className="px-2 py-1 bg-primary-container/10 text-primary-container rounded text-[10px] uppercase tracking-widest font-bold">
                    {issue.analysis.priority}
                  </span>
                </div>
                <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-2">
                  {issue.title}
                </h3>
                <p className="font-body text-on-surface-variant text-sm mb-3">
                  {issue.description}
                </p>
                <p className="font-body text-on-surface text-sm">
                  {issue.analysis.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
