"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "./LanguageProvider";

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export default function LanguageToggle({ className = "" }) {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const currentLanguage = LANGUAGES.find(lang => lang.code === locale) || LANGUAGES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (code) => {
    setLocale(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 transition-colors min-h-[44px] touch-manipulation"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-lg md:text-xl flex-shrink-0">{currentLanguage.flag}</span>
        <span className="text-xs md:text-sm font-medium text-slate-700">{currentLanguage.code.toUpperCase()}</span>
        <svg
          className={`w-3 h-3 md:w-4 md:h-4 text-slate-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed md:absolute bottom-0 md:bottom-auto left-0 md:left-auto right-0 md:right-0 md:mt-2 md:w-48 bg-white rounded-t-lg md:rounded-lg shadow-lg border border-slate-200 py-1 z-50 max-h-[70vh] overflow-y-auto">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 md:py-2 text-left hover:bg-slate-50 transition-colors text-base md:text-sm ${
                locale === lang.code ? 'bg-sky-50 text-sky-700' : 'text-slate-700'
              }`}
              aria-selected={locale === lang.code}
            >
              <span className="text-xl md:text-lg flex-shrink-0">{lang.flag}</span>
              <span className="font-medium flex-1">{lang.name}</span>
              {locale === lang.code && (
                <svg className="w-4 h-4 md:w-4 md:h-4 text-sky-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
