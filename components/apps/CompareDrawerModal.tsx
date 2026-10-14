'use client';

import React from 'react';
import Link from 'next/link';
import type { AppItem } from '@/lib/seed-apps';
import { Badge, Modal } from '@/components/ui/Primitives';

interface CompareDrawerModalProps {
  selectedApps: AppItem[];
  toggleCompareApp: (slug: string, name: string) => void;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export function CompareDrawerModal({
  selectedApps,
  toggleCompareApp,
  modalOpen,
  setModalOpen,
}: CompareDrawerModalProps) {
  if (!modalOpen) return null;

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`SIDE-BY-SIDE TELEMETRY MATRIX (${selectedApps.length} SYSTEMS)`}
        maxWidthClass="max-w-5xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-hairline">
                <th className="py-3 pr-4 font-mono text-[11px] uppercase tracking-wider text-muted w-44">
                  Dimension
                </th>
                {selectedApps.map((app) => (
                  <th key={app.slug} className="py-3 px-4 align-top">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-r10 border border-hairline bg-raised font-mono text-xs text-accent">
                          {app.iconGlyph}
                        </span>
                        <div>
                          <Link
                            href={`/apps/${app.slug}`}
                            onClick={() => setModalOpen(false)}
                            className="text-sm font-medium text-text hover:text-accent"
                          >
                            {app.name}
                          </Link>
                          <p className="font-mono text-[10px] text-muted">
                            {app.categoryLabel}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleCompareApp(app.slug, app.name)}
                        className="font-mono text-xs text-muted hover:text-text"
                      >
                        [×]
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline text-xs sm:text-sm">
              <tr>
                <td className="py-3.5 pr-4 font-mono text-xs text-muted">
                  Index Score
                </td>
                {selectedApps.map((app) => (
                  <td
                    key={app.slug}
                    className="py-3.5 px-4 font-mono font-semibold text-accent tabular-nums"
                  >
                    {app.rating.toFixed(1)} / 10.0 ({app.reviewCount} audits)
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-mono text-xs text-muted">
                  Verified Benchmark
                </td>
                {selectedApps.map((app) => (
                  <td key={app.slug} className="py-3.5 px-4 font-mono text-xs text-text">
                    ✓ {app.verifiedBenchmark}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-mono text-xs text-muted">
                  P99 Latency
                </td>
                {selectedApps.map((app) => (
                  <td
                    key={app.slug}
                    className="py-3.5 px-4 font-mono text-text tabular-nums"
                  >
                    {app.latencyMs}ms
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-mono text-xs text-muted">
                  Active Context
                </td>
                {selectedApps.map((app) => (
                  <td
                    key={app.slug}
                    className="py-3.5 px-4 font-mono text-text tabular-nums"
                  >
                    {app.contextWindow}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-mono text-xs text-muted">
                  Pricing Economics
                </td>
                {selectedApps.map((app) => (
                  <td key={app.slug} className="py-3.5 px-4">
                    <Badge>{app.pricing}</Badge>
                    <span className="ml-2 font-mono text-xs text-muted tabular-nums">
                      {app.startingPrice}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-mono text-xs text-muted">
                  Supported Runtimes
                </td>
                {selectedApps.map((app) => (
                  <td key={app.slug} className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {app.platforms.map((p) => (
                        <span
                          key={p}
                          className="rounded border border-hairline bg-bg px-2 py-0.5 font-mono text-[10px] text-muted"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-mono text-xs text-muted">
                  Primary Strengths
                </td>
                {selectedApps.map((app) => (
                  <td key={app.slug} className="py-3.5 px-4 align-top">
                    <ul className="space-y-1 text-xs text-text">
                      {app.pros.map((pro) => (
                        <li key={pro}>+ {pro}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-mono text-xs text-muted">
                  Known Tradeoffs
                </td>
                {selectedApps.map((app) => (
                  <td key={app.slug} className="py-3.5 px-4 align-top">
                    <ul className="space-y-1 text-xs text-muted">
                      {app.cons.map((con) => (
                        <li key={con}>− {con}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-mono text-xs text-muted">
                  Editorial Verdict
                </td>
                {selectedApps.map((app) => (
                  <td
                    key={app.slug}
                    className="py-3.5 px-4 text-xs text-muted italic font-serif text-base"
                  >
                    &ldquo;{app.editorialVerdict}&rdquo;
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
