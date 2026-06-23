// lib/advisor/seedSearch.ts
//
// Offline product source used while Amazon PA-API access is pending (it requires
// 10 qualifying sales / 30 days). Swaps in for `searchItems` so the advisor runs
// end-to-end on a hand-curated catalog. The planner + writer (DeepSeek) and the
// whole DB/answer pipeline are unchanged — only the product source differs.
import type { RawProduct, SearchGroup } from './types';
import { asinUrl } from './amazon';

/** One curated product. Superset of the searchable RawProduct fields. */
export interface SeedProduct {
  asin: string;
  title: string;
  imageUrl: string | null;
  price: string | null;        // formatted, e.g. "$99.00"
  currency: string | null;
  features: string[];
  tags: string[];              // extra search keywords (synonyms, use-cases)
  category: string;            // site category slug — used for grouping/fallback
  priceValue: number | null;   // numeric price for bound filtering (USD)
}

export interface SeedSearchOpts { limit?: number; }

// A real Amazon ASIN is exactly 10 uppercase alphanumerics. Placeholder/example
// rows (e.g. "EXAMPLE0001") fail this and are dropped — so an un-filled seed file
// can NEVER render broken affiliate links to real visitors.
const ASIN_RE = /^[A-Z0-9]{10}$/;
export const isValidAsin = (asin: string): boolean => ASIN_RE.test(asin);

const STOP = new Set([
  'the', 'a', 'an', 'for', 'to', 'and', 'of', 'with', 'in', 'on', 'at', 'by',
  'best', 'good', 'cheap', 'great', 'around', 'under', 'about', 'over',
  'my', 'i', 'we', 'you', 'need', 'want', 'buy', 'get', 'looking', 'some',
]);

function tokens(s: string): string[] {
  const out = s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map((w) => w.replace(/s$/, '')); // crude singularization: drills -> drill
  return out.filter((w, i) => out.indexOf(w) === i); // dedupe
}

function scoreOf(group: SearchGroup, p: SeedProduct): number {
  const q = tokens(`${group.keywords} ${group.label ?? ''}`);
  if (q.length === 0) return 0;
  const hay = tokens([p.title, p.category, ...p.tags].join(' '));
  let s = 0;
  for (const t of q) if (hay.includes(t)) s++;
  // Small boost when the planner's category guess matches the product's category.
  if (group.categoryGuess && tokens(group.categoryGuess).some((t) => p.category.includes(t))) s += 0.5;
  return s;
}

function withinPrice(group: SearchGroup, p: SeedProduct): boolean {
  if (p.priceValue == null) return true; // unknown price — don't exclude
  if (group.priceMin != null && p.priceValue < group.priceMin) return false;
  if (group.priceMax != null && p.priceValue > group.priceMax) return false;
  return true;
}

/** Map a seed product to the RawProduct shape the orchestrator expects. */
export function toRawProduct(p: SeedProduct, tag?: string): RawProduct {
  return {
    asin: p.asin,
    title: p.title,
    imageUrl: p.imageUrl,
    price: p.price,
    currency: p.currency,
    rating: null, // parity with PA-API, which also omits star ratings
    features: p.features,
    detailUrl: asinUrl(p.asin, tag ?? ''),
  };
}

/**
 * Find the seed products that best match a planner search group.
 * Returns [] on a genuine miss — the orchestrator then renders an honest
 * "no good matches" answer rather than a dead end or fabricated links.
 */
export function searchSeed(group: SearchGroup, seed: SeedProduct[], opts: SeedSearchOpts = {}): RawProduct[] {
  const limit = opts.limit ?? 6;
  return seed
    .filter((p) => isValidAsin(p.asin))
    .filter((p) => withinPrice(group, p))
    .map((p) => ({ p, score: scoreOf(group, p) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => toRawProduct(x.p));
}
