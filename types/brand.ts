import type { ContentDates, FaqItem } from './content';

export interface Brand extends ContentDates {
  slug: string;
  name: string;
  description: string; // markdown
  founded?: string;
  headquarters?: string;
  knownFor: string[];
  faq: FaqItem[];
}
