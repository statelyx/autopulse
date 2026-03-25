'use client';

/**
 * AUTO PULSE — SideNavBar Component
 * Fixed left sidebar navigation (hidden on mobile)
 * Interactive navigation with active states + Translations
 */

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
    { name: 'navExplore', href: '/explore', icon: 'explore' },
    { name: 'navCompare', href: '/compare', icon: 'compare_arrows' },
    { name: 'navSaved', href: '/saved', icon: 'bookmark' },
    { name: 'navAiInsights', href: '/ai-insights', icon: 'psychology' },
  ];

  return (
    <aside className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-background flex-col py-8 gap-4 z-40">
      <div className="px-6 mb-4">
        <h3 className="font-body text-xs font-medium uppercase tracking-widest text-primary-container">
          {language === 'tr' ? 'İstihbarat' : 'Intelligence'}
        </h3>
        <p className="text-[10px] text-on-surface/40 uppercase tracking-tighter mt-1">
          v2.4 Live
        </p>
      </div>
      <nav className="flex flex-col">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-3 transition-all duration-300 ease-in-out font-body text-xs font-medium uppercase tracking-widest ${
                isActive
                  ? 'bg-secondary-container/5 text-secondary-container border-r-2 border-secondary-container'
                  : 'text-on-surface/40 hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-sm" data-icon={item.icon}>
                {item.icon}
              </span>
              {t(item.name as any)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
