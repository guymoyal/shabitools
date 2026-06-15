import Link from 'next/link';
import { ScaleIcon, TrophyIcon } from '@/components/ui/icons';
import type { Compare } from '@/types/compare';

export default function CompareCard({ compare }: { compare: Compare }) {
  const { productA, productB, winner } = compare;
  return (
    <Link
      href={`/compare/${compare.slug}`}
      className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
    >
      {/* Head-to-head header: two tinted panels with a VS badge over the seam */}
      <div className="relative grid grid-cols-2 items-center">
        {/* Winner ribbon pinned to the top corner of the winning side */}
        {winner !== 'tie' && (
          <span
            className={`absolute top-2 z-20 inline-flex items-center gap-1 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow ${
              winner === 'a' ? 'left-2' : 'right-2'
            }`}
          >
            <TrophyIcon className="h-3 w-3" />
            Winner
          </span>
        )}
        <div className="flex min-h-[7rem] items-center justify-end bg-gradient-to-br from-sky-50 to-sky-100 p-5 pr-9 text-right">
          <span className="block text-[13px] font-bold leading-snug text-stone-900 [text-wrap:balance]">
            {productA.name}
          </span>
        </div>
        <div className="flex min-h-[7rem] items-center justify-start bg-gradient-to-bl from-amber-50 to-amber-100 p-5 pl-9 text-left">
          <span className="block text-[13px] font-bold leading-snug text-stone-900 [text-wrap:balance]">
            {productB.name}
          </span>
        </div>
        <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-sm font-black uppercase text-white shadow-lg ring-4 ring-white">
            VS
          </span>
        </span>
      </div>
      <div className="p-5">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
          <ScaleIcon className="h-4 w-4 text-amber-600" />
          {compare.category.replace(/-/g, ' ')} comparison
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-stone-600 group-hover:text-stone-800">
          {compare.verdict}
        </p>
      </div>
    </Link>
  );
}
