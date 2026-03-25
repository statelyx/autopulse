'use client';

/**
 * AUTO PULSE — Intelligence Page
 * Empty State Example
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
              AI Intelligence Hub
            </h1>
            <p className="font-body text-on-surface-variant text-lg">
              Advanced analytics and predictive modeling
            </p>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-on-surface/40 text-5xl">
                psychology
              </span>
            </div>

            <h2 className="font-headline text-2xl font-bold text-on-surface uppercase mb-4 text-center">
              No Intelligence Reports Yet
            </h2>

            <p className="font-body text-on-surface-variant text-center max-w-md mb-8">
              Start analyzing vehicles to generate AI-powered insights. Compare models,
              track trends, and discover patterns in automotive data.
            </p>

            <div className="flex gap-4">
              <Link
                href="/explore"
                className="px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all active:scale-95"
              >
                Explore Vehicles
              </Link>
              <Link
                href="/compare"
                className="px-6 py-3 bg-surface-container text-on-surface font-headline font-bold uppercase text-xs rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-all active:scale-95"
              >
                Start Comparison
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Market Analysis',
                description: 'Real-time price trends and valuation data',
                icon: 'trending_up',
                action: 'View Analytics',
              },
              {
                title: 'Failure Prediction',
                description: 'AI-powered reliability forecasting',
                icon: 'warning',
                action: 'Check Models',
              },
              {
                title: 'Comparative Reports',
                description: 'Side-by-side vehicle intelligence',
                icon: 'compare_arrows',
                action: 'Compare Now',
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
