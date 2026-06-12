import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import JsonLd from '@/components/seo/JsonLd';
import { getStoreLandings } from '@/lib/content';
import { itemListJsonLd } from '@/lib/schema';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Tool Stores & Deals',
  description:
    'Online stores we link to for power tools, hand tools, and home-improvement gear — with current programs and deals.',
  path: '/stores',
});

export default function StoresPage() {
  const stores = getStoreLandings();
  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          'Tool stores',
          stores.map((s) => ({ name: s.name, url: `${SITE_URL}/stores/${s.slug}` }))
        )}
      />
      <PageHero
        title="Tool stores & deals"
        subtitle="Stores we partner with. Links are sponsored — see our affiliate disclosure."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {stores.length === 0 && (
          <p className="text-stone-600">Store pages are coming soon — check back shortly.</p>
        )}
        {stores.map((s) => (
          <Link
            key={s.slug}
            href={`/stores/${s.slug}`}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm hover:border-amber-300 hover:shadow-md"
          >
            <h2 className="font-bold text-stone-900">{s.name}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-stone-600">
              {s.content?.subheadline ?? s.description ?? ''}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
