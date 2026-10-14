import React from 'react';
import type { Metadata } from 'next';
import { NEWS_SOURCES, SEED_NEWS } from '@/lib/seed-news';
import { NewsFeedClient } from '@/components/news/NewsFeedClient';
import { Badge } from '@/components/ui/Primitives';

export const metadata: Metadata = {
  title: 'AI News & Primary Research Dispatches',
  description:
    '24 verified research breakthroughs, foundation model releases, open-source kernels, and sovereign compute policy briefs.',
};

export default function NewsPage() {
  return (
    <div className="pt-28 pb-24 px-4 sm:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="pb-10 border-b border-hairline">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Badge tone="accent">PILLAR 02 // PRIMARY RESEARCH WIRE</Badge>
            <span className="font-mono text-xs text-muted tabular-nums">
              24 VERIFIED DISPATCHES · ZERO SYNTHETIC REWRITES
            </span>
          </div>

          <h1 className="mt-4 display-section font-medium text-text">
            Frontier <span className="font-serif italic font-normal text-accent">intelligence</span> dispatches.
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted leading-relaxed">
            Direct technical journalism covering sub-quadratic foundation architectures, formal verification mandates, open-weight kernels, and sovereign infrastructure capital.
          </p>
        </header>

        <div className="mt-8">
          <NewsFeedClient
            initialArticles={SEED_NEWS}
            sources={NEWS_SOURCES}
          />
        </div>
      </div>
    </div>
  );
}
