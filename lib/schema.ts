import type { FaqItem } from '@/types/content';
import type { Guide, GuidePick } from '@/types/guide';
import type { Project } from '@/types/project';
import type { Review } from '@/types/review';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The named editorial team that authors reviews and guides (E-E-A-T author entity). */
function editorialOrg(siteUrl: string) {
  return {
    '@type': 'Organization' as const,
    name: 'shabitools Editorial Team',
    url: `${siteUrl}/about`,
  };
}

/** The publishing organization, with logo (required for several rich-result types). */
function publisherOrg(siteUrl: string) {
  return {
    '@type': 'Organization' as const,
    name: 'shabitools',
    url: siteUrl,
    logo: { '@type': 'ImageObject' as const, url: `${siteUrl}/images/logo.png` },
  };
}

export function productReviewJsonLd(r: Review, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product' as const,
    name: `${cap(r.brand)} ${r.model}`,
    brand: { '@type': 'Brand', name: cap(r.brand) },
    ...(r.image ? { image: `${siteUrl}${r.image}` } : {}),
    review: {
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      author: editorialOrg(siteUrl),
      publisher: publisherOrg(siteUrl),
      datePublished: r.datePublished,
      dateModified: r.dateModified,
      url: `${siteUrl}/reviews/${r.slug}`,
    },
  };
}

/** Article schema for buying guides — supplies an author and freshness dates that ItemList cannot. */
export function articleJsonLd(guide: Guide, siteUrl: string, imageUrl?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article' as const,
    headline: guide.title,
    datePublished: guide.datePublished,
    dateModified: guide.dateModified,
    author: editorialOrg(siteUrl),
    publisher: publisherOrg(siteUrl),
    mainEntityOfPage: `${siteUrl}/guides/${guide.slug}`,
    ...(imageUrl ? { image: imageUrl } : {}),
  };
}

/** Resolve a guide pick to its review page when one exists, else the guide itself. */
export function guidePickUrl(siteUrl: string, guideSlug: string, pick: GuidePick) {
  return pick.reviewSlug
    ? `${siteUrl}/reviews/${pick.reviewSlug}`
    : `${siteUrl}/guides/${guideSlug}`;
}

export function faqJsonLd(faq: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage' as const,
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList' as const,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function itemListJsonLd(name: string, items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList' as const,
    name,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function howToJsonLd(project: Project, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo' as const,
    name: project.title,
    description: project.description,
    datePublished: project.datePublished,
    dateModified: project.dateModified,
    totalTime: project.timeRequiredIso,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: (project.estCost.match(/\d+/) || ['0'])[0], // intentionally reports the LOW end of the estCost range
    },
    tool: project.toolsNeeded.map((t) => ({ '@type': 'HowToTool', name: t.name })),
    supply: project.materials.map((m) => ({ '@type': 'HowToSupply', name: m })),
    step: project.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${siteUrl}/projects/${project.slug}#step-${i + 1}`,
    })),
  };
}
