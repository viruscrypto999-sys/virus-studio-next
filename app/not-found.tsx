'use client';

import React from 'react';

export default function NotFoundPage() {
  return (
    <section className="min-h-[84dvh] flex items-center justify-center px-4 sm:px-8 pt-28 pb-20">
      <div className="mx-auto w-full max-w-2xl text-center">
        <div className="spatial-glass rounded-r36 p-10 sm:p-14 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, rgba(225,6,0,0.14) 0%, transparent 60%)',
            }}
          />
          <div className="relative z-10 space-y-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
              // Lost in the void
            </p>
            <h1 className="display-mega text-7xl sm:text-9xl text-text">
              4<span className="red-gradient-text">0</span>4
            </h1>
            <p className="text-muted">This page took a wrong turn at redline.</p>
            <a href="/" className="btn-red inline-block rounded-r16 px-8 py-3.5 text-xs uppercase">
              Back home
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
