'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NewsArticle, NewsTopic } from './types';
import { SEED_NEWS } from './seed-news';

export interface NewsQueryFilter {
  topic?: NewsTopic | 'all';
  sourceId?: string | 'all';
  timeframe?: 'all' | 'today' | 'week' | 'month';
}

/**
 * Clean adapter interface ready to plug into real RSS/Atom or JSON REST endpoints.
 */
export interface NewsFeedAdapter {
  name: string;
  fetchDispatches: (filter?: NewsQueryFilter) => Promise<{
    articles: NewsArticle[];
    syncedAtIso: string;
  }>;
}

interface CacheEntry {
  articles: NewsArticle[];
  syncedAtIso: string;
  timestamp: number;
}

const SWR_CACHE = new Map<string, CacheEntry>();
const STALE_TTL_MS = 45_000;

export const PrimaryLabMockAdapter: NewsFeedAdapter = {
  name: 'VirusStudio-PrimaryWire-Adapter/v2.4',
  async fetchDispatches(filter = {}) {
    // Simulate sub-30ms edge wire validation
    await new Promise((resolve) => setTimeout(resolve, 24));

    let list = [...SEED_NEWS];

    if (filter.topic && filter.topic !== 'all') {
      list = list.filter((a) => a.topic === filter.topic);
    }
    if (filter.sourceId && filter.sourceId !== 'all') {
      list = list.filter((a) => a.source.id === filter.sourceId);
    }
    if (filter.timeframe && filter.timeframe !== 'all') {
      if (filter.timeframe === 'today') {
        list = list.filter((a) => a.timeframeBucket === 'today');
      } else if (filter.timeframe === 'week') {
        list = list.filter(
          (a) => a.timeframeBucket === 'today' || a.timeframeBucket === 'week'
        );
      }
    }

    return {
      articles: list,
      syncedAtIso: new Date().toISOString(),
    };
  },
};

/**
 * Stale-While-Revalidate hook with visibility-aware auto-refresh.
 * Never blocks initial render; serves seed/cached data immediately and revalidates in background.
 */
export function useNewsFeedSWR(
  filter: NewsQueryFilter,
  adapter: NewsFeedAdapter = PrimaryLabMockAdapter
) {
  const cacheKey = JSON.stringify(filter);
  const cached = SWR_CACHE.get(cacheKey);

  const [articles, setArticles] = useState<NewsArticle[]>(
    () => cached?.articles ?? SEED_NEWS
  );
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<string>(
    () => cached?.syncedAtIso ?? '2026-10-15T12:00:00Z'
  );
  const mountedRef = useRef<boolean>(true);

  const revalidate = useCallback(async () => {
    if (typeof document !== 'undefined' && document.hidden) return;
    setIsValidating(true);
    try {
      const res = await adapter.fetchDispatches(filter);
      SWR_CACHE.set(cacheKey, {
        articles: res.articles,
        syncedAtIso: res.syncedAtIso,
        timestamp: Date.now(),
      });
      if (mountedRef.current) {
        setArticles(res.articles);
        setLastSynced(res.syncedAtIso);
      }
    } finally {
      if (mountedRef.current) {
        setIsValidating(false);
      }
    }
  }, [adapter, cacheKey, filter]);

  useEffect(() => {
    mountedRef.current = true;
    const entry = SWR_CACHE.get(cacheKey);
    if (!entry || Date.now() - entry.timestamp > STALE_TTL_MS) {
      revalidate();
    } else {
      setArticles(entry.articles);
      setLastSynced(entry.syncedAtIso);
    }

    const interval = window.setInterval(() => {
      if (!document.hidden) {
        revalidate();
      }
    }, 60_000);

    return () => {
      mountedRef.current = false;
      window.clearInterval(interval);
    };
  }, [cacheKey, revalidate]);

  return {
    articles,
    isValidating,
    lastSynced,
    refreshNow: revalidate,
    adapterName: adapter.name,
  };
}
