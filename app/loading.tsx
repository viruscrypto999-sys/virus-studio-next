import React from 'react';

export default function GlobalLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className="pt-28 pb-24 px-4 sm:px-8 mx-auto max-w-[1200px] space-y-6"
    >
      <div className="space-y-3 pb-8">
        <div className="h-5 w-48 rounded-r10 bg-raised animate-pulse" />
        <div className="h-16 w-full max-w-2xl rounded-r16 bg-raised animate-pulse" />
        <div className="h-5 w-full max-w-xl rounded-r10 bg-raised animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-56 w-full rounded-r24 bg-raised animate-pulse" />
        ))}
      </div>
    </div>
  );
}
