import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Prose from '@/components/layout/Prose';
import AdSlot from '@/components/monetization/AdSlot';
import AffiliateCTA from '@/components/monetization/AffiliateCTA';
import WhereToBuyStrip from '@/components/monetization/WhereToBuyStrip';
import ProsCons from '@/components/reviews/ProsCons';
import RatingStars from '@/components/reviews/RatingStars';
import SpecTable from '@/components/reviews/SpecTable';
import VerdictBox from '@/components/reviews/VerdictBox';
import FAQSection from '@/components/seo/FAQSection';
import JsonLd from '@/components/seo/JsonLd';
import { getReview, getReviews } from '@/lib/content';
import { breadcrumbJsonLd, faqJsonLd, productReviewJsonLd } from '@/lib/schema';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return getReviews().map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const review = getReview(params.slug);
  if (!review) return {};
  return pageMetadata({
    title: review.title,
    description: `${review.title}: rated ${review.rating}/5. ${review.bestFor}`,
    path: `/reviews/${review.slug}`,
  });
}

export default function ReviewPage({ params }: { params: { slug: string } }) {
  const review = getReview(params.slug);
  if (!review) notFound();
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Reviews', href: '/reviews' },
    { name: review.model, href: `/reviews/${review.slug}` },
  ];
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={[
          productReviewJsonLd(review, SITE_URL),
          faqJsonLd(review.faq),
          breadcrumbJsonLd(crumbs.map((c) => ({ name: c.name, url: `${SITE_URL}${c.href}` }))),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
        {review.title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-stone-500">
        <RatingStars rating={review.rating} />
        <span>
          Updated <time dateTime={review.dateModified}>{review.dateModified}</time>
        </span>
      </div>
      <VerdictBox
        rating={review.rating}
        bestFor={review.bestFor}
        skipIf={review.skipIf}
        priceRange={review.priceRange}
      />
      <AffiliateCTA links={review.affiliate} productName={review.model} />
      <SpecTable specs={review.specs} />
      <ProsCons pros={review.pros} cons={review.cons} />
      <Prose markdown={review.body} />
      <AdSlot slot="0000000000" />
      <FAQSection faq={review.faq} />
      <WhereToBuyStrip />
    </article>
  );
}
