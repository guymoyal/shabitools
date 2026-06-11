import type { AffiliateLink, ContentDates, FaqItem } from './content';

export interface GuidePick {
  rank: number;
  awardLabel: string; // "Best overall", "Best budget"…
  name: string;
  reviewSlug?: string;
  summary: string;
  pros: string[];
  cons: string[];
  affiliate?: AffiliateLink;
}

export interface Guide extends ContentDates {
  slug: string;
  title: string;
  category: string;
  intro: string; // direct answer first (AEO)
  picks: GuidePick[];
  faq: FaqItem[];
  body: string;
  related: string[];
}
