'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[80dvh] flex items-center justify-center px-4 sm:px-8 pt-24">
      <div className="spatial-glass rounded-r24 max-w-xl w-full p-8 sm:p-10 text-center space-y-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
          // Engine fault
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text">
          Something blew a gasket
        </h2>
        <p className="text-xs sm:text-sm text-muted font-mono">
          {error?.message || 'Unexpected runtime error'}
        </p>
        <button onClick={reset} className="btn-red rounded-r16 px-8 py-3 text-xs uppercase">
          Restart engine
        </button>
      </div>
    </div>
  );
}
