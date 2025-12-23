"use client";

import { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import dynamic from 'next/dynamic';
import { signIn } from 'next-auth/react';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import { useLanguage } from '../../../components/LanguageProvider';

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};
zxcvbnOptions.setOptions(options);

const stepKeys = [
  'stepAccountDetails',
  'stepAccountType',
  'stepPhoneVerification',
  'stepVerification',
];
const PhoneVerification = dynamic(() => import('../../../components/PhoneVerification'), { ssr: false });

function RegisterForm() {
  const { t } = useLanguage();
  const [captchaToken, setCaptchaToken] = useState('');
  const captchaRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'USER',
    agreeToTerms: false,
    phoneNumber: '',
    phoneVerified: false,
  });
    const [phoneStepSkipped, setPhoneStepSkipped] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Real-time password strength check
    if (name === 'password' && value) {
      const result = zxcvbn(value);
      setPasswordStrength(result);
    } else if (name === 'password' && !value) {
      setPasswordStrength(null);
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0: // Account Details
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          setError(t('pleaseFillAllFields'));
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError(t('passwordsDoNotMatch'));
          return false;
        }
        if (formData.password.length < 8) {
          setError(t('passwordMinChars'));
          return false;
        }
        // Check password strength before allowing to proceed
        if (passwordStrength && passwordStrength.score < 3) {
          const suggestion = passwordStrength.feedback.warning || passwordStrength.feedback.suggestions[0] || '';
          setError(t('passwordTooWeak', { suggestion }));
          return false;
        }
        break;
      case 1: // Account Type
        if (!formData.role) {
          setError(t('selectAccountTypeError'));
          return false;
        }
        break;
      case 2: // Phone Verification
        if (!formData.phoneVerified && !phoneStepSkipped) {
          setError(t('pleaseVerifyPhoneOrSkip'));
          return false;
        }
        break;
      case 3: // Verification
        if (!formData.agreeToTerms) {
          setError(t('mustAgreeTerms'));
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setError('');
      setCurrentStep(prev => prev + 1);
    }
  };
  // Handler for phone verification success
  const handlePhoneVerified = (phone) => {
    // Persist verified phone into form data for submission
    setFormData(prev => ({ ...prev, phoneNumber: phone, phoneVerified: true }));
    setPhoneStepSkipped(false);
  };

  // Handler for skipping phone verification
  const handleSkipPhone = () => {
    setPhoneStepSkipped(true);
    setFormData(prev => ({ ...prev, phoneVerified: false }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
  };

  // Always fetch a fresh reCAPTCHA token (invisible v2)
  const getFreshCaptchaToken = async () => {
    if (!captchaRef.current) {
      throw new Error(t('recaptchaNotLoaded'));
    }
    // Prefer executeAsync if available
    if (typeof captchaRef.current.executeAsync === 'function') {
      const token = await captchaRef.current.executeAsync();
      setCaptchaToken(token);
      return token;
    }
    // Fallback: execute and wait until onChange sets state
    try {
      captchaRef.current.execute();
    } catch (e) {
      throw new Error(t('recaptchaNotLoaded'));
    }
    const start = Date.now();
    return await new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (captchaToken) {
          clearInterval(interval);
          resolve(captchaToken);
        } else if (Date.now() - start > 8000) {
          clearInterval(interval);
          reject(new Error(t('recaptchaNotLoaded')));
        }
      }, 100);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsLoading(true);
    setError('');

    try {
      // Always get a fresh token just before submit to avoid expiry
      const freshToken = await getFreshCaptchaToken();
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, captchaToken: freshToken, phoneNumber: formData.phoneNumber, phoneVerified: formData.phoneVerified }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('registrationFailed'));
      }

      // Redirect to verification page. Email verification is sent by the server.
      window.location.href = '/auth/verify';

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
      // Reset reCAPTCHA for subsequent attempts
      if (captchaRef.current && typeof captchaRef.current.reset === 'function') {
        try { captchaRef.current.reset(); } catch {}
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 via-white to-amber-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('registerCreateYourAccount')}
          </h2>
          <div className="mt-2 flex justify-center">
            <div className="flex items-center">
              {stepKeys.map((key, index) => (
                <div key={key + index} className="flex items-center">
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full border-2 ${
                      index === currentStep
                        ? 'border-sky-600 bg-sky-600 text-white'
                        : index < currentStep
                        ? 'border-sky-600 bg-sky-600 text-white'
                        : 'border-gray-300 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < stepKeys.length - 1 && (
                    <div
                      className={`h-0.5 w-10 ${
                        index < currentStep ? 'bg-sky-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Invisible reCAPTCHA v2 */}
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          size="invisible"
          ref={captchaRef}
          onChange={token => setCaptchaToken(token)}
          onErrored={() => setError(t('recaptchaNotLoaded'))}
        />

  <form className="mt-8 space-y-6" onSubmit={currentStep === stepKeys.length - 1 ? handleSubmit : e => e.preventDefault()}>
          {/* Step 1: Account Details */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('emailAddress')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {t('fullName')}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t('password')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {passwordStrength && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            passwordStrength.score === 0 ? 'bg-red-500 w-1/5' :
                            passwordStrength.score === 1 ? 'bg-orange-500 w-2/5' :
                            passwordStrength.score === 2 ? 'bg-yellow-500 w-3/5' :
                            passwordStrength.score === 3 ? 'bg-lime-500 w-4/5' :
                            'bg-green-500 w-full'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength.score < 3 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {passwordStrength.score === 0 ? t('veryWeak') :
                         passwordStrength.score === 1 ? t('weak') :
                         passwordStrength.score === 2 ? t('fair') :
                         passwordStrength.score === 3 ? t('good') :
                         t('strong')}
                      </span>
                    </div>
                    {passwordStrength.feedback.warning && (
                      <p className="text-xs text-amber-600 mt-1">{passwordStrength.feedback.warning}</p>
                    )}
                    {passwordStrength.feedback.suggestions.length > 0 && (
                      <p className="text-xs text-gray-600 mt-1">{passwordStrength.feedback.suggestions[0]}</p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  {t('confirmPassword')}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* Step 2: Account Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  {t('selectAccountType')}
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="USER"
                      name="role"
                      type="radio"
                      value="USER"
                      className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300"
                      checked={formData.role === 'USER'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="USER" className="ml-3">
                      <span className="block text-sm font-medium text-gray-700">{t('regularUser')}</span>
                      <span className="block text-sm text-gray-500">{t('regularUserDesc')}</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="HOST"
                      name="role"
                      type="radio"
                      value="HOST"
                      className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300"
                      checked={formData.role === 'HOST'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="HOST" className="ml-3">
                      <span className="block text-sm font-medium text-gray-700">{t('propertyHost')}</span>
                      <span className="block text-sm text-gray-500">{t('propertyHostDesc')}</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="EMPLOYER"
                      name="role"
                      type="radio"
                      value="EMPLOYER"
                      className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300"
                      checked={formData.role === 'EMPLOYER'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="EMPLOYER" className="ml-3">
                      <span className="block text-sm font-medium text-gray-700">{t('employerRole')}</span>
                      <span className="block text-sm text-gray-500">{t('employerRoleDesc')}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Phone Verification */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <PhoneVerification
                userId={null}
                initialPhone={formData.phoneNumber}
                verified={!!formData.phoneVerified}
                onVerified={(e164) => {
                  handlePhoneVerified(e164);
                  setCurrentStep(prev => prev + 1);
                }}
                showSkip={true}
              />
              {!formData.phoneVerified && (
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                  onClick={handleSkipPhone}
                >
                  {t('skipForNow')}
                </button>
              )}
            </div>
          )}

          {/* Step 4: Verification */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">{t('verificationRequired')}</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>{t('afterRegistration')}</p>
                      <ul className="list-disc pl-5 mt-2">
                        <li>{t('verifyYourEmail')}</li>
                        {(formData.role === 'HOST' || formData.role === 'EMPLOYER') && (
                          <>
                            <li>{t('submitIdDocs')}</li>
                            <li>{t('provideBusinessDocs')}</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                  {t('iAgreeTo')} {' '}
                  <a href="/agreement" className="text-sky-600 hover:text-sky-500">
                    {t('termsAndConditions')}
                  </a>
                </label>
              </div>
              <div className="text-xs text-gray-500">
                {t('recaptchaProtected')} {' '}
                <a href="https://policies.google.com/privacy" className="text-sky-600">{t('privacyPolicy')}</a> {t('or')} {' '}
                <a href="https://policies.google.com/terms" className="text-sky-600">{t('termsOfService')}</a> {t('apply')}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                {t('back')}
              </button>
            )}
            <button
              type="button"
              onClick={currentStep === stepKeys.length - 1 ? handleSubmit : handleNext}
              disabled={isLoading}
              className="ml-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === stepKeys.length - 1
                ? (isLoading ? t('creatingAccount') : t('createAccount'))
                : t('next')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Register() {
  const { t } = useLanguage();
  if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    return <div>{t('captchaNotConfigured')}</div>;
  }
  return <RegisterForm />;
}