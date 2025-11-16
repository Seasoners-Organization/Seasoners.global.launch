"use client";
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../../components/LanguageProvider';

export default function AuthError() {
  const { t } = useLanguage();
  // Read error param from window.location on client to avoid Next.js prerender bailout.
  if (typeof window === 'undefined') {
    return null; // Defer rendering to client; prevents prerender error.
  }
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');

  const errorMessages = {
    Configuration: t('serverConfigProblem'),
    AccessDenied: t('noPermissionSignIn'),
    Verification: t('verificationLinkIssue'),
    default: t('signInErrorGeneric'),
  };

  const errorMessage = errorMessages[error] || errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-red-600">{t('authErrorTitle')}</h2>
        <p className="text-gray-600">{errorMessage}</p>
        <a
          href="/auth/signin"
          className="inline-block mt-4 text-sky-600 hover:text-sky-500"
        >
          {t('returnToSignIn')}
        </a>
      </div>
    </div>
  );
}