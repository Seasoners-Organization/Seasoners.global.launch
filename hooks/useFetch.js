import { useState, useEffect, useCallback } from 'react';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 60000; // 1 minute

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const cacheKey = url + JSON.stringify(options);
  const useCache = options.cache !== false;

  const fetchData = useCallback(async (force = false) => {
    if (!url) {
      setLoading(false);
      return;
    }

    // Check cache
    if (useCache && !force) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setData(cached.data);
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (useCache) {
        cache.set(cacheKey, { data: result, timestamp: Date.now() });
      }
      
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [url, cacheKey, useCache]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => fetchData(true);

  return { data, loading, error, refetch };
}

export function clearCache() {
  cache.clear();
}
