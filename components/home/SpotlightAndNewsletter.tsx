'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Badge, Button, Card } from '@/components/ui/Primitives';
import { useAppStore } from '@/components/providers/AppProviders';

interface StatCounter {
  label: string;
  target: number;
  suffix: string;
  decimals?: number;
  caption: string;
}

const TELEMETRY_STATS: StatCounter[] = [
  {
    label: 'VERIFIED AI SYSTEMS',
    target: 30,
    suffix: '',
    decimals: 0,
    caption: 'Stress-tested across 8 architectural taxonomies',
  },
  {
    label: 'PRIMARY LAB DISPATCHES',
    target: 24,
    suffix: '',
    decimals: 0,
    caption: 'Zero synthetic rewrites or sponsored placements',
  },
  {
    label: 'BENCHMARK DATA POINTS',
    target: 14.8,
    suffix: 'M',
    decimals: 1,
    caption: 'Continuous token latency & recall evaluations',
  },
  {
    label: 'MEDIAN UI FRAME TIME',
    target: 16.6,
    suffix: 'ms',
    decimals: 1,
    caption: 'Locked 60fps spatial rendering budget',
  },
];

export function SpotlightAndNewsletter() {
  const { pushToast, playTick } = useAppStore();
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [statsProgress, setStatsProgress] = useState(0);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // IntersectionObserver count-up animation using requestAnimationFrame
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      setStatsProgress(1);
      return;
    }

    let rafId = 0;
    let triggered = false;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !triggered) {
          triggered = true;
          const start = performance.now();
          const duration = 1100;

          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            // Expo-out easing
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            setStatsProgress(eased);
            if (t < 1) {
              rafId = window.requestAnimationFrame(tick);
            }
          };
          rafId = window.requestAnimationFrame(tick);
        }
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!trimmed) {
      setErrorMsg('Please enter an institutional or personal email address.');
      playTick(880);
      return;
    }
    if (!emailRegex.test(trimmed)) {
      setErrorMsg('Invalid format. Expected syntax: researcher@domain.org');
      playTick(880);
      return;
    }

    setErrorMsg(null);
    setSubmitted(true);
    playTick(1820);
    pushToast(
      'Subscribed to Weekly Telemetry',
      `Dispatches routed to ${trimmed}. Zero tracking pixels.`,
      'accent'
    );
  };

  return (
    <section className="cv-auto py-20 sm:py-28 px-4 sm:px-8 border-b border-hairline">
      <div className="mx-auto max-w-[1440px] space-y-24">
        {/* 1. Dual Editorial Spotlight (App of the Month + Lead Investigation) */}
        <div>
          <div className="pb-8 border-b border-hairline flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              [CURATED SPOTLIGHT // DUAL PILLAR CONVERGENCE]
            </span>
            <span className="font-mono text-xs text-muted">
              ISSUE 2026.42 · VERIFIED BY VIRUS STUDIO LABS
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Featured Story (7 Cols) */}
            <Card radius="r24" className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <Badge tone="accent">LEAD INVESTIGATION</Badge>
                  <span className="font-mono text-xs text-muted">
                    8 MIN READ · ARCHITECTURAL BRIEF
                  </span>
                </div>

                <h3 className="mt-5 font-serif text-3xl sm:text-4xl leading-tight text-text">
                  Why Post-Transformer State Space Kernels Are Redefining Autonomous Systems Engineering
                </h3>

                <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed">
                  Dense attention scaled intelligence for a decade, but quadratic memory walls stalled continuous repository-scale reasoning. We audited 14 production state-space hybrids to measure where linear-time scaling wins—and where hybrid attention remains irreplaceable.
                </p>

                <blockquote className="mt-6 border-l-2 border-accent pl-4 py-1 font-serif italic text-lg text-text">
                  &ldquo;When context cost drops by 78%, an agent stops summarizing your codebase and starts holding the entire execution graph in active working memory.&rdquo;
                </blockquote>
              </div>

              <div className="mt-8 pt-5 border-t border-hairline flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-mono text-muted">
                  BY DR. ELENA VANCE · CHIEF SYSTEMS AUDITOR
                </div>
                <Link href="/news/sub-quadratic-state-space-10m-context">
                  <Button variant="primary" size="sm" rollText>
                    Read Full Investigation →
                  </Button>
                </Link>
              </div>
            </Card>

            {/* App Spotlight (5 Cols) */}
            <Card radius="r24" className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between bg-raised/40">
              <div>
                <div className="flex items-center justify-between">
                  <Badge>SYSTEM OF THE MONTH</Badge>
                  <span className="font-mono text-xs text-accent tabular-nums">
                    SCORE 9.9 / 10
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-r16 border border-accent/40 bg-surface font-mono text-lg font-semibold text-accent">
                    A6
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium text-text">
                      Astra-6 Omni Reasoner
                    </h3>
                    <p className="font-mono text-xs text-muted">
                      Foundation Models · Formal Verification Engine
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm text-muted leading-relaxed">
                  Astra-6 pairs a sub-quadratic 10M-token state-space backbone with an embedded Lean-4 proof verifier, eliminating hallucinated API calls in critical engineering workflows.
                </p>

                <div className="mt-6 space-y-2.5 rounded-r16 border border-hairline bg-bg/70 p-4 font-mono text-xs tabular-nums">
                  <div className="flex justify-between">
                    <span className="text-muted">SWE-BENCH VERIFIED</span>
                    <span className="text-text">96.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">TIME TO FIRST TOKEN</span>
                    <span className="text-text">142ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">ACTIVE CONTEXT</span>
                    <span className="text-accent">10,000,000 Tokens</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-hairline flex items-center justify-between">
                <Link
                  href="/apps?compare=astra-6-omni-reasoner"
                  className="font-mono text-xs text-muted hover:text-text"
                >
                  + Add to Matrix
                </Link>
                <Link href="/apps/astra-6-omni-reasoner">
                  <Button variant="secondary" size="sm" rollText>
                    Inspect Telemetry →
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* 2. Animated Count-Up Telemetry Stats */}
        <div
          ref={statsRef}
          aria-label="Virus Studio Index Telemetry"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {TELEMETRY_STATS.map((stat) => {
            const currentVal = (stat.target * statsProgress).toFixed(
              stat.decimals ?? 0
            );
            return (
              <Card key={stat.label} radius="r24" className="p-6">
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                  {stat.label}
                </p>
                <p className="mt-3 text-4xl sm:text-5xl font-medium tracking-tight text-text tabular-nums">
                  {currentVal}
                  <span className="text-accent font-serif italic font-normal ml-0.5">
                    {stat.suffix}
                  </span>
                </p>
                <p className="mt-2 text-xs text-muted leading-relaxed">
                  {stat.caption}
                </p>
              </Card>
            );
          })}
        </div>

        {/* 3. Elegant Validated Briefing Subscription */}
        <Card radius="r36" className="p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <Badge tone="accent">WEEKLY TELEMETRY DIGEST</Badge>
              <h2 className="mt-4 text-3xl sm:text-4xl font-medium tracking-tight text-text">
                One Sunday dispatch.{' '}
                <span className="font-serif italic font-normal text-accent">
                  Zero noise.
                </span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted max-w-xl leading-relaxed">
                Receive newly benchmarked AI applications, latency regressions, and peer-reviewed research syntheses every Sunday at 06:00 UTC. Unsubscribe in one click.
              </p>
            </div>

            <div className="lg:col-span-5">
              {submitted ? (
                <div className="rounded-r24 border border-accent/40 bg-accent/10 p-6">
                  <p className="font-mono text-xs uppercase tracking-widest text-accent">
                    ✓ CRYPTOGRAPHICALLY CONFIRMED
                  </p>
                  <p className="mt-2 text-base font-medium text-text">
                    Your endpoint ({email}) is registered for Issue #43.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setEmail('');
                    }}
                    className="mt-4 font-mono text-xs text-muted hover:text-text underline"
                  >
                    Register another address
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  noValidate
                  className="space-y-3"
                >
                  <label
                    htmlFor="telemetry-email"
                    className="block font-mono text-[11px] uppercase tracking-widest text-muted"
                  >
                    INSTITUTIONAL OR PERSONAL EMAIL
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      id="telemetry-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      placeholder="architect@studio.ai"
                      aria-invalid={Boolean(errorMsg)}
                      aria-describedby={errorMsg ? 'email-error' : undefined}
                      className="flex-1 rounded-r16 border border-hairline bg-bg px-4 py-3 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none"
                    />
                    <Button type="submit" variant="primary" size="lg" rollText>
                      Subscribe
                    </Button>
                  </div>
                  {errorMsg ? (
                    <p
                      id="email-error"
                      role="alert"
                      className="font-mono text-xs text-accent"
                    >
                      ! {errorMsg}
                    </p>
                  ) : (
                    <p className="font-mono text-[11px] text-muted">
                      PGP fingerprint available · Strictly no third-party telemetry.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
