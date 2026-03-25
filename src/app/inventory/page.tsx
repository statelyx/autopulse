'use client';

/**
 * AUTO PULSE — Inventory Page
 * Loading State Example
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';
import { useEffect, useState } from 'react';

export default function InventoryPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-4">
              Vehicle Inventory
            </h1>
            <p className="font-body text-on-surface-variant text-lg">
              Explore our comprehensive database of automotive intelligence
            </p>
          </div>

          {isLoading ? (
            // Loading State
            <div className="space-y-6">
              {/* Skeleton Loader */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-surface-container rounded-xl p-6 animate-pulse">
                    <div className="h-40 bg-surface-container-highest rounded-lg mb-4" />
                    <div className="h-4 bg-surface-container-highest rounded w-3/4 mb-2" />
                    <div className="h-3 bg-surface-container-highest rounded w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Loaded State (Basic Content)
            <div className="space-y-6">
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-headline text-xl font-bold uppercase mb-2">
                      Database Loading Complete
                    </h2>
                    <p className="font-body text-on-surface-variant text-sm">
                      Inventory system ready for vehicle queries
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-container text-3xl">
                      check_circle
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {['Performance', 'Electric', 'SUV', 'Classic'].map((category) => (
                    <button
                      key={category}
                      className="p-4 bg-surface-container-lowest rounded-lg hover:bg-surface-container transition-colors text-left"
                    >
                      <div className="font-headline text-xs font-bold uppercase text-on-surface mb-1">
                        {category}
                      </div>
                      <div className="font-body text-[10px] text-on-surface-variant/60">
                        Browse Category
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
