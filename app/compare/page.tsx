import type { Metadata } from 'next';
import CompareCard from '@/components/compare/CompareCard';
import PageHero from '@/components/layout/PageHero';
import JsonLd from '@/components/seo/JsonLd';
import { getCompares } from '@/lib/content';
import { itemListJsonLd } from '@/lib/schema';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Tool Comparisons',
  description:
    'Head-to-head cordless drill comparisons from Makita, DeWalt, Bosch, and Milwaukee — each decided on torque, kit value, and real-world fit with a clear winner.',
  path: '/compare',
});

export default function ComparePage() {
  const compares = getCompares();
  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          'Tool comparisons',
          compares.map((c) => ({ name: c.title, url: `${SITE_URL}/compare/${c.slug}` }))
        )}
      />
      <PageHero
        title="Tool comparisons"
        subtitle="Two tools, one winner — decided on specs, value, and real-world fit."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {compares.map((c) => (
          <CompareCard key={c.slug} compare={c} />
        ))}
      </div>
    </>
  );
}
