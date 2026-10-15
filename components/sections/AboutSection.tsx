'use client';

import React, { useEffect, useRef } from 'react';

const MARQUEE_WORDS = [
  'VIRUS STUDIO',
  'APPS',
  'GAMES',
  'FUTURE',
  'BUILT BY ITZVIRUS',
  'REDLINE',
];

export function AboutSection() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal');
    if (!els || els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="relative w-full overflow-hidden">
      {/* marquee */}
      <div className="border-y border-hairline py-4 overflow-hidden select-none" aria-hidden="true">
        <div className="marquee-track flex whitespace-nowrap gap-0 w-max">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0">
              {MARQUEE_WORDS.map((w) => (
                <span
                  key={`${dup}-${w}`}
                  className="font-mono text-xs uppercase tracking-[0.35em] text-muted px-8 flex items-center gap-8"
                >
                  {w}
                  <span className="text-accent">●</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative px-4 sm:px-8 py-24 sm:py-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 50% 45% at 50% 55%, rgba(225,6,0,0.1), transparent 70%)',
          }}
        />
        <div className="relative mx-auto w-full max-w-[900px] text-center">
          <p className="reveal font-mono text-[11px] uppercase tracking-[0.3em] text-accent mb-6">
            // About
          </p>
          <h2 className="reveal display-mega text-5xl sm:text-7xl lg:text-8xl mb-8">
            BUILT BY
            <br />
            <span className="red-gradient-text text-glow-red">ITZVIRUS</span>
          </h2>
          <p className="reveal text-muted text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            One builder. One vision. I make apps and games my friends actually want to play —
            then I ship them straight from this studio. No middlemen, no noise.
          </p>
          <div className="reveal mt-10 flex flex-wrap justify-center gap-3">
            <a href="#apps" className="btn-red rounded-r16 px-8 py-3.5 text-xs uppercase">
              Get the apps
            </a>
            <a href="#top" className="btn-ghost rounded-r16 px-8 py-3.5 text-xs font-mono uppercase tracking-wider">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
