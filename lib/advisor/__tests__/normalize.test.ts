// lib/advisor/__tests__/normalize.test.ts
import { describe, it, expect } from 'vitest';
import { normalizeQuestion, hashString, answerHashFor } from '@/lib/advisor/normalize';

describe('normalizeQuestion', () => {
  it('lowercases, trims, and collapses whitespace', () => {
    expect(normalizeQuestion('  Good   DRILL  ~$300 ')).toBe('good drill ~$300');
  });
  it('treats casing/spacing variants as equal', () => {
    expect(normalizeQuestion('Best Cordless Drill')).toBe(normalizeQuestion('best   cordless drill'));
  });
});

describe('hashString', () => {
  it('is deterministic and hex', () => {
    expect(hashString('abc')).toBe(hashString('abc'));
    expect(hashString('abc')).toMatch(/^[0-9a-f]{8,}$/);
  });
  it('differs for different input', () => {
    expect(hashString('abc')).not.toBe(hashString('abd'));
  });
});

describe('answerHashFor', () => {
  it('is stable across casing/whitespace variants', () => {
    expect(answerHashFor('Good Drill')).toBe(answerHashFor('  good   drill '));
  });
});
