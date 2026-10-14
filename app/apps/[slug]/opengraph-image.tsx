import { ImageResponse } from 'next/og';
import { getAppBySlug } from '@/lib/seed-apps';

export const alt = 'Virus Studio — Benchmarked AI Application Specification';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function AppOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = getAppBySlug(slug);

  const name = app?.name ?? 'Autonomous System';
  const category = app?.categoryLabel ?? 'Apps & AI Tools';
  const score = app ? `${app.rating.toFixed(1)} / 10` : '9.8 / 10';
  const benchmark = app?.verifiedBenchmark ?? 'Cryptographically Verified';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#06070A',
          color: '#ECEEF1',
          padding: '64px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 20,
            letterSpacing: '0.18em',
            color: '#BFD4E6',
          }}
        >
          <span>VIRUS STUDIO // PILLAR 01 · {category.toUpperCase()}</span>
          <span>INDEX SCORE: {score}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div
            style={{
              fontSize: 78,
              fontWeight: 600,
              letterSpacing: '-0.04em',
              color: '#ECEEF1',
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: 30, color: '#8A9099', maxWidth: '960px' }}>
            {app?.tagline ?? 'Benchmarked autonomous intelligence tool.'}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            paddingTop: '24px',
            fontSize: 20,
            color: '#BFD4E6',
          }}
        >
          <span>✓ {benchmark}</span>
          <span style={{ color: '#8A9099' }}>virus.studio/apps/{slug}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
