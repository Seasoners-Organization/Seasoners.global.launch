"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from './LanguageProvider';

export default function ListingPicker({ zone, onSelect, onCancel }) {
  const { t } = useLanguage();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/listings?zone=${encodeURIComponent(zone)}&limit=50`);
        if (!res.ok) throw new Error('Failed to load listings');
        const data = await res.json();
        if (!mounted) return;
        // If API returns { listings: [...] } or an array directly, normalize
        const items = data.listings || data || [];
        // Get current user to filter owner listings client-side
        const userRes = await fetch('/api/user/me');
        const userData = await userRes.json().catch(() => ({}));
        const currentUserId = userData.user?.id;

        // If we have a user id, prefer showing only listings owned by them
        const owned = currentUserId ? items.filter((l) => l.userId === currentUserId) : [];
        setListings(owned.length ? owned : items);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [zone]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">{t('chooseListing') || 'Choose a listing'}</h3>
        <button onClick={onCancel} className="text-sm text-gray-500">{t('cancel') || 'Cancel'}</button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && listings && listings.length === 0 && (
        <p className="text-sm text-gray-600">{t('noListingsFound') || 'No listings found'}</p>
      )}

      <ul className="space-y-2">
        {(listings || []).map((listing) => (
          <li key={listing.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <div className="font-medium">{listing.title || listing.name || `Listing ${listing.id}`}</div>
              <div className="text-sm text-gray-500">{listing.location || listing.zone || ''}</div>
            </div>
            <div>
              <button
                onClick={() => onSelect(listing)}
                className="px-3 py-1 bg-emerald-600 text-white rounded"
              >
                {t('select') || 'Select'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
