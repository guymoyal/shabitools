export interface LandingCopy {
  headline: string;
  subheadline: string;
  intro: string;
  benefits: string[];
  howItWorks: string[];
  faq: { q: string; a: string }[];
  ctaLabel: string;
  metaTitle: string;
  metaDescription: string;
}

export interface StoreLanding {
  slug: string;
  name: string;
  siteUrl: string;
  image?: string;
  description?: string;
  admitad: { gotolink: string | null; cpcGotolink?: string | null };
  content: LandingCopy | null;
}
