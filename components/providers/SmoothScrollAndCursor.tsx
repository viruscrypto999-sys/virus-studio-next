'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from './AppProviders';

export function SmoothScrollAndCursor() {
  const { cursorLabel, isCmdOpen } = useAppStore();
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [isDesktopFinePointer, setIsDesktopFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    );
    const updateMatch = () => setIsDesktopFinePointer(mq.matches);
    updateMatch();
    mq.addEventListener('change', updateMatch);
    return () => mq.removeEventListener('change', updateMatch);
  }, []);

  // Desktop-only lightweight inertial wheel scroll (Lenis-style low-lerp physics, zero bundle bloat)
  useEffect(() => {
    if (!isDesktopFinePointer || isCmdOpen) return;

    let targetScroll = window.scrollY;
    let currentScroll = window.scrollY;
    let isAnimating = false;
    let rafId = 0;

    const syncScroll = () => {
      if (!isAnimating) {
        targetScroll = window.scrollY;
        currentScroll = window.scrollY;
      }
    };

    const step = () => {
      const diff = targetScroll - currentScroll;
      if (Math.abs(diff) < 0.5) {
        currentScroll = targetScroll;
        window.scrollTo(0, currentScroll);
        isAnimating = false;
        return;
      }
      // Low lerp (0.14) for calm, responsive inertial decay at 60fps
      currentScroll += diff * 0.14;
      window.scrollTo(0, currentScroll);
      rafId = window.requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      // Do not hijack horizontal rails or scrollable inner containers
      const target = e.target as HTMLElement | null;
      if (
        e.ctrlKey ||
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ||
        target?.closest('[role="dialog"], [data-native-scroll="true"]')
      ) {
        return;
      }

      e.preventDefault();
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      targetScroll = Math.max(
        0,
        Math.min(maxScroll, targetScroll + e.deltaY * 0.95)
      );

      if (!isAnimating) {
        isAnimating = true;
        rafId = window.requestAnimationFrame(step);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', syncScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', syncScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, [isDesktopFinePointer, isCmdOpen]);

  // Top 1px Scroll Progress Rail (transform: scaleX only)
  useEffect(() => {
    let rafId = 0;
    let ticking = false;

    const updateProgress = () => {
      ticking = false;
      if (!progressRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio =
        docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      progressRef.current.style.transform = `scaleX(${ratio})`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = window.requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Desktop Magnetic Cursor Loop
  useEffect(() => {
    if (!isDesktopFinePointer) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId = 0;
    let isRunning = false;

    const tick = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      currentX += dx * 0.24;
      currentY += dy * 0.24;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX.toFixed(
          1
        )}px, ${currentY.toFixed(1)}px, 0)`;
      }

      if (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        isRunning = false;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isRunning) {
        isRunning = true;
        rafId = window.requestAnimationFrame(tick);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.cancelAnimationFrame(rafId);
    };
  }, [isDesktopFinePointer]);

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 h-[1.5px] pointer-events-none overflow-hidden"
      >
        <div
          ref={progressRef}
          className="h-full w-full bg-accent origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {isDesktopFinePointer && (
        <div
          ref={cursorRef}
          aria-hidden="true"
          className="fixed top-0 left-0 z-50 pointer-events-none -ml-2 -mt-2"
          style={{ transform: 'translate3d(-100px, -100px, 0)' }}
        >
          <div
            className={`flex items-center justify-center rounded-full border border-accent/40 bg-raised/90 text-[10px] font-medium uppercase tracking-widest text-text transition-transform duration-micro ease-expo-out ${
              cursorLabel
                ? 'px-3 py-1 scale-100 opacity-100'
                : 'h-3.5 w-3.5 scale-75 opacity-65'
            }`}
          >
            {cursorLabel && <span>{cursorLabel}</span>}
          </div>
        </div>
      )}
    </>
  );
}
