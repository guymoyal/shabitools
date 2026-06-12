import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/layout/PageHero';
import JsonLd from '@/components/seo/JsonLd';
import { getGuides } from '@/lib/content';
import { itemListJsonLd } from '@/lib/schema';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Tool Buying Guides',
  description:
    'Ranked cordless drill buying guides with a clear winner in every tier — best overall, best for beginners, and best budget picks, each with the reasoning behind the rank.',
  path: '/guides',
});

export default function GuidesPage() {
  const guides = getGuides();
  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          'Tool buying guides',
          guides.map((g) => ({ name: g.title, url: `${SITE_URL}/guides/${g.slug}` }))
        )}
      />
      <PageHero
        title="Tool buying guides"
        subtitle="Ranked picks with clear winners — and the reasoning behind every rank."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="block rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <h2 className="text-lg font-bold text-stone-900">{g.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm text-stone-600">{g.intro}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
