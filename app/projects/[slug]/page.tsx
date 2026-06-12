import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Prose from '@/components/layout/Prose';
import AdSlot from '@/components/monetization/AdSlot';
import StepList from '@/components/projects/StepList';
import ToolsNeededBox from '@/components/projects/ToolsNeededBox';
import { DIFFICULTY_STYLES } from '@/components/projects/difficulty';
import FAQSection from '@/components/seo/FAQSection';
import JsonLd from '@/components/seo/JsonLd';
import SiteImage from '@/components/ui/SiteImage';
import { getProject, getProjects, resolveRelated } from '@/lib/content';
import { getImage } from '@/lib/images';
import { breadcrumbJsonLd, faqJsonLd, howToJsonLd } from '@/lib/schema';
import { pageMetadata, ogImage, SITE_URL } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};
  return pageMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
    image: ogImage(getImage(`projects/${project.slug}`)),
  });
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();
  const hero = getImage(`projects/${project.slug}`);
  const related = resolveRelated(project.related);
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: project.title, href: `/projects/${project.slug}` },
  ];
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={[
          howToJsonLd(project, SITE_URL),
          faqJsonLd(project.faq),
          breadcrumbJsonLd(crumbs.map((c) => ({ name: c.name, url: `${SITE_URL}${c.href}` }))),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      {hero && (
        <div className="mt-4 aspect-[3/2] overflow-hidden rounded-2xl bg-stone-100">
          <SiteImage
            image={hero}
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
        {project.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-stone-700">{project.description}</p>
      <div className="mt-3 text-sm text-stone-500">
        Published <time dateTime={project.datePublished}>{project.datePublished}</time>
        {project.dateModified !== project.datePublished && (
          <>
            {' · Updated '}
            <time dateTime={project.dateModified}>{project.dateModified}</time>
          </>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Difficulty</p>
          <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold capitalize ${DIFFICULTY_STYLES[project.difficulty]}`}
          >
            {project.difficulty}
          </span>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Time</p>
          <p className="mt-2 font-semibold text-stone-900">{project.timeRequired}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Est. cost</p>
          <p className="mt-2 font-semibold text-stone-900">{project.estCost}</p>
        </div>
      </div>

      <ToolsNeededBox tools={project.toolsNeeded} />

      <section className="mt-10">
        <h2 className="text-xl font-bold text-stone-900">Materials</h2>
        <ul className="mt-4 space-y-2">
          {project.materials.map((m) => (
            <li key={m} className="flex items-start gap-2 text-stone-700">
              <span aria-hidden className="mt-0.5 font-bold text-green-700">
                ✓
              </span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </section>

      <StepList steps={project.steps} />
      <Prose markdown={project.body} />
      <AdSlot slot="0000000000" />
      <FAQSection faq={project.faq} />

      {related.length > 0 && (
        <section className="mt-12 border-t border-stone-200 pt-8">
          <h2 className="text-xl font-bold text-stone-900">Related reading</h2>
          <ul className="mt-4 space-y-2">
            {related.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="font-medium text-amber-700 underline">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
