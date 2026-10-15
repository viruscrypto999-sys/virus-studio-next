'use client';

import React, { useEffect, useRef, useState } from 'react';

interface StoryChapter {
  id: string;
  code: string;
  eyebrow: string;
  headlineTop: string;
  headlineRed: string;
  body: string;
  metricLeft: { label: string; value: string };
  metricRight: { label: string; value: string };
  range: [number, number];
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'scene-01',
    code: 'SCENE 01 // IGNITION',
    eyebrow: 'VIRUS STUDIO · EST. 2026',
    headlineTop: 'VIRUS',
    headlineRed: 'STUDIO',
    body: 'Apps. Games. Future. A cinematic lab built by iTzVirus — precision-engineered downloads, zero noise.',
    metricLeft: { label: 'ENGINE', value: 'REDLINE V1' },
    metricRight: { label: 'STATUS', value: 'LIVE' },
    range: [0.0, 0.26],
  },
  {
    id: 'scene-02',
    code: 'SCENE 02 // THE MACHINE',
    eyebrow: 'FLAGSHIP · VIRUS ARROWS PRO',
    headlineTop: 'BUILT TO',
    headlineRed: 'PLAY',
    body: 'The arrow puzzle game, rebuilt from the ground up. 1000+ levels, stealth admin, custom themes — tuned like a machine.',
    metricLeft: { label: 'LEVELS', value: '1000+' },
    metricRight: { label: 'SIZE', value: '7.2 MB' },
    range: [0.26, 0.54],
  },
  {
    id: 'scene-03',
    code: 'SCENE 03 // REDLINE',
    eyebrow: 'DIRECT DOWNLOAD · NO STORE',
    headlineTop: 'GET THE',
    headlineRed: 'GAME',
    body: 'Free forever. Download the APK straight from the studio — no accounts, no stores, no waiting.',
    metricLeft: { label: 'PRICE', value: 'FREE' },
    metricRight: { label: 'PLATFORM', value: 'ANDROID' },
    range: [0.54, 0.82],
  },
  {
    id: 'scene-04',
    code: 'SCENE 04 // ENTER',
    eyebrow: 'SYSTEM READY',
    headlineTop: 'BUILT BY',
    headlineRed: 'ITZVIRUS',
    body: 'One builder. One vision. Scroll down and enter the garage — every APK, ready to download.',
    metricLeft: { label: 'BUILDER', value: 'ITZVIRUS' },
    metricRight: { label: 'ACTION', value: 'SCROLL ↓' },
    range: [0.82, 1.01],
  },
];

