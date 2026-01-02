"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

const VerificationBadge = ({ field, label, isVerified, description, onVerify }) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
    isVerified
      ? 'bg-emerald-50 border-emerald-200'
      : 'bg-slate-50 border-slate-200'
  }`}>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="font-medium text-slate-900">{label}</span>
        {isVerified && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-xs"
          >
            ✓
          </motion.span>
        )}
      </div>
      <p className="text-xs text-slate-600 mt-0.5">{description}</p>
    </div>
    {!isVerified && onVerify && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onVerify}
        className="flex-shrink-0 px-3 py-1.5 bg-sky-600 text-white text-xs font-medium rounded hover:bg-sky-700 transition-colors"
      >
        Verify
      </motion.button>
    )}
  </div>
);

export default function InlineVerificationStatus({ user, onEmailVerify, onPhoneVerify, onIdentityVerify }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const verifications = [
    {
      id: 'email',
      label: 'Email Address',
      description: 'Required to send & receive messages',
      isVerified: !!user?.emailVerified,
      icon: '✉️',
      verifiedDate: user?.emailVerified,
      onVerify: user?.emailVerified ? null : onEmailVerify, // Don't show verify button if already verified
    },
    {
      id: 'phone',
      label: 'Phone Number',
      description: 'Helps hosts/employers verify you',
      isVerified: !!user?.phoneVerified,
      icon: '📱',
      verifiedDate: user?.phoneVerified,
      onVerify: user?.phoneVerified ? null : onPhoneVerify, // Don't show verify button if already verified
    },
    {
      id: 'identity',
      label: 'Government ID',
      description: 'Coming soon - we\'re building this feature',
      isVerified: !!user?.identityVerified,
      icon: '🆔',
      verifiedDate: user?.identityVerified,
      onVerify: null, // Disabled while in development
    },
  ];

  const unverifiedCount = verifications.filter(v => !v.isVerified).length;
  const completionPercentage = ((verifications.length - unverifiedCount) / verifications.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Verification Status</h3>
          <p className="text-sm text-slate-600 mt-1">
            {unverifiedCount === 0 ? 'All verifications complete! 🎉' : 'Complete verifications to unlock features'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900">
            {verifications.length - unverifiedCount}/{verifications.length}
          </div>
          <p className="text-xs text-slate-600">verified</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600">Completion</span>
          <span className="text-xs font-bold text-sky-600">{Math.round(completionPercentage)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-gradient-to-r from-sky-500 to-blue-600 h-1.5 rounded-full"
          />
        </div>
      </div>

      {/* Verification Items */}
      <div className="space-y-3">
        {verifications.map((verification, index) => (
          <motion.div
            key={verification.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => setExpandedSection(
                expandedSection === verification.id ? null : verification.id
              )}
              className="w-full text-left"
            >
              <VerificationBadge
                {...verification}
                onVerify={verification.onVerify}
              />
            </button>

            {/* Expanded Info */}
            {expandedSection === verification.id && !verification.isVerified && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 bg-blue-50 rounded-lg text-xs text-slate-700 border border-blue-100"
              >
                <p className="mb-2">
                  {verification.id === 'email' && 'Check your email for a verification link. You have 24 hours to verify.'}
                  {verification.id === 'phone' && 'We\'ll send you a code via SMS. This usually takes less than a minute.'}
                  {verification.id === 'identity' && '🔨 We\'re currently building this feature. Government ID verification coming soon!'}
                </p>
                <div className="text-xs text-slate-600 italic">
                  💡 Verified users get priority in search results
                </div>
              </motion.div>
            )}

            {verification.isVerified && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 p-2 bg-emerald-50 rounded-lg text-xs text-emerald-700 border border-emerald-100"
              >
                ✓ Verified on {new Date(verification.verifiedDate).toLocaleDateString()}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Benefits Section */}
      {unverifiedCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200"
        >
          <p className="text-xs font-semibold text-amber-900 mb-2">✨ Benefits of Verification:</p>
          <ul className="text-xs text-amber-800 space-y-1">
            <li>• 5x more messages from interested users</li>
            <li>• Appear in more search results</li>
            <li>• Access to premium features</li>
            <li>• Higher trust score</li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}
