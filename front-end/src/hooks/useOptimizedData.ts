import { useState, useEffect, useCallback, useMemo } from 'react';

// Simple cache implementation
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export function useOptimizedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    staleTime?: number;
    enabled?: boolean;
  } = {}
) {
  const { staleTime = CACHE_DURATION, enabled = true } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache first
    const cached = cache.get(key) as CacheEntry<T> | undefined;
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < staleTime) {
      setData(cached.data);
      return cached.data;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      
      // Update cache
      cache.set(key, {
        data: result,
        timestamp: now
      });
      
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, staleTime, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    // Clear cache for this key
    cache.delete(key);
    return fetchData();
  }, [key, fetchData]);

  return useMemo(() => ({
    data,
    isLoading,
    error,
    refetch
  }), [data, isLoading, error, refetch]);
}

// Preload data for faster navigation
export function preloadData<T>(key: string, fetcher: () => Promise<T>) {
  const cached = cache.get(key) as CacheEntry<T> | undefined;
  const now = Date.now();
  
  if (!cached || (now - cached.timestamp) >= CACHE_DURATION) {
    fetcher().then(data => {
      cache.set(key, {
        data,
        timestamp: now
      });
    }).catch(() => {
      // Silently fail for preloading
    });
  }
}

// Clear cache when needed
export function clearCache(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}
