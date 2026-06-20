import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RankedPickCard from '@/components/guides/RankedPickCard';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Prose from '@/components/layout/Prose';
import AdSlot from '@/components/monetization/AdSlot';
import EditorialByline from '@/components/seo/EditorialByline';
import FAQSection from '@/components/seo/FAQSection';
import JsonLd from '@/components/seo/JsonLd';
import SiteImage from '@/components/ui/SiteImage';
import { getGuide, getGuides } from '@/lib/content';
import { getImage } from '@/lib/images';
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, guidePickUrl, itemListJsonLd } from '@/lib/schema';
import { pageMetadata, ogImage, SITE_URL } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

function shortTitle(title: string) {
  return title.replace(/\s*\(2026\)\s*$/, '').trim();
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = getGuide(params.slug);
  if (!guide) return {};
  const description =
    guide.intro.length > 150 ? `${guide.intro.slice(0, 147).trimEnd()}...` : guide.intro;
  return pageMetadata({
    title: guide.title,
    description,
    path: `/guides/${guide.slug}`,
    image: ogImage(getImage(`guides/${guide.slug}`)),
  });
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();
  const hero = getImage(`guides/${guide.slug}`);
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Guides', href: '/guides' },
    { name: shortTitle(guide.title), href: `/guides/${guide.slug}` },
  ];
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={[
          articleJsonLd(guide, SITE_URL, hero ? `${SITE_URL}${hero.src}` : undefined),
          itemListJsonLd(
            guide.title,
            guide.picks.map((p) => ({
              name: p.name,
              url: guidePickUrl(SITE_URL, guide.slug, p),
            }))
          ),
          faqJsonLd(guide.faq),
          breadcrumbJsonLd(crumbs.map((c) => ({ name: c.name, url: `${SITE_URL}${c.href}` }))),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      {hero && (
        <div className="mt-4 aspect-[3/1] overflow-hidden rounded-2xl bg-stone-100">
          <SiteImage
            image={hero}
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
        {guide.title}
      </h1>
      <div className="mt-3 text-sm text-stone-500">
        <EditorialByline dateModified={guide.dateModified} />
      </div>
      <p className="mt-4 text-lg leading-relaxed text-stone-700">{guide.intro}</p>
      {guide.picks.map((p) => (
        <RankedPickCard key={p.rank} pick={p} />
      ))}
      <Prose markdown={guide.body} />
      <AdSlot />
      <FAQSection faq={guide.faq} />
    </article>
  );
}
