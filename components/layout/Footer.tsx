'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/components/providers/AppProviders';
import { APP_CATEGORIES } from '@/lib/seed-apps';
import { Toggle } from '@/components/ui/Primitives';

const WORDMARK_CHARS = 'VIRUS STUDIO'.split('');

export function Footer() {
  const {
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    openCommandPalette,
  } = useAppStore();

  const wordmarkRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      setRevealed(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRevealed(true);
        }
      },
      { threshold: 0.18 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      aria-label="Site footer and system controls"
      className="border-t border-hairline bg-bg pt-16 pb-10 px-4 sm:px-8 overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Top Architectural Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-hairline">
          {/* Col 1: Mission & Acoustic / Theme Controls */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-r10 border border-hairline bg-raised font-mono text-xs text-accent">
                V
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-text">
                VIRUS STUDIO // 3050.2026
              </span>
            </div>

            <p className="text-sm text-muted max-w-sm leading-relaxed">
              An architectural intelligence index built around two verified pillars:
              benchmarked autonomous applications and primary-source AI research
              dispatches.
            </p>

            {/* Interactive System Toggles (Sound off by default per spec) */}
            <div className="pt-2 flex flex-wrap items-center gap-6">
              <Toggle
                checked={soundEnabled}
                onChange={() => toggleSound()}
                label={`UI Acoustic Ticks (${soundEnabled ? 'ON' : 'OFF'})`}
              />

              <Toggle
                checked={theme === 'light'}
                onChange={() => toggleTheme()}
                label={`Paper Mode (${theme === 'light' ? 'ON' : 'OFF'})`}
              />
            </div>
          </div>

          {/* Col 2: Pillar 01 Taxonomies */}
          <div className="md:col-span-4 space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
              PILLAR 01 // APPS &amp; AI TOOLS
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted">
              {APP_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/apps/category/${cat.slug}`}
                    className="hover:text-text underline-draw"
                  >
                    {cat.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Pillar 02 Wire & Quick Commands */}
          <div className="md:col-span-3 space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
              PILLAR 02 // AI NEWS &amp; SYSTEM
            </p>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link href="/news" className="hover:text-text underline-draw">
                  All 24 Primary Dispatches
                </Link>
              </li>
              <li>
                <Link href="/apps" className="hover:text-text underline-draw">
                  3-Way Comparison Matrix
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openCommandPalette('')}
                  className="hover:text-text underline-draw text-left"
                >
                  Launch Command Palette (⌘K)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="hover:text-text underline-draw text-left"
                >
                  Return to Top Zenith ↑
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant 14vw Animated Wordmark Reveal (Transform & Opacity only) */}
        <div
          ref={wordmarkRef}
          aria-hidden="true"
          className="py-8 sm:py-12 select-none overflow-hidden border-b border-hairline"
        >
          <div className="flex items-baseline justify-between text-[13.2vw] leading-[0.86] tracking-[-0.05em] font-medium text-text">
            {WORDMARK_CHARS.map((char, idx) => (
              <span key={idx} className="inline-block overflow-hidden">
                <span
                  className={`inline-block transition-all duration-700 ease-expo-out ${
                    char === ' ' ? 'w-[3vw]' : ''
                  } ${
                    idx >= 6 ? 'font-serif italic font-normal text-accent' : ''
                  }`}
                  style={{
                    transform: revealed ? 'translateY(0%)' : 'translateY(105%)',
                    opacity: revealed ? 1 : 0,
                    transitionDelay: `${idx * 32}ms`,
                  }}
                >
                  {char}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Legal & Telemetry Colophon */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] text-muted tabular-nums">
          <div>
            © 2026 VIRUS STUDIO. ALL BENCHMARKS CRYPTOGRAPHICALLY VERIFIED.
          </div>
          <div className="flex items-center gap-6">
            <span>60FPS SPATIAL BUDGET</span>
            <span>WCAG AA COMPLIANT</span>
            <span className="text-accent">STATUS: NOMINAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
