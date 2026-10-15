'use client';

import React, { useEffect, useRef } from 'react';

interface Apk {
  name: string;
  desc: string;
  size: string;
  tag?: string;
  recommended?: boolean;
  url: string;
}

const APKS: Apk[] = [
  {
    name: 'Virus Arrows Pro',
    desc: 'The flagship arrow puzzle. 1000+ levels, stealth admin, custom themes, zero ads.',
    size: '7.2 MB',
    tag: 'RECOMMENDED',
    recommended: true,
    url: 'https://raw.githubusercontent.com/viruscrypto999-sys/virus-arrows-pro-apk/main/releases/Virus-Arrows-Pro.apk',
  },
];

const ICON_URL =
  'https://raw.githubusercontent.com/viruscrypto999-sys/virus-arrows-pro-apk/main/assets/icon-only.png';

export function AppsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal');
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
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="apps" ref={sectionRef} className="relative w-full py-24 sm:py-32 px-4 sm:px-8">
      {/* red ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(225,6,0,0.08), transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-[1200px]">
        <div className="reveal flex items-end justify-between gap-4 mb-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
              // The Garage
            </p>
            <h2 className="display-mega text-4xl sm:text-6xl lg:text-7xl">
              THE <span className="red-gradient-text text-glow-red">APPS</span>
            </h2>
          </div>
          <p className="hidden sm:block font-mono text-[11px] text-muted uppercase tracking-widest text-right">
            Android APK
            <br />
            Direct download
          </p>
        </div>

        <p className="reveal text-muted text-sm sm:text-base max-w-xl mb-12 leading-relaxed">
          No Play Store. No accounts. Tap download, install, play. Free forever.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {APKS.map((apk, i) => (
            <article
              key={apk.name}
              className={`reveal apk-card spatial-glass rounded-r24 p-6 sm:p-7 flex flex-col gap-5 ${
                apk.recommended ? 'sm:col-span-2 lg:col-span-1 border border-accent/40' : ''
              }`}
              style={{ transitionDelay: `${(i % 2) * 90}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <img
                    src={ICON_URL}
                    alt={`${apk.name} icon`}
                    width={72}
                    height={72}
                    loading="lazy"
                    className="w-[72px] h-[72px] rounded-2xl object-cover border border-hairline"
                    style={apk.recommended ? { boxShadow: '0 0 28px rgba(225,6,0,0.45)' } : undefined}
                  />
                  {apk.recommended && (
                    <span className="absolute -top-2.5 -right-2.5 bg-accent text-white font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                      {apk.tag}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-extrabold tracking-tight leading-snug">
                    {apk.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted leading-relaxed">{apk.desc}</p>
                </div>
              </div>

              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted border-t border-hairline pt-4">
                <span>{apk.size}</span>
                <span className="text-accent">vLatest · Android</span>
              </div>

              <a
                href={apk.url}
                download
                className="btn-red rounded-r16 px-5 py-3.5 text-xs uppercase text-center"
              >
                Download APK ↓
              </a>
            </article>
          ))}
        </div>

        {/* install steps */}
        <div className="reveal mt-14 spatial-glass rounded-r24 p-6 sm:p-8">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent mb-5">
            // How to install
          </h3>
          <ol className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
            {[
              ['01', 'Tap Download on any APK above'],
              ['02', 'Open the file when it finishes'],
              ['03', 'Allow "Install unknown apps" if asked'],
              ['04', 'Play. That is it.'],
            ].map(([n, t]) => (
              <li key={n} className="flex gap-3 items-start">
                <span className="font-mono font-bold text-accent text-lg leading-none">{n}</span>
                <span className="text-muted leading-relaxed">{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
