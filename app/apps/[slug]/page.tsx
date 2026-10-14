import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAppBySlug, getCategoryBySlug, SEED_APPS } from '@/lib/seed-apps';
import { Badge, Card } from '@/components/ui/Primitives';

export function generateStaticParams() {
  return SEED_APPS.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) return { title: 'System Not Found' };

  return {
    title: `${app.name} — Benchmarked AI System Spec`,
    description: app.tagline,
    openGraph: {
      title: app.name,
      description: app.tagline,
      type: 'website',
    },
  };
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) notFound();

  const categoryInfo = getCategoryBySlug(app.category);

  const alternativeApps = app.alternatives
    .map((s) => getAppBySlug(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const similarCategoryApps = SEED_APPS.filter(
    (a) => a.slug !== app.slug && a.category === app.category
  ).slice(0, 3);

  // SoftwareApplication JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: app.tagline,
    applicationCategory: app.categoryLabel,
    operatingSystem: app.platforms.join(', '),
    offers: {
      '@type': 'Offer',
      price: app.startingPrice,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: app.rating,
      reviewCount: app.reviewCount,
    },
  };

  return (
    <article className="pt-28 pb-24 px-4 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-[1100px]">
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
          <span className="text-accent">{app.name}</span>
        </nav>

        <header className="mt-8 pb-10 border-b border-hairline">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-r16 border border-hairline bg-raised font-mono text-lg text-accent">
                {app.iconGlyph}
              </span>
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="accent">{app.categoryLabel}</Badge>
                  <Badge tone="default">{app.pricing}</Badge>
                </div>
                <h1 className="mt-2 text-3xl sm:text-4xl font-medium text-text">
                  {app.name}
                </h1>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-3xl text-accent tabular-nums">
                {app.rating.toFixed(1)}
              </div>
              <div className="font-mono text-xs text-muted">/ 10 INDEX SCORE</div>
              <div className="mt-1 font-mono text-[11px] text-muted tabular-nums">
                {app.reviewCount} verified reviews
              </div>
            </div>
          </div>

          <p className="mt-6 text-lg text-text leading-relaxed max-w-3xl">
            {app.tagline}
          </p>
          <p className="mt-3 text-sm text-muted leading-relaxed max-w-3xl">
            {app.description}
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-r16 border border-hairline bg-raised/40 p-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted">Latency</div>
              <div className="mt-1 font-mono text-sm text-text tabular-nums">{app.latencyMs}ms</div>
            </div>
            <div className="rounded-r16 border border-hairline bg-raised/40 p-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted">Context</div>
              <div className="mt-1 font-mono text-sm text-text">{app.contextWindow}</div>
            </div>
            <div className="rounded-r16 border border-hairline bg-raised/40 p-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted">Starting At</div>
              <div className="mt-1 font-mono text-sm text-text">{app.startingPrice}</div>
            </div>
            <div className="rounded-r16 border border-hairline bg-raised/40 p-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted">Released</div>
              <div className="mt-1 font-mono text-sm text-text">{app.releaseDate}</div>
            </div>
          </div>

          <blockquote className="mt-8 border-l-2 border-accent pl-5 py-1">
            <p className="font-serif italic text-lg text-text leading-relaxed">
              &ldquo;{app.editorialVerdict}&rdquo;
            </p>
            <cite className="mt-2 block font-mono text-xs text-muted not-italic">
              — VIRUS STUDIO EDITORIAL · BENCHMARK: {app.verifiedBenchmark}
            </cite>
          </blockquote>
        </header>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card radius="r24" className="p-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
              01 // VERIFIED CAPABILITIES
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-text">
              {app.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <span className="font-mono text-accent mt-0.5">→</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card radius="r24" className="p-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
              02 // VERIFIED STRENGTHS
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-text">
              {app.pros.map((pro) => (
                <li key={pro} className="flex items-start gap-2.5">
                  <span className="font-mono text-accent mt-0.5">+</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card radius="r24" className="p-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
              03 // OPERATIONAL TRADEOFFS
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {app.cons.map((con) => (
                <li key={con} className="flex items-start gap-2.5">
                  <span className="font-mono text-muted mt-0.5">−</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Direct Verified Alternatives & Similar Systems */}
        <div className="mt-16 pt-12 border-t border-hairline">
          <h2 className="text-2xl font-medium text-text">
            Verified <span className="font-serif italic font-normal text-accent">alternatives</span> &amp; peer systems
          </h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[...alternativeApps, ...similarCategoryApps]
              .filter(
                (item, index, self) =>
                  self.findIndex((t) => t.slug === item.slug) === index
              )
              .slice(0, 3)
              .map((peer) => (
                <Card
                  key={peer.slug}
                  radius="r24"
                  className="p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-r10 border border-hairline bg-raised font-mono text-xs text-accent">
                        {peer.iconGlyph}
                      </span>
                      <span className="font-mono text-xs text-accent tabular-nums">
                        {peer.rating.toFixed(1)} / 10
                      </span>
                    </div>
                    <Link
                      href={`/apps/${peer.slug}`}
                      className="mt-4 block text-lg font-medium text-text hover:text-accent"
                    >
                      {peer.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted leading-relaxed">
                      {peer.tagline}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-hairline flex items-center justify-between font-mono text-xs">
                    <span className="text-muted">{peer.startingPrice}</span>
                    <Link
                      href={`/apps/${peer.slug}`}
                      className="text-text underline-draw"
                    >
                      Inspect Spec →
                    </Link>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </article>
  );
}