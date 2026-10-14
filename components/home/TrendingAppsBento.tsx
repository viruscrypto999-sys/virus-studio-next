'use client';

import React from 'react';
import Link from 'next/link';
import { Badge, Button, Card } from '@/components/ui/Primitives';
import { useAppStore } from '@/components/providers/AppProviders';

interface TrendingBentoApp {
  slug: string;
  name: string;
  tagline: string;
  categoryLabel: string;
  rating: number;
  latencyMs: number;
  contextWindow: string;
  pricing: string;
  verifiedBenchmark: string;
  iconGlyph: string;
  spanClass: string;
}

const TRENDING_BENTO_APPS: TrendingBentoApp[] = [
  {
    slug: 'astra-6-omni-reasoner',
    name: 'Astra-6 Omni Reasoner',
    tagline:
      'Deterministic multi-step symbolic synthesis with real-time formal proof verification and 10M-token active memory.',
    categoryLabel: 'Foundation Models',
    rating: 9.9,
    latencyMs: 142,
    contextWindow: '10M tokens',
    pricing: 'Usage-Based',
    verifiedBenchmark: '96.4% SWE-Verified · 99.1% MATH-500',
    iconGlyph: 'A6',
    spanClass: 'lg:col-span-7',
  },
  {
    slug: 'kinetix-kernel-ide',
    name: 'Kinetix Kernel IDE',
    tagline:
      'Repository-scale autonomous systems engineering with sub-second AST diff verification and local kernel execution.',
    categoryLabel: 'Code & Engineering',
    rating: 9.8,
    latencyMs: 68,
    contextWindow: '2M tokens',
    pricing: 'Freemium',
    verifiedBenchmark: '84.2% Autonomous PR Merge Rate',
    iconGlyph: 'KX',
    spanClass: 'lg:col-span-5',
  },
  {
    slug: 'chronos-world-model-4d',
    name: 'Chronos World Model 4D',
    tagline:
      'Physically grounded neural radiance and rigid-body mechanics simulation for robotics and cinema pre-visualization.',
    categoryLabel: 'Spatial & 3D',
    rating: 9.7,
    latencyMs: 210,
    contextWindow: '4D Voxel Stream',
    pricing: 'Enterprise',
    verifiedBenchmark: '60fps Native Ray-Consistent Output',
    iconGlyph: 'C4',
    spanClass: 'lg:col-span-4',
  },
  {
    slug: 'veritas-theorem-synthesizer',
    name: 'Veritas Theorem Synthesizer',
    tagline:
      'Automated Lean-4 mathematical proof discovery, cryptographic smart-contract auditing, and formal verification.',
    categoryLabel: 'Research & Reasoning',
    rating: 9.7,
    latencyMs: 195,
    contextWindow: '4M tokens',
    pricing: 'Freemium',
    verifiedBenchmark: 'Zero Unsound Proofs Across 14k Lemmas',
    iconGlyph: 'VT',
    spanClass: 'lg:col-span-4',
  },
  {
    slug: 'solaris-voice-duplex',
    name: 'Solaris Acoustic Duplex',
    tagline:
      'Sub-90ms full-duplex neural speech synthesis with acoustic emotion retention and zero-shot prosody transfer.',
    categoryLabel: 'Audio & Voice',
    rating: 9.6,
    latencyMs: 84,
    contextWindow: 'Continuous Stream',
    pricing: 'Usage-Based',
    verifiedBenchmark: '84ms Round-Trip Acoustic Latency',
    iconGlyph: 'SV',
    spanClass: 'lg:col-span-4',
  },
];

export function TrendingAppsBento() {
  const {
    bookmarkedApps,
    toggleAppBookmark,
    compareSlugs,
    toggleCompareApp,
  } = useAppStore();

  return (
    <section
      aria-labelledby="trending-bento-heading"
      className="cv-auto py-20 sm:py-28 px-4 sm:px-8 border-b border-hairline"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-hairline">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              [PILLAR 01 // BENCHMARKED SYSTEMS]
            </span>
            <h2
              id="trending-bento-heading"
              className="mt-2 display-section font-medium text-text"
            >
              Trending <span className="font-serif italic font-normal text-accent">autonomous</span> tools
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/apps">
              <Button variant="secondary" rollText>
                Explore All 30 Systems →
              </Button>
            </Link>
          </div>
        </div>

        {/* 12-Col Asymmetric Bento Grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {TRENDING_BENTO_APPS.map((app, idx) => {
            const isSaved = bookmarkedApps.includes(app.slug);
            const isCompared = compareSlugs.includes(app.slug);

            return (
              <Card
                key={app.slug}
                interactiveTilt
                cursorActionLabel="Inspect"
                radius="r24"
                className={`${app.spanClass} flex flex-col justify-between p-6 sm:p-8 group`}
              >
                <div>
                  {/* Top Row: Rank, Glyph, Category, Actions */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-r16 border border-hairline bg-raised font-mono text-sm font-semibold text-accent">
                        {app.iconGlyph}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-muted tabular-nums">
                            RANK #0{idx + 1}
                          </span>
                          <Badge>{app.categoryLabel}</Badge>
                        </div>
                        <Link
                          href={`/apps/${app.slug}`}
                          className="mt-1 block text-lg sm:text-xl font-medium text-text group-hover:text-accent transition-colors"
                        >
                          {app.name}
                        </Link>
                      </div>
                    </div>

                    {/* Bookmark & Compare Quick Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleCompareApp(app.slug, app.name)}
                        aria-label={`Compare ${app.name}`}
                        className={`rounded-r10 border px-2.5 py-1.5 font-mono text-[10px] uppercase transition-colors ${
                          isCompared
                            ? 'border-accent bg-accent/15 text-accent'
                            : 'border-hairline bg-raised text-muted hover:text-text'
                        }`}
                      >
                        {isCompared ? 'Comparing' : '+ Compare'}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleAppBookmark(app.slug, app.name)}
                        aria-label={`Bookmark ${app.name}`}
                        className={`flex h-8 w-8 items-center justify-center rounded-r10 border transition-colors ${
                          isSaved
                            ? 'border-accent bg-accent/15 text-accent'
                            : 'border-hairline bg-raised text-muted hover:text-text'
                        }`}
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill={isSaved ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth="1.75"
                        >
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-5 text-sm sm:text-base text-muted leading-relaxed">
                    {app.tagline}
                  </p>
                </div>

                {/* Telemetry & Verified Benchmark Footer */}
                <div className="mt-8 pt-5 border-t border-hairline">
                  <div className="grid grid-cols-3 gap-3 text-xs font-mono tabular-nums">
                    <div>
                      <span className="block text-[10px] text-muted uppercase">
                        INDEX SCORE
                      </span>
                      <span className="mt-0.5 block text-text font-semibold">
                        {app.rating.toFixed(1)} / 10
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-muted uppercase">
                        P99 LATENCY
                      </span>
                      <span className="mt-0.5 block text-text">
                        {app.latencyMs}ms
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-muted uppercase">
                        CONTEXT
                      </span>
                      <span className="mt-0.5 block text-text">
                        {app.contextWindow}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 rounded-r10 border border-hairline bg-bg/60 px-3.5 py-2 text-xs">
                    <span className="font-mono text-[11px] text-accent truncate">
                      ✓ {app.verifiedBenchmark}
                    </span>
                    <Link
                      href={`/apps/${app.slug}`}
                      className="shrink-0 font-mono text-[11px] text-text underline-draw"
                    >
                      Inspect Spec →
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
