'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/components/providers/AppProviders';

interface StoryChapter {
  id: string;
  code: string;
  eyebrow: string;
  headlinePlain: string;
  headlineSerif: string;
  body: string;
  metricLeft: { label: string; value: string };
  metricRight: { label: string; value: string };
  range: [number, number];
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'scene-01',
    code: 'SCENE 01 // THE MONOLITH',
    eyebrow: 'VIRUS STUDIO · SPATIAL ARCHITECTURE',
    headlinePlain: 'Designed for',
    headlineSerif: 'autonomous intelligence.',
    body: 'A singular, distraction-free instrument built around two verified pillars: benchmarked AI systems and primary-source research dispatches.',
    metricLeft: { label: 'OPTICAL CORE', value: '60FPS LOCKED' },
    metricRight: { label: 'ARCHITECTURE', value: 'DUAL-PILLAR' },
    range: [0.0, 0.26],
  },
  {
    id: 'scene-02',
    code: 'SCENE 02 // KERNEL DISASSEMBLY',
    eyebrow: 'PILLAR 01 · APPS & AI TOOLS',
    headlinePlain: '30 systems disassembled',
    headlineSerif: 'to the bare metal.',
    body: 'Watch the outer marketing shell strip away. Every foundation model, autonomous IDE, and 4D world simulator is stress-tested for P99 latency and formal proof soundness.',
    metricLeft: { label: 'INDEXED TOOLS', value: '30 FLAGSHIPS' },
    metricRight: { label: 'COMPARE ENGINE', value: '3-WAY MATRIX' },
    range: [0.26, 0.54],
  },
  {
    id: 'scene-03',
    code: 'SCENE 03 // THE OPTICAL WIRE',
    eyebrow: 'PILLAR 02 · AI NEWS & DISPATCHES',
    headlinePlain: 'Primary research signal,',
    headlineSerif: 'zero synthetic noise.',
    body: 'Direct technical monographs from Zurich, Kyoto, and Brussels — distilled into live table-of-contents and executive TL;DR vectors.',
    metricLeft: { label: 'PRIMARY LABS', value: '24 VERIFIED' },
    metricRight: { label: 'SIGNAL RATIO', value: '100% AUDITABLE' },
    range: [0.54, 0.82],
  },
  {
    id: 'scene-04',
    code: 'SCENE 04 // CONVERGENCE',
    eyebrow: 'SYSTEM READY · INTERACTIVE REGISTRY',
    headlinePlain: 'Command the',
    headlineSerif: 'complete index.',
    body: 'Query all 54 systems and dispatches instantaneously, or descend into the full directory below.',
    metricLeft: { label: 'SEARCH LATENCY', value: '< 4MS FUZZY' },
    metricRight: { label: 'SHORTCUT', value: 'CMD / CTRL + K' },
    range: [0.82, 1.01],
  },
];

