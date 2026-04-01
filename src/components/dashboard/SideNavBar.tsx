'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useTranslation } from '@/lib/i18n/translations';

export function SideNavBar() {
  const pathname = usePathname();
  const { language } = useLanguageTheme();
  const { t } = useTranslation(language);

  const navItems = [
    { name: 'navHome', href: '/', icon: 'home' },
    { name: 'navExplore', href: '/discover', icon: 'explore' },
    { name: 'navInventory', href: '/inventory', icon: 'directions_car' },
    { name: 'navCompare', href: '/compare', icon: 'compare_arrows' },
    { name: 'navAiInsights', href: '/ai-insights', icon: 'psychology' },
    { name: 'navSaved', href: '/saved', icon: 'bookmark' },
  ];

  return (
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-64px)] w-64 flex-col border-r border-white/10 bg-[#0b0907] px-4 py-6 md:flex">
      <div className="mb-6 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,176,0,0.14),rgba(255,176,0,0.02))] p-5">
        <h3 className="text-xs font-medium uppercase tracking-[0.3em] text-amber-200/80">
          {language === 'tr' ? 'AI Kokpit' : 'AI Cockpit'}
        </h3>
        <p className="mt-2 text-sm leading-6 text-stone-300">
          Araç keşfi, AI özetleri ve premium üyelik akışı tek panelde.
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 rounded-2xl px-4 py-3 text-xs font-medium uppercase tracking-[0.24em] transition ${
                isActive
                  ? 'bg-amber-400 text-[#241907]'
                  : 'text-stone-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
              {t(item.name as never)}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[28px] border border-white/10 bg-white/5 p-5">
        <div className="text-xs uppercase tracking-[0.3em] text-stone-500">Ücretsiz plan</div>
        <div className="mt-2 text-xl font-black text-white">3 soru / 3 saat</div>
        <p className="mt-2 text-sm text-stone-400">Sabit AI asistan her sayfada açık. Limit dolunca üyelik ekranı devreye girer.</p>
        <Link href="/membership" className="mt-4 inline-flex rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#241907]">
          Planları gör
        </Link>
      </div>
    </aside>
  );
}
