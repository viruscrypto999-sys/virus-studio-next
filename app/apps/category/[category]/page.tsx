import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  APP_CATEGORIES,
  getCategoryBySlug,
  SEED_APPS,
} from '@/lib/seed-apps';
import { AppsDirectoryClient } from '@/components/apps/AppsDirectoryClient';
import { Badge, Card } from '@/components/ui/Primitives';

export function generateStaticParams() {
  return APP_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const info = getCategoryBySlug(category);
  if (!info) return { title: 'Category Not Found' };

  return {
    title: `${info.name} — Benchmarked AI Tools`,
    description: info.editorialIntro,
  };
}

export default async function CategoryAppsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const info = getCategoryBySlug(category);
  if (!info) notFound();

  const categoryApps = SEED_APPS.filter((a) => a.category === info.slug);

  return (
    <div className="pt-28 pb-24 px-4 sm:px-8">
      <div className="mx-auto max-w-[1440px]">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-mono text-xs text-muted pb-6 border-b border-hairline"
        >
          <Link href="/" className="hover:text-text">
            Index
          </Link>
          <span>/</span>
          <Link href="/apps" className="hover:text-text">
            Apps &amp; AI Tools
          </Link>
          <span>/</span>
          <span className="text-accent">{info.shortName}</span>
        </nav>

        {/* Editorial Category Introduction */}
        <header className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-hairline items-end">
          <div className="lg:col-span-8">
            <Badge tone="accent">TAXONOMY BRIEF // {info.shortName}</Badge>
            <h1 className="mt-4 display-section font-medium text-text">
              {info.name}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
              {info.editorialIntro}
            </p>
          </div>

          <Card radius="r24" className="lg:col-span-4 p-6 bg-raised/40">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              EDITORIAL THESIS
            </span>
            <p className="mt-2 font-serif italic text-lg text-text leading-snug">
              &ldquo;{info.thesis}&rdquo;
            </p>
            <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between font-mono text-xs tabular-nums">
              <span className="text-muted">{info.metricLabel}</span>
              <span className="text-accent font-semibold">
                {info.metricValue}
              </span>
            </div>
          </Card>
        </header>

        <div className="mt-10">
          <Suspense fallback={null}>
            <AppsDirectoryClient
              initialApps={categoryApps}
              categories={APP_CATEGORIES}
              lockedCategory={info.slug}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
