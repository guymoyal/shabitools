import { marked } from 'marked';

export default function Prose({ markdown }: { markdown: string }) {
  return (
    <div
      className="prose-shabi mt-8 max-w-none leading-relaxed text-stone-700 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-stone-900 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-stone-900 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1 [&_a]:text-amber-700 [&_a]:underline"
      dangerouslySetInnerHTML={{ __html: marked.parse(markdown, { async: false }) }}
    />
  );
}
