import productsJson from '@/content/products.json';
import type { Product } from '@/types/product';
import type { Review } from '@/types/review';
import { getCategories, getReviews } from '@/lib/content';
import { AMAZON_TAG } from '@/lib/affiliate';

/** All curated products (the same catalog the AI advisor searches). */
export function getProducts(): Product[] {
  return productsJson as Product[];
}

/** A tagged Amazon outbound URL for one ASIN. */
export function productUrl(asin: string, tag: string = AMAZON_TAG): string {
  return tag
    ? `https://www.amazon.com/dp/${asin}?tag=${tag}`
    : `https://www.amazon.com/dp/${asin}`;
}

export interface CategoryProducts {
  slug: string;
  name: string;
  hasPage: boolean; // true when a /categories/<slug> page exists
  products: Product[];
}

function titleize(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Group products by category for the homepage grid. Categories that have a real
 * site page come first (in site order) and expose `hasPage: true` so the grid
 * can link/banner them; categories with products but no page yet still render
 * (humanized name, no link) — so every product shows and nothing 404s.
 */
export function getProductsByCategory(perCategory = 10): CategoryProducts[] {
  const cats = getCategories();
  const nameBySlug = new Map(cats.map((c) => [c.slug, c.name]));

  const byCat = new Map<string, Product[]>();
  const firstSeen: string[] = [];
  for (const p of getProducts()) {
    if (!byCat.has(p.category)) {
      byCat.set(p.category, []);
      firstSeen.push(p.category);
    }
    byCat.get(p.category)!.push(p);
  }

  const withPage = cats.map((c) => c.slug).filter((s) => byCat.has(s));
  const withoutPage = firstSeen.filter((s) => !nameBySlug.has(s));

  return [...withPage, ...withoutPage]
    .map((slug) => ({
      slug,
      name: nameBySlug.get(slug) ?? titleize(slug),
      hasPage: nameBySlug.has(slug),
      products: (byCat.get(slug) ?? []).slice(0, perCategory),
    }))
    .filter((c) => c.products.length > 0);
}

/**
 * Find an existing review for a product: same category, and the review's model
 * string appears in the product title. Returns the review slug or null.
 */
export function reviewSlugForProduct(product: Product, reviews: Review[] = getReviews()): string | null {
  const title = product.title.toLowerCase();
  const match = reviews.find(
    (r) => r.category === product.category && r.model && title.includes(r.model.toLowerCase()),
  );
  return match ? match.slug : null;
}
