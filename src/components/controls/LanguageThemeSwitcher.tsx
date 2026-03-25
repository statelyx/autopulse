'use client';

/**
 * AUTO PULSE — Language & Theme Switcher
 * Dil ve tema değiştirme kontrol paneli
 */

import { useLanguageTheme } from '@/contexts/LanguageThemeContext';
import { useTranslation } from '@/lib/i18n/translations';

export function LanguageThemeSwitcher() {
  const { language, theme, toggleLanguage, toggleTheme } = useLanguageTheme();
  const { t } = useTranslation(language);

  return (
    <div className="flex items-center gap-2 bg-surface-container-highest rounded-full px-2 py-2 border border-outline-variant/10">
      {/* Language Switcher */}
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-container transition-all group"
        title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye geç'}
      >
        {language === 'tr' ? (
          <>
            <span className="text-2xl">🇹🇷</span>
            <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface">
              TR
            </span>
          </>
        ) : (
          <>
            <span className="text-2xl">🇬🇧</span>
            <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface">
              EN
            </span>
          </>
        )}
      </button>

      <div className="w-px h-6 bg-outline-variant/20" />

      {/* Theme Switcher */}
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-container transition-all group"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {theme === 'dark' ? (
          <>
            <span className="material-symbols-outlined text-on-surface group-hover:text-primary transition-colors">
              dark_mode
            </span>
            <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface">
              Dark
            </span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-on-surface group-hover:text-primary transition-colors">
              light_mode
            </span>
            <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface">
              Light
            </span>
          </>
        )}
      </button>
    </div>
  );
}
