'use client';

/**
 * AUTO PULSE — FilterSection Component
 * Filter panel with manufacturer, model, and year range
 * From stitch/stitch/auto_pulse_dashboard/code.html
 */

import { useState } from 'react';

export function FilterSection() {
  const [yearRange, setYearRange] = useState([1990, 2026]);

  return (
    <section className="max-w-7xl mx-auto px-8 -mt-16 relative z-30 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-8 bg-surface-container-low/80 backdrop-blur-3xl rounded-2xl border border-outline-variant/10 shadow-2xl">
        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant px-1">
            Manufacturer
          </label>
          <select className="w-full bg-surface-container-lowest border-none text-on-surface rounded-lg py-3 px-4 font-body text-sm focus:ring-1 focus:ring-primary-container">
            <option>Select Make</option>
            <option>Porsche</option>
            <option>Ferrari</option>
            <option>BMW</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant px-1">
            Designation
          </label>
          <select className="w-full bg-surface-container-lowest border-none text-on-surface rounded-lg py-3 px-4 font-body text-sm focus:ring-1 focus:ring-primary-container">
            <option>Select Model</option>
            <option>911 GT3 RS</option>
            <option>M4 Competition</option>
            <option>SF90 Stradale</option>
          </select>
        </div>

        <div className="lg:col-span-2 space-y-4 px-2">
          <div className="flex justify-between items-center">
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              Epoch Spectrum
            </label>
            <span className="text-primary text-xs font-headline font-bold tracking-widest">
              {yearRange[0]} — {yearRange[1]}
            </span>
          </div>
          <div className="relative w-full">
            <input
              className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container"
              min="1990"
              max="2026"
              type="range"
              value={yearRange[1]}
              onChange={(e) => setYearRange([1990, parseInt(e.target.value)])}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
