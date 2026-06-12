import type { FaqItem } from '@/types/content';
import type { Project } from '@/types/project';
import type { Review } from '@/types/review';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
      author: { '@type': 'Organization', name: 'shabitools' },
      datePublished: r.datePublished,
      url: `${siteUrl}/reviews/${r.slug}`,
    },
  };
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
    totalTime: project.timeRequiredIso,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: (project.estCost.match(/\d+/) || ['0'])[0],
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
