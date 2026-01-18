"use client";
import { useState } from 'react';
import { BOOST_PLANS } from '../utils/subscription';

export default function ListingBoostButton({ listingId, currentBoost }) {
  const [loading, setLoading] = useState(false);
  const [selectedBoost, setSelectedBoost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleBoostClick = (boostType) => {
    setSelectedBoost(boostType);
    setShowModal(true);
  };

  const handleConfirmBoost = async () => {
    if (!selectedBoost) return;

    setLoading(true);
    try {
      const response = await fetch('/api/boosts/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          boostType: selectedBoost,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create boost checkout');
      }

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Boost purchase error:', err);
      alert('Failed to start boost purchase. Please try again.');
      setLoading(false);
    }
  };

  // Check if listing has active boost
  const hasActiveBoost = currentBoost && new Date(currentBoost.expiresAt) > new Date();

  if (hasActiveBoost) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-semibold text-amber-900">Featured Listing</span>
        </div>
        <p className="text-sm text-amber-700">
          Active until {new Date(currentBoost.expiresAt).toLocaleDateString()}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <p className="text-sm text-slate-600 mb-3">
          Boost your listing for maximum visibility
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleBoostClick('BOOST_7')}
            className="border-2 border-amber-200 rounded-lg p-4 hover:border-amber-400 hover:bg-amber-50 transition-all text-left"
          >
            <div className="font-semibold text-slate-900">7 Days</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">€{BOOST_PLANS.BOOST_7.price}</div>
            <div className="text-xs text-slate-500 mt-1">Best for quick fills</div>
          </button>
          
          <button
            onClick={() => handleBoostClick('BOOST_30')}
            className="border-2 border-amber-400 rounded-lg p-4 hover:border-amber-500 hover:bg-amber-50 transition-all text-left relative"
          >
            <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              BEST VALUE
            </span>
            <div className="font-semibold text-slate-900">30 Days</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">€{BOOST_PLANS.BOOST_30.price}</div>
            <div className="text-xs text-slate-500 mt-1">Maximum visibility</div>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Confirm Boost Purchase
            </h3>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-900">
                  {BOOST_PLANS[selectedBoost]?.name}
                </span>
                <span className="text-2xl font-bold text-amber-600">
                  €{BOOST_PLANS[selectedBoost]?.price}
                </span>
              </div>
              <ul className="space-y-1 text-sm text-slate-600">
                {BOOST_PLANS[selectedBoost]?.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Your listing will appear at the top of search results for {BOOST_PLANS[selectedBoost]?.durationDays} days.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBoost}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Purchase Boost'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
