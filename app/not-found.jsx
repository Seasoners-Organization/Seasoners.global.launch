"use client";

import Link from 'next/link';
import { useLanguage } from '../components/LanguageProvider';

export default function NotFound() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-amber-50 px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-6xl font-bold text-sky-900">404</h1>
        <h2 className="text-2xl font-bold text-gray-900">
          {t('pageNotFound') || 'Page Not Found'}
        </h2>
        <p className="text-gray-600">
          {t('pageNotFoundDescription') || 'The page you are looking for does not exist.'}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
        >
          {t('backToHome') || 'Back to Home'}
        </Link>
      </div>
    </div>
  );
}
