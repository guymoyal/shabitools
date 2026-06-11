import { expect, it } from 'vitest';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, productReviewJsonLd } from '../schema';
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
