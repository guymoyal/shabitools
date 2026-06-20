import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Prose from '@/components/layout/Prose';
import AdSlot from '@/components/monetization/AdSlot';
import AffiliateCTA from '@/components/monetization/AffiliateCTA';
import ProsCons from '@/components/reviews/ProsCons';
import RatingStars from '@/components/reviews/RatingStars';
import SpecTable from '@/components/reviews/SpecTable';
import VerdictBox from '@/components/reviews/VerdictBox';
import EditorialByline from '@/components/seo/EditorialByline';
import FAQSection from '@/components/seo/FAQSection';
import JsonLd from '@/components/seo/JsonLd';
import SiteImage from '@/components/ui/SiteImage';
import { getReview, getReviews } from '@/lib/content';
import { getImage } from '@/lib/images';
import { breadcrumbJsonLd, faqJsonLd, productReviewJsonLd } from '@/lib/schema';
import { pageMetadata, ogImage, SITE_URL } from '@/lib/seo';

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
    image: ogImage(getImage(`reviews/${review.slug}`)),
  });
}

export default function ReviewPage({ params }: { params: { slug: string } }) {
  const review = getReview(params.slug);
  if (!review) notFound();
  const hero = getImage(`reviews/${review.slug}`);
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
        <EditorialByline dateModified={review.dateModified} />
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto]">
        <VerdictBox
          rating={review.rating}
          bestFor={review.bestFor}
          skipIf={review.skipIf}
          priceRange={review.priceRange}
        />
        {hero && (
          <div className="order-first sm:order-last sm:w-52 aspect-square overflow-hidden rounded-2xl bg-stone-100 shrink-0">
            <SiteImage
              image={hero}
              priority
              sizes="(max-width: 640px) 100vw, 208px"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
      <SpecTable specs={review.specs} />
      <ProsCons pros={review.pros} cons={review.cons} />
      <Prose markdown={review.body} />
      <AdSlot />
      <FAQSection faq={review.faq} />
      <AffiliateCTA
        links={review.affiliate}
        productName={review.model}
        title={`Ready to buy the ${review.model}?`}
      />
    </article>
  );
}
