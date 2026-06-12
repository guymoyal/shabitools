import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/layout/PageHero';
import JsonLd from '@/components/seo/JsonLd';
import { getCategories } from '@/lib/content';
import { itemListJsonLd } from '@/lib/schema';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Tool Categories',
  description:
    'Power tool category guides covering what each tool type does, how the variants differ, and the buying factors that matter most before you choose.',
  path: '/categories',
});

function stripMarkdown(md: string) {
  return md
    .replace(/^#{1,6}\s+.*$/gm, '')
    .replace(/[*_`>#-]/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

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
