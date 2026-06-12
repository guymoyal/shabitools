import { describe, expect, it } from 'vitest';
import { fillAffiliateUrls } from '../admitadSync.js';

describe('fillAffiliateUrls', () => {
  const deeplinkFor = async (campaignId: number, productUrl: string) =>
    `https://ad.admitad.com/g/${campaignId}/?ulp=${encodeURIComponent(productUrl)}`;

  it('fills url for entries with campaignId+productUrl, leaves others alone', async () => {
    const doc = {
      affiliate: [
        { merchant: 'Home Depot', url: null, campaignId: 123, productUrl: 'https://homedepot.com/p/1' },
        { merchant: 'CPC store', url: '/go/acme-tools-us' },
      ],
    };
    const { updated, changed } = await fillAffiliateUrls(doc, deeplinkFor);
    expect(changed).toBe(1);
    expect(updated.affiliate[0].url).toContain('ad.admitad.com/g/123');
    expect(updated.affiliate[1].url).toBe('/go/acme-tools-us');
  });

  it('fills guide pick affiliates', async () => {
    const doc = {
      picks: [
        { rank: 1, affiliate: { merchant: 'HD', url: null, campaignId: 7, productUrl: 'https://x.com/p' } },
        { rank: 2 },
      ],
    };
    const { changed } = await fillAffiliateUrls(doc, deeplinkFor);
    expect(changed).toBe(1);
  });

  it('skips docs without affiliate arrays', async () => {
    const { changed } = await fillAffiliateUrls({ slug: 'x' }, deeplinkFor);
    expect(changed).toBe(0);
  });
});
