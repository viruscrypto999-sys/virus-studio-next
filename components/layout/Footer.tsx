'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="relative border-t border-hairline px-4 sm:px-8 py-10">
      <div className="mx-auto w-full max-w-[1200px] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #ff1e1e, #8a0400)' }}
          >
            V
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
            Virus<span className="text-accent">Studio</span> · © 2026
          </span>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
          Apps. Games. <span className="text-accent">Future.</span>
        </p>
      </div>
    </footer>
  );
}
