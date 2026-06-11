export default function PageHero({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-stone-200 bg-gradient-to-br from-amber-50 via-stone-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-3 max-w-2xl text-lg text-stone-600">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
