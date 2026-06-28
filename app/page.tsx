import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import TrustStrip from '@/components/layout/TrustStrip';
import ProjectCard from '@/components/projects/ProjectCard';
import CategoryProductGrid from '@/components/home/CategoryProductGrid';
import SiteImage from '@/components/ui/SiteImage';
import HeroAdvisorSearch from '@/components/advisor/HeroAdvisorSearch';
import { getCategories, getGuides, getProjects } from '@/lib/content';
import { getImage } from '@/lib/images';
import { pageMetadata, ogImage } from '@/lib/seo';

const heroImage = getImage('home/hero');

export const metadata: Metadata = pageMetadata({
  title: 'shabitools — Honest Home & Power Tool Reviews',
  description:
    'Independent reviews, head-to-head comparisons, and buying guides for Makita, DeWalt, Bosch, and Milwaukee power tools. Clear verdicts: buy it or skip it.',
  path: '',
  ogType: 'website',
  image: ogImage(heroImage),
});

export default function HomePage() {
  const guides = getGuides().slice(0, 3);
  const projects = getProjects().slice(0, 3);
  const categories = getCategories();
  return (
    <>
      <PageHero
        title="Power tool reviews you can actually use"
        subtitle="We test the claims, compare the specs, and end every review with a straight answer: buy it, or skip it."
      >
        {heroImage && (
          <div className="mt-6 overflow-hidden rounded-2xl bg-stone-100 aspect-[16/5]">
            <SiteImage
              image={heroImage}
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <HeroAdvisorSearch />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/guides/best-cordless-drill-2026"
            className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white shadow hover:bg-amber-700"
          >
            Best cordless drills 2026
          </Link>
          <Link
            href="/reviews"
            className="rounded-xl border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-800 hover:border-amber-400"
          >
            Browse all reviews
          </Link>
        </div>
      </PageHero>
      <TrustStrip />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-stone-900">Shop the best tools by category</h2>
        <p className="mt-2 max-w-2xl text-stone-600">
          Hand-picked top sellers in every category, each linking straight to Amazon — plus our
          in-depth reviews and buying guides where we have them.
        </p>
        <div className="mt-8">
          <CategoryProductGrid />
        </div>
        {projects.length > 0 && (
          <>
            <div className="mt-14 flex items-end justify-between">
              <h2 className="text-2xl font-bold text-stone-900">Build something this weekend</h2>
              <Link href="/projects" className="text-sm font-medium text-amber-700 hover:text-amber-800">
                All projects →
              </Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </>
        )}
        <h2 className="mt-14 text-2xl font-bold text-stone-900">Buying guides</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm hover:border-amber-300 hover:shadow-md"
            >
              <h3 className="font-bold text-stone-900">{g.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-stone-600">{g.intro}</p>
            </Link>
          ))}
        </div>
        <h2 className="mt-14 text-2xl font-bold text-stone-900">Shop by category</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="rounded-full border border-stone-300 px-5 py-2 font-medium text-stone-700 hover:border-amber-400 hover:text-amber-700"
            >
              {c.name}
            </Link>
          ))}
        </div>
        <section className="mt-14 rounded-2xl border border-stone-200 bg-stone-50 p-8">
          <h2 className="text-xl font-bold text-stone-900">What you&apos;ll find here</h2>
          <p className="mt-3 max-w-3xl text-stone-700 leading-relaxed">
            Every review ends with a clear buy-or-skip verdict. Comparisons pick a winner on stated
            criteria. Buying guides rank tools by use case — beginner, pro, budget, and best overall.
            DIY projects walk through builds and repairs with tool lists, materials, and realistic
            time estimates. We publish for readers, not algorithms — but we structure content so you
            can scan specs, FAQs, and recommendations quickly.
          </p>
          <p className="mt-3 text-sm text-stone-600">
            Read our{' '}
            <Link href="/editorial-policy" className="font-medium text-amber-700 hover:text-amber-800">
              editorial policy
            </Link>{' '}
            to see exactly how we research and rate tools.
          </p>
        </section>
      </div>
    </>
  );
}
