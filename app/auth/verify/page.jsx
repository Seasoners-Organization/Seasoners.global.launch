"use client";

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../../components/LanguageProvider';

export default function Verify() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const search = useSearchParams();
  const [verificationState, setVerificationState] = useState({
    email: false,
    identity: false,
    business: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  
  // Read success/error from URL params for email verification status
  useEffect(() => {
    const s = search?.get('success');
    const e = search?.get('error');
    if (s === 'email_verified') {
      setSuccess(t('emailVerifiedSuccess') || 'Email verified successfully.');
    }
    if (e === 'invalid_or_expired') {
      setError(t('verificationLinkExpired') || 'The verification link is invalid or expired. Please resend the email.');
    }
    if (e === 'missing_token') {
      setError(t('missingToken') || 'Verification token missing. Please resend the email.');
    }
  }, [search, t]);
  useEffect(() => {
    const s = search?.get('success');
    const e = search?.get('error');
    if (s === 'email_verified') {
      setSuccess(t('emailVerifiedSuccess') || 'Email verified successfully.');
    }
    if (e === 'invalid_or_expired') {
      setError(t('verificationLinkExpired') || 'The verification link is invalid or expired. Please resend the email.');
    }
    if (e === 'missing_token') {
      setError(t('missingToken') || 'Verification token missing. Please resend the email.');
    }
  }, [search, t]);

  useEffect(() => {
    if (session?.user) {
      setVerificationState({
        email: session.user.emailVerified,
        identity: session.user.identityVerified === 'VERIFIED',
        business: session.user.businessVerified === 'VERIFIED',
      });
    }
  }, [session]);

  const handleFileUpload = async (type, file) => {
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);

    try {
      const response = await fetch('/api/auth/verify-documents', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);

      setSuccess(t('documentSubmittedSuccess', { type }));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleResendVerificationEmail = async () => {
    setSendingEmail(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session?.user?.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setSuccess(t('verificationEmailSent'));
    } catch (error) {
      setError(error.message);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('accountVerification')}</h2>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
              {success}
            </div>
          )}

          <div className="space-y-6">
            {/* Email Verification Status */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{t('emailVerification')}</h3>
                  <p className="text-sm text-gray-500">{t('verifyEmailToActivate')}</p>
                </div>
                <div className={`flex items-center ${verificationState.email ? 'text-green-600' : 'text-amber-600'}`}>
                  {verificationState.email ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                      Pending
                    </span>
                  )}
                </div>
              </div>
              
              {!verificationState.email && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">
                    {t('checkInboxForVerification')}
                  </p>
                  <button
                    onClick={handleResendVerificationEmail}
                    disabled={sendingEmail}
                    className="inline-flex items-center px-4 py-2 border border-sky-600 text-sm font-medium rounded-md text-sky-600 bg-white hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingEmail ? t('sending') : t('resendVerificationEmail')}
                  </button>
                </div>
              )}
            </div>

            {/* Identity Verification */}
            {(session?.user?.role === 'HOST' || session?.user?.role === 'EMPLOYER') && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{t('identityVerification')}</h3>
                    <p className="text-sm text-gray-500">{t('uploadGovIdForVerification')}</p>
                  </div>
                  <div>
                    {verificationState.identity ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                        {t('required')}
                      </span>
                    )}
                  </div>
                </div>
                
                {!verificationState.identity && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">{t('uploadIdDocument')}</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload('ID', e.target.files[0])}
                      className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-sky-50 file:text-sky-700
                        hover:file:bg-sky-100"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Business Verification */}
            {session?.user?.role === 'EMPLOYER' && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{t('businessVerification')}</h3>
                    <p className="text-sm text-gray-500">{t('uploadBusinessDocs')}</p>
                  </div>
                  <div>
                    {verificationState.business ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                        {t('required')}
                      </span>
                    )}
                  </div>
                </div>
                
                {!verificationState.business && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">{t('uploadBusinessDocuments')}</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload('BUSINESS', e.target.files[0])}
                      className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-sky-50 file:text-sky-700
                        hover:file:bg-sky-100"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('nextSteps')}</h3>
            <div className="bg-blue-50 p-4 rounded-md">
              <ul className="list-disc pl-5 space-y-2 text-sm text-blue-700">
                {!verificationState.email && (
                  <li>{t('checkEmailVerification')}</li>
                )}
                {(session?.user?.role === 'HOST' || session?.user?.role === 'EMPLOYER') && !verificationState.identity && (
                  <li>{t('uploadGovId')}</li>
                )}
                {session?.user?.role === 'EMPLOYER' && !verificationState.business && (
                  <li>{t('uploadBusinessDocs')}</li>
                )}
                {Object.values(verificationState).every(v => v) && (
                  <li className="text-green-700">{t('allVerificationsComplete')}</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}