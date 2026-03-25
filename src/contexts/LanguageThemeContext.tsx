'use client';

/**
 * AUTO PULSE — Language & Theme Context
 * Dil ve tema yönetimi için global context
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Language = 'tr' | 'en';
type Theme = 'light' | 'dark';

interface LanguageThemeContextType {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleLanguage: () => void;
  toggleTheme: () => void;
}

const LanguageThemeContext = createContext<LanguageThemeContextType | undefined>(undefined);

export function LanguageThemeProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr');
  const [theme, setThemeState] = useState<Theme>('dark');

  // LocalStorage'dan yükle
  useEffect(() => {
    const savedLanguage = localStorage.getItem('autopulse-language') as Language;
    const savedTheme = localStorage.getItem('autopulse-theme') as Theme;

    if (savedLanguage && (savedLanguage === 'tr' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }

    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeState(savedTheme);
    }
  }, []);

  // Temayı HTML class'ına uygula
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('autopulse-language', lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('autopulse-theme', newTheme);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'tr' ? 'en' : 'tr');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <LanguageThemeContext.Provider
      value={{
        language,
        theme,
        setLanguage,
        setTheme,
        toggleLanguage,
        toggleTheme,
      }}
    >
      {children}
    </LanguageThemeContext.Provider>
  );
}

export function useLanguageTheme() {
  const context = useContext(LanguageThemeContext);
  if (context === undefined) {
    throw new Error('useLanguageTheme must be used within a LanguageThemeProvider');
  }
  return context;
}
