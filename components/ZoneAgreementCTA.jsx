"use client";

import React, { useState } from 'react';
import AgreementSignModal from './AgreementSignModal';
import ListingPicker from './ListingPicker';
import { useLanguage } from './LanguageProvider';

function normalizeListingsResponse(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.listings)) return data.listings;
  // sometimes API returns { results: [...] }
  if (Array.isArray(data.results)) return data.results;
  return [];
}

export default function ZoneAgreementCTA({ zone, preset }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const createAgreementForListing = async (listing) => {
    setLoading(true);
    setError(null);
    try {
      const userRes = await fetch('/api/user/me');
      if (!userRes.ok) throw new Error('You must be signed in to create an agreement');
      const userData = await userRes.json();
      const guestId = userData.user?.id;
      if (!guestId) throw new Error('User information missing');

      const isOwner = listing.userId === guestId;

      const payload = {
        listingId: listing.id,
        guestId,
        preamble: preset?.preamble || `A seasonal stay in ${zone}`,
        clauses: preset?.clauses || [{ title: 'Duration', content: `Season: ${preset?.season || 'season'}`, order: 1 }],
        startDate: preset?.startDate || null,
        endDate: preset?.endDate || null,
      };

      const endpoint = isOwner ? '/api/agreements' : '/api/agreements/request';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create agreement');
      }

      const created = await res.json();
      setAgreement(created);
      setIsOpen(true);
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCTA = async () => {
    setError(null);
    try {
      // if user owns listings in this zone, open the picker so they can select
      const userRes = await fetch('/api/user/me');
      if (userRes.ok) {
        const userData = await userRes.json();
        const userId = userData.user?.id;
        if (userId) {
          const ownedRes = await fetch(`/api/listings?owner=${userId}&zone=${encodeURIComponent(zone)}&limit=1`);
          if (ownedRes.ok) {
            const ownedData = await ownedRes.json();
            const owned = normalizeListingsResponse(ownedData);
            if (owned.length > 0) {
              setShowPicker(true);
              return;
            }
          }
        }
      }
    } catch (e) {
      // ignore and fallback to auto-pick
    }

    // auto-pick the first listing in the zone
    try {
      const pickRes = await fetch(`/api/listings?zone=${encodeURIComponent(zone)}&limit=1`);
      if (!pickRes.ok) throw new Error('No available listing');
      const pickData = await pickRes.json();
      const listings = normalizeListingsResponse(pickData);
      const listing = listings[0];
      if (!listing) throw new Error('No listings available');
      await createAgreementForListing(listing);
    } catch (err) {
      setError(err?.message || String(err));
    }
  };

  return (
    <div>
      <div className="text-center mt-6">
        <button onClick={handleCTA} className="px-6 py-3 bg-emerald-600 text-white rounded-lg" disabled={loading}>
          {loading ? (t('creating') || 'Creating...') : t('joinSeasonersCTA')}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {showPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-xl mx-4">
            <ListingPicker
              zone={zone}
              onCancel={() => setShowPicker(false)}
              onSelect={(listing) => {
                setShowPicker(false);
                createAgreementForListing(listing);
              }}
            />
          </div>
        </div>
      )}

      <AgreementSignModal
        isOpen={isOpen}
        agreement={agreement}
        preset={preset}
        onClose={() => setIsOpen(false)}
        onSign={(updated) => {
          setAgreement(updated);
          setIsOpen(false);
        }}
      />
    </div>
  );
}
