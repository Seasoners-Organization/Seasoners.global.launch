"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SUBSCRIPTION_PLANS } from "../utils/subscription";

export default function SubscriptionGate({ 
  isOpen, 
  onClose, 
  requiredTier = "PLUS", 
  action = "send unlimited messages",
  onUpgrade 
}) {
  const plan = SUBSCRIPTION_PLANS[requiredTier];
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    if (onUpgrade) {
      await onUpgrade(requiredTier);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-amber-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Upgrade Required
            </h2>
            <p className="text-gray-600">
              Subscribe to {action}
            </p>
          </div>

          <div className="bg-gradient-to-br from-sky-50 to-amber-50 rounded-xl p-6 mb-6">
            <div className="flex items-baseline justify-center mb-4">
              <span className="text-4xl font-bold text-gray-900">€{plan.price}</span>
              <span className="text-gray-600 ml-2">/month</span>
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-900 mb-4">
              {plan.name} Plan
            </h3>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-600 to-amber-600 hover:from-sky-700 hover:to-amber-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            {loading ? "Processing..." : `Upgrade for €${plan.price}/month`}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Cancel anytime. No long-term commitment.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
