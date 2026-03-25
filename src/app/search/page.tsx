'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { SideNavBar, TopNavBar } from '@/components/dashboard';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useCatalog } from '@/hooks/useCatalog';

type SummaryResponse = {
  summary: string;
  insights: string[];
  recommendations: string[];
  matchedVehicles: Array<{
    id: string;
    brand: string;
    model: string;
    year: number;
    segment: string;
  }>;
};

function SearchContent() {
  const { language } = useLanguageTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SummaryResponse | null>(null);

  const composedQuery = useMemo(() => {
    const q = searchParams.get('q');
    const brand = searchParams.get('brand');
    const model = searchParams.get('model');
    const year = searchParams.get('year');

    if (q) return q;
    return [brand, model, year].filter(Boolean).join(' ');
  }, [searchParams]);

  const { vehicles } = useCatalog({
    q: composedQuery || undefined,
    brand: searchParams.get('brand') ?? undefined,
    model: searchParams.get('model') ?? undefined,
    year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
    limit: 12,
  });

  useEffect(() => {
    setSearchQuery(composedQuery);
  }, [composedQuery]);

  useEffect(() => {
    if (!composedQuery) return;
    void runAnalysis(composedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composedQuery]);

  async function runAnalysis(query: string) {
    if (!query.trim()) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          vehicleIds: vehicles.slice(0, 4).map((vehicle) => vehicle.id),
        }),
      });

      if (!response.ok) {
        throw new Error('Analiz üretilemedi');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch {
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  }

  const handleAnalyze = () => {
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-4">
          {language === 'tr' ? 'Yapay Zeka Arama' : 'AI Search'}
        </h1>
        <p className="font-body text-on-surface-variant text-lg">
          {language === 'tr'
            ? 'Arama, katalog ve AI özetini aynı ekranda birleştirir.'
            : 'Search, catalog and AI summary in one place.'}
        </p>
      </div>

      <div className="mb-8 relative group">
        <div className="absolute -inset-1 bg-primary-container/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden">
          <span className="material-symbols-outlined ml-6 text-on-surface-variant">search</span>
          <input
            className="w-full bg-transparent border-none text-on-surface font-body px-6 py-6 focus:ring-0 placeholder:text-on-surface-variant/40 placeholder:uppercase placeholder:tracking-widest placeholder:text-xs"
            placeholder={language === 'tr' ? 'Marka, model, segment veya yakıt tipini analiz et...' : 'Analyze brand, model or segment...'}
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleAnalyze()}
            disabled={isAnalyzing}
          />
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !searchQuery.trim()}
            className="mr-4 px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing
              ? (language === 'tr' ? 'Analiz ediliyor...' : 'Analyzing...')
              : (language === 'tr' ? 'Analiz et' : 'Analyze')}
          </button>
        </div>
      </div>

      {analysisResult && (
        <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary-container text-3xl">psychology</span>
            <h2 className="font-headline text-xl font-bold text-on-surface uppercase">
              {language === 'tr' ? 'Analiz Sonucu' : 'Analysis Result'}
            </h2>
          </div>

          <p className="font-body text-on-surface mb-6 whitespace-pre-wrap">
            {analysisResult.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                {language === 'tr' ? 'İçgörüler' : 'Insights'}
              </div>
              <div className="space-y-2">
                {analysisResult.insights.map((insight) => (
                  <div key={insight} className="text-sm text-on-surface-variant">
                    • {insight}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                {language === 'tr' ? 'Öneriler' : 'Recommendations'}
              </div>
              <div className="space-y-2">
                {analysisResult.recommendations.map((recommendation) => (
                  <div key={recommendation} className="text-sm text-on-surface-variant">
                    • {recommendation}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehicles.slice(0, 6).map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 hover:border-primary-container/20 transition-all cursor-pointer"
            onClick={() => router.push(`/vehicle/${vehicle.id}`)}
          >
            <span className="material-symbols-outlined text-primary-container text-4xl mb-4">directions_car</span>
            <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-2">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="font-body text-on-surface-variant text-sm">
              {vehicle.year} · {vehicle.segment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <Suspense fallback={<div className="max-w-5xl mx-auto px-8 py-12" />}>
          <SearchContent />
        </Suspense>
      </main>
    </>
  );
}
