// lib/advisor/__tests__/internalMatch.test.ts
import { describe, it, expect } from 'vitest';
import { matchInternal } from '@/lib/advisor/internalMatch';
import type { CatalogEntry, RawProduct } from '@/lib/advisor/types';

const catalog: CatalogEntry[] = [
  { slug: 'bosch-1617evspk', kind: 'review', href: '/reviews/bosch-1617evspk',
    label: 'Bosch 1617EVSPK Review', brand: 'bosch', category: 'routers',
    model: '1617EVSPK', asin: 'B00005RHPD' },
  { slug: 'cordless-drills', kind: 'category', href: '/categories/cordless-drills',
    label: 'Cordless Drills', category: 'cordless-drills' },
];

function product(p: Partial<RawProduct>): RawProduct {
  return { asin: '', title: '', imageUrl: null, price: null, currency: null,
    rating: null, features: [], detailUrl: '', ...p };
}

describe('matchInternal', () => {
  it('matches a review by ASIN (highest precedence)', () => {
    const m = matchInternal(product({ asin: 'B00005RHPD', title: 'Anything' }), catalog);
    expect(m?.href).toBe('/reviews/bosch-1617evspk');
  });
  it('matches a review by brand+model in the title', () => {
    const m = matchInternal(product({ asin: 'ZZZ', title: 'Bosch 1617EVSPK Combo' }), catalog);
    expect(m?.href).toBe('/reviews/bosch-1617evspk');
  });
  it('falls back to a category page when no review matches', () => {
    const m = matchInternal(product({ asin: 'ZZZ', title: 'Generic cordless drill 20V' }), catalog);
    expect(m?.href).toBe('/categories/cordless-drills');
  });
  it('returns null when nothing matches (a content gap)', () => {
    expect(matchInternal(product({ asin: 'ZZZ', title: 'Garden hose reel' }), catalog)).toBeNull();
  });
});
