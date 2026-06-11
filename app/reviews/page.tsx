import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import ReviewCard from '@/components/reviews/ReviewCard';
import JsonLd from '@/components/seo/JsonLd';
import { getReviews } from '@/lib/content';
import { itemListJsonLd } from '@/lib/schema';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Power Tool Reviews',
  description:
    'Hands-on style reviews of cordless drills, saws, and power tools from Makita, DeWalt, Bosch, and Milwaukee — with pros, cons, and clear buy/skip verdicts.',
  path: '/reviews',
});

export default function ReviewsPage() {
  const reviews = getReviews();
  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          'Power tool reviews',
          reviews.map((r) => ({ name: r.title, url: `${SITE_URL}/reviews/${r.slug}` }))
        )}
      />
      <PageHero
        title="Power tool reviews"
        subtitle="Every review ends with a clear verdict: buy it, or skip it — and what to get instead."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <ReviewCard key={r.slug} review={r} />
        ))}
      </div>
    </>
  );
}
