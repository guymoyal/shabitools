import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import IndexEditorial from '@/components/layout/IndexEditorial';
import ReviewCard from '@/components/reviews/ReviewCard';
import JsonLd from '@/components/seo/JsonLd';
import { getReviews } from '@/lib/content';
import { itemListJsonLd } from '@/lib/schema';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Power Tool Reviews',
  description:
    'In-depth reviews of cordless drills, saws, and power tools from Makita, DeWalt, Bosch, and Milwaukee — with pros, cons, and clear buy/skip verdicts.',
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
      <IndexEditorial title="How we review power tools">
        <p>
          Each review on shabitools covers a single model in depth: verified specifications, honest
          pros and cons, a buy-if / skip-if summary, and answers to the questions shoppers actually
          ask before they spend. We compare the tool against its category peers on torque, battery
          platform, weight, warranty, and street price — not marketing bullet points.
        </p>
        <p>
          Ratings reflect overall value for a defined buyer, not a universal score. A 4.5-star drill
          might be perfect for a weekend DIYer and wrong for a daily framer. Use the verdict box and
          FAQ on each page to decide if a tool fits your work.
        </p>
      </IndexEditorial>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <ReviewCard key={r.slug} review={r} />
        ))}
      </div>
    </>
  );
}
