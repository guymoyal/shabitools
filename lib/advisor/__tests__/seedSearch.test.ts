// lib/advisor/__tests__/seedSearch.test.ts
import { describe, it, expect } from 'vitest';
import { searchSeed, toRawProduct } from '@/lib/advisor/seedSearch';
import type { SeedProduct } from '@/lib/advisor/seedSearch';
import type { SearchGroup } from '@/lib/advisor/types';

const seed: SeedProduct[] = [
  { asin: 'B0DRILL001', title: 'DEWALT 20V MAX Cordless Drill Driver Kit', imageUrl: 'i1',
    price: '$99.00', currency: 'USD', features: ['20V', 'brushless'],
    tags: ['drill', 'cordless drill', 'power drill'], category: 'cordless-drills', priceValue: 99 },
  { asin: 'B0DRILL002', title: 'Makita XFD Cordless Drill 18V Premium', imageUrl: 'i2',
    price: '$259.00', currency: 'USD', features: ['18V'],
    tags: ['drill', 'cordless drill'], category: 'cordless-drills', priceValue: 259 },
  { asin: 'B0SAW00001', title: 'BLACK+DECKER Circular Saw 20V', imageUrl: 'i3',
    price: '$79.00', currency: 'USD', features: ['20V'],
    tags: ['saw', 'circular saw', 'cutting'], category: 'circular-saws', priceValue: 79 },
  // Placeholder entry — must never appear in results (invalid ASIN).
  { asin: 'EXAMPLE0001', title: 'Example Placeholder Drill', imageUrl: null,
    price: '$1.00', currency: 'USD', features: [], tags: ['drill'], category: 'cordless-drills', priceValue: 1 },
];

const group = (over: Partial<SearchGroup>): SearchGroup =>
  ({ label: 'Drill', keywords: 'cordless drill', ...over });

describe('searchSeed', () => {
  it('matches products by keyword token overlap', () => {
    const res = searchSeed(group({ keywords: 'cordless drill' }), seed);
    const asins = res.map((r) => r.asin);
    expect(asins).toContain('B0DRILL001');
    expect(asins).toContain('B0DRILL002');
    expect(asins).not.toContain('B0SAW00001'); // a saw is not a drill
  });

  it('never returns placeholder entries with invalid ASINs', () => {
    const res = searchSeed(group({ keywords: 'drill' }), seed);
    expect(res.map((r) => r.asin)).not.toContain('EXAMPLE0001');
  });

  it('respects price bounds when priceValue is known', () => {
    const res = searchSeed(group({ keywords: 'cordless drill', priceMax: 150 }), seed);
    const asins = res.map((r) => r.asin);
    expect(asins).toContain('B0DRILL001'); // $99 <= 150
    expect(asins).not.toContain('B0DRILL002'); // $259 > 150
  });

  it('returns an empty array on a genuine miss (the honest no-match path)', () => {
    const res = searchSeed(group({ keywords: 'kayak inflatable paddle', label: 'Kayak' }), seed);
    expect(res).toEqual([]);
  });

  it('ranks stronger keyword matches first', () => {
    const res = searchSeed(group({ keywords: 'circular saw cutting', label: 'Saw' }), seed);
    expect(res[0].asin).toBe('B0SAW00001');
  });

  it('caps the number of returned products', () => {
    const big: SeedProduct[] = Array.from({ length: 20 }, (_, i) => ({
      asin: `B0DRILLZ${String(i).padStart(2, '0')}`, title: `Cordless Drill ${i}`, imageUrl: null,
      price: '$50.00', currency: 'USD', features: [], tags: ['cordless drill'],
      category: 'cordless-drills', priceValue: 50,
    }));
    const res = searchSeed(group({ keywords: 'cordless drill' }), big, { limit: 6 });
    expect(res.length).toBeLessThanOrEqual(6);
  });
});

describe('toRawProduct', () => {
  it('maps a seed product to the RawProduct shape with a detail URL', () => {
    const raw = toRawProduct(seed[0], 'shabitools-20');
    expect(raw.asin).toBe('B0DRILL001');
    expect(raw.title).toBe('DEWALT 20V MAX Cordless Drill Driver Kit');
    expect(raw.detailUrl).toContain('B0DRILL001');
    expect(raw.detailUrl).toContain('tag=shabitools-20');
    expect(raw.rating).toBeNull();
  });
});
