import Link from 'next/link';
import SiteImage from '@/components/ui/SiteImage';
import { DIFFICULTY_STYLES } from '@/components/projects/difficulty';
import { getImage } from '@/lib/images';
import type { Project } from '@/types/project';

export default function ProjectCard({ project }: { project: Project }) {
  const image = getImage(`projects/${project.slug}`);
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
    >
      {image && (
        <div className="aspect-[3/2] overflow-hidden bg-stone-100">
          <SiteImage
            image={image}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <span
          className={`self-start rounded-full px-3 py-1 text-xs font-semibold capitalize ${DIFFICULTY_STYLES[project.difficulty]}`}
        >
          {project.difficulty}
        </span>
        <h3 className="mt-3 font-bold text-stone-900 group-hover:text-amber-700">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-stone-600">{project.description}</p>
        <p className="mt-auto pt-4 text-sm text-stone-500">
          {project.timeRequired} · {project.estCost}
        </p>
      </div>
    </Link>
  );
}
