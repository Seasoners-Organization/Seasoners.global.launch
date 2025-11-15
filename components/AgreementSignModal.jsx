'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadAgreementPDF } from '../utils/pdf-generator';

/**
 * Modal for signing Smart Stay Agreements
 * Displays agreement content, parties, and signature flow
 */
export default function AgreementSignModal({ agreement, isOpen, onClose, onSign, preset }) {
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState(null);
  const [accepted, setAccepted] = useState(false);

  // Allow modal to be opened with either an existing agreement or a preset
  if (!agreement && !preset) return null;

  const { preamble, clauses, host, guest, listing, startDate, endDate, signatures, status } = agreement || {};

  // Merge preset values when provided (zone presets)
  const effectivePreamble = preset?.preamble || preamble || '';
  const effectiveStart = startDate || preset?.startDate;
  const effectiveEnd = endDate || preset?.endDate;
  const depositSuggest = preset?.depositSuggest;

  // Parse signatures
  const signatureList = Array.isArray(signatures) ? signatures : [];
  const hostSigned = host?.id ? signatureList.some((sig) => sig.userId === host.id) : false;
  const guestSigned = guest?.id ? signatureList.some((sig) => sig.userId === guest.id) : false;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSign = async () => {
    if (!accepted) {
      setError('Please accept the agreement terms before signing');
      return;
    }

    setIsSigning(true);
    setError(null);

    try {
      const response = await fetch(`/api/agreements/${agreement.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sign' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to sign agreement');
      }

      const updatedAgreement = await response.json();
      
      if (onSign) {
        await onSign(updatedAgreement);
      }

      // Show success briefly before closing
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Smart Stay Agreement</h2>
                <p className="text-sm text-gray-600 mt-1">{listing?.title}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-gray-500 text-xl">✕</span>
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-280px)] p-6 space-y-6">
              {/* Agreement Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-sky-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <span className="text-sky-600 mt-0.5">👥</span>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Parties</p>
                    <p className="text-sm text-gray-600">
                      {host?.name || 'Host'} & {guest?.name || 'Guest'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-sky-600 mt-0.5">📅</span>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Duration</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(effectiveStart)} - {formatDate(effectiveEnd)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preamble */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome</h3>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                  {effectivePreamble}
                </div>
                {depositSuggest && (
                  <p className="text-sm text-slate-600 mt-2">Suggested deposit: {depositSuggest}</p>
                )}
              </div>

              {/* Clauses */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agreement Terms</h3>
                <div className="space-y-4">
                  {Array.isArray(clauses) &&
                    clauses
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((clause, index) => (
                        <div key={index} className="border-l-4 border-emerald-500 pl-4">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {clause.title}
                          </h4>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {clause.content}
                          </p>
                        </div>
                      ))}
                </div>
              </div>

              {/* Signature Status */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Signatures</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{host?.name || 'Host'} (Host)</span>
                    {hostSigned ? (
                      <span className="flex items-center text-sm text-emerald-600">
                        ✓ Signed
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Pending</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{guest?.name || 'Guest'} (Guest)</span>
                    {guestSigned ? (
                      <span className="flex items-center text-sm text-emerald-600">
                        ✓ Signed
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Pending</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <span className="text-red-600 flex-shrink-0 mt-0.5">⚠️</span>
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              {/* Acceptance Checkbox */}
              {status !== 'FULLY_SIGNED' && (
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">
                    I have read and understand this agreement. I agree to all terms and
                    conditions stated above. By signing, I acknowledge that this creates a
                    binding commitment between both parties.
                  </span>
                </label>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {status === 'FULLY_SIGNED' ? 'Close' : 'Cancel'}
                </button>

                {status === 'FULLY_SIGNED' && (
                  <button
                    onClick={() => downloadAgreementPDF(agreement)}
                    className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center space-x-2"
                  >
                    <span>📄</span>
                    <span>Download PDF</span>
                  </button>
                )}
              </div>

              {status !== 'FULLY_SIGNED' && (
                <button
                  onClick={handleSign}
                  disabled={isSigning || !accepted || !agreement?.id}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isSigning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing...</span>
                    </>
                  ) : (
                    <>
                      <span>📝</span>
                      <span>Sign Agreement</span>
                    </>
                  )}
                </button>
              )}

              {status === 'FULLY_SIGNED' && (
                <div className="flex items-center space-x-2 text-emerald-600">
                  <span>✓</span>
                  <span className="font-semibold">Fully Signed</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
