"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from './LanguageProvider';

const SubscriptionPlan = ({ nameKey, price, period, features, highlighted, ctaKey, ctaHref, t, showTrialPrice, trialSavings }) => (
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
      <div className="flex items-baseline gap-2">
        {showTrialPrice ? (
          <>
            <span className="text-4xl font-bold text-emerald-600">€0</span>
            <span className="text-lg text-slate-400 line-through">€{trialSavings}</span>
          </>
        ) : (
          <>
            <span className="text-4xl font-bold text-sky-600">€{price}</span>
            <span className="text-slate-600 text-sm">/{period}</span>
          </>
        )}
      </div>
      {showTrialPrice && (
        <p className="text-xs text-emerald-700 font-semibold mt-2">
          {t('trialSavingsText').replace('{{amount}}', trialSavings)}
        </p>
      )}
    </div>

    <ul className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-3 text-sm text-slate-700">
          <span className="text-emerald-500 font-bold">✓</span>
          <span>{t(feature)}</span>
        </li>
      ))}
    </ul>

    <a
      href={ctaHref}
      className={`block w-full py-3 rounded-lg font-semibold transition-colors text-center ${
        highlighted
          ? 'bg-sky-600 text-white hover:bg-sky-700'
          : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
      }`}
    >
      {t(ctaKey)}
    </a>
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
      ctaHref: '/auth/signin',
      features: [
      showTrialPrice: true,
      trialSavings: 21,
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
      ctaHref: '/subscribe?tier=LISTER',
      showTrialPrice: true,
      trialSavings: 36
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
      ctaHref: '/subscribe?tier=LISTER',
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
div className="inline-block mb-4">
          <span className="bg-emerald-400 text-emerald-900 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide">
            {t('earlyBirdOffer')}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
          {t('pricingSectionTitle')}
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-3">
          {t('pricingSectionDesc')}
        </p>
        <div className="bg-gradient-to-r from-emerald-50 to-sky-50 border-2 border-emerald-200 rounded-xl p-4 max-w-2xl mx-auto">
          <p className="text-base text-emerald-800 font-bold">
            {t('freeTrialBanner')}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            {t('freeTrialExplainer')}
          </p>
            key={index} 
            nameKey={plan.nameKey} 
            price={plan.price} 
            period={plan.period} 
            features={plan.features} 
            highlighted={plan.highlighted} 
            ctaKey={plan.ctaKey} 
            ctaHref={plan.ctaHref} 
            showTrialPrice={plan.showTrialPrice}
            trialSavings={plan.trialSavings}
            t={t} 
         
        </divt('pricingSectionDesc')}
        </p>
        <p className="text-sm text-emerald-700 font-semibold mt-4">
          {t('freeTrialBanner')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <SubscriptionPlan key={index} nameKey={plan.nameKey} price={plan.price} period={plan.period} features={plan.features} highlighted={plan.highlighted} ctaKey={plan.ctaKey} ctaHref={plan.ctaHref} t={t} />
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
