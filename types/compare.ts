import type { ContentDates, FaqItem } from './content';

export interface CompareRow {
  label: string;
  a: string;
  b: string;
  advantage?: 'a' | 'b' | 'tie';
}

export interface Compare extends ContentDates {
  slug: string;
  title: string;
  category: string;
  productA: { reviewSlug: string; name: string };
  productB: { reviewSlug: string; name: string };
  winner: 'a' | 'b' | 'tie';
  verdict: string; // 2–3 sentence direct answer (AEO)
  rows: CompareRow[];
  faq: FaqItem[];
  body: string;
  related: string[];
}
