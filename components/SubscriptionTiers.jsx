"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';

const SubscriptionPlan = ({ name, price, period, features, highlighted, cta }) => (
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
          MOST POPULAR
        </span>
      </div>
    )}

    <div className="mb-6">
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{name}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-sky-600">€{price}</span>
        <span className="text-slate-600 text-sm">/{period}</span>
      </div>
    </div>

    <ul className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-3 text-sm text-slate-700">
          <span className="text-emerald-500 font-bold">✓</span>
          <span>{feature}</span>
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
      {cta}
    </button>
  </motion.div>
);

export default function SubscriptionTiers() {
  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      cta: 'Start Exploring',
      features: [
        'Browse verified listings',
        'View trusted member profiles',
        'Transparent trust scores',
        'Save up to 5 favorites',
        'Access to community guidelines',
      ],
    },
    {
      name: 'Searcher',
      price: 7,
      period: 'month',
      highlighted: true,
      cta: 'Unlock Searcher Access',
      features: [
        'Everything in Free, plus:',
        'Message hosts & employers',
        'Unlimited messaging',
        'Save unlimited favorites',
        'Priority support',
        'Advanced search filters',
      ],
    },
    {
      name: 'Lister',
      price: 12,
      period: 'month',
      cta: 'Unlock Lister Access',
      features: [
        'Everything in Searcher, plus:',
        'Create unlimited listings',
        'Featured listing badge',
        'Request secure agreements',
        'Applicant messaging',
        'Performance analytics',
        'Early access to new tools',
      ],
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Choose the plan that works for you. All plans include verified user access and safety features.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <SubscriptionPlan key={index} {...plan} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-16 bg-blue-50 rounded-2xl border-2 border-blue-200 p-8 text-center"
      >
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Premium ID Verification</h3>
        <p className="text-slate-600 mb-4">
          Unlock premium features like advanced verification, priority listings, and exclusive matches. Coming soon!
        </p>
        <p className="text-sm text-slate-500">
          Early adopters will get lifetime discounts on premium tier
        </p>
      </motion.div>
    </section>
  );
}
