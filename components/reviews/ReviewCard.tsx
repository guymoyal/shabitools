import Link from 'next/link';
import SiteImage from '@/components/ui/SiteImage';
import { getImage } from '@/lib/images';
import type { Review } from '@/types/review';
import RatingStars from './RatingStars';

export default function ReviewCard({ review }: { review: Review }) {
  const image = getImage(`reviews/${review.slug}`);
  return (
    <Link
      href={`/reviews/${review.slug}`}
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
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
          {review.category.replace(/-/g, ' ')}
        </p>
        <h3 className="mt-2 font-bold text-stone-900 group-hover:text-amber-700">{review.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-stone-600">{review.bestFor}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <RatingStars rating={review.rating} />
          <span className="text-sm text-stone-500">{review.priceRange}</span>
        </div>
      </div>
    </Link>
  );
}
