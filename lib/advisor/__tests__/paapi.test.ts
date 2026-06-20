// lib/advisor/__tests__/paapi.test.ts
import { describe, it, expect, vi } from 'vitest';
import { searchItems, parseSearchResult } from '@/lib/advisor/paapi';
import type { SearchGroup } from '@/lib/advisor/types';

const sample = {
  SearchResult: { Items: [{
    ASIN: 'B00005RHPD',
    DetailPageURL: 'https://www.amazon.com/dp/B00005RHPD?tag=shabitools-20',
    Images: { Primary: { Large: { URL: 'https://img/x.jpg' } } },
    ItemInfo: { Title: { DisplayValue: 'Bosch 1617EVSPK Router' },
      Features: { DisplayValues: ['2.25 HP', 'Combo kit'] } },
    Offers: { Listings: [{ Price: { DisplayAmount: '$199.00', Currency: 'USD' } }] },
  }] },
};

describe('parseSearchResult', () => {
  it('maps PA-API items to RawProduct[]', () => {
    const products = parseSearchResult(sample);
    expect(products[0]).toMatchObject({ asin: 'B00005RHPD', title: 'Bosch 1617EVSPK Router',
      imageUrl: 'https://img/x.jpg', price: '$199.00', currency: 'USD' });
    expect(products[0].features).toContain('2.25 HP');
  });
  it('tolerates missing offers/images', () => {
    const products = parseSearchResult({ SearchResult: { Items: [{ ASIN: 'Z', DetailPageURL: 'u',
      ItemInfo: { Title: { DisplayValue: 'X' } } }] } });
    expect(products[0]).toMatchObject({ asin: 'Z', price: null, imageUrl: null });
  });
  it('returns [] when no items', () => {
    expect(parseSearchResult({})).toEqual([]);
  });
});

describe('searchItems', () => {
  it('signs and posts, returning parsed products', async () => {
    const fetchImpl = vi.fn(async () => ({ ok: true, json: async () => sample })) as unknown as typeof fetch;
    const group: SearchGroup = { label: 'Router', keywords: 'router combo', priceMax: 300 };
    const products = await searchItems(group, {
      accessKey: 'AKID', secretKey: 'secret', partnerTag: 'shabitools-20',
      now: new Date('2024-01-01T00:00:00Z'), fetchImpl,
    });
    expect(products[0].asin).toBe('B00005RHPD');
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [, init] = (fetchImpl as any).mock.calls[0];
    expect(init.headers['x-amz-target']).toContain('SearchItems');
  });
});
