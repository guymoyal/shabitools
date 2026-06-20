// lib/advisor/internalMatch.ts
import type { CatalogEntry, RawProduct } from './types';

export interface InternalMatch { href: string; label: string; slug: string; }

/**
 * Match a product to the best on-site page:
 *  1. exact ASIN → review (most precise)
 *  2. brand + model both present in the product title → review
 *  3. category keyword present in the title → category page
 *  4. otherwise null (a content gap worth a future review)
 */
export function matchInternal(p: RawProduct, catalog: CatalogEntry[]): InternalMatch | null {
  const title = p.title.toLowerCase();

  const byAsin = catalog.find((c) => c.kind === 'review' && c.asin && c.asin === p.asin);
  if (byAsin) return { href: byAsin.href, label: byAsin.label, slug: byAsin.slug };

  const byModel = catalog.find((c) =>
    c.kind === 'review' && c.brand && c.model &&
    title.includes(c.brand.toLowerCase()) && title.includes(c.model.toLowerCase()));
  if (byModel) return { href: byModel.href, label: byModel.label, slug: byModel.slug };

  const byCategory = catalog.find((c) =>
    c.kind === 'category' && c.category &&
    c.category.split('-').every((word) => title.includes(word.replace(/s$/, ''))));
  if (byCategory) return { href: byCategory.href, label: byCategory.label, slug: byCategory.slug };

  return null;
}