export function HeroSection() {
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

  // Scroll-scrubbed BMW-red 3D core renderer (canvas 2D, 60fps budget)
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

    const drawScrubbedFrame = (p: number, timeSec: number) => {
      ctx.clearRect(0, 0, width, height);

      // Deep black void with red atmospheric core
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * (width < 768 ? 0.32 : 0.48),
        10,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.78
      );
      bgGrad.addColorStop(0, '#1c0605');
      bgGrad.addColorStop(0.45, '#0d0d0d');
      bgGrad.addColorStop(1, '#060606');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const isPortrait = width < 768;
      const cx = width * (isPortrait ? 0.5 : 0.64);
      const cy = height * (isPortrait ? 0.3 : 0.5);
      const baseRadius = Math.min(width, height) * (isPortrait ? 0.3 : 0.31);

      // Scroll kinematics
      const disassembly =
        p < 0.25
          ? p * 0.4
          : p < 0.55
            ? 0.1 + ((p - 0.25) / 0.3) * 1.15
            : p < 0.82
              ? 1.25 - ((p - 0.55) / 0.27) * 0.45
              : 0.8 * (1 - (p - 0.82) / 0.18);

      const zoom =
        1 + Math.sin(p * Math.PI) * (isPortrait ? 0.22 : 0.34) + (p > 0.55 && p < 0.85 ? 0.18 : 0);

      const tilt = 0.32 + p * 0.48;
      const rotation = p * Math.PI * 2.4 + timeSec * 0.18;
      const ringCount = 9;

      // Axial spine — red laser
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 30, 30, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy - baseRadius * 1.5);
      ctx.lineTo(cx, cy + baseRadius * 1.5);
      ctx.stroke();
      ctx.restore();

      // Concentric racing-red rings
      for (let i = 0; i < ringCount; i++) {
        const norm = i / (ringCount - 1) - 0.5;
        const zOffset = norm * baseRadius * 1.75 * disassembly;
        const ringScale = (1 - Math.abs(norm) * 0.42) * zoom;
        const rx = baseRadius * ringScale;
        const ry = rx * Math.max(0.14, Math.cos(tilt + norm * 0.35));
        const yPos = cy + zOffset;

        ctx.save();
        ctx.translate(cx, yPos);
        ctx.rotate(rotation * (i % 2 === 0 ? 0.35 : -0.25) * 0.2);

        const alpha = 0.25 + (1 - Math.abs(norm)) * 0.6;
        // Red metallic body
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(225, 20, 10, ${alpha})`;
        ctx.lineWidth = i === 4 ? 2.6 : 1.2;
        ctx.stroke();

        // Silver specular highlight on top rim
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, Math.PI * 1.12, Math.PI * 1.88);
        ctx.strokeStyle = 'rgba(235, 235, 235, 0.8)';
        ctx.lineWidth = i === 4 ? 2.2 : 1.2;
        ctx.stroke();

        // Red underglow arc on bottom rim
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, Math.PI * 0.15, Math.PI * 0.85);
        ctx.strokeStyle = `rgba(255, 30, 30, ${0.5 + alpha * 0.4})`;
        ctx.lineWidth = i === 4 ? 3.4 : 1.8;
        ctx.stroke();

        // Ignition nodes
        const nodeAngle = rotation * (i % 2 === 0 ? 1 : -1) + i * 1.1;
        const nx = Math.cos(nodeAngle) * rx;
        const ny = Math.sin(nodeAngle) * ry;
        ctx.fillStyle = '#ff2a1e';
        ctx.beginPath();
        ctx.arc(nx, ny, i === 4 ? 3.6 : 2.2, 0, Math.PI * 2);
        ctx.fill();
        // node halo
        ctx.fillStyle = 'rgba(255, 42, 30, 0.25)';
        ctx.beginPath();
        ctx.arc(nx, ny, i === 4 ? 8 : 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Red lens flare core
      const coreGlow = ctx.createRadialGradient(cx, cy, 2, cx, cy, baseRadius * 0.85 * zoom);
      coreGlow.addColorStop(0, 'rgba(255, 30, 20, 0.34)');
      coreGlow.addColorStop(0.4, 'rgba(225, 6, 0, 0.1)');
      coreGlow.addColorStop(1, 'rgba(6, 6, 6, 0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 0.85 * zoom, 0, Math.PI * 2);
      ctx.fill();

      // Speed lines on fast scroll
      const speed = Math.abs(targetProgress - currentProgress);
      if (speed > 0.004) {
        ctx.save();
        ctx.strokeStyle = `rgba(255, 30, 30, ${Math.min(0.35, speed * 8)})`;
        ctx.lineWidth = 1;
        for (let s = 0; s < 14; s++) {
          const sy = ((s * 97 + timeSec * 400) % (height + 200)) - 100;
          const sx = (s * 211) % width;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx, sy + 46);
          ctx.stroke();
        }
        ctx.restore();
      }
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
    const targetY = track.offsetTop + maxScroll * ((chap.range[0] + chap.range[1]) / 2);
    window.scrollTo({ top: targetY, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const scrollToApps = () => {
    document.getElementById('apps')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <section
      ref={trackRef}
      aria-label="Cinematic scroll-story stage"
      className="relative h-[320vh] w-full border-b border-hairline select-none"
    >
      <div className="sticky top-0 h-dvh w-full overflow-hidden flex flex-col justify-between pt-20 pb-6 sm:pt-24 sm:pb-10 px-4 sm:px-8">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        {/* Red scanline sweep */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-24 scanline"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(225,6,0,0.08), transparent)' }}
        />

        {/* Top HUD */}
        <div className="relative z-10 mx-auto w-full max-w-[1440px] flex items-center justify-between gap-4 border-b border-hairline pb-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-muted">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-accent pulse-red" />
            <span className="text-text">{activeChapter.code}</span>
          </div>
          <div className="flex items-center gap-4 tabular-nums">
            <span className="hidden sm:inline text-accent">
              REDLINE // {Math.round(progress * 100)}%
            </span>
            <button
              type="button"
              onClick={skipScrollStage}
              className="rounded-full border border-hairline bg-surface/80 px-3 py-1 text-[10px] text-muted hover:text-text hover:border-accent/50 transition-colors"
            >
              Skip ↓
            </button>
          </div>
        </div>

        {/* Chapter card */}
        <div className="relative z-10 mx-auto w-full max-w-[1440px] mt-auto lg:my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-end lg:items-center">
          <div className="lg:col-span-7 xl:col-span-6">
            <div
              key={activeChapter.id}
              className="spatial-glass rounded-r24 p-6 sm:p-8 lg:p-10 space-y-5"
            >
              <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                <span>{activeChapter.eyebrow}</span>
                <span>0{activeChapterIdx + 1} / 04</span>
              </div>

              <h1 className="display-mega text-5xl sm:text-7xl lg:text-8xl text-text">
                {activeChapter.headlineTop}
                <br />
                <span className="red-gradient-text text-glow-red">{activeChapter.headlineRed}</span>
              </h1>

              <p className="text-sm sm:text-base text-muted leading-relaxed max-w-md">
                {activeChapter.body}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-hairline font-mono tabular-nums">
                <div>
                  <span className="block text-[10px] text-muted">{activeChapter.metricLeft.label}</span>
                  <span className="mt-0.5 block text-xs sm:text-sm text-text font-bold">{activeChapter.metricLeft.value}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-muted">{activeChapter.metricRight.label}</span>
                  <span className="mt-0.5 block text-xs sm:text-sm text-accent font-bold">{activeChapter.metricRight.value}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={scrollToApps}
                  className="btn-red flex-1 min-w-[180px] rounded-r16 px-5 py-3.5 text-xs uppercase"
                >
                  Download APK ↓
                </button>
                <button
                  type="button"
                  onClick={skipScrollStage}
                  className="btn-ghost rounded-r16 px-5 py-3.5 text-xs font-mono uppercase tracking-wider"
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter scrub rail */}
        <div className="relative z-10 mx-auto w-full max-w-[1440px] pt-4 flex items-end justify-between gap-4">
          <div className="grid grid-cols-4 gap-2 w-full max-w-md">
            {STORY_CHAPTERS.map((chap, idx) => {
              const active = idx === activeChapterIdx;
              const fill =
                progress >= chap.range[1]
                  ? 1
                  : progress <= chap.range[0]
                    ? 0
                    : (progress - chap.range[0]) / (chap.range[1] - chap.range[0]);
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
            <span>Scroll to ignite</span>
            <span className="inline-block animate-bounce text-accent">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
