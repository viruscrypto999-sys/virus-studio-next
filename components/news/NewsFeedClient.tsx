'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { NewsArticle, NewsSource, NewsTopic } from '@/lib/types';
import { useNewsFeedSWR } from '@/lib/news-adapter';
import {
  buildHighlightSegments,
  formatRelativeDate,
  fuzzyMatch,
} from '@/lib/utils';
import { useAppStore } from '@/components/providers/AppProviders';
import { Badge, Button, Card, Tabs } from '@/components/ui/Primitives';
import { BreakingTicker } from './BreakingTicker';

interface NewsFeedClientProps {
  initialArticles: NewsArticle[];
  sources: NewsSource[];
}

const TOPIC_OPTIONS: Array<{ value: NewsTopic | 'all'; label: string }> = [
  { value: 'all', label: 'All Dispatches' },
  { value: 'models', label: 'Models' },
  { value: 'tools', label: 'Tools' },
  { value: 'research', label: 'Research' },
  { value: 'funding', label: 'Funding' },
  { value: 'policy', label: 'Policy' },
  { value: 'open-source', label: 'Open-Source' },
];

const TIMEFRAME_TABS: Array<{
  value: 'all' | 'today' | 'week' | 'month';
  label: string;
}> = [
  { value: 'all', label: 'All Archive' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

export function NewsFeedClient({
  initialArticles,
  sources,
}: NewsFeedClientProps) {
  const { bookmarkedNews, toggleNewsBookmark, playTick } = useAppStore();

  const [selectedTopic, setSelectedTopic] = useState<NewsTopic | 'all'>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<'all' | 'today' | 'week' | 'month'>(
    'all'
  );
  const [rawQuery, setRawQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // 120ms debounce for search
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(rawQuery);
      setVisibleCount(12);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [rawQuery]);

  const { articles, isValidating, refreshNow, adapterName } = useNewsFeedSWR({
    topic: selectedTopic,
    sourceId: selectedSource,
    timeframe,
  });

  const activePool = articles.length > 0 ? articles : initialArticles;

  const filteredArticles = useMemo(() => {
    const list: Array<{
      article: NewsArticle;
      titleMatches: number[];
      score: number;
    }> = [];

    for (const art of activePool) {
      if (onlyBookmarked && !bookmarkedNews.includes(art.slug)) {
        continue;
      }

      if (!debouncedQuery.trim()) {
        list.push({ article: art, titleMatches: [], score: 1 });
      } else {
        const tMatch = fuzzyMatch(art.title, debouncedQuery);
        const sMatch = fuzzyMatch(art.summary, debouncedQuery);
        if (tMatch || sMatch) {
          list.push({
            article: art,
            titleMatches: tMatch ? tMatch.matchedIndices : [],
            score: (tMatch?.score ?? 0) * 2 + (sMatch?.score ?? 0),
          });
        }
      }
    }

    if (debouncedQuery.trim()) {
      list.sort((a, b) => b.score - a.score);
    }

    return list;
  }, [activePool, onlyBookmarked, bookmarkedNews, debouncedQuery]);

  const leadStory =
    filteredArticles.find((item) => item.article.isLeadStory)?.article ??
    filteredArticles[0]?.article;

  const masonryItems = filteredArticles
    .filter((item) => item.article.slug !== leadStory?.slug)
    .slice(0, visibleCount);

  return (
    <div className="space-y-8">
      {/* Subtle Breaking Wire Ticker */}
      <BreakingTicker articles={initialArticles} />

      {/* Filter & SWR Telemetry Controls */}
      <div className="spatial-card rounded-r24 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={rawQuery}
              onChange={(e) => setRawQuery(e.target.value)}
              placeholder="Search 24 primary dispatches by model, theorem, lab, or policy..."
              aria-label="Search AI news dispatches"
              className="w-full rounded-r16 border border-hairline bg-bg pl-11 pr-16 py-3 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none"
            />
            {rawQuery && (
              <button
                type="button"
                onClick={() => setRawQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-hairline bg-raised px-2 py-0.5 font-mono text-[10px] text-muted hover:text-text"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Today / Week / Month Switch + Saved Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <Tabs
              ariaLabel="Timeframe filter"
              options={TIMEFRAME_TABS}
              value={timeframe}
              onChange={(val) => {
                setTimeframe(val);
                setVisibleCount(12);
              }}
            />

            <button
              type="button"
              onClick={() => {
                setOnlyBookmarked((p) => !p);
                playTick(1520);
              }}
              className={`rounded-r16 border px-3.5 py-2 font-mono text-xs tabular-nums transition-colors ${
                onlyBookmarked
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-hairline bg-bg text-muted hover:text-text'
              }`}
            >
              Saved ({bookmarkedNews.length})
            </button>
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TOPIC_OPTIONS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                setSelectedTopic(t.value);
                setVisibleCount(12);
              }}
              className={`shrink-0 rounded-r10 border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                selectedTopic === t.value
                  ? 'border-accent bg-accent/15 text-text'
                  : 'border-hairline bg-bg text-muted hover:text-text'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Source Filter & SWR Adapter Status */}
        <div className="pt-4 border-t border-hairline flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase text-muted">
              Primary Source:
            </span>
            <button
              type="button"
              onClick={() => setSelectedSource('all')}
              className={`rounded-r10 px-2.5 py-1 font-mono text-[11px] ${
                selectedSource === 'all'
                  ? 'bg-raised text-accent border border-accent/35'
                  : 'text-muted hover:text-text'
              }`}
            >
              All Labs ({sources.length})
            </button>
            {sources.map((src) => (
              <button
                key={src.id}
                type="button"
                onClick={() => setSelectedSource(src.id)}
                className={`rounded-r10 px-2.5 py-1 font-mono text-[11px] ${
                  selectedSource === src.id
                    ? 'bg-raised text-accent border border-accent/35'
                    : 'text-muted hover:text-text'
                }`}
              >
                {src.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-muted tabular-nums">
            <span>{adapterName}</span>
            <button
              type="button"
              onClick={refreshNow}
              className="text-accent hover:underline"
            >
              {isValidating ? '[SYNCING WIRE...]' : '[REVALIDATE SWR]'}
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 ? (
        <Card radius="r24" className="p-12 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            [ZERO MATCHING DISPATCHES]
          </p>
          <h3 className="mt-2 text-xl font-medium text-text">
            No articles match your active topic or timeframe filters
          </h3>
          <div className="mt-6">
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedTopic('all');
                setSelectedSource('all');
                setTimeframe('all');
                setRawQuery('');
                setOnlyBookmarked(false);
              }}
            >
              Reset All Wire Filters
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Lead Editorial Dispatch Card */}
          {leadStory && (
            <Card radius="r36" className="p-7 sm:p-10 lg:p-12 bg-surface">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge tone="accent">LEAD DISPATCH // {leadStory.topic.toUpperCase()}</Badge>
                    <Badge>{leadStory.source.credibilityTier}</Badge>
                    <span className="font-mono text-xs text-muted tabular-nums">
                      {formatRelativeDate(leadStory.publishedAt)} · {leadStory.readTimeMinutes}m read
                    </span>
                  </div>

                  <Link
                    href={`/news/${leadStory.slug}`}
                    className="block font-serif text-3xl sm:text-5xl leading-[1.06] text-text hover:text-accent transition-colors"
                  >
                    {leadStory.title}
                  </Link>

                  <p className="text-base sm:text-lg text-muted leading-relaxed">
                    {leadStory.subtitle}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-muted">
                    <span>
                      BY {leadStory.author.name.toUpperCase()} ({leadStory.author.role.toUpperCase()})
                    </span>
                    <span>·</span>
                    <span className="text-accent">{leadStory.source.name}</span>
                  </div>
                </div>

                {/* Executive TL;DR Preview Box inside Lead Story */}
                <div className="lg:col-span-4 rounded-r24 border border-hairline bg-bg/80 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-hairline pb-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-accent">
                      EXECUTIVE TL;DR
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        toggleNewsBookmark(leadStory.slug, leadStory.title)
                      }
                      className="font-mono text-xs text-muted hover:text-text"
                    >
                      {bookmarkedNews.includes(leadStory.slug)
                        ? '[★ SAVED]'
                        : '[☆ SAVE]'}
                    </button>
                  </div>

                  <ul className="space-y-2.5 text-xs text-text leading-relaxed">
                    {leadStory.tldrBullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="font-mono text-accent">→</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <Link href={`/news/${leadStory.slug}`}>
                      <Button variant="primary" size="md" className="w-full" rollText>
                        Read Full Monograph →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Editorial Masonry Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
            {masonryItems.map(({ article, titleMatches }, idx) => {
              const isSaved = bookmarkedNews.includes(article.slug);
              const titleSegments = buildHighlightSegments(
                article.title,
                titleMatches
              );
              const showExpandedPreview = idx % 3 === 0;

              return (
                <Card
                  key={article.slug}
                  radius="r24"
                  className="break-inside-avoid p-6 flex flex-col justify-between space-y-5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          tone={article.isBreaking ? 'accent' : 'default'}
                        >
                          {article.topic.toUpperCase()}
                        </Badge>
                        <span className="font-mono text-[11px] text-muted tabular-nums">
                          {formatRelativeDate(article.publishedAt)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          toggleNewsBookmark(article.slug, article.title)
                        }
                        aria-label={`Bookmark ${article.title}`}
                        className={`flex h-7 w-7 items-center justify-center rounded-r10 border transition-colors ${
                          isSaved
                            ? 'border-accent bg-accent/15 text-accent'
                            : 'border-hairline bg-raised text-muted hover:text-text'
                        }`}
                      >
                        ★
                      </button>
                    </div>

                    <Link
                      href={`/news/${article.slug}`}
                      className="mt-4 block font-serif text-2xl leading-snug text-text hover:text-accent transition-colors"
                    >
                      {titleSegments.map((seg, i) =>
                        seg.highlight ? (
                          <mark
                            key={i}
                            className="bg-accent/25 text-text rounded-sm px-0.5"
                          >
                            {seg.text}
                          </mark>
                        ) : (
                          <span key={i}>{seg.text}</span>
                        )
                      )}
                    </Link>

                    <p className="mt-3 text-sm text-muted leading-relaxed">
                      {article.summary}
                    </p>

                    {showExpandedPreview && (
                      <blockquote className="mt-4 border-l-2 border-accent/60 pl-3.5 py-0.5 font-serif italic text-base text-text">
                        &ldquo;{article.pullQuote.text}&rdquo;
                      </blockquote>
                    )}
                  </div>

                  <div className="pt-4 border-t border-hairline flex items-center justify-between font-mono text-xs text-muted tabular-nums">
                    <span className="truncate max-w-[180px]">
                      {article.source.name}
                    </span>
                    <Link
                      href={`/news/${article.slug}`}
                      className="text-text underline-draw shrink-0"
                    >
                      {article.readTimeMinutes}m read →
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination Batch Trigger */}
          {visibleCount < filteredArticles.length - 1 && (
            <div className="pt-4 flex justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + 12)}
              >
                Load More Dispatches ({filteredArticles.length - 1 - visibleCount}{' '}
                Remaining)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
