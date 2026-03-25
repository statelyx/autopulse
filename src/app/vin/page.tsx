'use client';

import Link from 'next/link';
import { useState } from 'react';

import { SideNavBar, TopNavBar } from '@/components/dashboard';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';

type VinResult = {
  vin: string;
  make?: string;
  model?: string;
  year?: number;
  trim?: string;
  bodyType?: string;
  engine?: string;
  transmission?: string;
  driveType?: string;
  fuelType?: string;
  manufacturer?: string;
  plant?: string;
  source: string;
  confidence: number;
  error?: string;
};

export default function VinPage() {
  const { language } = useLanguageTheme();
  const [vin, setVin] = useState('');
  const [result, setResult] = useState<VinResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = async () => {
    if (!vin.trim()) {
      setError(language === 'tr' ? 'Lütfen bir VIN girin' : 'Please enter a VIN');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/vin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'VIN sorgusu başarısız');
      }

      setResult(data);
      setError(data.error ?? null);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'VIN sorgusu başarısız');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-2">
              {language === 'tr' ? 'VIN Sorgulama' : 'VIN Lookup'}
            </h1>
            <p className="font-body text-on-surface-variant text-lg">
              {language === 'tr'
                ? 'Birincil kaynak vPIC, ikincil kaynak yerel WMI çözümleyici.'
                : 'Primary source vPIC, secondary source local WMI decoder.'}
            </p>
          </div>

          <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 mb-8">
            <label className="block text-on-surface-variant text-sm mb-2 font-label uppercase tracking-widest">
              {language === 'tr' ? 'VIN Kodu' : 'VIN Code'}
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder={language === 'tr' ? 'Örn: WVWZZZ1JZ3W386752' : 'Example VIN'}
                className="flex-1 h-12 bg-surface-container-highest rounded-lg px-4 text-on-surface placeholder-on-surface-variant/50 border border-outline-variant/20 focus:border-primary focus:outline-none transition-colors font-body text-sm"
                maxLength={17}
                value={vin}
                onChange={(event) => setVin(event.target.value.toUpperCase())}
                onKeyDown={(event) => event.key === 'Enter' && handleDecode()}
                disabled={isLoading}
              />
              <button
                onClick={handleDecode}
                disabled={isLoading || !vin.trim()}
                className="px-8 h-12 bg-primary-container text-on-primary-fixed rounded-lg font-headline font-bold uppercase text-xs hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? (language === 'tr' ? 'Sorgulanıyor...' : 'Querying...')
                  : (language === 'tr' ? 'Sorgula' : 'Query')}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-error-container/10 rounded-xl p-6 border border-error-container/20 mb-8">
              <div className="flex items-center gap-3 text-error">
                <span className="material-symbols-outlined">error</span>
                <span className="font-label text-sm">{error}</span>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-surface-container-low rounded-xl p-8 border border-primary-container/20 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="font-headline text-2xl font-bold text-on-surface uppercase">
                  {language === 'tr' ? 'Sorgulama Sonucu' : 'Result'}
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary-container/10 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-primary-container" />
                  <span className="font-label text-[10px] uppercase tracking-widest text-primary-container">
                    {result.source} · {result.confidence}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: language === 'tr' ? 'Marka' : 'Make', value: result.make },
                  { label: language === 'tr' ? 'Model' : 'Model', value: result.model },
                  { label: language === 'tr' ? 'Yıl' : 'Year', value: result.year },
                  { label: language === 'tr' ? 'Paket' : 'Trim', value: result.trim },
                  { label: language === 'tr' ? 'Kasa tipi' : 'Body type', value: result.bodyType },
                  { label: language === 'tr' ? 'Motor' : 'Engine', value: result.engine },
                  { label: language === 'tr' ? 'Şanzıman' : 'Transmission', value: result.transmission },
                  { label: language === 'tr' ? 'Yakıt' : 'Fuel', value: result.fuelType },
                  { label: language === 'tr' ? 'Üretici' : 'Manufacturer', value: result.manufacturer },
                  { label: language === 'tr' ? 'Üretim yeri' : 'Plant', value: result.plant },
                ]
                  .filter((item) => item.value)
                  .map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                      <span className="text-on-surface-variant text-sm">{item.label}</span>
                      <span className="font-headline font-bold text-on-surface">{item.value}</span>
                    </div>
                  ))}
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => {
                    setResult(null);
                    setVin('');
                  }}
                  className="flex-1 px-6 py-3 bg-surface-container text-on-surface font-headline font-bold uppercase text-xs rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-all"
                >
                  {language === 'tr' ? 'Yeni sorgu' : 'New query'}
                </button>
                <Link
                  href={`/search?q=${encodeURIComponent(`${result.make ?? ''} ${result.model ?? ''}`.trim())}`}
                  className="flex-1 px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all text-center"
                >
                  {language === 'tr' ? 'Katalogda ara' : 'Search catalog'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
