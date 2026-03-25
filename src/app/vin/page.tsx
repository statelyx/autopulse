'use client';

/**
 * AUTO PULSE — VIN Page
 * VIN sorgulama - Future-ready yapı
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useState } from 'react';
import { vinAdapter } from '@/lib/adapters/vin-adapter';
import type { VINDecodeResult } from '@/lib/adapters/vin-adapter';
import Link from 'next/link';

export default function VinPage() {
  const { language } = useLanguageTheme();
  const [vin, setVin] = useState('');
  const [result, setResult] = useState<VINDecodeResult | null>(null);
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
      const decodeResult = await vinAdapter.decode(vin);
      setResult(decodeResult);

      if (decodeResult.error) {
        setError(decodeResult.error);
      }
    } catch (err) {
      setError(language === 'tr' ? 'Sorgulama başarısız' : 'Query failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDecode();
    }
  };

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-2">
              {language === 'tr' ? 'VIN Sorgulama' : 'VIN Lookup'}
            </h1>
            <p className="font-body text-on-surface-variant text-lg">
              {language === 'tr'
                ? 'Araç şasi numarası ile detaylı sorgulama'
                : 'Detailed vehicle lookup by chassis number'}
            </p>
          </div>

          {/* VIN Input */}
          <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 mb-8">
            <label className="block text-on-surface-variant text-sm mb-2 font-label uppercase tracking-widest">
              {language === 'tr' ? 'VIN Kodu' : 'VIN Code'}
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder={language === 'tr' ? 'Örn: WVWZZZ... (17 karakter)' : 'Ex: WVWZZZ... (17 characters)'}
                className="flex-1 h-12 bg-surface-container-highest rounded-lg px-4 text-on-surface placeholder-on-surface-variant/50 border border-outline-variant/20 focus:border-primary focus:outline-none transition-colors font-body text-sm"
                maxLength={17}
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                onClick={handleDecode}
                disabled={isLoading || !vin.trim()}
                className="px-8 h-12 bg-primary-container text-on-primary-fixed rounded-lg font-headline font-bold uppercase text-xs hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? (language === 'tr' ? 'Sorgulanıyor...' : 'Querying...')
                  : (language === 'tr' ? 'Sorgula' : 'Query')
                }
              </button>
            </div>

            {/* Character count */}
            <div className="mt-2 flex justify-between text-xs text-on-surface-variant/60">
              <span>{language === 'tr' ? 'Karakter' : 'Characters'}: {vin.length}/17</span>
              <span className={vin.length === 17 ? 'text-primary' : ''}>
                {vin.length === 17
                  ? (language === 'tr' ? '✓ Geçerli' : '✓ Valid')
                  : (language === 'tr' ? '17 karakter gerekli' : '17 characters required')
                }
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-error-container/10 rounded-xl p-6 border border-error-container/20 mb-8">
              <div className="flex items-center gap-3 text-error">
                <span className="material-symbols-outlined">error</span>
                <span className="font-label text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Results */}
          {result && !result.error && (
            <div className="bg-surface-container-low rounded-xl p-8 border border-primary-container/20 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-2xl font-bold text-on-surface uppercase">
                  {language === 'tr' ? 'Sorgulama Sonucu' : 'Query Result'}
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary-container/10 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-primary-container" />
                  <span className="font-label text-[10px] uppercase tracking-widest text-primary-container">
                    {language === 'tr' ? 'Başarılı' : 'Success'}
                  </span>
                </div>
              </div>

              {/* Vehicle Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.make && (
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant text-sm">
                      {language === 'tr' ? 'Marka' : 'Make'}
                    </span>
                    <span className="font-headline font-bold text-on-surface">
                      {result.make}
                    </span>
                  </div>
                )}

                {result.model && (
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant text-sm">
                      {language === 'tr' ? 'Model' : 'Model'}
                    </span>
                    <span className="font-headline font-bold text-on-surface">
                      {result.model}
                    </span>
                  </div>
                )}

                {result.year && (
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant text-sm">
                      {language === 'tr' ? 'Yıl' : 'Year'}
                    </span>
                    <span className="font-headline font-bold text-on-surface">
                      {result.year}
                    </span>
                  </div>
                )}

                {result.trim && (
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant text-sm">
                      {language === 'tr' ? 'Paket' : 'Trim'}
                    </span>
                    <span className="font-headline font-bold text-on-surface">
                      {result.trim}
                    </span>
                  </div>
                )}

                {result.bodyType && (
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant text-sm">
                      {language === 'tr' ? 'Kasa Tipi' : 'Body Type'}
                    </span>
                    <span className="font-headline font-bold text-on-surface">
                      {result.bodyType}
                    </span>
                  </div>
                )}

                {result.engine && (
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant text-sm">
                      {language === 'tr' ? 'Motor' : 'Engine'}
                    </span>
                    <span className="font-headline font-bold text-on-surface">
                      {result.engine}
                    </span>
                  </div>
                )}

                {result.transmission && (
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant text-sm">
                      {language === 'tr' ? 'Şanzıman' : 'Transmission'}
                    </span>
                    <span className="font-headline font-bold text-on-surface">
                      {result.transmission}
                    </span>
                  </div>
                )}

                {result.driveType && (
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant text-sm">
                      {language === 'tr' ? 'Çekiş' : 'Drive Type'}
                    </span>
                    <span className="font-headline font-bold text-on-surface">
                      {result.driveType}
                    </span>
                  </div>
                )}

                {result.fuelType && (
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant text-sm">
                      {language === 'tr' ? 'Yakıt' : 'Fuel'}
                    </span>
                    <span className="font-headline font-bold text-on-surface">
                      {result.fuelType}
                    </span>
                  </div>
                )}

                {result.manufacturer && (
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant text-sm">
                      {language === 'tr' ? 'Üretici' : 'Manufacturer'}
                    </span>
                    <span className="font-headline font-bold text-on-surface">
                      {result.manufacturer}
                    </span>
                  </div>
                )}

                {result.plant && (
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant text-sm">
                      {language === 'tr' ? 'Üretim Yeri' : 'Plant'}
                    </span>
                    <span className="font-headline font-bold text-on-surface">
                      {result.plant}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => {
                    setResult(null);
                    setVin('');
                  }}
                  className="flex-1 px-6 py-3 bg-surface-container text-on-surface font-headline font-bold uppercase text-xs rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-all active:scale-95"
                >
                  {language === 'tr' ? 'Yeni Sorgulama' : 'New Query'}
                </button>
                {result.make && result.model && (
                  <Link
                    href="/inventory"
                    className="flex-1 px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all active:scale-95 text-center"
                  >
                    {language === 'tr' ? 'Envantere Git' : 'Go to Inventory'}
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">
                info
              </span>
              <div>
                <h3 className="font-headline text-sm font-bold text-on-surface uppercase mb-2">
                  {language === 'tr' ? 'VIN Nedir?' : 'What is VIN?'}
                </h3>
                <p className="font-body text-on-surface-variant text-sm">
                  {language === 'tr'
                    ? 'VIN (Vehicle Identification Number) araçın kimlik numarasıdır. Sürücü kabini üzerindeki plakada, araç kayıt belgesinde veya ön camın alt köşesinde bulunur. 17 karakterden oluşur ve araçın üretici, model, yıl ve diğer özelliklerini içerir.'
                    : 'VIN (Vehicle Identification Number) is the vehicle\'s unique identifier. Found on the dashboard plate, registration document, or lower corner of the windshield. It consists of 17 characters and includes the vehicle\'s manufacturer, model, year, and other features.'
                  }
                </p>
                <div className="mt-4 p-4 bg-surface-container-highest rounded-lg">
                  <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                    {language === 'tr' ? 'Örnek VIN' : 'Example VIN'}
                  </div>
                  <code className="font-mono text-sm text-primary">
                    WVWZZZ1JZKW123456
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
