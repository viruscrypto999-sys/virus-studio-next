'use client';

import React from 'react';
import { Badge, Button, Card } from '@/components/ui/Primitives';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[80dvh] flex items-center justify-center px-4 sm:px-8 pt-24">
      <Card radius="r24" className="max-w-xl w-full p-8 sm:p-10 text-center space-y-5">
        <Badge tone="accent">RUNTIME FAULT ISOLATED</Badge>
        <h2 className="text-2xl sm:text-3xl font-medium text-text">
          Telemetry stream interrupted
        </h2>
        <p className="text-xs sm:text-sm text-muted font-mono">
          {error.message || 'An unexpected state transition occurred in this view.'}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Button variant="primary" onClick={reset} rollText>
            Re-Initialize View
          </Button>
        </div>
      </Card>
    </div>
  );
}
