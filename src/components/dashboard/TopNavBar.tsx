'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LanguageSwitcher, ThemeSwitcher } from '@/components/controls';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { type TranslationKey, useTranslation } from '@/lib/i18n/translations';

export function TopNavBar() {
  const pathname = usePathname();
  const { language } = useLanguageTheme();
  const { t } = useTranslation(language);

  const navItems = [
    { name: 'navHome', href: '/' },
    { name: 'navExplore', href: '/discover' },
    { name: 'navInventory', href: '/inventory' },
    { name: 'navIntelligence', href: '/intelligence' },
  ];

  return (
    <nav className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#0d0b09]/85 px-5 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400 text-sm font-black text-[#221707] shadow-[0_10px_30px_rgba(255,176,0,0.35)]">
            AP
          </span>
          <div className="hidden sm:block">
            <div className="text-xs uppercase tracking-[0.32em] text-stone-500">Auto Pulse</div>
            <div className="text-sm font-semibold text-white">AI Vehicle Desk</div>
          </div>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${
                  isActive
                    ? 'bg-amber-400 text-[#241907]'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {t(item.name as TranslationKey)}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
        <Link href="/membership" className="hidden rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-100 transition hover:bg-amber-400/15 md:block">
          Premium
        </Link>
        <Link href="/auth/login" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-300 transition hover:text-white">
          <span className="material-symbols-outlined">account_circle</span>
        </Link>
      </div>
    </nav>
  );
}
