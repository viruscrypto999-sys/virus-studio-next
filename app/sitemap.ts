import type { MetadataRoute } from 'next';
import { APP_CATEGORIES, SEED_APPS } from '@/lib/seed-apps';
import { SEED_NEWS } from '@/lib/seed-news';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://virus.studio';
  const now = new Date('2026-10-15T12:00:00Z');

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/apps`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.95,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = APP_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/apps/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const appRoutes: MetadataRoute.Sitemap = SEED_APPS.map((app) => ({
    url: `${baseUrl}/apps/${app.slug}`,
    lastModified: new Date(app.releaseDate),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const newsRoutes: MetadataRoute.Sitemap = SEED_NEWS.map((art) => ({
    url: `${baseUrl}/news/${art.slug}`,
    lastModified: new Date(art.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...appRoutes, ...newsRoutes];
}
