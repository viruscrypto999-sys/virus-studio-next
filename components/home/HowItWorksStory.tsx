'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Badge, Card } from '@/components/ui/Primitives';

interface StoryPhase {
  step: string;
  code: string;
  title: string;
  serifHighlight: string;
  summary: string;
  telemetry: { label: string; value: string }[];
  diagramNodes: string[];
}

const STORY_PHASES: StoryPhase[] = [
  {
    step: '01',
    code: 'INGESTION // DETERMINISTIC AUDIT',
    title: 'Continuous telemetry across',
    serifHighlight: 'frontier kernels.',
    summary:
      'Every candidate system entering Virus Studio is sandboxed against standardized synthetic workloads: token-latency curves, context-window recall at 1M+ tokens, and zero-shot code synthesis.',
    telemetry: [
      { label: 'AUDIT CADENCE', value: 'Every 6 Hours' },
      { label: 'REJECTION RATE', value: '91.4% Filtered' },
      { label: 'VERIFICATION', value: 'Cryptographic Hash' },
    ],
    diagramNodes: [
      'Raw Model Weights / API Endpoint',
      '10M-Token Needle Stress Harness',
      'Latency & Jitter Profiler (P99)',
      'Signed Benchmark Certificate',
    ],
  },
  {
    step: '02',
    code: 'PILLAR 01 // SPATIAL DIRECTORY',
    title: 'Side-by-side matrix',
    serifHighlight: 'instrumentation.',
    summary:
      'Marketing copy is stripped away. Compare up to three autonomous applications simultaneously across deterministic metrics, pricing economics, platform runtimes, and verified alternatives.',
    telemetry: [
      { label: 'INDEXED SYSTEMS', value: '30 Flagships' },
      { label: 'CATEGORIES', value: '8 Taxonomies' },
      { label: 'COMPARE ENGINE', value: 'Up to 3-Way Matrix' },
    ],
    diagramNodes: [
      'Fuzzy Instant Index (<4ms)',
      'Multi-Axis Faceted Filtering',
      '3-Way Specular Comparison Table',
      'Persistent Local Workspace Sync',
    ],
  },
  {
    step: '03',
    code: 'PILLAR 02 // PRIMARY DISPATCHES',
    title: 'Peer-reviewed signal,',
    serifHighlight: 'zero synthetic noise.',
    summary:
      'Our editorial wire ingests arXiv preprints, primary lab technical reports, and sovereign policy filings—distilling each dispatch into live table-of-contents and structured TL;DR briefs.',
    telemetry: [
      { label: 'PRIMARY SOURCES', value: '24 Verified Labs' },
      { label: 'SYNTHESIS', value: 'Instant TL;DR Vectors' },
      { label: 'SIGNAL RATIO', value: '100% Primary Data' },
    ],
    diagramNodes: [
      'Primary Lab Technical Monolith',
      'Automated Claim Cross-Check',
      'Structured Executive TL;DR Card',
      'Cross-Linked Tool Ecosystem',
    ],
  },
];

/**
 * Pinned scroll story on desktop (1 of max 2 pinned sections on entire site).
 * Automatically falls back to native vertical cards on mobile (<1024px) for zero jank.
 */
