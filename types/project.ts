import type { AffiliateLink, ContentDates, FaqItem } from './content';

export interface ProjectTool {
  name: string;
  reviewSlug?: string; // internal link to our review when we have one
  affiliate?: AffiliateLink;
}

export interface ProjectStep {
  name: string;
  text: string;
}

export interface Project extends ContentDates {
  slug: string;
  title: string;
  description: string; // 120–170 chars, used for meta description
  category: string; // category slug
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeRequired: string; // human, "4–6 hours"
  timeRequiredIso: string; // ISO 8601 for HowTo schema, "PT5H"
  estCost: string; // "$80–$140"
  toolsNeeded: ProjectTool[];
  materials: string[];
  steps: ProjectStep[]; // 5+
  faq: FaqItem[]; // 4+
  body: string; // markdown 700+ words: intro, planning, mistakes to avoid
  related: string[];
}
