import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Shared cache to prevent duplicate requests
let cachedUserData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 30000; // 30 seconds

export function useUserProfile() {
  const { data: session } = useSession();
  const [user, setUser] = useState(cachedUserData);
  const [loading, setLoading] = useState(!cachedUserData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session?.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Use cache if valid
    const now = Date.now();
    if (cachedUserData && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      setUser(cachedUserData);
      setLoading(false);
      return;
    }

    // Fetch fresh data
    setLoading(true);
    fetch('/api/user/me', {
      headers: {
        'Cache-Control': 'max-age=30',
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then(data => {
        if (data.user) {
          cachedUserData = data.user;
          cacheTimestamp = Date.now();
          setUser(data.user);
        }
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        console.error('Failed to fetch user profile:', err);
      })
      .finally(() => setLoading(false));
  }, [session]);

  const refreshUser = () => {
    cachedUserData = null;
    cacheTimestamp = null;
    if (session?.user) {
      setLoading(true);
      fetch('/api/user/me', {
        cache: 'no-store',
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.user) {
            cachedUserData = data.user;
            cacheTimestamp = Date.now();
            setUser(data.user);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  return { user, loading, error, refreshUser };
}

// Clear cache on logout
export function clearUserCache() {
  cachedUserData = null;
  cacheTimestamp = null;
}
