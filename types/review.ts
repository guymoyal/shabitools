import type { AffiliateLink, ContentDates, FaqItem } from './content';

export interface Review extends ContentDates {
  slug: string;
  title: string;
  brand: string; // brand slug, e.g. "makita"
  category: string; // category slug, e.g. "cordless-drills"
  model: string;
  rating: number; // 0–5, one decimal
  priceRange: string;
  image?: string;
  affiliate: AffiliateLink[];
  pros: string[];
  cons: string[];
  bestFor: string;
  skipIf: string;
  specs: Record<string, string>;
  faq: FaqItem[];
  body: string; // markdown, 800+ words
  related: string[]; // slugs of reviews/compare/guides
}
