'use client';

/**
 * AUTO PULSE — Saved Page
 * User's saved vehicles and collections
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';
import Link from 'next/link';
import { useState } from 'react';

export default function SavedPage() {
  const [savedVehicles] = useState([
    { id: 1, name: '911 GT3 RS', brand: 'Porsche', year: 2024, addedAt: '2 hours ago' },
    { id: 2, name: 'Model S Plaid', brand: 'Tesla', year: 2023, addedAt: '1 day ago' },
  ]);

  const collections = [
    { id: 1, name: 'Dream Garage', count: 5, icon: 'favorite' },
    { id: 2, name: 'Research List', count: 8, icon: 'search' },
  ];

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-2">
                Saved Vehicles
              </h1>
              <p className="font-body text-on-surface-variant text-lg">
                Your personalized collection and research lists
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-surface-container-low text-on-surface font-headline font-bold uppercase text-xs rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-all active:scale-95">
                Create Collection
              </button>
            </div>
          </div>

          {savedVehicles.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-on-surface/40 text-5xl">
                  bookmark
                </span>
              </div>
              <h2 className="font-headline text-2xl font-bold text-on-surface uppercase mb-4 text-center">
                No Saved Vehicles Yet
              </h2>
              <p className="font-body text-on-surface-variant text-center max-w-md mb-8">
                Start exploring and save vehicles to build your collection. Create lists for
                different research projects or dream garage scenarios.
              </p>
              <Link
                href="/explore"
                className="px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all active:scale-95"
              >
                Start Exploring
              </Link>
            </div>
          ) : (
            <>
              {/* Collections */}
              <div className="mb-12">
                <h2 className="font-headline text-lg font-bold text-on-surface uppercase mb-6">
                  Collections
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {collections.map((collection) => (
                    <button
                      key={collection.id}
                      className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-primary-container/20 transition-all text-left"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="material-symbols-outlined text-primary-container text-3xl">
                          {collection.icon}
                        </span>
                        <span className="px-2 py-1 bg-surface-container-highest rounded-full text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          {collection.count} vehicles
                        </span>
                      </div>
                      <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-2">
                        {collection.name}
                      </h3>
                      <p className="font-body text-sm text-on-surface-variant">
                        Last updated 2 days ago
                      </p>
                    </button>
                  ))}
                  <button className="p-6 bg-surface-container rounded-xl border-2 border-dashed border-outline-variant/20 hover:border-primary-container/40 transition-all flex items-center justify-center">
                    <div className="text-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
                        add
                      </span>
                      <p className="font-headline text-sm font-bold text-on-surface uppercase">
                        New Collection
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Saved Vehicles */}
              <div>
                <h2 className="font-headline text-lg font-bold text-on-surface uppercase mb-6">
                  All Saved Vehicles ({savedVehicles.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedVehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10 hover:border-primary-container/20 transition-all group"
                    >
                      <div className="h-40 bg-surface-container-highest flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-on-surface-variant group-hover:text-primary transition-colors">
                          directions_car
                        </span>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-1">
                              {vehicle.name}
                            </h3>
                            <p className="font-body text-sm text-on-surface-variant">
                              {vehicle.brand}
                            </p>
                          </div>
                          <button className="p-2 hover:bg-surface-container-highest rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-error">
                              bookmark
                            </span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-body text-xs text-on-surface-variant/60">
                            Added {vehicle.addedAt}
                          </span>
                          <Link
                            href={`/compare?add=${vehicle.id}`}
                            className="px-3 py-1 bg-surface-container-highest rounded text-[10px] font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container transition-all"
                          >
                            Compare
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
