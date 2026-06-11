export default function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      <span aria-hidden className="text-amber-500">
        {'★'.repeat(Math.round(rating))}
        <span className="text-stone-300">{'★'.repeat(5 - Math.round(rating))}</span>
      </span>
      <span className="text-sm font-semibold text-stone-700">{rating.toFixed(1)}/5</span>
    </span>
  );
}
