import Link from 'next/link';
import AffiliateCTA from '@/components/monetization/AffiliateCTA';
import type { ProjectTool } from '@/types/project';

export default function ToolsNeededBox({ tools }: { tools: ProjectTool[] }) {
  if (!tools.length) return null;
  return (
    <section className="mt-10 rounded-2xl border border-stone-200 bg-stone-50 p-6">
      <h2 className="text-xl font-bold text-stone-900">Tools you&apos;ll need</h2>
      <ul className="mt-4 space-y-3">
        {tools.map((tool) => (
          <li key={tool.name} className="text-stone-700">
            <span className="font-medium text-stone-900">{tool.name}</span>
            {tool.reviewSlug && (
              <>
                {' — '}
                <Link
                  href={`/reviews/${tool.reviewSlug}`}
                  className="font-medium text-amber-700 underline"
                >
                  our review
                </Link>
              </>
            )}
            {tool.affiliate && (
              <AffiliateCTA links={[tool.affiliate]} productName={tool.name} />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
