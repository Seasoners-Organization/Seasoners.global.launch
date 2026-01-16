"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

const TrustFeature = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="flex gap-4"
  >
    <div>
      <h4 className="font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  </motion.div>
);

export default function TrustAndSafety() {
  const { t } = useLanguage();
  const trustFeatures = [
    {
      icon: '',
      titleKey: 'trustEmailVerifyTitle',
      descKey: 'trustEmailVerifyDesc',
    },
    {
      icon: '',
      titleKey: 'trustPhoneVerifyTitle',
      descKey: 'trustPhoneVerifyDesc',
    },
    {
      icon: '',
      titleKey: 'trustIDVerifyTitle',
      descKey: 'trustIDVerifyDesc',
    },
    {
      icon: '⭐',
      titleKey: 'trustScoresTitle',
      descKey: 'trustScoresDesc',
    },
    {
      icon: '📋',
      titleKey: 'trustAgreementsTitle',
      descKey: 'trustAgreementsDesc',
    },
    {
      icon: '🛡️',
      titleKey: 'trustDisputeTitle',
      descKey: 'trustDisputeDesc',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left side - Features list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
            {t('trustSectionTitle')}
          </h2>
          <p className="text-slate-600 text-lg mb-8">
            {t('trustSectionDesc')}
          </p>

          <div className="space-y-6">
            {trustFeatures.map((feature, index) => (
              <TrustFeature key={index} icon={feature.icon} title={t(feature.titleKey)} description={t(feature.descKey)} />
            ))}
          </div>

          <Link
            href="/agreement"
            className="inline-block mt-8 px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors"
          >
            {t('learnAgreementsBtn')} →
          </Link>
        </motion.div>

        {/* Right side - Visual representation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl border border-sky-200 p-8"
        >
          <div className="space-y-6">
            {/* Trust Score Circle */}
            <div className="text-center p-6 bg-white rounded-2xl border border-sky-100">
              <div className="text-5xl font-bold text-sky-600 mb-2">85</div>
              <p className="text-slate-600 font-medium">{t('avgTrustScore')}</p>
              <p className="text-xs text-slate-500 mt-2">{t('avgTrustScoreDesc')}</p>
            </div>

            {/* Verification badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-emerald-200">
                <span className="text-2xl"></span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t('emailVerified')}</p>
                  <p className="text-xs text-slate-600">{t('emailVerificationPercent')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-emerald-200">
                <span className="text-2xl"></span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t('phoneVerified')}</p>
                  <p className="text-xs text-slate-600">{t('phoneVerificationPercent')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-emerald-200">
                <span className="text-2xl"></span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t('idVerified')}</p>
                  <p className="text-xs text-slate-600">{t('idVerificationPercent')}</p>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="text-center p-4 bg-gradient-to-r from-emerald-100 to-sky-100 rounded-xl border border-emerald-200">
              <p className="text-sm font-semibold text-emerald-900">{t('trustBadgeText')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
