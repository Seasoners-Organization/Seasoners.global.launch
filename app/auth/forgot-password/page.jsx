"use client";

import { useState } from 'react';
import { useLanguage } from '../../../components/LanguageProvider';

export default function ForgotPassword() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('unexpectedError'));
      } else {
        setSuccess(true);
      }
    } catch (error) {
      setError(t('unexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 via-white to-amber-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('checkYourEmail')}</h2>
          <p className="text-gray-600">
            {t('resetLinkSent', { email })}
          </p>
          <p className="text-sm text-gray-500">
            {t('checkSpam')}
          </p>
          <a
            href="/auth/signin"
            className="inline-block text-sm font-medium text-sky-600 hover:text-sky-500"
          >
            {t('backToSignIn')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 via-white to-amber-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('resetYourPassword')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('enterEmailForReset')}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              {t('emailAddress')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              placeholder={t('emailAddress')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('sendingLink') : t('sendResetLink')}
          </button>

          <div className="text-center">
            <a
              href="/auth/signin"
              className="text-sm font-medium text-sky-600 hover:text-sky-500"
            >
              {t('backToSignIn')}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
