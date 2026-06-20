/** Substantive intro copy on index/listing pages — helps AdSense reviewers see
 *  editorial value beyond card grids. */
export default function IndexEditorial({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-4">
      {title && <h2 className="text-xl font-bold text-stone-900">{title}</h2>}
      <div className="mt-3 space-y-4 text-base leading-relaxed text-stone-700">{children}</div>
    </section>
  );
}
