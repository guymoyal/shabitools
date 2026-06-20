// components/advisor/ProductCard.tsx
import type { Card } from '@/lib/advisor/types';

export default function ProductCard({ card }: { card: Card }) {
  return (
    <div className="flex flex-col rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-900">
      {card.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={card.imageUrl} alt={card.title} className="mb-3 h-40 w-full rounded-lg object-contain" />
      )}
      <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">{card.title}</h3>
      {card.price && <p className="mt-1 text-lg font-bold text-orange-600">{card.price}</p>}
      <p className="mt-2 flex-1 text-sm text-stone-600 dark:text-stone-300">{card.why}</p>
      <div className="mt-3 flex flex-col gap-2">
        <a
          href={`/api/click?asin=${card.asin}`}
          rel="sponsored nofollow noopener"
          target="_blank"
          className="rounded-lg bg-orange-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-orange-700"
        >
          View on Amazon &rarr;
        </a>
        {card.internalHref && (
          <a href={card.internalHref} className="text-center text-xs font-medium text-stone-500 underline">
            {card.internalLabel ? `Read our review: ${card.internalLabel}` : 'Read our review'}
          </a>
        )}
      </div>
    </div>
  );
}
