import { expect, it } from 'vitest';
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  guidePickUrl,
  itemListJsonLd,
  productReviewJsonLd,
} from '../schema';
import type { Guide } from '@/types/guide';
import type { Review } from '@/types/review';

const review = {
  slug: 'makita-xfd131',
  title: 'Makita XFD131 Review',
  brand: 'makita',
  category: 'cordless-drills',
  model: 'XFD131',
  rating: 4.5,
  priceRange: '$150–$200',
  affiliate: [],
  pros: [],
  cons: [],
  bestFor: '',
  skipIf: '',
  specs: {},
  faq: [],
  body: '',
  datePublished: '2026-06-12',
  dateModified: '2026-06-12',
  related: [],
} satisfies Review;

it('productReviewJsonLd nests a Review with rating inside a Product', () => {
  const ld = productReviewJsonLd(review, 'https://shabitools.com');
  expect(ld['@type']).toBe('Product');
  expect(ld.brand).toEqual({ '@type': 'Brand', name: 'Makita' });
  expect(ld.review.reviewRating.ratingValue).toBe(4.5);
  expect(ld.review.datePublished).toBe('2026-06-12');
});

it('productReviewJsonLd carries dateModified, an editorial author, and a publisher', () => {
  const ld = productReviewJsonLd(review, 'https://shabitools.com');
  expect(ld.review.dateModified).toBe('2026-06-12');
  expect(ld.review.author).toMatchObject({
    '@type': 'Organization',
    name: 'shabitools Editorial Team',
    url: 'https://shabitools.com/about',
  });
  expect(ld.review.publisher).toMatchObject({ '@type': 'Organization', name: 'shabitools' });
  expect(ld.review.publisher.logo['@type']).toBe('ImageObject');
});

const guide = {
  slug: 'best-cordless-drill-2026',
  title: 'Best Cordless Drills (2026)',
  category: 'cordless-drills',
  intro: 'Our top picks.',
  picks: [
    { rank: 1, awardLabel: 'Best overall', name: 'Makita XFD131', reviewSlug: 'makita-xfd131', summary: '', pros: [], cons: [] },
    { rank: 2, awardLabel: 'Best budget', name: 'No-review pick', summary: '', pros: [], cons: [] },
  ],
  faq: [],
  body: '',
  related: [],
  datePublished: '2026-06-10',
  dateModified: '2026-06-14',
} satisfies Guide;

it('articleJsonLd carries headline, both dates, editorial author and publisher', () => {
  const ld = articleJsonLd(guide, 'https://shabitools.com');
  expect(ld['@type']).toBe('Article');
  expect(ld.headline).toBe('Best Cordless Drills (2026)');
  expect(ld.datePublished).toBe('2026-06-10');
  expect(ld.dateModified).toBe('2026-06-14');
  expect(ld.author).toMatchObject({ '@type': 'Organization', name: 'shabitools Editorial Team' });
  expect(ld.publisher).toMatchObject({ '@type': 'Organization', name: 'shabitools' });
  expect(ld.mainEntityOfPage).toBe('https://shabitools.com/guides/best-cordless-drill-2026');
});

it('articleJsonLd includes image only when provided', () => {
  expect('image' in articleJsonLd(guide, 'https://shabitools.com')).toBe(false);
  const withImage = articleJsonLd(guide, 'https://shabitools.com', 'https://shabitools.com/img.jpg');
  expect(withImage.image).toBe('https://shabitools.com/img.jpg');
});

it('guidePickUrl points to the review when reviewSlug is set, else the guide', () => {
  expect(guidePickUrl('https://shabitools.com', guide.slug, guide.picks[0])).toBe(
    'https://shabitools.com/reviews/makita-xfd131'
  );
  expect(guidePickUrl('https://shabitools.com', guide.slug, guide.picks[1])).toBe(
    'https://shabitools.com/guides/best-cordless-drill-2026'
  );
});

it('faqJsonLd maps Q/A pairs', () => {
  const ld = faqJsonLd([{ q: 'Is it good?', a: 'Yes.' }]);
  expect(ld['@type']).toBe('FAQPage');
  expect(ld.mainEntity[0].acceptedAnswer.text).toBe('Yes.');
});

it('breadcrumbJsonLd numbers positions from 1', () => {
  const ld = breadcrumbJsonLd([
    { name: 'Home', url: 'https://shabitools.com' },
    { name: 'Reviews', url: 'https://shabitools.com/reviews' },
  ]);
  expect(ld.itemListElement[1]).toMatchObject({ position: 2, name: 'Reviews' });
});

it('itemListJsonLd orders items', () => {
  const ld = itemListJsonLd('Best drills', [{ name: 'A', url: 'https://x.com/a' }]);
  expect(ld.itemListElement[0]).toMatchObject({ position: 1, name: 'A' });
});
