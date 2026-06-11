export interface FaqItem {
  q: string;
  a: string;
}

/** One merchant CTA. `url` is filled by `pnpm admitad:sync` (CPA deeplink)
 *  or points at a first-party `/go/<slug>` redirect (CPC). Render only when set. */
export interface AffiliateLink {
  merchant: string;
  url: string | null;
  /** Official-API campaign id + target product URL — input for admitad:sync. */
  campaignId?: number;
  productUrl?: string;
}

export interface ContentDates {
  datePublished: string; // YYYY-MM-DD
  dateModified: string;
}
