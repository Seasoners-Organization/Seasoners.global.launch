"use client";
import { useLanguage } from '../../../components/LanguageProvider';

export default function VerifyRequest() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-900">{t('checkYourEmail')}</h2>
        <p className="text-gray-600">
          {t('signInLinkSentSimple')}
        </p>
        <p className="text-sm text-gray-500">
          {t('checkSpam')}
        </p>
      </div>
    </div>
  );
}