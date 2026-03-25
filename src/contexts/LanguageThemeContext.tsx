'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

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

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'tr';
  const savedLanguage = localStorage.getItem('autopulse-language');
  return savedLanguage === 'en' ? 'en' : 'tr';
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const savedTheme = localStorage.getItem('autopulse-theme');
  return savedTheme === 'light' ? 'light' : 'dark';
}

export function LanguageThemeProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    localStorage.setItem('autopulse-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('autopulse-theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      return;
    }
    root.classList.remove('dark');
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <LanguageThemeContext.Provider
      value={{
        language,
        theme,
        setLanguage,
        setTheme,
        toggleLanguage: () => setLanguage(language === 'tr' ? 'en' : 'tr'),
        toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      }}
    >
      {children}
    </LanguageThemeContext.Provider>
  );
}

export function useLanguageTheme() {
  const context = useContext(LanguageThemeContext);
  if (!context) {
    throw new Error('useLanguageTheme must be used within a LanguageThemeProvider');
  }
  return context;
}
