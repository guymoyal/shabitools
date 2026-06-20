// lib/advisor/__tests__/deepseek.test.ts
import { describe, it, expect, vi } from 'vitest';
import { planQuestion, writeAnswer } from '@/lib/advisor/deepseek';
import type { RawProduct } from '@/lib/advisor/types';

function fakeFetch(jsonContent: string) {
  return vi.fn(async () => ({
    ok: true,
    json: async () => ({ choices: [{ message: { content: jsonContent } }] }),
  })) as unknown as typeof fetch;
}

describe('planQuestion', () => {
  it('parses planner JSON into a Plan', async () => {
    const content = JSON.stringify({
      intent: 'find a drill', groups: [{ label: 'Cordless drill', keywords: 'cordless drill', priceMax: 300 }],
    });
    const plan = await planQuestion('good drill ~$300', { apiKey: 'k', fetchImpl: fakeFetch(content) });
    expect(plan.groups[0].keywords).toBe('cordless drill');
    expect(plan.groups[0].priceMax).toBe(300);
  });
  it('throws on malformed JSON', async () => {
    await expect(planQuestion('x', { apiKey: 'k', fetchImpl: fakeFetch('not json') }))
      .rejects.toThrow();
  });
});

describe('writeAnswer', () => {
  it('parses writer JSON into intro + per-asin blurbs', async () => {
    const products: RawProduct[] = [{ asin: 'A1', title: 'Drill A', imageUrl: null, price: '$199',
      currency: 'USD', rating: 4.5, features: [], detailUrl: 'x' }];
    const content = JSON.stringify({ intro: 'Here are picks', picks: [{ asin: 'A1', why: 'Great value' }] });
    const res = await writeAnswer('good drill', products, { apiKey: 'k', fetchImpl: fakeFetch(content) });
    expect(res.intro).toBe('Here are picks');
    expect(res.picks[0]).toEqual({ asin: 'A1', why: 'Great value' });
  });
});
