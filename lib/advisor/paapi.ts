// lib/advisor/paapi.ts
import type { RawProduct, SearchGroup } from './types';
import { signRequest } from './sigv4';

const HOST = 'webservices.amazon.com';
const REGION = 'us-east-1';
const MARKETPLACE = 'www.amazon.com';
const PATH = '/paapi5/searchitems';
const TARGET = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems';

export interface PaapiCreds {
  accessKey: string; secretKey: string; partnerTag: string;
  now?: Date; fetchImpl?: typeof fetch;
}

export function parseSearchResult(body: any): RawProduct[] {
  const items = body?.SearchResult?.Items;
  if (!Array.isArray(items)) return [];
  return items.map((it: any) => {
    const listing = it?.Offers?.Listings?.[0];
    return {
      asin: it.ASIN,
      title: it?.ItemInfo?.Title?.DisplayValue ?? '',
      imageUrl: it?.Images?.Primary?.Large?.URL ?? null,
      price: listing?.Price?.DisplayAmount ?? null,
      currency: listing?.Price?.Currency ?? null,
      rating: null, // PA-API does not return star ratings; reserved for future enrichment
      features: it?.ItemInfo?.Features?.DisplayValues ?? [],
      detailUrl: it?.DetailPageURL ?? '',
    } as RawProduct;
  });
}

function fmtDates(d: Date) {
  const iso = d.toISOString().replace(/[:-]|\.\d{3}/g, ''); // YYYYMMDDTHHMMSSZ
  return { amzDate: iso, dateStamp: iso.slice(0, 8) };
}

export async function searchItems(group: SearchGroup, creds: PaapiCreds): Promise<RawProduct[]> {
  const f = creds.fetchImpl ?? fetch;
  const payload: Record<string, unknown> = {
    Keywords: group.keywords,
    SearchIndex: 'All',
    ItemCount: 6,
    PartnerTag: creds.partnerTag,
    PartnerType: 'Associates',
    Marketplace: MARKETPLACE,
    Resources: [
      'ItemInfo.Title',
      'ItemInfo.Features',
      'Images.Primary.Large',
      'Offers.Listings.Price',
    ],
  };
  if (group.priceMin != null) payload.MinPrice = Math.round(group.priceMin * 100);
  if (group.priceMax != null) payload.MaxPrice = Math.round(group.priceMax * 100);

  const body = JSON.stringify(payload);
  const { amzDate, dateStamp } = fmtDates(creds.now ?? new Date());
  const signed = await signRequest({
    accessKey: creds.accessKey, secretKey: creds.secretKey, region: REGION,
    service: 'ProductAdvertisingAPI', host: HOST, path: PATH, target: TARGET,
    body, amzDate, dateStamp,
  });
  const res = await f(signed.url, { method: 'POST', headers: signed.headers, body: signed.body });
  if (!(res as any).ok) throw new Error(`paapi ${(res as any).status ?? ''}`);
  return parseSearchResult(await res.json());
}
