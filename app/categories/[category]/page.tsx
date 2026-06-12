import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Prose from '@/components/layout/Prose';
import ReviewCard from '@/components/reviews/ReviewCard';
import FAQSection from '@/components/seo/FAQSection';
import JsonLd from '@/components/seo/JsonLd';
import { getCategories, getCategory, getReviews } from '@/lib/content';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/schema';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const category = getCategory(params.category);
  if (!category) return {};
  const description = `${category.name} buying guide — what they do, how the variants differ, and the key factors to weigh before you buy.`;
  return pageMetadata({
    title: `${category.name} — Buying Guide`,
    description,
    path: `/categories/${category.slug}`,
  });
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = getCategory(params.category);
  if (!category) notFound();
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: category.name, href: `/categories/${category.slug}` },
  ];
  const reviews = getReviews().filter((r) => r.category === params.category);
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={[
          faqJsonLd(category.faq),
          breadcrumbJsonLd(crumbs.map((c) => ({ name: c.name, url: `${SITE_URL}${c.href}` }))),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
        {category.name}
      </h1>
      <div className="mt-3 text-sm text-stone-500">
        Updated <time dateTime={category.dateModified}>{category.dateModified}</time>
      </div>
      <Prose markdown={category.description} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {category.buyingFactors.map((f) => (
          <div key={f.title} className="rounded-xl border border-stone-200 bg-white p-5">
            <h3 className="font-bold text-stone-900">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{f.text}</p>
          </div>
        ))}
      </div>
      {reviews.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-stone-900">{category.name} reviews</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {reviews.map((r) => (
              <ReviewCard key={r.slug} review={r} />
            ))}
          </div>
        </section>
      )}
      <FAQSection faq={category.faq} />
    </article>
  );
}
