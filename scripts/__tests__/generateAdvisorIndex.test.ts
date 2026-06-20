// scripts/__tests__/generateAdvisorIndex.test.ts
import { describe, it, expect } from 'vitest';
import { buildIndex } from '@/scripts/generateAdvisorIndex';

describe('buildIndex', () => {
  it('produces review entries with derived ASIN and category entries', () => {
    const reviews = [{
      slug: 'bosch-1617evspk', title: 'Bosch 1617EVSPK Review', brand: 'bosch',
      category: 'routers', model: '1617EVSPK',
      affiliate: [{ merchant: 'Amazon', productUrl: 'https://www.amazon.com/x/dp/B00005RHPD' }],
    }];
    const categories = [{ slug: 'routers', name: 'Routers' }];
    const idx = buildIndex(reviews as any, categories as any);
    const review = idx.find((e) => e.slug === 'bosch-1617evspk');
    expect(review).toMatchObject({ kind: 'review', href: '/reviews/bosch-1617evspk',
      brand: 'bosch', category: 'routers', model: '1617EVSPK', asin: 'B00005RHPD' });
    expect(idx.find((e) => e.slug === 'routers')).toMatchObject({
      kind: 'category', href: '/categories/routers' });
  });
});
