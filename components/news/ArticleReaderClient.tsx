'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppItem, NewsArticle } from '@/lib/types';
import { formatRelativeDate } from '@/lib/utils';
import { useAppStore } from '@/components/providers/AppProviders';
import { Badge, Button, Card } from '@/components/ui/Primitives';

interface ArticleReaderClientProps {
  article: NewsArticle;
  relatedApps: AppItem[];
  relatedArticles: NewsArticle[];
}

export function ArticleReaderClient({
  article,
  relatedApps,
  relatedArticles,
}: ArticleReaderClientProps) {
  const { bookmarkedNews, toggleNewsBookmark, pushToast, playTick } =
    useAppStore();

  const [activeSectionId, setActiveSectionId] = useState<string>(
    article.sections[0]?.id ?? ''
  );
  const [tldrExpanded, setTldrExpanded] = useState<boolean>(true);
  const [articleProgress, setArticleProgress] = useState<number>(0);

  const isSaved = bookmarkedNews.includes(article.slug);

  // Live Table of Contents via IntersectionObserver
  useEffect(() => {
    const headings = article.sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (headings.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0.1 }
    );

    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [article.sections]);

  // Dedicated Article Reading Progress Percentage (passive RAF)
  useEffect(() => {
    let rafId = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct =
        maxScroll > 0
          ? Math.min(100, Math.max(0, Math.round((scrollY / maxScroll) * 100)))
          : 0;
      setArticleProgress(pct);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = window.requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.clipboard && url) {
        await navigator.clipboard.writeText(url);
        pushToast(
          'Dispatch Permalink Copied',
          `${article.title.slice(0, 48)}... copied to clipboard.`,
          'accent'
        );
      }
    } catch {
      pushToast('Share Link Ready', url, 'default');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Left Sticky Live Table of Contents & Reading Telemetry */}
      <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-5 order-2 lg:order-1">
        <Card radius="r24" className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3 font-mono text-xs tabular-nums">
            <span className="text-muted">READING PROGRESS</span>
            <span className="text-accent font-semibold">{articleProgress}%</span>
          </div>

          <div className="h-1 w-full bg-hairline rounded-full overflow-hidden">
            <div
              className="h-full bg-accent origin-left transition-transform duration-micro"
              style={{ transform: `scaleX(${articleProgress / 100})` }}
            />
          </div>

          <nav aria-label="Live Table of Contents" className="space-y-1.5 pt-2">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
              LIVE TABLE OF CONTENTS
            </span>
            {article.sections.map((sec, idx) => {
              const active = sec.id === activeSectionId;
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={() => playTick(1540)}
                  className={`block rounded-r10 px-3 py-2 text-xs transition-colors ${
                    active
                      ? 'bg-raised text-accent border border-accent/35 font-medium'
                      : 'text-muted hover:text-text'
                  }`}
                >
                  <span className="font-mono text-[10px] mr-1.5">
                    0{idx + 1}
                  </span>
                  {sec.heading}
                </a>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-hairline flex flex-col gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toggleNewsBookmark(article.slug, article.title)}
            >
              {isSaved ? '★ Bookmarked Dispatch' : '☆ Bookmark Dispatch'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              Copy Permalink
            </Button>
          </div>
        </Card>

        {/* Cross-Linked Benchmarked Systems */}
        {relatedApps.length > 0 && (
          <Card radius="r24" className="p-5 space-y-3">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-accent">
              INDEXED SYSTEMS IN THIS BRIEF
            </span>
            {relatedApps.map((app) => (
              <Link
                key={app.slug}
                href={`/apps/${app.slug}`}
                className="flex items-center justify-between rounded-r10 border border-hairline bg-raised/60 p-3 hover:border-accent/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded border border-hairline bg-bg font-mono text-[11px] text-accent">
                    {app.iconGlyph}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-text">{app.name}</p>
                    <p className="font-mono text-[10px] text-muted">
                      {app.rating.toFixed(1)}/10 · {app.latencyMs}ms
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs text-accent">→</span>
              </Link>
            ))}
          </Card>
        )}
      </aside>

      {/* Main Article Body Column */}
      <div className="lg:col-span-9 space-y-10 order-1 lg:order-2">
        {/* Animated Executive TL;DR Synthesis Card */}
        <Card radius="r24" className="p-6 sm:p-8 bg-raised/40">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Badge tone="accent">SYNTHESIZED TL;DR VECTOR</Badge>
              <span className="font-mono text-xs text-muted tabular-nums">
                {article.readTimeMinutes} MIN FULL READ
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setTldrExpanded((p) => !p);
                playTick(1480);
              }}
              className="font-mono text-xs text-accent hover:underline"
            >
              {tldrExpanded ? '[COLLAPSE]' : '[EXPAND]'}
            </button>
          </div>

          {tldrExpanded && (
            <ul className="mt-5 space-y-3 text-sm sm:text-base text-text border-t border-hairline pt-5 transition-opacity duration-ui">
              {article.tldrBullets.map((bullet, idx) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="font-mono text-xs text-accent mt-1 tabular-nums">
                    0{idx + 1}
                  </span>
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Editorial Monograph Sections & Pull Quote */}
        <div className="space-y-12">
          {article.sections.map((section, idx) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 space-y-5"
            >
              <div className="flex items-baseline gap-3 border-b border-hairline pb-3">
                <span className="font-mono text-xs text-accent tabular-nums">
                  SECTION 0{idx + 1}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-text">
                  {section.heading}
                </h2>
              </div>

              {section.paragraphs.map((para, pIdx) => (
                <p
                  key={pIdx}
                  className="text-base sm:text-lg text-text/90 leading-[1.78] font-normal"
                >
                  {para}
                </p>
              ))}

              {/* Insert Editorial Pull Quote after Section 1 */}
              {idx === 0 && (
                <blockquote className="my-8 rounded-r24 border border-hairline bg-surface p-7 sm:p-9">
                  <p className="font-serif italic text-2xl sm:text-3xl leading-snug text-text">
                    &ldquo;{article.pullQuote.text}&rdquo;
                  </p>
                  <footer className="mt-4 font-mono text-xs uppercase tracking-widest text-accent">
                    — {article.pullQuote.attribution}
                  </footer>
                </blockquote>
              )}
            </section>
          ))}
        </div>

        {/* Related Dispatches Footer */}
        <div className="pt-12 border-t border-hairline">
          <h3 className="text-2xl font-medium text-text">
            Related <span className="font-serif italic font-normal text-accent">primary</span> dispatches
          </h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {relatedArticles.map((rel) => (
              <Card
                key={rel.slug}
                radius="r24"
                className="p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Badge>{rel.topic.toUpperCase()}</Badge>
                    <span className="font-mono text-xs text-muted tabular-nums">
                      {formatRelativeDate(rel.publishedAt)}
                    </span>
                  </div>
                  <Link
                    href={`/news/${rel.slug}`}
                    className="mt-3 block font-serif text-xl text-text hover:text-accent"
                  >
                    {rel.title}
                  </Link>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    {rel.summary}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between font-mono text-xs text-muted">
                  <span>{rel.source.name}</span>
                  <Link
                    href={`/news/${rel.slug}`}
                    className="text-text underline-draw"
                  >
                    {rel.readTimeMinutes}m read →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
