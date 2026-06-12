import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StoreLanding from '@/components/landings/StoreLanding';
import JsonLd from '@/components/seo/JsonLd';
import { getStoreLanding, getStoreLandings } from '@/lib/content';
import { faqJsonLd } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  const landings = getStoreLandings();
  // Next 14 export fails on an empty array — emit a placeholder that 404s.
  if (!landings.length) return [{ slug: '__placeholder' }];
  return landings.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const landing = getStoreLanding(params.slug);
  if (!landing) return { robots: { index: false } };
  return pageMetadata({
    title: landing.content?.metaTitle ?? `${landing.name} — Tools & Deals`,
    description:
      landing.content?.metaDescription ??
      `Shop ${landing.name} for power tools and home-improvement gear.`,
    path: `/stores/${landing.slug}`,
  });
}

export default function StorePage({ params }: { params: { slug: string } }) {
  const landing = getStoreLanding(params.slug);
  if (!landing) notFound();
  return (
    <>
      {landing.content?.faq?.length ? <JsonLd data={faqJsonLd(landing.content.faq)} /> : null}
      <StoreLanding landing={landing} />
    </>
  );
}
