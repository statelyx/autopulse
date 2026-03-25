'use client';

/**
 * AUTO PULSE — İstihbarat Sayfası
 * Yapay zeka destekli otomotiv analitiği
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';
import Link from 'next/link';

export default function IntelligencePage() {
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
              Gelişmiş analitik ve öngörü modelleme
            </p>
          </div>

          {/* Boş Durum */}
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-on-surface/40 text-5xl">
                psychology
              </span>
            </div>

            <h2 className="font-headline text-2xl font-bold text-on-surface uppercase mb-4 text-center">
              Henüz İstihbarat Raporu Yok
            </h2>

            <p className="font-body text-on-surface-variant text-center max-w-md mb-8">
              Araçları analiz etmeye başlayarak yapay zeka destekli içgörüler oluşturun.
              Modelleri karşılaştırın, trendleri takip edin ve otomotiv verilerinde kalıplar keşfedin.
            </p>

            <div className="flex gap-4">
              <Link
                href="/discover"
                className="px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all active:scale-95"
              >
                Araçları Keşfet
              </Link>
              <Link
                href="/compare"
                className="px-6 py-3 bg-surface-container text-on-surface font-headline font-bold uppercase text-xs rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-all active:scale-95"
              >
                Karşılaştırmayı Başlat
              </Link>
            </div>
          </div>

          {/* Hızlı İşlemler */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Piyasa Analizi',
                description: 'Gerçek zamanlı fiyat trendleri ve değerleme verileri',
                icon: 'trending_up',
                action: 'Analitiği Görüntüle',
              },
              {
                title: 'Arıza Tahmini',
                description: 'Yapay zeka destekli güvenilirlik öngörüsü',
                icon: 'warning',
                action: 'Modelleri Kontrol Et',
              },
              {
                title: 'Karşılaştırmalı Raporlar',
                description: 'Yan yana araç istihbaratı',
                icon: 'compare_arrows',
                action: 'Şimdi Karşılaştır',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 hover:border-primary-container/20 transition-all group"
              >
                <span className="material-symbols-outlined text-primary-container text-4xl mb-4">
                  {card.icon}
                </span>
                <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-2">
                  {card.title}
                </h3>
                <p className="font-body text-on-surface-variant text-sm mb-4">
                  {card.description}
                </p>
                <button className="font-label text-[10px] uppercase tracking-widest text-primary group-hover:underline transition-all">
                  {card.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
