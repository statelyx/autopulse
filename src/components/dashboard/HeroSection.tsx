'use client';

/**
 * AUTO PULSE — HeroSection Component
 * Main hero section with dramatic car image and AI search bar
 * From stitch/stitch/auto_pulse_dashboard/code.html + Translations
 */

import { useState } from 'react';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useTranslation } from '@/lib/i18n/translations';
import { useRouter } from 'next/navigation';

export function HeroSection() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguageTheme();
  const { t } = useTranslation(language);
  const router = useRouter();

  const handleAnalyze = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <section className="relative h-[870px] w-full overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover brightness-[0.2] saturate-50"
          alt="dramatic low angle front view of a black modern supercar in a dark futuristic studio with sharp leading lines and orange ambient glows"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYHqa1KWlxGhxz4ZEj0a45sVgR18LsdIDBVIHbdjIxc5F4IpcFNT90PIGtF_1ZGX7G9wc-Kt8E72tm_Eqs6OO6tic02_LHCPoB6r8E8N1KVMmhUQe8JxkRAzMqzHapQC8-VV5K0NrSA4iuzUsOLoAAJh6MiU1NPBJxLYnLcF6IAd7tE7Jtn4G3Xai0JMzizI7B-7f8GCbr9taqGZNNfJaod7incc9FoG1-kBF04uvU2DbwUNZDnqr4JBC3Z94kUyQjJVph73wpxDc"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full high-beam-effect opacity-40 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-5xl px-8 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-highest rounded-full border border-outline-variant/15 mb-6">
          <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim shadow-[0_0_8px_#00dbe9]" />
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
            {t('heroLiveTelemetry')}
          </span>
        </div>

        <h1 className="font-headline text-5xl md:text-8xl font-black text-on-surface text-center leading-none tracking-tighter uppercase mb-4">
          {t('heroTitle').split(' ').map((word, i) =>
            i === 2 ? (
              <span key={i} className="text-primary-container">{word}</span>
            ) : (
              <span key={i}>{word} </span>
            )
          )}
        </h1>

        <p className="font-body text-on-surface-variant text-lg md:text-xl max-w-2xl text-center mb-12 font-light leading-relaxed">
          {t('heroSubtitle')}
        </p>

        {/* Premium AI Search Bar */}
        <div className="w-full max-w-3xl relative group" onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)}>
          <div className="absolute -inset-1 bg-primary-container/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden glass-panel">
            <span className="material-symbols-outlined ml-6 text-on-surface-variant" data-icon="search">
              search
            </span>
            <input
              className="w-full bg-transparent border-none text-on-surface font-body px-6 py-6 focus:ring-0 placeholder:text-on-surface-variant/40 placeholder:uppercase placeholder:tracking-widest placeholder:text-xs"
              placeholder={t('heroSearchPlaceholder')}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleAnalyze}
              className="mr-4 px-6 py-3 bg-primary-container text-on-primary-fixed font-headline font-bold uppercase text-xs rounded-lg hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!searchQuery.trim()}
            >
              {language === 'tr' ? 'Analiz Et' : 'Synthesize'}
            </button>
          </div>

          {/* Search Dropdown Suggestion */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 w-full mt-4 bg-surface-container-low border border-outline-variant/15 rounded-xl z-20 overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-outline-variant/5">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                  Trending Assets
                </span>
              </div>
              <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center gap-4 p-3 hover:bg-surface-container-highest rounded-lg cursor-pointer transition-colors group/item">
                  <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary" data-icon="directions_car">
                      directions_car
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold font-headline uppercase group-hover/item:text-primary transition-colors">
                      Lamborghini Revuelto
                    </div>
                    <div className="text-[10px] text-on-surface-variant/40">2024 Performance Segment</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 hover:bg-surface-container-highest rounded-lg cursor-pointer transition-colors group/item">
                  <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary" data-icon="bolt">
                      bolt
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold font-headline uppercase group-hover/item:text-primary transition-colors">
                      Tesla Model S Plaid
                    </div>
                    <div className="text-[10px] text-on-surface-variant/40">2023 EV Market</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
