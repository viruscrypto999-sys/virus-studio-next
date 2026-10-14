import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Virus Studio — Apps & AI Tools Directory + AI News';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function GlobalOpenGraphImage() {
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
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 20,
            letterSpacing: '0.2em',
            color: '#BFD4E6',
          }}
        >
          <span>VIRUS STUDIO // SYS.3050</span>
          <span>PILLAR 01: APPS · PILLAR 02: NEWS</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 600,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              color: '#ECEEF1',
            }}
          >
            The Spatial Index for Autonomous Intelligence.
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#8A9099',
              maxWidth: '900px',
            }}
          >
            30 Benchmarked AI Systems · 24 Primary Research Dispatches · Zero Synthetic Noise.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '24px',
            fontSize: 18,
            color: '#8A9099',
          }}
        >
          <span>https://virus.studio</span>
          <span style={{ color: '#BFD4E6' }}>VERIFIED TELEMETRY // 2026</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
