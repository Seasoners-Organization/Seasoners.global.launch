"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import en from "../locales/en.json";
import de from "../locales/de.json";
import es from "../locales/es.json";
import fr from "../locales/fr.json";
import it from "../locales/it.json";
import pt from "../locales/pt.json";

const DEFAULT = "en";

// Load translations synchronously for SSR compatibility
const LOCALES = {
  en,
  de,
  es,
  fr,
  it,
  pt,
};

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  console.log('[LanguageProvider] Translations loaded');
  console.log('- Keys in en:', Object.keys(en).length);
}

const LanguageContext = createContext({
  locale: DEFAULT,
  setLocale: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT);

  // Set locale from localStorage or browser language
  useEffect(() => {
    try {
      const stored = localStorage.getItem("locale");
      if (stored && LOCALES[stored]) {
        setLocaleState(stored);
        document.documentElement.lang = stored;
        return;
      }
    } catch (e) {
      // ignore
    }
    const nav = typeof navigator !== "undefined" ? navigator.language || navigator.userLanguage : null;
    if (nav) {
      const navLower = nav.toLowerCase();
      // Check for exact match or language prefix
      if (LOCALES[navLower]) {
        setLocaleState(navLower);
        document.documentElement.lang = navLower;
      } else {
        // Check for language prefix (e.g., "en-US" -> "en")
        const prefix = navLower.split('-')[0];
        if (LOCALES[prefix]) {
          setLocaleState(prefix);
          document.documentElement.lang = prefix;
        }
      }
    }
  }, []);

  const setLocale = (l) => {
    if (!LOCALES[l]) return;
    setLocaleState(l);
    try {
      localStorage.setItem("locale", l);
    } catch (e) {}
    document.documentElement.lang = l;
  };

  const t = (key, params = {}) => {
    const dict = LOCALES[locale] || LOCALES[DEFAULT];
    if (dict[key] === undefined) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(`[i18n] Missing key "${key}" for locale "${locale}"`);
      }
      return `[${key}]`;
    }
    
    let text = dict[key];
    
    // Replace {{param}} placeholders with values
    Object.keys(params).forEach((param) => {
      const regex = new RegExp(`{{${param}}}`, 'g');
      text = text.replace(regex, params[param]);
    });
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export default LanguageProvider;
