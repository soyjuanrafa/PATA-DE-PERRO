/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro - i18n Context Provider & Hooks
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LanguageCode,
  LanguageInfo,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  TRANSLATIONS,
} from './translations';

interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  languages: LanguageInfo[];
  currentLanguageInfo: LanguageInfo;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'patadeperro_language_v1';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode;
      if (saved && TRANSLATIONS[saved]) {
        return saved;
      }
      // Check browser language
      const navLang = navigator.language?.substring(0, 2) as LanguageCode;
      if (navLang && TRANSLATIONS[navLang]) {
        return navLang;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = (newLang: LanguageCode) => {
    if (TRANSLATIONS[newLang]) {
      setLanguageState(newLang);
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      } catch {
        // Safe catch
      }
    }
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS[DEFAULT_LANGUAGE];
    if (langDict && key in langDict) {
      return langDict[key];
    }
    // Fallback to Spanish
    if (TRANSLATIONS[DEFAULT_LANGUAGE] && key in TRANSLATIONS[DEFAULT_LANGUAGE]) {
      return TRANSLATIONS[DEFAULT_LANGUAGE][key];
    }
    return fallback || key;
  };

  const currentLanguageInfo =
    SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        currentLanguageInfo,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    // If used outside provider, return default fallback helper
    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => {},
      t: (key: string, fallback?: string) => TRANSLATIONS[DEFAULT_LANGUAGE][key] || fallback || key,
      languages: SUPPORTED_LANGUAGES,
      currentLanguageInfo: SUPPORTED_LANGUAGES[0],
    };
  }
  return context;
};

export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE };
