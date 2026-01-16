"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from './LanguageProvider';

const SubscriptionPlan = ({ nameKey, price, period, features, highlighted, ctaKey, t }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={`rounded-2xl border-2 p-8 relative transition-shadow ${
      highlighted
        ? 'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-400 shadow-lg'
        : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
    }`}
  >
    {highlighted && (
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className="bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          {t('mostPopular')}
        </span>
      </div>
    )}

    <div className="mb-6">
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{t(nameKey)}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-sky-600">€{price}</span>
        <span className="text-slate-600 text-sm">/{period}</span>
      </div>
    </div>

    <ul className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-3 text-sm text-slate-700">
          <span className="text-emerald-500 font-bold">✓</span>
          <span>{t(feature)}</span>
        </li>
      ))}
    </ul>

    <button
      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
        highlighted
          ? 'bg-sky-600 text-white hover:bg-sky-700'
          : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
      }`}
    >
      {t(ctaKey)}
    </button>
  </motion.div>
);

export default function SubscriptionTiers() {
  const { t } = useLanguage();
  const plans = [
    {
      nameKey: 'planFreeName',
      price: 0,
      period: 'forever',
      ctaKey: 'planFreeBtn',
      features: [
        'planFreeFeat1',
        'planFreeFeat2',
        'planFreeFeat3',
        'planFreeFeat4',
        'planFreeFeat5',
      ],
    },
    {
      nameKey: 'planSearcherName',
      price: 7,
      period: 'month',
      highlighted: true,
      ctaKey: 'planSearcherBtn',
      features: [
        'planSearcherFeat1',
        'planSearcherFeat2',
        'planSearcherFeat3',
        'planSearcherFeat4',
        'planSearcherFeat5',
        'planSearcherFeat6',
      ],
    },
    {
      nameKey: 'planListerName',
      price: 12,
      period: 'month',
      ctaKey: 'planListerBtn',
      features: [
        'planListerFeat1',
        'planListerFeat2',
        'planListerFeat3',
        'planListerFeat4',
        'planListerFeat5',
        'planListerFeat6',
        'planListerFeat7',
      ],
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
          {t('pricingSectionTitle')}
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          {t('pricingSectionDesc')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <SubscriptionPlan key={index} nameKey={plan.nameKey} price={plan.price} period={plan.period} features={plan.features} highlighted={plan.highlighted} ctaKey={plan.ctaKey} t={t} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-16 bg-blue-50 rounded-2xl border-2 border-blue-200 p-8 text-center"
      >
        <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('premiumIDTitle')}</h3>
        <p className="text-slate-600 mb-4">
          {t('premiumIDDesc')}
        </p>
        <p className="text-sm text-slate-500">
          {t('premiumIDEarlyBird')}
        </p>
      </motion.div>
    </section>
  );
}
