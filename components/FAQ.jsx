"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';

const FAQItem = ({ question, answer, index }) => {
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
        <span className="font-semibold text-slate-900 text-left">{question}</span>
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
          {answer}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function FAQ() {
  const faqs = [
    {
      question: 'How do I get started on Seasoners?',
      answer:
        'Create an account with your email, verify it, and complete your profile. Add your phone number and optional government ID for verification. Browse listings, message hosts or employers, and start your seasonal adventure!',
    },
    {
      question: 'Is it really safe to use Seasoners?',
      answer:
        'Yes! We verify all users, maintain trust scores, use digital agreements with e-signatures, and have dispute resolution built-in. Report any suspicious activity and we\'ll investigate immediately.',
    },
    {
      question: 'What\'s the difference between Free, Searcher, and Lister plans?',
      answer:
        'Free: Browse and view profiles. Searcher (€7/month): Contact hosts/employers and message freely. Lister (€12/month): Create unlimited listings and manage agreements. All plans include safety features.',
    },
    {
      question: 'How do agreements work?',
      answer:
        'Once you and a host/employer agree on terms, both sign a digital agreement that outlines expectations, duration, payment, and responsibilities. The agreement protects both parties and can be used if disputes arise.',
    },
    {
      question: 'What if there\'s a problem with my stay or job?',
      answer:
        'Use our in-app messaging to resolve issues first. If needed, you can escalate to our dispute resolution team. We\'ll review both sides fairly and find a solution that protects everyone.',
    },
    {
      question: 'Can I get a refund if I don\'t like the platform?',
      answer:
        'Yes! We offer a 7-day money-back guarantee on subscription purchases with no questions asked. Just contact support@seasoners.eu.',
    },
    {
      question: 'How do trust scores work?',
      answer:
        'Your trust score increases when you verify information, complete stays/jobs successfully, and get positive feedback. It decreases if you cancel agreements or receive complaints. Higher scores get priority in search results.',
    },
    {
      question: 'Is my data private?',
      answer:
        'Absolutely. We use industry-standard encryption, follow GDPR guidelines, and never sell your data. Your contact info is only shared with people you approve.',
    },
  ];

  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-600 text-lg">
          Everything you need to know to get started
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {faqs.map((faq, index) => (
          <FAQItem key={index} {...faq} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-12 text-center p-8 bg-sky-50 rounded-2xl border border-sky-200"
      >
        <p className="text-slate-700 mb-4">
          Didn't find what you're looking for?
        </p>
        <a
          href="mailto:support@seasoners.eu"
          className="inline-block px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors"
        >
          Contact Our Support Team
        </a>
      </motion.div>
    </section>
  );
}