export function HeroSection() {
  const { openCommandPalette } = useAppStore();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [progress, setProgress] = useState(0);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Scroll-scrubbing engine + 3D Optical Core procedural frame renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    const track = trackRef.current;
    if (!canvas || !track) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let currentProgress = 0;
    let targetProgress = 0;
    let rafId = 0;
    let running = true;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const onScroll = () => {
      const rect = track.getBoundingClientRect();
      const maxScroll = Math.max(1, rect.height - window.innerHeight);
      const raw = Math.min(1, Math.max(0, -rect.top / maxScroll));
      targetProgress = raw;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        rafId = window.requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Renders the 3D Machined Optical Core & Disassembly Rings scrubbed by scroll progress
    const drawScrubbedFrame = (p: number, timeSec: number) => {
      const isLight =
        document.documentElement.getAttribute('data-theme') === 'light';

      ctx.clearRect(0, 0, width, height);

      // Background atmospheric void
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * (width < 768 ? 0.34 : 0.48),
        10,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      if (isLight) {
        bgGrad.addColorStop(0, '#E5E2DA');
        bgGrad.addColorStop(1, '#F4F3EF');
      } else {
        bgGrad.addColorStop(0, '#131822');
        bgGrad.addColorStop(0.55, '#090B10');
        bgGrad.addColorStop(1, '#06070A');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Mobile portrait refinement: position the 3D assembly in the upper-middle stage
      const isPortrait = width < 768;
      const cx = width * (isPortrait ? 0.5 : 0.62);
      const cy = height * (isPortrait ? 0.33 : 0.5);
      const baseRadius = Math.min(width, height) * (isPortrait ? 0.27 : 0.29);

      // Scroll-driven kinematic parameters:
      // Scene 1 (0..0.25): Monolith assembled
      // Scene 2 (0.25..0.55): Disassembles along Z-axis (expansion)
      // Scene 3 (0.55..0.82): Macro zoom + high-angle orbit
      // Scene 4 (0.82..1.0): Compresses into laser horizon
      const disassembly =
        p < 0.25
          ? p * 0.4
          : p < 0.55
            ? 0.1 + ((p - 0.25) / 0.3) * 1.15
            : p < 0.82
              ? 1.25 - ((p - 0.55) / 0.27) * 0.45
              : 0.8 * (1 - (p - 0.82) / 0.18);

      const zoom =
        1 +
        Math.sin(p * Math.PI) * (isPortrait ? 0.22 : 0.34) +
        (p > 0.55 && p < 0.85 ? 0.18 : 0);

      const tilt = 0.32 + p * 0.48;
      const rotation = p * Math.PI * 2.4 + timeSec * 0.18;

      const ringCount = 9;

      // Draw axial telemetry spine
      ctx.save();
      ctx.strokeStyle = isLight
        ? 'rgba(43, 76, 102, 0.18)'
        : 'rgba(191, 212, 230, 0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy - baseRadius * 1.45);
      ctx.lineTo(cx, cy + baseRadius * 1.45);
      ctx.stroke();
      ctx.restore();

      // Draw concentric machined titanium/glass rings with Z-axis scroll separation
      for (let i = 0; i < ringCount; i++) {
        const norm = i / (ringCount - 1) - 0.5; // -0.5 to +0.5
        const zOffset = norm * baseRadius * 1.75 * disassembly;
        const ringScale = (1 - Math.abs(norm) * 0.42) * zoom;
        const rx = baseRadius * ringScale;
        const ry = rx * Math.max(0.14, Math.cos(tilt + norm * 0.35));
        const yPos = cy + zOffset;

        ctx.save();
        ctx.translate(cx, yPos);
        ctx.rotate(rotation * (i % 2 === 0 ? 0.35 : -0.25) * 0.2);

        // Outer metallic ring ellipse
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        const alpha = 0.22 + (1 - Math.abs(norm)) * 0.55;
        ctx.strokeStyle = isLight
          ? `rgba(11, 12, 14, ${alpha * 0.65})`
          : `rgba(191, 212, 230, ${alpha})`;
        ctx.lineWidth = i === 4 ? 2.2 : 1.1;
        ctx.stroke();

        // Specular highlight arc on top rim
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, Math.PI * 1.15, Math.PI * 1.85);
        ctx.strokeStyle = isLight
          ? 'rgba(43, 76, 102, 0.7)'
          : 'rgba(255, 255, 255, 0.78)';
        ctx.lineWidth = i === 4 ? 2.6 : 1.4;
        ctx.stroke();

        // Micro telemetry nodes along the ring circumference
        const nodeAngle = rotation * (i % 2 === 0 ? 1 : -1) + i * 1.1;
        const nx = Math.cos(nodeAngle) * rx;
        const ny = Math.sin(nodeAngle) * ry;
        ctx.fillStyle = isLight ? '#2B4C66' : '#BFD4E6';
        ctx.beginPath();
        ctx.arc(nx, ny, i === 4 ? 3.2 : 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Central core lens flare / horizon line
      const coreGlow = ctx.createRadialGradient(
        cx,
        cy,
        2,
        cx,
        cy,
        baseRadius * 0.75 * zoom
      );
      if (isLight) {
        coreGlow.addColorStop(0, 'rgba(43, 76, 102, 0.22)');
        coreGlow.addColorStop(1, 'rgba(43, 76, 102, 0)');
      } else {
        coreGlow.addColorStop(0, 'rgba(191, 212, 230, 0.26)');
        coreGlow.addColorStop(0.4, 'rgba(191, 212, 230, 0.06)');
        coreGlow.addColorStop(1, 'rgba(6, 7, 10, 0)');
      }
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 0.75 * zoom, 0, Math.PI * 2);
      ctx.fill();
    };

    const startTime = performance.now();

    const tick = (now: number) => {
      if (!running) return;
      const target = reducedMotion ? 0 : targetProgress;
      currentProgress += (target - currentProgress) * 0.12;
      const rounded = Math.round(currentProgress * 1000) / 1000;

      setProgress((prev) => (prev === rounded ? prev : rounded));
      const idx = STORY_CHAPTERS.findIndex(
        (c) => rounded >= c.range[0] && rounded < c.range[1]
      );
      if (idx !== -1) {
        setActiveChapterIdx((prev) => (prev !== idx ? idx : prev));
      }

      drawScrubbedFrame(currentProgress, (now - startTime) * 0.001);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      running = false;
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reducedMotion]);

  const activeChapter = STORY_CHAPTERS[activeChapterIdx] ?? STORY_CHAPTERS[0];

  const skipScrollStage = () => {
    const track = trackRef.current;
    if (!track) return;
    window.scrollTo({
      top: track.offsetTop + track.offsetHeight,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  const jumpToChapter = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const chap = STORY_CHAPTERS[idx];
    if (!chap) return;
    const maxScroll = Math.max(1, track.offsetHeight - window.innerHeight);
    const targetY =
      track.offsetTop + maxScroll * ((chap.range[0] + chap.range[1]) / 2);
    window.scrollTo({
      top: targetY,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <section
      ref={trackRef}
      aria-label="Cinematic scroll-story stage"
      className="relative h-[320vh] w-full border-b border-hairline select-none"
    >
      {/* Sticky 100dvh Pinned Stage */}
      <div className="sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between pt-20 pb-6 sm:pt-24 sm:pb-10 px-4 sm:px-8">
        {/* Full-Bleed Scroll-Scrubbed Visual Canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        {/* Top HUD Telemetry Bar + Skip Scroll Story Control */}
        <div className="relative z-10 mx-auto w-full max-w-[1440px] flex items-center justify-between gap-4 border-b border-hairline pb-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-muted">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-text">{activeChapter.code}</span>
          </div>

          <div className="flex items-center gap-4 tabular-nums">
            <span className="hidden sm:inline text-accent">
              FRAME SCRUB // {Math.round(progress * 100)}%
            </span>
            <button
              type="button"
              onClick={skipScrollStage}
              className="rounded-full border border-hairline bg-surface/80 px-3 py-1 text-[10px] text-muted hover:text-text hover:border-accent/40 transition-colors"
            >
              Skip Story ↓
            </button>
          </div>
        </div>

        {/* Main Responsive Composition:
            - Desktop: Left-aligned editorial chapter card while right 60% showcases the 3D optical core.
            - Mobile Portrait: Top 48% open for portrait 3D core, bottom docks the clean glass story card. */}
        <div className="relative z-10 mx-auto w-full max-w-[1440px] mt-auto lg:my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-end lg:items-center">
          <div className="lg:col-span-6 xl:col-span-5">
            <div
              key={activeChapter.id}
              className="spatial-glass rounded-r24 p-6 sm:p-8 lg:p-10 space-y-5 transition-all duration-ui ease-expo-out"
            >
              <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                <span>{activeChapter.eyebrow}</span>
                <span>0{activeChapterIdx + 1} / 04</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[0.98] text-text">
                {activeChapter.headlinePlain}{' '}
                <span className="font-serif italic font-normal text-accent block sm:inline">
                  {activeChapter.headlineSerif}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-muted leading-relaxed">
                {activeChapter.body}
              </p>

              {/* Chapter Telemetry Pair */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-hairline font-mono tabular-nums">
                <div>
                  <span className="block text-[10px] text-muted">
                    {activeChapter.metricLeft.label}
                  </span>
                  <span className="mt-0.5 block text-xs sm:text-sm text-text font-medium">
                    {activeChapter.metricLeft.value}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-muted">
                    {activeChapter.metricRight.label}
                  </span>
                  <span className="mt-0.5 block text-xs sm:text-sm text-accent font-medium">
                    {activeChapter.metricRight.value}
                  </span>
                </div>
              </div>

              {/* Primary Action Row (Clean 2-button dock, zero mobile squishing) */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => openCommandPalette('')}
                  className="flex-1 min-w-[180px] flex items-center justify-between rounded-r16 border border-accent/40 bg-raised/90 px-4 py-3 text-xs font-mono text-text hover:border-accent transition-colors"
                >
                  <span className="truncate">Search Index...</span>
                  <kbd className="ml-2 rounded border border-hairline bg-bg px-1.5 py-0.5 text-[10px] text-accent">
                    ⌘K
                  </kbd>
                </button>

                <Link
                  href="/apps"
                  className="inline-flex items-center justify-center rounded-r16 bg-text px-5 py-3 text-xs font-mono uppercase tracking-wider text-bg font-medium hover:opacity-90 transition-opacity"
                >
                  Apps →
                </Link>

                <Link
                  href="/news"
                  className="inline-flex items-center justify-center rounded-r16 border border-hairline bg-surface px-4 py-3 text-xs font-mono uppercase tracking-wider text-text hover:border-accent/40 transition-colors"
                >
                  News
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Chapter Scrub Rail */}
        <div className="relative z-10 mx-auto w-full max-w-[1440px] pt-4 flex items-end justify-between gap-4">
          <div className="grid grid-cols-4 gap-2 w-full max-w-md">
            {STORY_CHAPTERS.map((chap, idx) => {
              const active = idx === activeChapterIdx;
              const fill =
                progress >= chap.range[1]
                  ? 1
                  : progress <= chap.range[0]
                    ? 0
                    : (progress - chap.range[0]) /
                      (chap.range[1] - chap.range[0]);
              return (
                <div key={chap.id} className="space-y-1.5">
                  <div className="h-1 w-full rounded-full bg-hairline overflow-hidden">
                    <div
                      className="h-full bg-accent origin-left transition-transform duration-150"
                      style={{ transform: `scaleX(${fill})` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => jumpToChapter(idx)}
                    className={`block font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.14em] text-left transition-colors ${
                      active ? 'text-accent' : 'text-muted hover:text-text'
                    }`}
                    aria-label={`Jump to ${chap.code}`}
                  >
                    0{idx + 1}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted pb-1">
            <span>Scroll to scrub</span>
            <span className="inline-block animate-bounce">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
