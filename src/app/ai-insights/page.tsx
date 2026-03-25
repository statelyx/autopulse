'use client';

/**
 * AUTO PULSE — AI Insights Page
 * Basic Content State Example
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';

export default function AIInsightsPage() {
  const insights = [
    {
      id: 1,
      title: 'Electric Vehicle Market Shift',
      category: 'Market Trend',
      confidence: 94,
      summary: 'EV adoption accelerated 23% in Q1 2026, with premium segment leading growth.',
      impact: 'high',
    },
    {
      id: 2,
      title: 'Hybrid Powertrain Reliability',
      category: 'Technical Analysis',
      confidence: 87,
      summary: 'Battery degradation rates improved by 15% with new thermal management systems.',
      impact: 'medium',
    },
    {
      id: 3,
      title: 'Luxury Segment Valuation',
      category: 'Price Forecast',
      confidence: 91,
      summary: 'Classic models showing 12% appreciation, particularly 1990s Japanese sports cars.',
      impact: 'high',
    },
  ];

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-2">
                  AI Insights
                </h1>
                <p className="font-body text-on-surface-variant text-lg">
                  Machine learning powered automotive intelligence
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary-container/10 rounded-full">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
                <span className="font-label text-[10px] uppercase tracking-widest text-secondary-container">
                  Live Analysis
                </span>
              </div>
            </div>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 hover:border-primary-container/20 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {insight.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-headline text-sm font-bold text-primary-container">
                      {insight.confidence}%
                    </span>
                    <span className="material-symbols-outlined text-primary-container text-sm">
                      confidence
                    </span>
                  </div>
                </div>

                <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-3">
                  {insight.title}
                </h3>

                <p className="font-body text-on-surface-variant text-sm mb-4 leading-relaxed">
                  {insight.summary}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    insight.impact === 'high' ? 'text-error' : 'text-secondary-container'
                  }`}>
                    {insight.impact} Impact
                  </span>
                  <button className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors">
                    <span className="font-label text-[10px] uppercase tracking-widest font-bold">
                      Details
                    </span>
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 bg-surface-container rounded-2xl p-8 border border-primary-container/20">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface uppercase mb-4">
                  Generate Custom Insight
                </h3>
                <p className="font-body text-on-surface-variant max-w-xl mb-6">
                  Use our AI engine to analyze specific vehicles, compare models, or predict market trends.
                </p>
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all active:scale-95">
                    New Analysis
                  </button>
                  <button className="px-6 py-3 bg-surface-container-low text-on-surface font-headline font-bold uppercase text-xs rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-all active:scale-95">
                    View History
                  </button>
                </div>
              </div>
              <div className="w-20 h-20 rounded-full bg-primary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-container text-4xl">
                  auto_awesome
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
