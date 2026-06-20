import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import IndexEditorial from '@/components/layout/IndexEditorial';
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
      <IndexEditorial title="Step-by-step DIY projects">
        <p>
          Project guides are informational first: what to build or fix, what tools and materials you
          need, how long it takes, and what it should cost. Steps follow conventional DIY practice
          with safety notes where relevant. When we recommend a specific tool model, we link to our
          review so you can verify it fits the job.
        </p>
        <p>
          Projects complement our tool reviews — they show how gear gets used in real work, not just
          on a spec sheet. Filter by difficulty and time on each project page before you commit to a
          weekend build.
        </p>
      </IndexEditorial>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </>
  );
}
