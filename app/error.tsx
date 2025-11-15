"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../components/LanguageProvider';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-amber-50 px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-6xl font-bold text-red-600">⚠️</h1>
        <h2 className="text-2xl font-bold text-gray-900">
          {t('somethingWentWrong') || 'Something went wrong'}
        </h2>
        <p className="text-gray-600">
          {t('errorDescription') || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
          >
            {t('tryAgain') || 'Try Again'}
          </button>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            {t('backToHome') || 'Back to Home'}
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs text-gray-400 mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
