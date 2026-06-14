import { describe, expect, it } from 'vitest';
import { isAmazonUrl, withAmazonTag, resolveAffiliateUrl } from '../affiliate';

describe('isAmazonUrl', () => {
  it('matches amazon storefront + short domains', () => {
    expect(isAmazonUrl('https://www.amazon.com/dp/B00005RHPD')).toBe(true);
    expect(isAmazonUrl('https://amazon.co.uk/dp/X')).toBe(true);
    expect(isAmazonUrl('https://amzn.to/abc')).toBe(true);
  });
  it('rejects non-amazon + junk', () => {
    expect(isAmazonUrl('https://www.homedepot.com/p/123')).toBe(false);
    expect(isAmazonUrl('https://notamazon.evil.com')).toBe(false);
    expect(isAmazonUrl('')).toBe(false);
    expect(isAmazonUrl('not a url')).toBe(false);
  });
});

describe('withAmazonTag', () => {
  it('appends the associates tag', () => {
    expect(withAmazonTag('https://www.amazon.com/dp/B00005RHPD', 'shabitools-20')).toBe(
      'https://www.amazon.com/dp/B00005RHPD?tag=shabitools-20'
    );
  });
  it('replaces an existing tag rather than duplicating it', () => {
    expect(withAmazonTag('https://www.amazon.com/dp/X?tag=someoneelse-20', 'shabitools-20')).toBe(
      'https://www.amazon.com/dp/X?tag=shabitools-20'
    );
  });
  it('preserves other query params', () => {
    const out = withAmazonTag('https://www.amazon.com/dp/X?th=1', 'shabitools-20');
    expect(out).toContain('th=1');
    expect(out).toContain('tag=shabitools-20');
  });
});

describe('resolveAffiliateUrl', () => {
  const tag = 'shabitools-20';
  it('prefers an already-populated url (e.g. an Admitad deeplink)', () => {
    expect(
      resolveAffiliateUrl({ merchant: 'Walmart', url: 'https://ad.admitad.com/g/x/' }, tag)
    ).toBe('https://ad.admitad.com/g/x/');
  });
  it('builds an Amazon link from productUrl when url is null', () => {
    expect(
      resolveAffiliateUrl(
        { merchant: 'Amazon', url: null, productUrl: 'https://www.amazon.com/dp/B00005RHPD' },
        tag
      )
    ).toBe('https://www.amazon.com/dp/B00005RHPD?tag=shabitools-20');
  });
  it('returns null for a non-amazon merchant with no url', () => {
    expect(
      resolveAffiliateUrl(
        { merchant: 'Home Depot', url: null, productUrl: 'https://www.homedepot.com/p/1' },
        tag
      )
    ).toBeNull();
  });
  it('returns null for an amazon product when no tag is configured', () => {
    expect(
      resolveAffiliateUrl(
        { merchant: 'Amazon', url: null, productUrl: 'https://www.amazon.com/dp/X' },
        ''
      )
    ).toBeNull();
  });
});
