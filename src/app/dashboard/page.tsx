'use client';

/**
 * AUTO PULSE — Dashboard Page
 * User dashboard with statistics and activity
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    { label: 'Vehicles Viewed', value: '24', change: '+12%', trend: 'up' },
    { label: 'Comparisons Made', value: '8', change: '+3', trend: 'up' },
    { label: 'Saved Items', value: '5', change: '+2', trend: 'up' },
    { label: 'AI Queries', value: '15', change: '+8', trend: 'up' },
  ];

  const recentActivity = [
    { type: 'view', vehicle: 'Porsche 911 GT3 RS', time: '2 hours ago' },
    { type: 'compare', vehicle: 'BMW M4 vs Tesla Model S', time: '5 hours ago' },
    { type: 'save', vehicle: 'Ferrari SF90 Stradale', time: '1 day ago' },
    { type: 'search', vehicle: 'Electric SUVs under $80k', time: '2 days ago' },
  ];

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-4">
              Dashboard
            </h1>
            <p className="font-body text-on-surface-variant text-lg">
              Your activity overview and quick access to saved content
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {stat.label}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                      stat.trend === 'up'
                        ? 'bg-secondary-container/10 text-secondary-container'
                        : 'bg-error-container/10 text-error'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <div className="font-headline text-4xl font-black text-on-surface">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-headline text-xl font-bold text-on-surface uppercase">
                    Recent Activity
                  </h2>
                  <Link
                    href="/saved"
                    className="font-label text-[10px] uppercase tracking-widest text-primary hover:underline transition-all"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-surface-container-highest rounded-lg hover:bg-surface-container transition-colors"
                    >
                      <span
                        className={`material-symbols-outlined ${
                          activity.type === 'view'
                            ? 'text-primary'
                            : activity.type === 'compare'
                            ? 'text-secondary-container'
                            : activity.type === 'save'
                            ? 'text-error'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        {activity.type === 'view'
                          ? 'visibility'
                          : activity.type === 'compare'
                          ? 'compare_arrows'
                          : activity.type === 'save'
                          ? 'bookmark'
                          : 'search'}
                      </span>
                      <div className="flex-1">
                        <p className="font-body text-sm text-on-surface">{activity.vehicle}</p>
                        <p className="font-body text-[10px] text-on-surface-variant/60">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <h2 className="font-headline text-xl font-bold text-on-surface uppercase mb-6">
                  Quick Actions
                </h2>

                <div className="space-y-3">
                  <Link
                    href="/compare"
                    className="flex items-center gap-3 p-4 bg-surface-container-highest rounded-lg hover:bg-surface-container transition-colors group"
                  >
                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                      compare_arrows
                    </span>
                    <div className="flex-1 text-left">
                      <p className="font-headline text-xs font-bold text-on-surface uppercase">
                        New Comparison
                      </p>
                      <p className="font-body text-[10px] text-on-surface-variant">
                        Compare vehicles
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/explore"
                    className="flex items-center gap-3 p-4 bg-surface-container-highest rounded-lg hover:bg-surface-container transition-colors group"
                  >
                    <span className="material-symbols-outlined text-secondary-container group-hover:scale-110 transition-transform">
                      explore
                    </span>
                    <div className="flex-1 text-left">
                      <p className="font-headline text-xs font-bold text-on-surface uppercase">
                        Explore
                      </p>
                      <p className="font-body text-[10px] text-on-surface-variant">
                        Browse vehicles
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/ai-insights"
                    className="flex items-center gap-3 p-4 bg-surface-container-highest rounded-lg hover:bg-surface-container transition-colors group"
                  >
                    <span className="material-symbols-outlined text-error group-hover:scale-110 transition-transform">
                      psychology
                    </span>
                    <div className="flex-1 text-left">
                      <p className="font-headline text-xs font-bold text-on-surface uppercase">
                        AI Insights
                      </p>
                      <p className="font-body text-[10px] text-on-surface-variant">
                        Get analysis
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
