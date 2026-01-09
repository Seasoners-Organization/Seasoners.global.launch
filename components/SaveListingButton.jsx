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
  const [showToast, setShowToast] = useState({ message: '', type: 'info' });

  const handleToggleSave = async () => {
    // Check if user is signed in
    if (status === 'unauthenticated') {
      setShowToast({ message: 'Sign in to save listings', type: 'info' });
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
          setShowToast({ message: 'Upgrade to Searcher to save listings', type: 'error' });
        } else {
          setShowToast({ message: data.error || 'Failed to update', type: 'error' });
        }
        return;
      }

      setIsSaved(!isSaved);
      setShowToast({ 
        message: isSaved ? 'Removed from favorites' : 'Added to favorites',
        type: 'success'
      });
    } catch (error) {
      setShowToast({ message: 'Something went wrong', type: 'error' });
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
      {showToast.message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-4 right-4 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-sm z-50 font-medium ${
            showToast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : showToast.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-sky-600 text-white'
          }`}
          onAnimationComplete={() => {
            if (showToast.message) {
              setTimeout(() => setShowToast({ message: '', type: 'info' }), 3000);
            }
          }}
        >
          {showToast.type === 'success' && (
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          )}
          {showToast.type === 'error' && (
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          )}
          {showToast.type === 'info' && (
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z" />
            </svg>
          )}
          <span>{showToast.message}</span>
        </motion.div>
      )}
    </>
  );
}
