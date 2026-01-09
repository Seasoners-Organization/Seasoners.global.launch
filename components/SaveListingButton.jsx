'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function SaveListingButton({
  listingId,
  className = '',
}) {
  const { data: session, status } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState('');

  const handleToggleSave = async () => {
    // Check if user is signed in
    if (status === 'unauthenticated') {
      setShowToast('Sign in to save listings');
      return;
    }

    setIsLoading(true);
    try {
      const method = isSaved ? 'DELETE' : 'POST';
      const response = await fetch(`/api/listings/${listingId}/save`, {
        method,
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 403) {
          setShowToast('Upgrade to Searcher to save listings');
        } else {
          setShowToast(data.error || 'Failed to update');
        }
        return;
      }

      setIsSaved(!isSaved);
      setShowToast(isSaved ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      setShowToast('Something went wrong');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggleSave}
        disabled={isLoading}
        className={`relative p-2 rounded-full transition-colors ${
          isSaved
            ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title={isSaved ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          className="w-6 h-6"
          fill={isSaved ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {isLoading && (
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-spin" />
        )}
      </motion.button>

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm z-50"
          onAnimationComplete={() => {
            if (showToast) {
              setTimeout(() => setShowToast(''), 3000);
            }
          }}
        >
          {showToast}
        </motion.div>
      )}
    </>
  );
}
