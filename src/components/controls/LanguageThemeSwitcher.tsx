'use client';

/**
 * AUTO PULSE — Language & Theme Switchers
 * Minimal ayrı butonlar - avatar ve notifications gibi
 */

import { useLanguageTheme } from '@/contexts/LanguageThemeContext';

export function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguageTheme();

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 text-on-surface/60 hover:text-primary-container transition-colors active:scale-95 duration-200"
      title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye geç'}
    >
      <span className="text-2xl">
        {language === 'tr' ? '🇹🇷' : '🇬🇧'}
      </span>
    </button>
  );
}

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useLanguageTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-on-surface/60 hover:text-primary-container transition-colors active:scale-95 duration-200"
      title={theme === 'dark' ? 'Açık moda geç' : 'Karanlık moda geç'}
    >
      <span className="material-symbols-outlined" data-icon={theme === 'dark' ? 'dark_mode' : 'light_mode'}>
        {theme === 'dark' ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  );
}
