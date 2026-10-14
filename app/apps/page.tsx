import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { APP_CATEGORIES, SEED_APPS } from '@/lib/seed-apps';
import { AppsDirectoryClient } from '@/components/apps/AppsDirectoryClient';
import { Badge } from '@/components/ui/Primitives';

export const metadata: Metadata = {
  title: 'Apps & AI Tools Directory',
  description:
    '30 benchmarked AI systems across 8 categories — foundation models, code engineering, visual synthesis, agents, audio, research, spatial 3D, and ops. Verified telemetry, zero synthetic noise.',
};

export default function AppsDirectoryPage() {
  return (
    <div className="pt-28 pb-24 px-4 sm:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="pb-10 border-b border-hairline">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Badge tone="accent">PILLAR 01 // APPS & AI TOOLS</Badge>
            <span className="font-mono text-xs text-muted tabular-nums">
              {SEED_APPS.length} VERIFIED SYSTEMS · 8 TAXONOMIES
            </span>
          </div>

          <h1 className="mt-4 display-section font-medium text-text">
            Benchmarked <span className="font-serif italic font-normal text-accent">AI systems</span>, indexed.
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted leading-relaxed">
            Every system carries verified telemetry — latency, benchmarks, pricing economics, and editorial verdicts. Search instantly, filter by category, and compare up to 3 side-by-side.
          </p>
        </header>

        <div className="mt-8">
          <Suspense fallback={null}>
            <AppsDirectoryClient
              initialApps={SEED_APPS}
              categories={APP_CATEGORIES}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
