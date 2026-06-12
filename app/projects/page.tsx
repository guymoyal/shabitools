import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import ProjectCard from '@/components/projects/ProjectCard';
import JsonLd from '@/components/seo/JsonLd';
import { getProjects } from '@/lib/content';
import { itemListJsonLd } from '@/lib/schema';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'DIY Projects & Build Guides',
  description:
    'Step-by-step DIY project guides — workbenches, shelving, repairs and installs — with tool lists, materials, cost estimates, and clear instructions for every skill level.',
  path: '/projects',
});

export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          'DIY projects',
          projects.map((p) => ({ name: p.title, url: `${SITE_URL}/projects/${p.slug}` }))
        )}
      />
      <PageHero
        title="DIY projects & build guides"
        subtitle="Practical step-by-step builds and repairs — with the tools, materials, time, and cost laid out before you start."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </>
  );
}
