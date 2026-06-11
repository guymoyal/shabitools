import type { ContentDates, FaqItem } from './content';

export interface Category extends ContentDates {
  slug: string;
  name: string;
  description: string; // markdown
  buyingFactors: { title: string; text: string }[];
  faq: FaqItem[];
}
