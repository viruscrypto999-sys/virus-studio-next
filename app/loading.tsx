import React from 'react';
import { Skeleton } from '@/components/ui/Primitives';

export default function GlobalLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading spatial view"
      className="pt-28 pb-24 px-4 sm:px-8 mx-auto max-w-[1440px] space-y-8"
    >
      <div className="space-y-3 border-b border-hairline pb-8">
        <Skeleton className="h-5 w-48 rounded-r10" />
        <Skeleton className="h-14 w-full max-w-2xl rounded-r16" />
        <Skeleton className="h-5 w-full max-w-xl rounded-r10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-64 w-full rounded-r24" />
        ))}
      </div>
    </div>
  );
}
