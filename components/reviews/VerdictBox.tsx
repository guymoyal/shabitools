import RatingStars from './RatingStars';

export default function VerdictBox({
  rating,
  bestFor,
  skipIf,
  priceRange,
}: {
  rating: number;
  bestFor: string;
  skipIf: string;
  priceRange: string;
}) {
  return (
    <aside className="mt-8 rounded-2xl border-2 border-amber-300 bg-amber-50 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-stone-900">Our verdict</h2>
        <div className="flex items-center gap-4">
          <RatingStars rating={rating} />
          <span className="rounded-full bg-stone-900 px-3 py-1 text-sm font-semibold text-white">
            {priceRange}
          </span>
        </div>
      </div>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-4">
          <dt className="font-semibold text-green-800">Buy it if…</dt>
          <dd className="mt-1 text-sm text-stone-700">{bestFor}</dd>
        </div>
        <div className="rounded-xl bg-white p-4">
          <dt className="font-semibold text-red-800">Skip it if…</dt>
          <dd className="mt-1 text-sm text-stone-700">{skipIf}</dd>
        </div>
      </dl>
    </aside>
  );
}
