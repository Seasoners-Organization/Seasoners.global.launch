import { useState, useCallback } from 'react';

export function useSaveListing(listingId: string) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSave = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (isSaved) {
        // Remove from saved
        const response = await fetch(
          `/api/listings/${listingId}/save`,
          { method: 'DELETE' }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to unsave listing');
        }

        setIsSaved(false);
      } else {
        // Add to saved
        const response = await fetch(
          `/api/listings/${listingId}/save`,
          { method: 'POST' }
        );

        if (!response.ok) {
          const data = await response.json();
          if (response.status === 403) {
            throw new Error('Upgrade to Searcher or Lister to save listings');
          }
          throw new Error(data.error || 'Failed to save listing');
        }

        setIsSaved(true);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error toggling save:', err);
    } finally {
      setIsLoading(false);
    }
  }, [listingId, isSaved]);

  return {
    isSaved,
    isLoading,
    error,
    toggleSave,
    setSaved: setIsSaved,
  };
}
