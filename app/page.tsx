import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import WhereToBuyStrip from '@/components/monetization/WhereToBuyStrip';
import ProjectCard from '@/components/projects/ProjectCard';
import ReviewCard from '@/components/reviews/ReviewCard';
import { getCategories, getGuides, getProjects, getReviews } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'shabitools — Honest Home & Power Tool Reviews',
  description:
    'Independent reviews, head-to-head comparisons, and buying guides for Makita, DeWalt, Bosch, and Milwaukee power tools. Clear verdicts: buy it or skip it.',
  path: '',
  ogType: 'website',
});

export default function HomePage() {
  const reviews = getReviews().slice(0, 6);
  const guides = getGuides().slice(0, 3);
  const projects = getProjects().slice(0, 3);
  const categories = getCategories();
  return (
    <>
      <PageHero
        title="Power tool reviews you can actually use"
        subtitle="We test the claims, compare the specs, and end every review with a straight answer: buy it, or skip it."
      >
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
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-stone-900">Latest reviews</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <ReviewCard key={r.slug} review={r} />
          ))}
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
        <WhereToBuyStrip max={8} />
      </div>
    </>
  );
}
