'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { AppCategorySlug, AppItem, CategoryInfo, PricingTier } from '@/lib/seed-apps';
import { fuzzyMatch, buildHighlightSegments, cn } from '@/lib/utils';
import { Badge, Button, Card, Tabs } from '@/components/ui/Primitives';
import { CompareDrawerModal } from '@/components/apps/CompareDrawerModal';
import { useAppStore } from '@/components/providers/AppProviders';

interface AppsDirectoryClientProps {
  initialApps: AppItem[];
  categories: CategoryInfo[];
  lockedCategory?: AppCategorySlug;
}

const PRICING_FILTERS: Array<'All' | PricingTier> = ['All', 'Free', 'Freemium', 'Usage-Based', 'Enterprise'];
const PAGE_SIZE = 12;

function HighlightedText({ text, query }: { text: string; query: string }) {
  const match = fuzzyMatch(text, query);
  if (!match || !query.trim()) return <>{text}</>;
  const segments = buildHighlightSegments(text, match.matchedIndices);
  return (
    <>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <mark key={i} className="bg-accent/30 text-text rounded-sm px-px">
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  );
}

export function AppsDirectoryClient({
  initialApps,
  categories,
  lockedCategory,
}: AppsDirectoryClientProps) {
  const { pushToast } = useAppStore();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(lockedCategory ?? 'all');
  const [pricing, setPricing] = useState<'All' | PricingTier>('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 120ms debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(query), 120);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, activeCategory, pricing]);

  const filtered = useMemo(() => {
    let apps = initialApps;
    if (lockedCategory) {
      apps = apps.filter((a) => a.category === lockedCategory);
    } else if (activeCategory !== 'all') {
      apps = apps.filter((a) => a.category === activeCategory);
    }
    if (pricing !== 'All') {
      apps = apps.filter((a) => a.pricing === pricing);
    }
    const q = debouncedQuery.trim();
    if (q) {
      const scored = apps
        .map((app) => {
          const hay = `${app.name} ${app.tagline} ${app.description} ${app.categoryLabel}`;
          const m = fuzzyMatch(hay, q);
          return m ? { app, score: m.score } : null;
        })
        .filter(Boolean) as Array<{ app: AppItem; score: number }>;
      scored.sort((a, b) => b.score - a.score);
      apps = scored.map((s) => s.app);
    } else {
      apps = [...apps].sort((a, b) => b.rating - a.rating);
    }
    return apps;
  }, [initialApps, lockedCategory, activeCategory, pricing, debouncedQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageApps = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleCompareApp = (slug: string, name: string) => {
    setCompareSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) {
        pushToast('Compare limit reached', 'You can compare up to 3 systems side-by-side.', 'accent');
        return prev;
      }
      pushToast('Added to compare', name, 'default');
      return [...prev, slug];
    });
  };

  const selectedApps = useMemo(
    () => compareSlugs.map((s) => initialApps.find((a) => a.slug === s)).filter(Boolean) as AppItem[],
    [compareSlugs, initialApps]
  );

  const categoryTabs = useMemo(() => {
    if (lockedCategory) return [];
    return [
      { value: 'all', label: 'All Systems' },
      ...categories.map((c) => ({ value: c.slug, label: c.shortName })),
    ];
  }, [categories, lockedCategory]);

  return (
    <div>
      {/* Search + filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 30 benchmarked AI systems..."
              className="w-full rounded-r16 border border-hairline bg-raised/60 px-4 py-3 text-sm text-text placeholder:text-muted outline-none focus:border-accent/50 transition-colors"
              aria-label="Search apps"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted hover:text-text"
              >
                [×]
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === 'grid' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setView('grid')}
            >
              Grid
            </Button>
            <Button
              variant={view === 'list' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setView('list')}
            >
              List
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!lockedCategory && categoryTabs.length > 0 && (
            <Tabs
              options={categoryTabs}
              value={activeCategory}
              onChange={setActiveCategory}
              ariaLabel="Filter by category"
            />
          )}
          <select
            value={pricing}
            onChange={(e) => setPricing(e.target.value as 'All' | PricingTier)}
            className="rounded-r10 border border-hairline bg-raised/60 px-3 py-2 font-mono text-xs text-text outline-none focus:border-accent/50"
            aria-label="Filter by pricing"
          >
            {PRICING_FILTERS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <span className="font-mono text-xs text-muted tabular-nums">
            {filtered.length} SYSTEMS
          </span>
        </div>
      </div>

      {/* Results */}
      {pageApps.length === 0 ? (
        <div className="mt-12 text-center py-16 border border-hairline rounded-r24">
          <p className="font-mono text-sm text-muted">NO SYSTEMS MATCH THIS QUERY</p>
          <Button variant="ghost" size="sm" className="mt-4" onClick={() => { setQuery(''); setPricing('All'); setActiveCategory('all'); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            'mt-8',
            view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
              : 'flex flex-col gap-4'
          )}
        >
          {pageApps.map((app) => {
            const inCompare = compareSlugs.includes(app.slug);
            return (
              <Card
                key={app.slug}
                radius="r24"
                className={cn(
                  'p-6 flex flex-col justify-between transition-transform duration-ui hover:-translate-y-1',
                  view === 'list' && 'sm:flex-row sm:items-center sm:gap-6',
                  inCompare && 'border-accent/50'
                )}
              >
                <div className={cn(view === 'list' && 'flex-1')}>
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-r10 border border-hairline bg-raised font-mono text-xs text-accent">
                      {app.iconGlyph}
                    </span>
                    <span className="font-mono text-xs text-accent tabular-nums">
                      {app.rating.toFixed(1)} / 10
                    </span>
                  </div>
                  <Link
                    href={`/apps/${app.slug}`}
                    className="mt-4 block text-lg font-medium text-text hover:text-accent"
                  >
                    <HighlightedText text={app.name} query={debouncedQuery} />
                  </Link>
                  <p className="mt-1 text-xs text-muted leading-relaxed">
                    <HighlightedText text={app.tagline} query={debouncedQuery} />
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge tone="default">{app.categoryLabel}</Badge>
                    <Badge tone={app.pricing === 'Free' ? 'accent' : 'default'}>{app.pricing}</Badge>
                  </div>
                </div>
                <div
                  className={cn(
                    'mt-5 pt-3 border-t border-hairline flex items-center justify-between',
                    view === 'list' && 'sm:mt-0 sm:pt-0 sm:border-0 sm:flex-col sm:items-end sm:gap-2'
                  )}
                >
                  <span className="font-mono text-xs text-muted">{app.startingPrice}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleCompareApp(app.slug, app.name)}
                      className={cn(
                        'rounded-r10 border px-2.5 py-1.5 font-mono text-[11px] transition-colors',
                        inCompare
                          ? 'border-accent/60 text-accent'
                          : 'border-hairline text-muted hover:text-text hover:border-accent/40'
                      )}
                    >
                      {inCompare ? '[✓] COMPARE' : '[+] COMPARE'}
                    </button>
                    <Link
                      href={`/apps/${app.slug}`}
                      className="font-mono text-[11px] text-text underline-draw"
                    >
                      Inspect →
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Prev
          </Button>
          <span className="font-mono text-xs text-muted tabular-nums px-3">
            {page} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next →
          </Button>
        </div>
      )}

      {/* Floating compare bar */}
      {compareSlugs.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-3 rounded-r16 border border-accent/40 bg-raised/95 px-4 py-3 shadow-2xl backdrop-blur">
            <span className="font-mono text-xs text-text tabular-nums">
              {compareSlugs.length}/3 SELECTED
            </span>
            <Button size="sm" onClick={() => setModalOpen(true)}>
              Compare Now →
            </Button>
            <button
              type="button"
              onClick={() => setCompareSlugs([])}
              className="font-mono text-xs text-muted hover:text-text"
            >
              [clear]
            </button>
          </div>
        </div>
      )}

      <CompareDrawerModal
        selectedApps={selectedApps}
        toggleCompareApp={toggleCompareApp}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </div>
  );
}
