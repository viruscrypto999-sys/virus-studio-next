import { ImageResponse } from 'next/og';
import { getNewsBySlug } from '@/lib/seed-news';

export const alt = 'Virus Studio — Primary AI Research Dispatch';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function NewsOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

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
          <span>
            VIRUS STUDIO // DISPATCH · {(article?.topic ?? 'RESEARCH').toUpperCase()}
          </span>
          <span>{article?.readTimeMinutes ?? 5} MIN READ</span>
        </div>

        <div
          style={{
            fontSize: 58,
            fontWeight: 500,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: '#ECEEF1',
            maxWidth: '1040px',
          }}
        >
          {article?.title ?? 'Primary Intelligence Dispatch'}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            paddingTop: '24px',
            fontSize: 20,
            color: '#8A9099',
          }}
        >
          <span>SOURCE: {article?.source.name ?? 'Virus Studio Wire'}</span>
          <span style={{ color: '#BFD4E6' }}>
            BY {(article?.author.name ?? 'Editorial Staff').toUpperCase()}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
