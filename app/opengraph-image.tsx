import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'VIRUS STUDIO — Apps. Games. Future.';
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
          backgroundColor: '#0a0a0a',
          color: '#f5f5f5',
          padding: '64px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 20,
            letterSpacing: '0.25em',
            color: '#ff1e1e',
          }}
        >
          <span>VIRUS STUDIO</span>
          <span>APPS · GAMES · FUTURE</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              color: '#f5f5f5',
            }}
          >
            VIRUS
            <br />
            <span style={{ color: '#e10600' }}>STUDIO</span>
          </div>
          <div style={{ fontSize: 30, color: '#9a9a9a' }}>
            Apps. Games. Future. Built by iTzVirus.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            paddingTop: '24px',
            fontSize: 18,
            color: '#9a9a9a',
          }}
        >
          <span>virus-studio.vercel.app</span>
          <span style={{ color: '#ff1e1e' }}>FREE APK DOWNLOADS</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
