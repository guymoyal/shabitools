// lib/advisor/__tests__/amazon.test.ts
import { describe, it, expect } from 'vitest';
import { asinUrl, extractAsin } from '@/lib/advisor/amazon';

describe('asinUrl', () => {
  it('builds a tagged dp URL', () => {
    expect(asinUrl('B00005RHPD', 'shabitools-20'))
      .toBe('https://www.amazon.com/dp/B00005RHPD?tag=shabitools-20');
  });
});

describe('extractAsin', () => {
  it('reads ASIN from a /dp/ URL', () => {
    expect(extractAsin('https://www.amazon.com/Bosch-Router/dp/B00005RHPD/ref=x')).toBe('B00005RHPD');
  });
  it('reads ASIN from a /gp/product/ URL', () => {
    expect(extractAsin('https://www.amazon.com/gp/product/B0ABCDEFGH')).toBe('B0ABCDEFGH');
  });
  it('returns null when no ASIN', () => {
    expect(extractAsin('https://www.rockler.com/x')).toBeNull();
  });
});