export function HowItWorksStory() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    if (!mq.matches) return;

    let rafId = 0;
    let ticking = false;

    const updateStep = () => {
      ticking = false;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = Math.min(Math.max(-rect.top, 0), totalScrollable);
      const progress = scrolled / totalScrollable;
      const nextIdx = Math.min(
        STORY_PHASES.length - 1,
        Math.floor(progress * STORY_PHASES.length)
      );
      setActivePhase((prev) => (prev !== nextIdx ? nextIdx : prev));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = window.requestAnimationFrame(updateStep);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateStep();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const current = STORY_PHASES[activePhase];

  return (
    <section
      aria-labelledby="architecture-story-heading"
      className="border-b border-hairline bg-bg"
    >
      {/* Desktop Sticky Pinned Container */}
      <div
        ref={containerRef}
        className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:min-h-[240vh] relative"
      >
        <div className="py-16 lg:py-24 lg:sticky lg:top-16 lg:min-h-[84vh] flex flex-col justify-between">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                [SYSTEM METHODOLOGY // 01—03]
              </span>
              <h2
                id="architecture-story-heading"
                className="mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-text"
              >
                How Virus Studio instruments{' '}
                <span className="font-serif italic font-normal text-accent">
                  intelligence
                </span>
              </h2>
            </div>

            {/* Step Selector Pills on Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              {STORY_PHASES.map((phase, idx) => (
                <button
                  key={phase.step}
                  type="button"
                  onClick={() => setActivePhase(idx)}
                  className={`rounded-r10 border px-3.5 py-1.5 font-mono text-xs transition-colors ${
                    idx === activePhase
                      ? 'border-accent bg-accent/10 text-text'
                      : 'border-hairline bg-surface text-muted hover:text-text'
                  }`}
                >
                  PHASE {phase.step}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Interactive Split Stage */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-center my-auto py-10">
            {/* Left Editorial Narrative */}
            <div className="col-span-6 space-y-6">
              <Badge tone="accent">{current.code}</Badge>
              <h3 className="display-section font-medium text-text">
                {current.title}{' '}
                <span className="font-serif italic font-normal text-accent">
                  {current.serifHighlight}
                </span>
              </h3>
              <p className="text-base text-muted leading-relaxed max-w-xl">
                {current.summary}
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-hairline">
                {current.telemetry.map((metric) => (
                  <div key={metric.label}>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                      {metric.label}
                    </p>
                    <p className="mt-1 text-sm font-mono font-medium text-text tabular-nums">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Optical Architecture Schematic */}
            <div className="col-span-6">
              <Card radius="r24" className="p-8 bg-surface">
                <div className="flex items-center justify-between border-b border-hairline pb-4">
                  <span className="font-mono text-xs text-accent">
                    SCHEMATIC // NODE-{current.step}
                  </span>
                  <span className="font-mono text-xs text-muted tabular-nums">
                    STEP {activePhase + 1} OF 3
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {current.diagramNodes.map((node, index) => (
                    <div
                      key={node}
                      className="flex items-center justify-between rounded-r16 border border-hairline bg-raised/70 px-5 py-4 transition-transform duration-ui ease-expo-out"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-accent/40 font-mono text-[11px] text-accent tabular-nums">
                          0{index + 1}
                        </span>
                        <span className="text-sm font-medium text-text">
                          {node}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-muted">
                        VERIFIED
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress Bar Across All 3 Phases */}
                <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between text-[11px] font-mono text-muted">
                  <span>SCROLL TO ADVANCE PIPELINE</span>
                  <div className="flex items-center gap-1.5">
                    {STORY_PHASES.map((p, idx) => (
                      <span
                        key={p.step}
                        className={`h-1.5 rounded-full transition-all duration-ui ${
                          idx === activePhase
                            ? 'w-8 bg-accent'
                            : 'w-2 bg-hairline'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Mobile / Tablet Native Stack (Zero Pinning for 60fps Touch Scroll) */}
          <div className="grid grid-cols-1 gap-6 mt-8 lg:hidden">
            {STORY_PHASES.map((phase) => (
              <Card key={phase.step} radius="r24" className="p-6">
                <div className="flex items-center justify-between">
                  <Badge tone="accent">{phase.code}</Badge>
                  <span className="font-mono text-xs text-muted">
                    {phase.step}/03
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-medium text-text">
                  {phase.title}{' '}
                  <span className="font-serif italic font-normal text-accent">
                    {phase.serifHighlight}
                  </span>
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {phase.summary}
                </p>
                <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-hairline">
                  {phase.telemetry.map((m) => (
                    <div key={m.label}>
                      <p className="font-mono text-[10px] text-muted">
                        {m.label}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-text tabular-nums">
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
