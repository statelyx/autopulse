'use client';

/**
 * AUTO PULSE — Compare Page
 * Interactive vehicle comparison with slots
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';
import { useState } from 'react';
import Link from 'next/link';

type ComparisonSlot = {
  id: number;
  vehicle: {
    name: string;
    brand: string;
    year: number;
    image: string;
  } | null;
};

export default function ComparePage() {
  const [slots, setSlots] = useState<ComparisonSlot[]>([
    { id: 1, vehicle: null },
    { id: 2, vehicle: null },
    { id: 3, vehicle: null },
  ]);

  const sampleVehicles = [
    { name: '911 GT3 RS', brand: 'Porsche', year: 2024, image: '/placeholder.png' },
    { name: 'Model S Plaid', brand: 'Tesla', year: 2024, image: '/placeholder.png' },
    { name: 'M4 Competition', brand: 'BMW', year: 2024, image: '/placeholder.png' },
  ];

  const addVehicle = (slotId: number) => {
    const randomVehicle = sampleVehicles[Math.floor(Math.random() * sampleVehicles.length)];
    setSlots(slots.map(slot =>
      slot.id === slotId
        ? { ...slot, vehicle: randomVehicle }
        : slot
    ));
  };

  const removeVehicle = (slotId: number) => {
    setSlots(slots.map(slot =>
      slot.id === slotId
        ? { ...slot, vehicle: null }
        : slot
    ));
  };

  const clearAll = () => {
    setSlots([
      { id: 1, vehicle: null },
      { id: 2, vehicle: null },
      { id: 3, vehicle: null },
    ]);
  };

  const filledSlots = slots.filter(s => s.vehicle).length;

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-2">
                Compare Vehicles
              </h1>
              <p className="font-body text-on-surface-variant text-lg">
                Side-by-side vehicle intelligence and specifications
              </p>
            </div>
            {filledSlots > 0 && (
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-surface-container-low text-on-surface font-headline font-bold uppercase text-xs rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-all active:scale-95"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Comparison Slots */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10 hover:border-primary-container/20 transition-all"
              >
                {slot.vehicle ? (
                  // Filled Slot
                  <div className="h-full">
                    <div className="h-48 bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-primary-container">
                        directions_car
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-1">
                            {slot.vehicle.name}
                          </h3>
                          <p className="font-body text-sm text-on-surface-variant">
                            {slot.vehicle.brand}
                          </p>
                        </div>
                        <button
                          onClick={() => removeVehicle(slot.id)}
                          className="p-2 hover:bg-surface-container-highest rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-error">
                            close
                          </span>
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-on-surface-variant">Year</span>
                          <span className="font-headline font-bold text-on-surface">{slot.vehicle.year}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-on-surface-variant">Segment</span>
                          <span className="font-headline font-bold text-on-surface">Performance</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Empty Slot
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <button
                        onClick={() => addVehicle(slot.id)}
                        className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center mx-auto mb-4 hover:bg-surface-container transition-colors group"
                      >
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors">
                          add
                        </span>
                      </button>
                      <p className="font-headline text-sm font-bold text-on-surface uppercase mb-2">
                        Add Vehicle
                      </p>
                      <p className="font-body text-xs text-on-surface-variant">
                        Slot {slot.id} of 3
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Comparison Results */}
          {filledSlots >= 2 && (
            <div className="bg-surface-container-low rounded-xl p-8 border border-primary-container/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-2xl font-bold text-on-surface uppercase">
                  Comparison Results
                </h2>
                <span className="px-3 py-1 bg-primary-container/10 text-primary-container rounded-full font-label text-[10px] uppercase tracking-widest font-bold">
                  {filledSlots} Vehicles
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-surface-container-highest rounded-lg">
                  <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                    AI Analysis
                  </div>
                  <p className="font-body text-sm text-on-surface">
                    Detailed comparison ready for {filledSlots} vehicles
                  </p>
                </div>
                <div className="p-4 bg-surface-container-highest rounded-lg">
                  <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                    Price Delta
                  </div>
                  <p className="font-headline text-lg font-bold text-primary-container">
                    Calculate
                  </p>
                </div>
                <div className="p-4 bg-surface-container-highest rounded-lg">
                  <div className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                    Recommendation
                  </div>
                  <p className="font-body text-sm text-on-surface">
                    Add 3rd vehicle for full analysis
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button className="flex-1 px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all active:scale-95">
                  Generate Full Report
                </button>
                <button className="px-6 py-3 bg-surface-container text-on-surface font-headline font-bold uppercase text-xs rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-all active:scale-95">
                  Export Data
                </button>
              </div>
            </div>
          )}

          {/* Quick Add Suggestions */}
          {filledSlots < 3 && (
            <div className="mt-12">
              <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-6">
                Popular Comparisons
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { vehicles: ['Porsche 911', 'BMW M4', 'Mercedes AMG'], category: 'Performance' },
                  { vehicles: ['Tesla Model S', 'Rivian R1T', 'Lucid Air'], category: 'Electric' },
                  { vehicles: ['Range Rover', 'LX 600', 'G-Wagon'], category: 'Luxury SUV' },
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const emptySlot = slots.find(s => !s.vehicle);
                      if (emptySlot) addVehicle(emptySlot.id);
                    }}
                    className="p-4 bg-surface-container rounded-lg border border-outline-variant/10 hover:border-primary-container/20 transition-all text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        {suggestion.category}
                      </span>
                      <span className="material-symbols-outlined text-primary">
                        add_circle
                      </span>
                    </div>
                    <div className="space-y-1">
                      {suggestion.vehicles.map((vehicle, vIdx) => (
                        <div key={vIdx} className="font-body text-xs text-on-surface">
                          {vehicle}
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
