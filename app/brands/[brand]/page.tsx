import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Prose from '@/components/layout/Prose';
import ReviewCard from '@/components/reviews/ReviewCard';
import FAQSection from '@/components/seo/FAQSection';
import JsonLd from '@/components/seo/JsonLd';
import { getBrand, getBrands, getReviews } from '@/lib/content';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/schema';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return getBrands().map((b) => ({ brand: b.slug }));
}

export function generateMetadata({ params }: { params: { brand: string } }): Metadata {
  const brand = getBrand(params.brand);
  if (!brand) notFound();
  const description = `${brand.name} power tools brand guide — ${brand.knownFor
    .slice(0, 3)
    .join(', ')}, and who should choose ${brand.name}.`;
  return pageMetadata({
    title: `${brand.name} Power Tools — Brand Guide`,
    description,
    path: `/brands/${brand.slug}`,
  });
}

export default function BrandPage({ params }: { params: { brand: string } }) {
  const brand = getBrand(params.brand);
  if (!brand) notFound();
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Brands', href: '/brands' },
    { name: brand.name, href: `/brands/${brand.slug}` },
  ];
  const reviews = getReviews().filter((r) => r.brand === params.brand);
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={[
          faqJsonLd(brand.faq),
          breadcrumbJsonLd(crumbs.map((c) => ({ name: c.name, url: `${SITE_URL}${c.href}` }))),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
        {brand.name} power tools
      </h1>
      <div className="mt-3 text-sm text-stone-500">
        Updated <time dateTime={brand.dateModified}>{brand.dateModified}</time>
      </div>
      <Prose markdown={brand.description} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-stone-900">Known for</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {brand.knownFor.map((k) => (
            <li
              key={k}
              className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-800"
            >
              {k}
            </li>
          ))}
        </ul>
      </div>
      {reviews.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-stone-900">{brand.name} reviews</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {reviews.map((r) => (
              <ReviewCard key={r.slug} review={r} />
            ))}
          </div>
        </section>
      )}
      <FAQSection faq={brand.faq} />
    </article>
  );
}
