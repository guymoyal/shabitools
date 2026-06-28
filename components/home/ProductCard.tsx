import Link from 'next/link';
import { TagIcon } from '@/components/ui/icons';
import { productUrl } from '@/lib/products';
import type { Product } from '@/types/product';

/**
 * A text/spec product card — deliberately no per-product image (real Amazon
 * product photos require PA-API; a generic category photo here would misrepresent
 * the specific product). Brand/model, price, a few features, and the buy CTA
 * carry the conversion.
 */
export default function ProductCard({
  product,
  reviewSlug,
}: {
  product: Product;
  reviewSlug?: string | null;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md">
      <h3 className="font-bold leading-snug text-stone-900 line-clamp-2">{product.title}</h3>
      {product.features.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-stone-600">
          {product.features.slice(0, 3).map((f, i) => (
            <li key={i} className="flex gap-1.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
              <span className="line-clamp-1">{f}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto pt-4">
        {product.price && (
          <p className="flex items-center gap-1.5 text-lg font-bold text-stone-900">
            <TagIcon className="h-4 w-4 text-amber-600" />
            {product.price}
          </p>
        )}
        <div className="mt-3 flex items-center gap-3">
          <a
            href={productUrl(product.asin)}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="flex-1 rounded-xl bg-amber-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow hover:bg-amber-700"
          >
            View on Amazon
          </a>
          {reviewSlug && (
            <Link
              href={`/reviews/${reviewSlug}`}
              className="shrink-0 text-sm font-medium text-amber-700 hover:text-amber-800"
            >
              Read review
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
