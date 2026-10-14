import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNewsBySlug, SEED_NEWS } from '@/lib/seed-news';
import { getAppBySlug } from '@/lib/seed-apps';
import { formatRelativeDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Primitives';
import { ArticleReaderClient } from '@/components/news/ArticleReaderClient';

export function generateStaticParams() {
  return SEED_NEWS.map((art) => ({ slug: art.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) return { title: 'Dispatch Not Found' };

  return {
    title: article.title,
    description: article.subtitle,
    openGraph: {
      title: article.title,
      description: article.subtitle,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) notFound();

  const relatedApps = article.relatedAppSlugs
    .map((s) => getAppBySlug(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const relatedArticles = SEED_NEWS.filter(
    (n) => n.slug !== article.slug && n.topic === article.topic
  ).slice(0, 2);

  // NewsArticle JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.subtitle,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Virus Studio',
    },
  };

  return (
    <article className="pt-28 pb-24 px-4 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[1440px]">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-mono text-xs text-muted pb-6 border-b border-hairline"
        >
          <Link href="/" className="hover:text-text">
            Index
          </Link>
          <span>/</span>
          <Link href="/news" className="hover:text-text">
            AI News
          </Link>
          <span>/</span>
          <span className="uppercase text-accent">{article.topic}</span>
        </nav>

        {/* Editorial Monograph Header */}
        <header className="mt-8 pb-10 border-b border-hairline max-w-4xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="accent">{article.topic.toUpperCase()}</Badge>
            <Badge>{article.source.name}</Badge>
            <Badge tone="outline">{article.source.credibilityTier}</Badge>
            <span className="font-mono text-xs text-muted tabular-nums">
              {formatRelativeDate(article.publishedAt)} · {article.readTimeMinutes} MIN READ
            </span>
          </div>

          <h1 className="mt-5 font-serif text-3xl sm:text-5xl lg:text-6xl leading-[1.04] tracking-tight text-text">
            {article.title}
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-muted leading-relaxed">
            {article.subtitle}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6 font-mono text-xs text-muted">
            <div>
              <span className="text-text font-medium">{article.author.name}</span>{' '}
              · {article.author.role}
            </div>
            <div>SOURCE DOMAIN // {article.source.domain}</div>
          </div>
        </header>

        {/* Interactive Reader Client (Live TOC, Progress, TL;DR, Body) */}
        <div className="mt-10">
          <ArticleReaderClient
            article={article}
            relatedApps={relatedApps}
            relatedArticles={relatedArticles}
          />
        </div>
      </div>
    </article>
  );
}
