"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from './LanguageProvider';

const FAQItem = ({ questionKey, answerKey, index, t }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="border-b border-slate-200 last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-900 text-left">{t(questionKey)}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-sky-600 text-xl flex-shrink-0 ml-4"
        >
          ↓
        </motion.span>
      </button>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-4 text-slate-600 text-sm leading-relaxed">
          {t(answerKey)}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function FAQ() {
  const { t } = useLanguage();
  const faqs = [
    { questionKey: 'faq1Q', answerKey: 'faq1A' },
    { questionKey: 'faq2Q', answerKey: 'faq2A' },
    { questionKey: 'faq3Q', answerKey: 'faq3A' },
    { questionKey: 'faq4Q', answerKey: 'faq4A' },
    { questionKey: 'faq5Q', answerKey: 'faq5A' },
    { questionKey: 'faq6Q', answerKey: 'faq6A' },
    { questionKey: 'faq7Q', answerKey: 'faq7A' },
    { questionKey: 'faq8Q', answerKey: 'faq8A' },
  ];

  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
          {t('faqSectionTitle')}
        </h2>
        <p className="text-slate-600 text-lg">
          {t('faqSectionDesc')}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {faqs.map((faq, index) => (
          <FAQItem key={index} questionKey={faq.questionKey} answerKey={faq.answerKey} index={index} t={t} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-12 text-center p-8 bg-sky-50 rounded-2xl border border-sky-200"
      >
        <p className="text-slate-700 mb-4">
          {t('faqContactText')}
        </p>
        <a
          href="mailto:support@seasoners.eu"
          className="inline-block px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors"
        >
          {t('faqContactBtn')}
        </a>
      </motion.div>
    </section>
  );
}
