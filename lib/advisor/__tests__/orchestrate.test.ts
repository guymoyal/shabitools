// lib/advisor/__tests__/orchestrate.test.ts
import { describe, it, expect, vi } from 'vitest';
import { buildAnswer } from '@/lib/advisor/orchestrate';
import type { CatalogEntry, RawProduct } from '@/lib/advisor/types';

const catalog: CatalogEntry[] = [
  { slug: 'cordless-drills', kind: 'category', href: '/categories/cordless-drills',
    label: 'Cordless Drills', category: 'cordless-drills' },
];

const product: RawProduct = { asin: 'A1', title: 'DeWalt cordless drill 20V', imageUrl: 'i',
  price: '$129', currency: 'USD', rating: null, features: [], detailUrl: 'd' };

it('assembles an answer from plan -> search -> write -> enrich', async () => {
  const deps = {
    plan: vi.fn(async () => ({ intent: 'drill', groups: [{ label: 'Drill', keywords: 'cordless drill' }] })),
    search: vi.fn(async () => [product]),
    write: vi.fn(async () => ({ intro: 'Top picks', picks: [{ asin: 'A1', why: 'Best value' }] })),
    catalog, tag: 'shabitools-20',
  };
  const answer = await buildAnswer('good drill', deps as any);
  expect(answer.intro).toBe('Top picks');
  expect(answer.intent).toBe('drill'); // planner intent is surfaced for analytics
  expect(answer.groups[0].cards[0].asin).toBe('A1');
  expect(answer.groups[0].cards[0].why).toBe('Best value');
  expect(answer.groups[0].cards[0].affiliateUrl).toContain('tag=shabitools-20');
  expect(answer.groups[0].cards[0].internalHref).toBe('/categories/cordless-drills');
  expect(answer.answerHash).toMatch(/^[0-9a-f]{8}$/);
});

it('drops picks whose asin is not in the fetched products', async () => {
  const deps = {
    plan: vi.fn(async () => ({ intent: 'x', groups: [{ label: 'Drill', keywords: 'drill' }] })),
    search: vi.fn(async () => [product]),
    write: vi.fn(async () => ({ intro: 'i', picks: [{ asin: 'GHOST', why: 'nope' }, { asin: 'A1', why: 'ok' }] })),
    catalog, tag: 't',
  };
  const answer = await buildAnswer('q', deps as any);
  const asins = answer.groups[0].cards.map((c) => c.asin);
  expect(asins).toEqual(['A1']);
});
