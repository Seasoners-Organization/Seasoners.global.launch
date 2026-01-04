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

  const handleSignUp = () => {
    localStorage.setItem('earlyBirdModalSeen', 'true');
    localStorage.setItem('earlyBirdSignupDate', new Date().toISOString());
    // Redirect to registration with promo code
    window.location.href = '/auth/register?promo=EARLYBIRD3';
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
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden relative">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>

              {/* Header with Gradient */}
              <div className="bg-gradient-to-br from-sky-600 via-blue-600 to-sky-700 text-white p-8 pb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
                
                <div className="relative">
                  <div className="inline-block mb-4">
                    <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                      🎉 Launch Special
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                    Get 3 Months FREE!
                  </h2>
                  
                  <p className="text-xl text-sky-100 font-medium">
                    Be an early bird and unlock premium features at no cost
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 -mt-6 relative">
                {/* Value Proposition Cards */}
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border-2 border-sky-200 p-6 mb-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-4xl font-bold text-sky-600 mb-2">
                        €0
                        <span className="text-lg text-slate-500 line-through ml-2">€21</span>
                      </div>
                      <p className="text-sm text-slate-600 font-semibold mb-3">
                        Searcher Plan (save €21)
                      </p>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>3 months completely free</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>Contact unlimited hosts & employers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>Priority support access</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <div className="text-4xl font-bold text-sky-600 mb-2">
                        €0
                        <span className="text-lg text-slate-500 line-through ml-2">€36</span>
                      </div>
                      <p className="text-sm text-slate-600 font-semibold mb-3">
                        Lister Plan (save €36)
                      </p>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>3 months completely free</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>Create unlimited listings</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>Featured badge & analytics</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Urgency Message */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
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
                <div className="flex flex-wrap gap-4 justify-center mb-6 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Full access included</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSignUp}
                    className="flex-1 bg-gradient-to-r from-sky-600 to-blue-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-sky-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Claim Your 3 Months Free →
                  </button>
                  
                  <button
                    onClick={handleRemindLater}
                    className="sm:w-auto px-6 py-4 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
                  >
                    Remind me later
                  </button>
                </div>

                <p className="text-center text-xs text-slate-500 mt-4">
                  By signing up, you agree to our <a href="/subscribe/terms" className="underline hover:text-slate-700">Subscription Terms</a> and <a href="/privacy" className="underline hover:text-slate-700">Privacy Policy</a>. 
                  You'll receive email reminders before your trial ends.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
