import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/layout/PageHero';
import IndexEditorial from '@/components/layout/IndexEditorial';
import JsonLd from '@/components/seo/JsonLd';
import { getBrands } from '@/lib/content';
import { itemListJsonLd } from '@/lib/schema';
import { pageMetadata, SITE_URL } from '@/lib/seo';
import { stripMarkdown } from '@/lib/text';

export const metadata: Metadata = pageMetadata({
  title: 'Power Tool Brands',
  description:
    'Brand guides to the major US power tool makers — Makita, Bosch, and more — covering battery platforms, pro versus DIY positioning, and what each brand is known for.',
  path: '/brands',
});

export default function BrandsPage() {
  const brands = getBrands();
  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          'Power tool brands',
          brands.map((b) => ({ name: b.name, url: `${SITE_URL}/brands/${b.slug}` }))
        )}
      />
      <PageHero
        title="Power tool brands"
        subtitle="Battery platforms, pro versus DIY positioning, and what each major brand is known for."
      />
      <IndexEditorial title="Brand guides">
        <p>
          Battery platform lock-in is one of the most expensive decisions in cordless tools. Brand
          hubs explain each manufacturer&apos;s voltage systems, pro versus homeowner positioning,
          warranty norms, and category strengths — so you can commit to an ecosystem with eyes open.
        </p>
        <p>
          Brand pages link to every review we have published for that maker. Use them as a starting
          point, then drill into categories or comparisons for model-level decisions.
        </p>
      </IndexEditorial>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => (
          <Link
            key={b.slug}
            href={`/brands/${b.slug}`}
            className="block rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <h2 className="text-lg font-bold text-stone-900">{b.name}</h2>
            <p className="mt-2 line-clamp-3 text-sm text-stone-600">
              {stripMarkdown(b.description).slice(0, 140)}…
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
