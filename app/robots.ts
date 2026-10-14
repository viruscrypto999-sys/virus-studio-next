import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://virus.studio/sitemap.xml',
    host: 'https://virus.studio',
  };
}
