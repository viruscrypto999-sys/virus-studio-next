'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Badge, Button, Card } from '@/components/ui/Primitives';
import { useAppStore } from '@/components/providers/AppProviders';

interface RailDispatch {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  sourceName: string;
  publishedRelative: string;
  readTimeMinutes: number;
  isBreaking?: boolean;
}

const RAIL_DISPATCHES: RailDispatch[] = [
  {
    slug: 'sub-quadratic-state-space-10m-context',
    title:
      'Sub-Quadratic State Space Architectures Surpass Dense Transformers at 10M Context',
    summary:
      'Independent multi-lab evaluation confirms 78% KV-cache elimination with zero needle-in-a-haystack degradation across 10-million-token repositories.',
    topic: 'MODELS',
    sourceName: 'Zurich Neural Systems Lab',
    publishedRelative: '2h ago',
    readTimeMinutes: 5,
    isBreaking: true,
  },
  {
    slug: 'formal-proof-carrying-code-sovereign-cloud',
    title:
      'Formal Proof-Carrying Code Becomes Mandatory Across European Sovereign Cloud',
    summary:
      'Autonomous agents deploying into critical financial and energy grids must now attach Lean-4 verifiable safety certificates prior to execution.',
    topic: 'POLICY',
    sourceName: 'Brussels Compute Accord',
    publishedRelative: '5h ago',
    readTimeMinutes: 6,
  },
  {
    slug: 'open-weights-120b-moe-runs-local-workstation',
    title:
      'Sparse 120B Mixture-of-Experts Executes at 94 Tokens/Sec on Dual-Unified Memory Nodes',
    summary:
      '1.58-bit ternary quantization paired with speculative lookahead decoding brings frontier-grade reasoning to air-gapped studio workstations.',
    topic: 'OPEN-SOURCE',
    sourceName: 'OpenWeights Consortium',
    publishedRelative: '9h ago',
    readTimeMinutes: 4,
  },
  {
    slug: 'zero-latency-compiler-agents-replace-ci-pipelines',
    title:
      'Self-Healing Compiler Agents Cut Production Regression Incidents by 64% in 12-Month Audit',
    summary:
      'Longitudinal telemetry across 400 engineering organizations reveals autonomous patch verification outperforms human-only code review queues.',
    topic: 'TOOLS',
    sourceName: 'ACM Systems Telemetry',
    publishedRelative: '14h ago',
    readTimeMinutes: 7,
  },
  {
    slug: 'photonic-interconnect-series-c-4-billion',
    title:
      'Optical Wafer-Scale Interconnect Consortium Closes $4.2B Sovereign Infrastructure Round',
    summary:
      'Silicon-photonic backplanes eliminate copper bottlenecks between 100,000-node training clusters while cutting thermal dissipation by 52%.',
    topic: 'FUNDING',
    sourceName: 'Semiconductor Wire',
    publishedRelative: '1d ago',
    readTimeMinutes: 5,
  },
  {
    slug: 'episodic-memory-graphs-solve-catastrophic-forgetting',
    title:
      'Non-Parametric Episodic Memory Graphs Eliminate Catastrophic Forgetting in Continual Agents',
    summary:
      'Decoupling long-term factual graphs from frozen reasoning weights allows agents to learn continuously without gradient drift.',
    topic: 'RESEARCH',
    sourceName: 'Kyoto Frontier Institute',
    publishedRelative: '2d ago',
    readTimeMinutes: 8,
  },
];

export function NewsHorizontalRail() {
  const { setCursorLabel, bookmarkedNews, toggleNewsBookmark } = useAppStore();
  const railRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragState = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    velocity: 0,
    lastX: 0,
    rafId: 0,
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = railRef.current;
    if (!el) return;
    window.cancelAnimationFrame(dragState.current.rafId);
    dragState.current.isDown = true;
    dragState.current.startX = e.pageX - el.offsetLeft;
    dragState.current.scrollLeft = el.scrollLeft;
    dragState.current.lastX = e.pageX;
    dragState.current.velocity = 0;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = railRef.current;
    if (!dragState.current.isDown || !el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.25;
    dragState.current.velocity = e.pageX - dragState.current.lastX;
    dragState.current.lastX = e.pageX;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const stopDraggingWithInertia = () => {
    if (!dragState.current.isDown) return;
    dragState.current.isDown = false;
    setIsDragging(false);

    const el = railRef.current;
    if (!el) return;

    let vel = dragState.current.velocity * 1.4;
    const stepInertia = () => {
      if (Math.abs(vel) < 0.4 || !railRef.current) return;
      railRef.current.scrollLeft -= vel;
      vel *= 0.92;
      dragState.current.rafId = window.requestAnimationFrame(stepInertia);
    };
    dragState.current.rafId = window.requestAnimationFrame(stepInertia);
  };

  const scrollByStep = (direction: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 420, behavior: 'smooth' });
  };

  return (
    <section
      aria-labelledby="news-rail-heading"
      className="cv-auto py-20 sm:py-28 border-b border-hairline overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-hairline">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              [PILLAR 02 // PRIMARY RESEARCH WIRE]
            </span>
            <h2
              id="news-rail-heading"
              className="mt-2 display-section font-medium text-text"
            >
              Latest <span className="font-serif italic font-normal text-accent">intelligence</span> dispatches
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByStep(-1)}
              aria-label="Scroll news rail left"
              className="flex h-10 w-10 items-center justify-center rounded-r10 border border-hairline bg-surface text-text hover:border-accent/40 transition-colors"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollByStep(1)}
              aria-label="Scroll news rail right"
              className="flex h-10 w-10 items-center justify-center rounded-r10 border border-hairline bg-surface text-text hover:border-accent/40 transition-colors"
            >
              →
            </button>
            <Link href="/news" className="ml-2">
              <Button variant="secondary" rollText>
                All 24 Dispatches →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Horizontal Inertial Drag Track */}
      <div
        ref={railRef}
        onMouseEnter={() => setCursorLabel('Drag')}
        onMouseLeave={() => {
          setCursorLabel(null);
          stopDraggingWithInertia();
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDraggingWithInertia}
        className={`mt-10 flex gap-5 overflow-x-auto px-4 sm:px-8 pb-4 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {RAIL_DISPATCHES.map((item) => {
          const isSaved = bookmarkedNews.includes(item.slug);
          return (
            <Card
              key={item.slug}
              radius="r24"
              className="w-[330px] sm:w-[400px] shrink-0 p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge tone={item.isBreaking ? 'accent' : 'default'}>
                      {item.isBreaking ? '● BREAKING' : item.topic}
                    </Badge>
                    <span className="font-mono text-[11px] text-muted tabular-nums">
                      {item.publishedRelative}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleNewsBookmark(item.slug, item.title)}
                    aria-label={`Bookmark ${item.title}`}
                    className={`flex h-7 w-7 items-center justify-center rounded-r10 border transition-colors ${
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

                <Link
                  href={`/news/${item.slug}`}
                  draggable={false}
                  className="mt-4 block font-serif text-xl sm:text-2xl leading-snug text-text hover:text-accent transition-colors"
                >
                  {item.title}
                </Link>

                <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between text-xs font-mono text-muted tabular-nums">
                <span>{item.sourceName}</span>
                <Link
                  href={`/news/${item.slug}`}
                  draggable={false}
                  className="text-text underline-draw"
                >
                  {item.readTimeMinutes}m read →
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
