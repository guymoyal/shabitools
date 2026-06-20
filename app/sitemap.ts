import type { MetadataRoute } from 'next';
import {
  getBrands,
  getCategories,
  getCompares,
  getGuides,
  getProjects,
  getReviews,
  getStoreLandings,
} from '@/lib/content';
import { hasStoreLandings } from '@/lib/stores';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '',
    '/reviews',
    '/compare',
    '/guides',
    '/projects',
    '/brands',
    '/categories',
    ...(hasStoreLandings() ? ['/stores'] : []),
    '/about',
    '/editorial-policy',
    '/contact',
    '/privacy',
    '/terms',
    '/affiliate-disclosure',
  ].map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: 'weekly' as const }));

  const content = [
    ...getReviews().map((r) => ({ path: `/reviews/${r.slug}`, mod: r.dateModified })),
    ...getCompares().map((c) => ({ path: `/compare/${c.slug}`, mod: c.dateModified })),
    ...getGuides().map((g) => ({ path: `/guides/${g.slug}`, mod: g.dateModified })),
    ...getProjects().map((p) => ({ path: `/projects/${p.slug}`, mod: p.dateModified })),
    ...getBrands().map((b) => ({ path: `/brands/${b.slug}`, mod: b.dateModified })),
    ...getCategories().map((c) => ({ path: `/categories/${c.slug}`, mod: c.dateModified })),
    ...getStoreLandings().map((s) => ({ path: `/stores/${s.slug}`, mod: undefined as string | undefined })),
  ].map((e) => ({
    url: `${SITE_URL}${e.path}`,
    ...(e.mod ? { lastModified: e.mod } : {}),
    changeFrequency: 'monthly' as const,
  }));

  return [...staticPaths, ...content];
}
