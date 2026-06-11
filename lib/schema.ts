import type { FaqItem } from '@/types/content';
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
