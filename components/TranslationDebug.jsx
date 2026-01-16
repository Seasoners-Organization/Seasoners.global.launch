"use client";

import { useLanguage } from './LanguageProvider';
import en from "../locales/en.json";

export default function TranslationDebug() {
  const { t, locale } = useLanguage();
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      right: 0, 
      backgroundColor: 'black', 
      color: 'white', 
      padding: '10px',
      fontSize: '10px',
      maxWidth: '400px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div><strong>Translation Debug Panel</strong></div>
      <div>Current Locale: {locale}</div>
      <div>Direct import en.footerStays: {JSON.stringify(en?.footerStays)}</div>
      <div>t('footerStays'): {t('footerStays')}</div>
      <div>t('nonExistentKey'): {t('nonExistentKey')}</div>
      <div>typeof en: {typeof en}</div>
      <div>en is object: {String(typeof en === 'object')}</div>
      <div>Keys in en (first 5): {JSON.stringify(Object.keys(en || {}).slice(0, 5))}</div>
    </div>
  );
}
