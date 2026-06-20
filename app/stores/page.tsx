import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import JsonLd from '@/components/seo/JsonLd';
import { getStoreLandings } from '@/lib/content';
import { hasStoreLandings } from '@/lib/stores';
import { itemListJsonLd } from '@/lib/schema';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export function generateMetadata(): Metadata {
  const meta = pageMetadata({
    title: 'Tool Stores & Deals',
    description:
      'Online stores we link to for power tools, hand tools, and home-improvement gear — with current programs and deals.',
    path: '/stores',
  });
  if (!hasStoreLandings()) {
    return { ...meta, robots: { index: false, follow: true } };
  }
  return meta;
}

export default function StoresPage() {
  const stores = getStoreLandings();
  return (
    <>
      {stores.length > 0 && (
        <JsonLd
          data={itemListJsonLd(
            'Tool stores',
            stores.map((s) => ({ name: s.name, url: `${SITE_URL}/stores/${s.slug}` }))
          )}
        />
      )}
      <PageHero
        title="Tool stores & deals"
        subtitle="Stores we partner with. Links are sponsored — see our affiliate disclosure."
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        {stores.length === 0 ? (
          <>
            <p className="text-stone-700 leading-relaxed">
              We are preparing curated store pages with current deals and program details. In the
              meantime, use our reviews and buying guides to choose the right tool — each article
              links to retailers when we have a verified affiliate program.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/reviews"
                className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-700"
              >
                Browse reviews
              </Link>
              <Link
                href="/guides"
                className="rounded-xl border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-800 hover:border-amber-400"
              >
                Buying guides
              </Link>
            </div>
          </>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        )}
      </div>
    </>
  );
}
