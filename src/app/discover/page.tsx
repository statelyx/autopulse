'use client';

/**
 * AUTO PULSE — Explore Page
 * Interactive brand and model exploration
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';
import Link from 'next/link';
import { useState } from 'react';

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Brands', icon: 'grid_view' },
    { id: 'performance', name: 'Performance', icon: 'sports_score' },
    { id: 'electric', name: 'Electric', icon: 'electric_car' },
    { id: 'luxury', name: 'Luxury', icon: 'diamond' },
    { id: 'suv', name: 'SUV', icon: 'directions_car' },
  ];

  const brands = [
    { name: 'Porsche', models: 12, category: 'performance' },
    { name: 'Tesla', models: 8, category: 'electric' },
    { name: 'BMW', models: 24, category: 'luxury' },
    { name: 'Mercedes', models: 20, category: 'luxury' },
    { name: 'Ferrari', models: 6, category: 'performance' },
    { name: 'Audi', models: 18, category: 'performance' },
    { name: 'Lexus', models: 10, category: 'luxury' },
    { name: 'Rivian', models: 3, category: 'electric' },
    { name: 'Range Rover', models: 9, category: 'suv' },
    { name: 'Lamborghini', models: 5, category: 'performance' },
    { name: 'Polestar', models: 4, category: 'electric' },
    { name: 'Jaguar', models: 7, category: 'luxury' },
  ];

  const filteredBrands = selectedCategory === 'all'
    ? brands
    : brands.filter(brand => brand.category === selectedCategory);

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-4">
              Explore Vehicles
            </h1>
            <p className="font-body text-on-surface-variant text-lg">
              Browse our comprehensive database of automotive brands and models
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-headline font-bold uppercase text-xs transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary-container text-on-primary-fixed'
                    : 'bg-surface-container text-on-surface/60 hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {category.icon}
                </span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mb-8 bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div>
                  <div className="font-headline text-2xl font-bold text-on-surface">
                    {filteredBrands.length}
                  </div>
                  <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Brands
                  </div>
                </div>
                <div className="h-12 w-px bg-outline-variant/20" />
                <div>
                  <div className="font-headline text-2xl font-bold text-on-surface">
                    {filteredBrands.reduce((sum, b) => sum + b.models, 0)}
                  </div>
                  <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Models
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-surface-container-highest rounded-lg font-label text-[10px] uppercase tracking-widest text-on-surface hover:bg-surface-container transition-all">
                  Sort A-Z
                </button>
                <button className="px-4 py-2 bg-surface-container-highest rounded-lg font-label text-[10px] uppercase tracking-widest text-on-surface hover:bg-surface-container transition-all">
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredBrands.map((brand) => (
              <Link
                key={brand.name}
                href={`/inventory?brand=${brand.name.toLowerCase()}`}
                className="group"
              >
                <div className="h-32 bg-surface-container rounded-xl flex flex-col items-center justify-center border border-outline-variant/5 group-hover:bg-surface-container-high group-hover:border-primary-container/20 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary-container/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors mb-2">
                    directions_car
                  </span>
                  <p className="text-center font-label text-[10px] uppercase tracking-widest text-on-surface group-hover:text-primary transition-colors">
                    {brand.name}
                  </p>
                </div>
                <div className="mt-2 text-center">
                  <p className="font-body text-[10px] text-on-surface-variant/60">
                    {brand.models} models
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-surface-container-low text-on-surface font-headline font-bold uppercase text-xs rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-all active:scale-95">
              Load More Brands
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
