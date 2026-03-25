'use client';

/**
 * AUTO PULSE — TopNavBar Component
 * Fixed top navigation bar with backdrop blur
 * Interactive navigation with active states + Minimal Language/Theme controls
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useTranslation } from '@/lib/i18n/translations';
import { LanguageSwitcher, ThemeSwitcher } from '@/components/controls';

export function TopNavBar() {
  const pathname = usePathname();
  const { language } = useLanguageTheme();
  const { t } = useTranslation(language);

  const navItems = [
    { name: 'navHome', href: '/' },
    { name: 'navInventory', href: '/inventory' },
    { name: 'navIntelligence', href: '/intelligence' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl shadow-[0_0_40px_rgba(255,176,0,0.1)] flex justify-between items-center px-8 h-16">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-black tracking-tighter text-on-surface uppercase font-headline hover:text-primary-container transition-colors">
          Auto Pulse
        </Link>
        <div className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-headline font-bold tracking-tight py-1 transition-colors duration-300 ${
                  isActive
                    ? 'text-primary-container border-b-2 border-primary-container'
                    : 'text-on-surface/60 hover:text-primary-container'
                }`}
              >
                {t(item.name as any)}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Dil Butonu - Minimal */}
        <LanguageSwitcher />

        {/* Tema Butonu - Minimal */}
        <ThemeSwitcher />

        {/* Bildirimler */}
        <button className="p-2 text-on-surface/60 hover:text-primary-container transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined" data-icon="notifications">
            notifications
          </span>
        </button>

        {/* Hesap */}
        <Link href="/auth/login" className="p-2 text-on-surface/60 hover:text-primary-container transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined" data-icon="account_circle">
            account_circle
          </span>
        </Link>
      </div>
    </nav>
  );
}
