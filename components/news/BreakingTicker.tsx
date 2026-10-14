'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { NewsArticle } from '@/lib/types';
import { formatRelativeDate } from '@/lib/utils';

export function BreakingTicker({ articles }: { articles: NewsArticle[] }) {
  const breakingItems = articles.filter((a) => a.isBreaking);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (breakingItems.length <= 1 || paused) return;

    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setActiveIndex((prev) => (prev + 1) % breakingItems.length);
      }
    }, 4800);

    return () => window.clearInterval(timer);
  }, [breakingItems.length, paused]);

  if (breakingItems.length === 0) return null;

  const current = breakingItems[activeIndex] ?? breakingItems[0];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="spatial-card rounded-r16 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className="inline-flex items-center gap-1.5 rounded-r10 border border-accent/40 bg-accent/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          BREAKING WIRE
        </span>

        <Link
          key={current.slug}
          href={`/news/${current.slug}`}
          className="truncate text-xs sm:text-sm font-medium text-text hover:text-accent transition-all duration-ui ease-expo-out"
        >
          {current.title}
        </Link>
      </div>

      <div className="flex items-center gap-3 shrink-0 font-mono text-[11px] text-muted tabular-nums">
        <span className="hidden sm:inline">{current.source.name}</span>
        <span>{formatRelativeDate(current.publishedAt)}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              setActiveIndex(
                (prev) => (prev - 1 + breakingItems.length) % breakingItems.length
              )
            }
            aria-label="Previous breaking dispatch"
            className="rounded border border-hairline bg-raised px-1.5 py-0.5 text-text hover:border-accent/40"
          >
            ‹
          </button>
          <span className="px-1">
            {activeIndex + 1}/{breakingItems.length}
          </span>
          <button
            type="button"
            onClick={() =>
              setActiveIndex((prev) => (prev + 1) % breakingItems.length)
            }
            aria-label="Next breaking dispatch"
            className="rounded border border-hairline bg-raised px-1.5 py-0.5 text-text hover:border-accent/40"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
