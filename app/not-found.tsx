'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/components/providers/AppProviders';
import { Badge, Button, Card } from '@/components/ui/Primitives';

export default function NotFoundPage() {
  const { openCommandPalette } = useAppStore();

  return (
    <section className="min-h-[84dvh] flex items-center justify-center px-4 sm:px-8 pt-28 pb-20">
      <div className="mx-auto w-full max-w-3xl">
        <Card radius="r36" className="p-8 sm:p-14 text-center relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, var(--accent-ice-soft) 0%, transparent 65%)',
            }}
          />

          <div className="relative z-10 space-y-6">
            <Badge tone="accent">HTTP 404 // UNINDEXED VECTOR COORDINATE</Badge>

            <h1 className="text-6xl sm:text-8xl font-mono font-medium tracking-tighter text-text tabular-nums">
              4<span className="font-serif italic text-accent">0</span>4
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-text">
              The requested spatial coordinate does not exist in this registry.
            </p>

            <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
              The system specification or research dispatch may have been superseded by a newer benchmark revision. Query the live index below.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link href="/">
                <Button variant="primary" size="lg" rollText>
                  Return to Spatial Index
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => openCommandPalette('')}
              >
                Search Command Palette (⌘K)
              </Button>
              <Link href="/apps">
                <Button variant="outline" size="lg">
                  Browse 30 AI Tools →
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
