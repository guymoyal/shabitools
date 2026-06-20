import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/layout/PageHero';
import IndexEditorial from '@/components/layout/IndexEditorial';
import JsonLd from '@/components/seo/JsonLd';
import { getCategories } from '@/lib/content';
import { itemListJsonLd } from '@/lib/schema';
import { pageMetadata, SITE_URL } from '@/lib/seo';
import { stripMarkdown } from '@/lib/text';

export const metadata: Metadata = pageMetadata({
  title: 'Tool Categories',
  description:
    'Power tool category guides covering what each tool type does, how the variants differ, and the buying factors that matter most before you choose.',
  path: '/categories',
});

export default function CategoriesPage() {
  const categories = getCategories();
  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          'Tool categories',
          categories.map((c) => ({ name: c.name, url: `${SITE_URL}/categories/${c.slug}` }))
        )}
      />
      <PageHero
        title="Tool categories"
        subtitle="What each tool type does, how the variants differ, and the factors that matter when you buy."
      />
      <IndexEditorial title="Category buying guides">
        <p>
          Not sure which type of tool you need? Category hubs explain what cordless drills, miter
          saws, impact drivers, and other tool classes actually do, how sub-types differ, and which
          specs matter most when you shop. Each hub includes buying factors, FAQs, and links to our
          reviews in that category.
        </p>
        <p>
          Start here if you are early in the purchase journey. Move to comparisons or buying guides
          when you know the category and want a specific model recommendation.
        </p>
      </IndexEditorial>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="block rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <h2 className="text-lg font-bold text-stone-900">{c.name}</h2>
            <p className="mt-2 line-clamp-3 text-sm text-stone-600">
              {stripMarkdown(c.description).slice(0, 140)}…
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
