import type { AffiliateLink } from '@/types/content';

/**
 * Amazon Associates link helper.
 *
 * Amazon tracking is just a `tag=<associate-id>` query param on a normal
 * product URL — no API, no deeplink call — so we derive monetised links at
 * build time from each entry's `productUrl` and one env var. Content JSON is
 * left untouched (its `url` stays null for Amazon entries); change the tag in
 * one place and every Amazon link updates on the next build.
 */
export const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATES_TAG ?? '';

/** True for Amazon storefronts (any TLD) and the amzn.to short domain. */
export function isAmazonUrl(url: string): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host === 'amzn.to' ||
      host === 'amazon.com' ||
      host.endsWith('.amazon.com') ||
      /(^|\.)amazon\.[a-z.]+$/.test(host)
    );
  } catch {
    return false;
  }
}

/** Return `productUrl` with our Associates tag set, replacing any existing tag. */
export function withAmazonTag(productUrl: string, tag: string): string {
  const u = new URL(productUrl);
  u.searchParams.set('tag', tag);
  return u.toString();
}

/**
 * Resolve the outbound URL for an affiliate entry:
 *  1. an already-populated `url` (e.g. a synced Admitad deeplink) wins;
 *  2. otherwise, an Amazon `productUrl` + configured tag becomes a tracked link;
 *  3. otherwise null — the caller drops the entry (no dead/untracked link shown).
 */
export function resolveAffiliateUrl(link: AffiliateLink, tag: string = AMAZON_TAG): string | null {
  if (link.url) return link.url;
  if (tag && link.productUrl && isAmazonUrl(link.productUrl)) {
    return withAmazonTag(link.productUrl, tag);
  }
  return null;
}
