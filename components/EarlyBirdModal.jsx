'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function EarlyBirdModal({ trigger = 'navigation' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    // Check if user has already seen the modal
    const hasSeenModal = localStorage.getItem('earlyBirdModalSeen');
    const signupDate = localStorage.getItem('earlyBirdSignupDate');
    
    // Don't show if already seen or if already signed up
    if (hasSeenModal || signupDate) return;

    if (trigger === 'navigation') {
      // Track page navigation
      const currentCount = parseInt(localStorage.getItem('pageNavigationCount') || '0');
      const newCount = currentCount + 1;
      setPageCount(newCount);
      localStorage.setItem('pageNavigationCount', newCount.toString());

      // Show modal after 2nd page view
      if (newCount === 2) {
        setTimeout(() => setIsOpen(true), 1000);
      }
    } else if (trigger === 'payment') {
      // Show immediately on payment page
      setTimeout(() => setIsOpen(true), 500);
    }
  }, [trigger]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('earlyBirdModalSeen', 'true');
  };

  const handleUpgrade = () => {
    localStorage.setItem('earlyBirdModalSeen', 'true');
    // Redirect to pricing/subscribe page
    window.location.href = '/subscribe';
  };

  const handleRemindLater = () => {
    setIsOpen(false);
    // Don't set 'seen' flag so it can show again later
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleRemindLater}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && handleRemindLater()}
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg md:max-w-2xl overflow-hidden relative max-h-[85vh] flex flex-col">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>

              {/* Header with Gradient */}
              <div className="bg-gradient-to-br from-sky-600 via-blue-600 to-sky-700 text-white p-6 md:p-8 pb-10 md:pb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
                
                <div className="relative">
                  <div className="inline-block mb-4">
                    <span className="bg-amber-300 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                      Upgrade to Plus
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                    Unlock Unlimited Messaging
                  </h2>

                  <p className="text-lg md:text-xl text-sky-100 font-medium">
                    €9.90/month • Cancel anytime
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-8 -mt-6 relative overflow-y-auto">
                {/* Plus Plan Features */}
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border-2 border-sky-200 p-4 md:p-6 mb-6">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-3xl md:text-4xl font-bold text-sky-600">€9.90</span>
                    <span className="text-slate-600">/month</span>
                  </div>
                  <p className="text-sm md:text-base text-slate-600 font-semibold mb-3">
                    Plus Plan
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                      <span>Unlimited outbound messages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                      <span>Unlimited saved searches</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                      <span>Instant email alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                      <span>Priority message indicator</span>
                    </li>
                  </ul>
                </div>

                {/* Urgency Message */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 md:p-5 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <p className="font-bold text-amber-900 mb-1">
                        Limited Time Offer - Launch Week Only!
                      </p>
                      <p className="text-sm text-amber-800">
                        Sign up now to lock in your 3-month free trial. After the free period, continue at the regular monthly price or cancel anytime.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap gap-3 justify-center mb-6 text-xs md:text-sm text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>No hidden fees</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Secure payments</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleUpgrade}
                    className="flex-1 bg-gradient-to-r from-sky-600 to-blue-600 text-white py-3.5 px-6 rounded-xl font-bold text-base md:text-lg hover:from-sky-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Upgrade for €9.90/month →
                  </button>
                  
                  <button
                    onClick={handleRemindLater}
                    className="sm:w-auto px-6 py-3.5 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
                  >
                    Remind me later
                  </button>
                </div>

                <p className="text-center text-xs text-slate-500 mt-4">
                  By upgrading, you agree to our <a href="/subscribe/terms" className="underline hover:text-slate-700">Subscription Terms</a> and <a href="/privacy" className="underline hover:text-slate-700">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
