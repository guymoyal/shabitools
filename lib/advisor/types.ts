// lib/advisor/types.ts

/** One product-search intent produced by the planner. */
export interface SearchGroup {
  label: string;          // e.g. "Cordless drill" or "Cutting"
  keywords: string;       // Amazon search keywords
  priceMin?: number;      // USD
  priceMax?: number;      // USD
  categoryGuess?: string; // best-guess site category slug
  whyNeeded?: string;     // short rationale (project questions)
}

export interface Plan {
  intent: string;
  groups: SearchGroup[];
}

/** Normalized product as returned by PA-API. */
export interface RawProduct {
  asin: string;
  title: string;
  imageUrl: string | null;
  price: string | null;     // formatted, e.g. "$129.00"
  currency: string | null;  // e.g. "USD"
  rating: number | null;    // 0..5 when available
  features: string[];
  detailUrl: string;        // PA-API DetailPageURL (already tagged by Amazon)
}

/** One rendered card. */
export interface Card {
  groupLabel: string;
  asin: string;
  title: string;
  imageUrl: string | null;
  price: string | null;
  currency: string | null;
  rating: number | null;
  why: string;                 // one-line "why it fits you" from the writer
  affiliateUrl: string;        // tagged outbound URL
  internalHref: string | null; // "/reviews/<slug>" etc. when matched
  internalLabel: string | null;
  position: number;
}

export interface CardGroup {
  label: string;
  totalEstimate: string | null; // optional sum for project questions
  cards: Card[];
}

export interface Answer {
  question: string;
  answerHash: string;
  intent: string; // the planner's parsed intent summary (for demand analytics)
  intro: string;
  groups: CardGroup[];
}

/** One entry in the generated catalog index. */
export interface CatalogEntry {
  slug: string;
  kind: 'review' | 'category';
  href: string;
  label: string;
  brand?: string;
  category?: string;
  model?: string;
  asin?: string;
}
