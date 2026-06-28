import Link from 'next/link';
import SiteImage from '@/components/ui/SiteImage';
import ProductCard from '@/components/home/ProductCard';
import { getProductsByCategory, reviewSlugForProduct } from '@/lib/products';
import { getReviews } from '@/lib/content';
import { getImage } from '@/lib/images';

/**
 * Homepage storefront: one section per category. A category photo serves as a
 * section BANNER (not a per-product image), then a grid of text/spec product
 * cards with affiliate buy links.
 */
export default function CategoryProductGrid({ perCategory = 10 }: { perCategory?: number }) {
  const groups = getProductsByCategory(perCategory);
  const reviews = getReviews();

  return (
    <div className="space-y-14">
      {groups.map(({ slug, name, hasPage, products }) => {
        const banner = hasPage ? getImage(`categories/${slug}`) : null;
        const bannerInner = (
          <>
            {banner && (
              <SiteImage
                image={banner}
                className="absolute inset-0 h-full w-full object-cover opacity-55 transition group-hover:opacity-65"
              />
            )}
            <div className="relative z-10 p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-white drop-shadow sm:text-3xl">{name}</h2>
              <p className="mt-1 text-sm font-medium text-amber-200">
                Top {products.length} picks{hasPage ? ' · buying guide →' : ''}
              </p>
            </div>
          </>
        );
        const bannerClass =
          'group relative flex items-end overflow-hidden rounded-2xl bg-gradient-to-br from-stone-700 to-stone-900 aspect-[16/3]';
        return (
          <section key={slug} id={slug} className="scroll-mt-20">
            {hasPage ? (
              <Link href={`/categories/${slug}`} className={bannerClass}>
                {bannerInner}
              </Link>
            ) : (
              <div className={bannerClass}>{bannerInner}</div>
            )}
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.asin} product={p} reviewSlug={reviewSlugForProduct(p, reviews)} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
