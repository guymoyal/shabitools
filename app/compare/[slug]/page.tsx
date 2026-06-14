import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ComparisonTable from '@/components/compare/ComparisonTable';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Prose from '@/components/layout/Prose';
import AdSlot from '@/components/monetization/AdSlot';
import AffiliateCTA from '@/components/monetization/AffiliateCTA';
import WhereToBuyStrip from '@/components/monetization/WhereToBuyStrip';
import FAQSection from '@/components/seo/FAQSection';
import JsonLd from '@/components/seo/JsonLd';
import SiteImage from '@/components/ui/SiteImage';
import { getCompare, getCompares, getReview } from '@/lib/content';
import { getImage } from '@/lib/images';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/schema';
import { pageMetadata, ogImage, SITE_URL } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return getCompares().map((c) => ({ slug: c.slug }));
}

function shortLabel(c: { productA: { name: string }; productB: { name: string } }) {
  return `${c.productA.name} vs ${c.productB.name}`;
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const compare = getCompare(params.slug);
  if (!compare) return {};
  const description =
    compare.verdict.length > 150 ? `${compare.verdict.slice(0, 147).trimEnd()}...` : compare.verdict;
  const imageA = getImage(`reviews/${compare.productA.reviewSlug}`);
  return pageMetadata({
    title: compare.title,
    description,
    path: `/compare/${compare.slug}`,
    image: ogImage(imageA),
  });
}

export default function ComparePage({ params }: { params: { slug: string } }) {
  const compare = getCompare(params.slug);
  if (!compare) notFound();
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Compare', href: '/compare' },
    { name: shortLabel(compare), href: `/compare/${compare.slug}` },
  ];
  const winnerReview =
    compare.winner === 'tie'
      ? undefined
      : getReview(
          compare.winner === 'a' ? compare.productA.reviewSlug : compare.productB.reviewSlug
        );
  const imageA = getImage(`reviews/${compare.productA.reviewSlug}`);
  const imageB = getImage(`reviews/${compare.productB.reviewSlug}`);
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={[
          faqJsonLd(compare.faq),
          breadcrumbJsonLd(crumbs.map((c) => ({ name: c.name, url: `${SITE_URL}${c.href}` }))),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
        {compare.title}
      </h1>
      <div className="mt-3 text-sm text-stone-500">
        Updated <time dateTime={compare.dateModified}>{compare.dateModified}</time>
      </div>
      {(imageA || imageB) && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {[{ image: imageA, name: compare.productA.name }, { image: imageB, name: compare.productB.name }].map(
            ({ image, name }) => (
              <div key={name} className="flex flex-col gap-2">
                <div className="aspect-square overflow-hidden rounded-xl bg-stone-100">
                  <SiteImage
                    image={image}
                    sizes="(max-width: 640px) 50vw, 320px"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="text-center text-sm font-medium text-stone-700">{name}</p>
              </div>
            )
          )}
        </div>
      )}
      <aside className="mt-8 rounded-2xl border-2 border-amber-300 bg-amber-50 p-6">
        <h2 className="text-xl font-bold text-stone-900">The short answer</h2>
        <p className="mt-2 leading-relaxed text-stone-700">{compare.verdict}</p>
      </aside>
      <ComparisonTable compare={compare} />
      {winnerReview && (
        <AffiliateCTA links={winnerReview.affiliate} productName={winnerReview.model} />
      )}
      <Prose markdown={compare.body} />
      <AdSlot />
      <FAQSection faq={compare.faq} />
      {winnerReview && (
        <AffiliateCTA
          links={winnerReview.affiliate}
          productName={winnerReview.model}
          title={`Ready to buy the ${winnerReview.model}?`}
        />
      )}
      <WhereToBuyStrip />
    </article>
  );
}
