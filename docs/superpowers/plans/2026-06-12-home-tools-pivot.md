# Home Tools Pivot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild shabitools.com as a US-targeted home & power tools review site monetized via Admitad CPA deeplinks + CPC partner landing pages + manual AdSense slots, capped at 1,500 pages.

**Architecture:** Next.js 14 static export to Cloudflare Pages. Editorial content lives as JSON in `content/`, rendered by typed route groups (`/reviews`, `/compare`, `/guides`, `/brands`, `/categories`). The Admitad CPC layer is ported from `/Users/guym/Projects/aibuzz` (harvest scripts + landing renderer) into `/stores/[slug]`. All tracked links route through first-party `/go/<slug>` URLs served as **static 302 lines in Cloudflare Pages `_redirects`** (generated at build — replaces aibuzz's Worker, which Pages doesn't have). CPA deeplinks are generated build-time via the official Admitad API.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind, `output: 'export'`, `trailingSlash: false`, pnpm, Playwright (e2e), Vitest (lib unit tests), Playwright-driven Admitad internal API, DeepSeek for landing copy.

**Testing strategy:** TDD with Vitest for `lib/` and build scripts (pure logic). Components and routes are server-rendered Tailwind markup — verified via `pnpm build` + Playwright smoke tests, not unit tests (RTL/jsdom adds infra for near-zero signal on presentational markup).

**Spec:** `docs/superpowers/specs/2026-06-12-home-tools-pivot-design.md`

**Reference repo (read-only):** `/Users/guym/Projects/aibuzz`

**Deviations from spec (justified):** keep `marked` dependency (now renders review/guide markdown bodies; only `qrcode` is dev-tool legacy). `/go/` uses Pages `_redirects` static 302s instead of JS `location.replace` pages — server-side is strictly more ad-blocker-resistant and simpler.

**Rules for every task:** never commit `.env`, `.env.local`, `.admitad-profile/`. Deploy ONLY when the user explicitly asks. All internal links without trailing slashes.

---

## Phase 0 — Finish cleanup

### Task 1: Delete legacy code, prune deps, commit the pending pivot

**Files:**
- Delete: `components/Base64ImageConverter/ components/CSSValidator/ components/HashGenerator/ components/HTMLMinifier/ components/HTMLValidator/ components/ImageCompressor/ components/JavaScriptMinifier/ components/SQLFormatter/ components/URLEncoder/ components/XMLFormatter/`
- Modify: `package.json` (remove `qrcode`, `@types/qrcode`)

- [ ] **Step 1: Delete remaining legacy dev-tool components**

```bash
cd /Users/guym/Projects/shabitools
rm -rf components/Base64ImageConverter components/CSSValidator components/HashGenerator \
  components/HTMLMinifier components/HTMLValidator components/ImageCompressor \
  components/JavaScriptMinifier components/SQLFormatter components/URLEncoder components/XMLFormatter
ls components   # expect ONLY: Footer Header Logo
```

- [ ] **Step 2: Remove unused deps (keep `marked` — it renders content bodies)**

```bash
pnpm remove qrcode @types/qrcode
```

- [ ] **Step 3: Verify no dangling imports of deleted code**

```bash
rg -l "Base64ImageConverter|CSSValidator|HashGenerator|HTMLMinifier|HTMLValidator|ImageCompressor|JavaScriptMinifier|SQLFormatter|URLEncoder|XMLFormatter|qrcode" app components lib types 2>/dev/null
```
Expected: no output. If any file matches, remove the import/usage (these should all be inside the already-deleted `app/tools/` tree).

- [ ] **Step 4: Build must pass**

```bash
pnpm build
```
Expected: `✓ Generating static pages`, exit 0, `out/` contains `index.html`.

- [ ] **Step 5: Commit everything pending (the ~294 staged deletions + this cleanup)**

```bash
git add -A
git commit -m "chore: complete dev-tools teardown for home-tools pivot

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 2: Move Admitad verify code to env var

**Files:**
- Modify: `app/layout.tsx:34-37`
- Modify: `.env` (add key — DO NOT COMMIT)
- Create: `.env.example`

- [ ] **Step 1: Add to `.env` (uncommitted)**

```env
ADMITAD_VERIFY_CODE=45daf07b7b
NEXT_PUBLIC_SITE_URL=https://shabitools.com
```

- [ ] **Step 2: Create `.env.example` (committed, no secrets)**

```env
# Admitad official API (CPA deeplinks)
ADMITAD_CLIENT_ID=
ADMITAD_CLIENT_SECRET=
ADMITAD_BASE64_HEADER=
ADMITAD_API_URL=https://api.admitad.com
ADMITAD_WEBSITE_ID=        # shabitools ad-space id from the Admitad dashboard
ADMITAD_VERIFY_CODE=
NEXT_PUBLIC_SITE_URL=https://shabitools.com
# Admitad internal-catalog harvest (CPC partner programs)
HARVEST_WEBSITE_ID=        # same ad-space id
HARVEST_CATEGORIES=        # comma-separated catalog category ids (home improvement / DIY / garden)
# Landing copy generation
DEEPSEEK_API_KEY=
```

- [ ] **Step 3: Read the env var in `app/layout.tsx`** — replace the `other:` block:

```tsx
  other: {
    'google-adsense-account': 'ca-pub-2201239508910470',
    ...(process.env.ADMITAD_VERIFY_CODE
      ? { 'verify-admitad': process.env.ADMITAD_VERIFY_CODE }
      : {}),
  },
```

- [ ] **Step 4: Verify the tag still renders**

```bash
pnpm build && rg -o 'verify-admitad[^>]*' out/index.html
```
Expected: `verify-admitad" content="45daf07b7b"`.

- [ ] **Step 5: Confirm `.env` ignored, then commit**

```bash
git check-ignore .env   # MUST print .env; if not, add it to .gitignore first
git add app/layout.tsx .env.example .gitignore
git commit -m "chore: env-driven Admitad verify code + .env.example

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Phase 1 — Foundation

### Task 3: Vitest setup + content types

**Files:**
- Create: `types/content.ts` (shared primitives), `types/review.ts`, `types/compare.ts`, `types/guide.ts`, `types/brand.ts`, `types/category.ts`, `types/landing.ts`
- Modify: `package.json` (add `vitest`, `test:unit` script)

- [ ] **Step 1: Install vitest, add script**

```bash
pnpm add -D vitest
```
In `package.json` scripts add: `"test:unit": "vitest run"`.

- [ ] **Step 2: Create `types/content.ts`**

```ts
export interface FaqItem {
  q: string;
  a: string;
}

/** One merchant CTA. `url` is filled by `pnpm admitad:sync` (CPA deeplink)
 *  or points at a first-party `/go/<slug>` redirect (CPC). Render only when set. */
export interface AffiliateLink {
  merchant: string;
  url: string | null;
  /** Official-API campaign id + target product URL — input for admitad:sync. */
  campaignId?: number;
  productUrl?: string;
}

export interface ContentDates {
  datePublished: string; // YYYY-MM-DD
  dateModified: string;
}
```

- [ ] **Step 3: Create `types/review.ts`**

```ts
import type { AffiliateLink, ContentDates, FaqItem } from './content';

export interface Review extends ContentDates {
  slug: string;
  title: string;
  brand: string; // brand slug, e.g. "makita"
  category: string; // category slug, e.g. "cordless-drills"
  model: string;
  rating: number; // 0–5, one decimal
  priceRange: string;
  image?: string;
  affiliate: AffiliateLink[];
  pros: string[];
  cons: string[];
  bestFor: string;
  skipIf: string;
  specs: Record<string, string>;
  faq: FaqItem[];
  body: string; // markdown, 800+ words
  related: string[]; // slugs of reviews/compare/guides
}
```

- [ ] **Step 4: Create `types/compare.ts`**

```ts
import type { ContentDates, FaqItem } from './content';

export interface CompareRow {
  label: string;
  a: string;
  b: string;
  advantage?: 'a' | 'b' | 'tie';
}

export interface Compare extends ContentDates {
  slug: string;
  title: string;
  category: string;
  productA: { reviewSlug: string; name: string };
  productB: { reviewSlug: string; name: string };
  winner: 'a' | 'b' | 'tie';
  verdict: string; // 2–3 sentence direct answer (AEO)
  rows: CompareRow[];
  faq: FaqItem[];
  body: string;
  related: string[];
}
```

- [ ] **Step 5: Create `types/guide.ts`**

```ts
import type { AffiliateLink, ContentDates, FaqItem } from './content';

export interface GuidePick {
  rank: number;
  awardLabel: string; // "Best overall", "Best budget"…
  name: string;
  reviewSlug?: string;
  summary: string;
  pros: string[];
  cons: string[];
  affiliate?: AffiliateLink;
}

export interface Guide extends ContentDates {
  slug: string;
  title: string;
  category: string;
  intro: string; // direct answer first (AEO)
  picks: GuidePick[];
  faq: FaqItem[];
  body: string;
  related: string[];
}
```

- [ ] **Step 6: Create `types/brand.ts` and `types/category.ts`**

```ts
// types/brand.ts
import type { ContentDates, FaqItem } from './content';

export interface Brand extends ContentDates {
  slug: string;
  name: string;
  description: string; // markdown
  founded?: string;
  headquarters?: string;
  knownFor: string[];
  faq: FaqItem[];
}
```

```ts
// types/category.ts
import type { ContentDates, FaqItem } from './content';

export interface Category extends ContentDates {
  slug: string;
  name: string;
  description: string; // markdown
  buyingFactors: { title: string; text: string }[];
  faq: FaqItem[];
}
```

- [ ] **Step 7: Create `types/landing.ts`** (mirrors aibuzz `content/admitad-landings.json` entries)

```ts
export interface LandingCopy {
  headline: string;
  subheadline: string;
  intro: string;
  benefits: string[];
  howItWorks: string[];
  faq: { q: string; a: string }[];
  ctaLabel: string;
  metaTitle: string;
  metaDescription: string;
}

export interface StoreLanding {
  slug: string;
  name: string;
  siteUrl: string;
  image?: string;
  description?: string;
  admitad: { gotolink: string | null; cpcGotolink?: string | null };
  content: LandingCopy | null;
}
```

- [ ] **Step 8: Typecheck + commit**

```bash
pnpm exec tsc --noEmit
git add types package.json pnpm-lock.yaml
git commit -m "feat: content types + vitest

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 4: Content loader (`lib/content.ts`) — TDD

**Files:**
- Create: `lib/content.ts`
- Test: `lib/__tests__/content.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// lib/__tests__/content.test.ts
import { describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { loadCollection, loadOne } from '../content';

function fixtureDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shabi-content-'));
  fs.mkdirSync(path.join(dir, 'reviews'));
  fs.writeFileSync(
    path.join(dir, 'reviews', 'older.json'),
    JSON.stringify({ slug: 'older', datePublished: '2026-01-01' })
  );
  fs.writeFileSync(
    path.join(dir, 'reviews', 'newer.json'),
    JSON.stringify({ slug: 'newer', datePublished: '2026-06-01' })
  );
  fs.writeFileSync(path.join(dir, 'reviews', 'notes.txt'), 'ignore me');
  return dir;
}

describe('loadCollection', () => {
  it('loads .json files newest-first and ignores non-json', () => {
    const items = loadCollection<{ slug: string }>('reviews', fixtureDir());
    expect(items.map((i) => i.slug)).toEqual(['newer', 'older']);
  });

  it('returns [] for a missing directory', () => {
    expect(loadCollection('nope', fixtureDir())).toEqual([]);
  });
});

describe('loadOne', () => {
  it('finds by slug and returns undefined when absent', () => {
    const dir = fixtureDir();
    expect(loadOne<{ slug: string }>('reviews', 'older', dir)?.slug).toBe('older');
    expect(loadOne('reviews', 'ghost', dir)).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run — expect FAIL** (`Cannot find module '../content'`)

```bash
pnpm test:unit
```

- [ ] **Step 3: Implement `lib/content.ts`**

```ts
import fs from 'fs';
import path from 'path';
import type { Brand } from '@/types/brand';
import type { Category } from '@/types/category';
import type { Compare } from '@/types/compare';
import type { Guide } from '@/types/guide';
import type { StoreLanding } from '@/types/landing';
import type { Review } from '@/types/review';

const DEFAULT_BASE = path.join(process.cwd(), 'content');

export function loadCollection<T extends { datePublished?: string }>(
  dir: string,
  base: string = DEFAULT_BASE
): T[] {
  const full = path.join(base, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(full, f), 'utf8')) as T)
    .sort((a, b) => (b.datePublished ?? '').localeCompare(a.datePublished ?? ''));
}

export function loadOne<T extends { slug: string }>(
  dir: string,
  slug: string,
  base: string = DEFAULT_BASE
): T | undefined {
  return loadCollection<T & { datePublished?: string }>(dir, base).find((i) => i.slug === slug);
}

export const getReviews = () => loadCollection<Review>('reviews');
export const getReview = (slug: string) => loadOne<Review>('reviews', slug);
export const getCompares = () => loadCollection<Compare>('compare');
export const getCompare = (slug: string) => loadOne<Compare>('compare', slug);
export const getGuides = () => loadCollection<Guide>('guides');
export const getGuide = (slug: string) => loadOne<Guide>('guides', slug);
export const getBrands = () => loadCollection<Brand>('brands');
export const getBrand = (slug: string) => loadOne<Brand>('brands', slug);
export const getCategories = () => loadCollection<Category>('categories');
export const getCategory = (slug: string) => loadOne<Category>('categories', slug);

/** CPC store landings from content/admitad-landings.json (aibuzz format:
 *  `{ entries: [...] }`). Only entries with a tracking link and copy render. */
export function getStoreLandings(base: string = DEFAULT_BASE): StoreLanding[] {
  const file = path.join(base, 'admitad-landings.json');
  if (!fs.existsSync(file)) return [];
  const payload = JSON.parse(fs.readFileSync(file, 'utf8'));
  const entries: StoreLanding[] = Array.isArray(payload?.entries) ? payload.entries : [];
  return entries.filter((e) => e.slug && e.admitad?.gotolink);
}

export const getStoreLanding = (slug: string) =>
  getStoreLandings().find((e) => e.slug === slug);
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:unit
```

- [ ] **Step 5: Commit**

```bash
git add lib/content.ts lib/__tests__/content.test.ts
git commit -m "feat: typed content loader

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 5: JSON-LD generators (`lib/schema.ts`) — TDD

**Files:**
- Create: `lib/schema.ts`
- Test: `lib/__tests__/schema.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// lib/__tests__/schema.test.ts
import { describe, expect, it } from 'vitest';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, productReviewJsonLd } from '../schema';
import type { Review } from '@/types/review';

const review = {
  slug: 'makita-xfd131',
  title: 'Makita XFD131 Review',
  brand: 'makita',
  category: 'cordless-drills',
  model: 'XFD131',
  rating: 4.5,
  priceRange: '$150–$200',
  affiliate: [],
  pros: [],
  cons: [],
  bestFor: '',
  skipIf: '',
  specs: {},
  faq: [],
  body: '',
  datePublished: '2026-06-12',
  dateModified: '2026-06-12',
  related: [],
} satisfies Review;

it('productReviewJsonLd nests a Review with rating inside a Product', () => {
  const ld = productReviewJsonLd(review, 'https://shabitools.com');
  expect(ld['@type']).toBe('Product');
  expect(ld.brand).toEqual({ '@type': 'Brand', name: 'Makita' });
  expect(ld.review.reviewRating.ratingValue).toBe(4.5);
  expect(ld.review.datePublished).toBe('2026-06-12');
});

it('faqJsonLd maps Q/A pairs', () => {
  const ld = faqJsonLd([{ q: 'Is it good?', a: 'Yes.' }]);
  expect(ld['@type']).toBe('FAQPage');
  expect(ld.mainEntity[0].acceptedAnswer.text).toBe('Yes.');
});

it('breadcrumbJsonLd numbers positions from 1', () => {
  const ld = breadcrumbJsonLd([
    { name: 'Home', url: 'https://shabitools.com' },
    { name: 'Reviews', url: 'https://shabitools.com/reviews' },
  ]);
  expect(ld.itemListElement[1]).toMatchObject({ position: 2, name: 'Reviews' });
});

it('itemListJsonLd orders items', () => {
  const ld = itemListJsonLd('Best drills', [{ name: 'A', url: 'https://x.com/a' }]);
  expect(ld.itemListElement[0]).toMatchObject({ position: 1, name: 'A' });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:unit
```

- [ ] **Step 3: Implement `lib/schema.ts`**

```ts
import type { FaqItem } from '@/types/content';
import type { Review } from '@/types/review';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function productReviewJsonLd(r: Review, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product' as const,
    name: `${cap(r.brand)} ${r.model}`,
    brand: { '@type': 'Brand', name: cap(r.brand) },
    ...(r.image ? { image: `${siteUrl}${r.image}` } : {}),
    review: {
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      author: { '@type': 'Organization', name: 'shabitools' },
      datePublished: r.datePublished,
      url: `${siteUrl}/reviews/${r.slug}`,
    },
  };
}

export function faqJsonLd(faq: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage' as const,
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList' as const,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function itemListJsonLd(name: string, items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList' as const,
    name,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:unit
```

- [ ] **Step 5: Commit**

```bash
git add lib/schema.ts lib/__tests__/schema.test.ts
git commit -m "feat: JSON-LD generators

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 6: SEO helper + shared UI primitives

**Files:**
- Create: `lib/seo.ts`, `components/seo/JsonLd.tsx`, `components/seo/FAQSection.tsx`, `components/layout/Breadcrumbs.tsx`, `components/layout/PageHero.tsx`, `components/layout/Prose.tsx`

- [ ] **Step 1: `lib/seo.ts`**

```ts
import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shabitools.com';

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string; // leading slash, no trailing slash
}): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: { title: opts.title, description: opts.description, url, type: 'article' },
    twitter: { card: 'summary_large_image', title: opts.title, description: opts.description },
  };
}
```

- [ ] **Step 2: `components/seo/JsonLd.tsx`**

```tsx
export default function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
```

- [ ] **Step 3: `components/seo/FAQSection.tsx`** (visible FAQ; pair with `faqJsonLd` on the page)

```tsx
import type { FaqItem } from '@/types/content';

export default function FAQSection({ faq }: { faq: FaqItem[] }) {
  if (!faq.length) return null;
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-stone-900">Frequently asked questions</h2>
      <dl className="mt-6 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
        {faq.map((f) => (
          <div key={f.q} className="p-5">
            <dt className="font-semibold text-stone-900">{f.q}</dt>
            <dd className="mt-2 leading-relaxed text-stone-600">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 4: `components/layout/Breadcrumbs.tsx`** (visible trail; pair with `breadcrumbJsonLd`)

```tsx
import Link from 'next/link';

export default function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden>/</span>}
            {i === items.length - 1 ? (
              <span className="text-stone-700">{item.name}</span>
            ) : (
              <Link href={item.href} className="hover:text-amber-700">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 5: `components/layout/PageHero.tsx` and `components/layout/Prose.tsx`**

```tsx
// components/layout/PageHero.tsx
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
```

```tsx
// components/layout/Prose.tsx — renders markdown content bodies at build time
import { marked } from 'marked';

export default function Prose({ markdown }: { markdown: string }) {
  return (
    <div
      className="prose-shabi mt-8 max-w-none leading-relaxed text-stone-700 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-stone-900 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-stone-900 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1 [&_a]:text-amber-700 [&_a]:underline"
      dangerouslySetInnerHTML={{ __html: marked.parse(markdown) as string }}
    />
  );
}
```

- [ ] **Step 6: Typecheck + commit**

```bash
pnpm exec tsc --noEmit
git add lib/seo.ts components/seo components/layout
git commit -m "feat: seo helpers + shared layout/seo components

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 7: Header & Footer with real navigation

**Files:**
- Modify: `components/Header/Header.tsx`, `components/Footer/Footer.tsx`

- [ ] **Step 1: Replace `components/Header/Header.tsx`** (server component, mobile uses `<details>` — zero JS)

```tsx
import Link from 'next/link';
import Image from 'next/image';

const NAV = [
  { name: 'Reviews', href: '/reviews' },
  { name: 'Compare', href: '/compare' },
  { name: 'Guides', href: '/guides' },
  { name: 'Brands', href: '/brands' },
  { name: 'Stores', href: '/stores' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="shabitools" width={36} height={36} priority />
          <span className="text-lg font-extrabold tracking-tight text-stone-900">
            shabi<span className="text-amber-600">tools</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-stone-600 hover:text-amber-700"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700">
            Menu
          </summary>
          <nav
            className="absolute right-0 mt-2 w-44 rounded-xl border border-stone-200 bg-white p-2 shadow-lg"
            aria-label="Mobile"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-amber-50"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Replace `components/Footer/Footer.tsx`**

```tsx
import Link from 'next/link';

const SECTIONS = [
  {
    title: 'Content',
    links: [
      { name: 'Reviews', href: '/reviews' },
      { name: 'Comparisons', href: '/compare' },
      { name: 'Buying guides', href: '/guides' },
      { name: 'Categories', href: '/categories' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { name: 'Brands', href: '/brands' },
      { name: 'Stores & deals', href: '/stores' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Affiliate disclosure', href: '/affiliate-disclosure' },
      { name: 'Privacy policy', href: '/privacy' },
      { name: 'Terms of service', href: '/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-900 text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold text-white">
            shabi<span className="text-amber-500">tools</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Independent reviews and buying guides for home &amp; power tools.
          </p>
          <p className="mt-3 text-xs text-stone-400">
            As an affiliate, we may earn a commission from qualifying purchases made through
            links on this site — at no extra cost to you.
          </p>
        </div>
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <p className="text-sm font-semibold uppercase tracking-wide text-stone-400">
              {s.title}
            </p>
            <ul className="mt-3 space-y-2">
              {s.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-amber-400">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-stone-800 py-4 text-center text-xs text-stone-500">
        © 2026 shabitools.com — All rights reserved.
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Build (footer links 404 until later tasks — build still passes since they're plain hrefs)**

```bash
pnpm build
```
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add components/Header components/Footer
git commit -m "feat: site navigation header + footer

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 8: Review building blocks (ProsCons, SpecTable, VerdictBox, ReviewCard, RatingStars)

**Files:**
- Create: `components/reviews/RatingStars.tsx`, `components/reviews/ProsCons.tsx`, `components/reviews/SpecTable.tsx`, `components/reviews/VerdictBox.tsx`, `components/reviews/ReviewCard.tsx`

- [ ] **Step 1: `components/reviews/RatingStars.tsx`**

```tsx
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
```

- [ ] **Step 2: `components/reviews/ProsCons.tsx`**

```tsx
export default function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <h3 className="font-bold text-green-900">Pros</h3>
        <ul className="mt-3 space-y-2">
          {pros.map((p) => (
            <li key={p} className="flex gap-2 text-sm text-green-900">
              <span aria-hidden>✓</span> {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <h3 className="font-bold text-red-900">Cons</h3>
        <ul className="mt-3 space-y-2">
          {cons.map((c) => (
            <li key={c} className="flex gap-2 text-sm text-red-900">
              <span aria-hidden>✗</span> {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: `components/reviews/SpecTable.tsx`**

```tsx
export default function SpecTable({ specs }: { specs: Record<string, string> }) {
  return (
    <table className="mt-8 w-full overflow-hidden rounded-xl border border-stone-200 text-sm">
      <caption className="sr-only">Technical specifications</caption>
      <tbody>
        {Object.entries(specs).map(([key, value], i) => (
          <tr key={key} className={i % 2 ? 'bg-white' : 'bg-stone-50'}>
            <th scope="row" className="w-1/3 px-4 py-3 text-left font-semibold capitalize text-stone-900">
              {key.replace(/([A-Z])/g, ' $1')}
            </th>
            <td className="px-4 py-3 text-stone-700">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 4: `components/reviews/VerdictBox.tsx`** (verdict + Buy if / Skip if — the AEO decision block)

```tsx
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
```

- [ ] **Step 5: `components/reviews/ReviewCard.tsx`** (used on index pages and homepage)

```tsx
import Link from 'next/link';
import type { Review } from '@/types/review';
import RatingStars from './RatingStars';

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <Link
      href={`/reviews/${review.slug}`}
      className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
        {review.category.replace(/-/g, ' ')}
      </p>
      <h3 className="mt-2 font-bold text-stone-900 group-hover:text-amber-700">{review.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-stone-600">{review.bestFor}</p>
      <div className="mt-auto flex items-center justify-between pt-4">
        <RatingStars rating={review.rating} />
        <span className="text-sm text-stone-500">{review.priceRange}</span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 6: Typecheck + commit**

```bash
pnpm exec tsc --noEmit
git add components/reviews
git commit -m "feat: review building-block components

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 9: Monetization components (SmartCtaButton, AffiliateCTA, WhereToBuyStrip, AdSlot)

**Files:**
- Create: `components/monetization/SmartCtaButton.tsx`, `components/monetization/AffiliateCTA.tsx`, `components/monetization/WhereToBuyStrip.tsx`, `components/monetization/AdSlot.tsx`

- [ ] **Step 1: Port `SmartCtaButton`** — copy then adapt:

```bash
mkdir -p components/monetization
cp /Users/guym/Projects/aibuzz/components/landings/SmartCtaButton.tsx components/monetization/SmartCtaButton.tsx
```
Edits to the copied file: (1) on the rendered `<a>`, set `rel="sponsored nofollow noopener"`; (2) ensure hrefs passed in have NO trailing slash (this repo is `trailingSlash: false`); leave the popup-recovery logic untouched (it is the proven part).

- [ ] **Step 2: `components/monetization/AffiliateCTA.tsx`** — primary CTA with FTC micro-disclosure

```tsx
import { SmartCtaButton } from './SmartCtaButton';
import type { AffiliateLink } from '@/types/content';

export default function AffiliateCTA({
  links,
  productName,
}: {
  links: AffiliateLink[];
  productName: string;
}) {
  const live = links.filter((l) => l.url);
  if (!live.length) return null;
  return (
    <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-6 text-center">
      <p className="font-semibold text-stone-900">Where to buy the {productName}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {live.map((l) => (
          <SmartCtaButton
            key={l.merchant}
            href={l.url!}
            className="inline-block rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-amber-700"
          >
            Check price at {l.merchant}
          </SmartCtaButton>
        ))}
      </div>
      <p className="mt-3 text-xs text-stone-500">
        We may earn a commission if you buy through these links, at no extra cost to you.
      </p>
    </div>
  );
}
```

- [ ] **Step 3: `components/monetization/WhereToBuyStrip.tsx`** — secondary CPC strip (top stores via `/go/`)

```tsx
import Link from 'next/link';
import { getStoreLandings } from '@/lib/content';

export default function WhereToBuyStrip({ max = 4 }: { max?: number }) {
  const stores = getStoreLandings().slice(0, max);
  if (!stores.length) return null;
  return (
    <aside className="mt-10 rounded-2xl border border-stone-200 bg-white p-5">
      <p className="text-sm font-semibold text-stone-900">Tool stores we link to</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {stores.map((s) => (
          <li key={s.slug}>
            <a
              href={`/go/${s.slug}`}
              rel="sponsored nofollow noopener"
              target="_blank"
              className="inline-block rounded-full border border-stone-300 px-4 py-1.5 text-sm font-medium text-stone-700 hover:border-amber-400 hover:text-amber-700"
            >
              {s.name}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-stone-500">
        Sponsored links — see our <Link href="/affiliate-disclosure" className="underline">affiliate disclosure</Link>.{' '}
        <Link href="/stores" className="underline">All stores</Link>
      </p>
    </aside>
  );
}
```

- [ ] **Step 4: `components/monetization/AdSlot.tsx`** — lazy AdSense, fixed height (no CLS)

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

const CLIENT = 'ca-pub-2201239508910470';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Manual AdSense slot. Loads the ads script only when the slot nears the
 *  viewport (IntersectionObserver), inside a fixed-height box so CLS stays 0. */
export default function AdSlot({ slot, height = 280 }: { slot: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { rootMargin: '600px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (!document.querySelector('script[data-adsense]')) {
      const s = document.createElement('script');
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.dataset.adsense = '1';
      document.head.appendChild(s);
    }
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocked — box stays empty */
    }
  }, [visible]);

  return (
    <div ref={ref} style={{ minHeight: height }} className="my-8 overflow-hidden" aria-hidden>
      {visible && (
        <ins
          className="adsbygoogle block"
          style={{ display: 'block', minHeight: height }}
          data-ad-client={CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
```
Note: `slot` values come from AdSense dashboard ad units — use placeholder slot id `"0000000000"` in pages until the user creates units; the component renders an empty fixed box meanwhile (harmless).

- [ ] **Step 5: Typecheck + commit**

```bash
pnpm exec tsc --noEmit
git add components/monetization
git commit -m "feat: monetization components (CTA, store strip, lazy AdSlot)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Phase 2 — Editorial routes + seed content

> **Content quality bar (applies to every authoring step in Tasks 10–16):** 800+ words of original body markdown; specific entity-rich sentences (brand + model + numeric spec); 5+ FAQ with the direct answer in the first sentence; 3+ related links; `datePublished`/`dateModified` = authoring date. **Verify product specs via web search at execution time** — do not trust memory for torque/weight/price numbers.

### Task 10: Seed reviews + `/reviews` routes

**Files:**
- Create: `content/reviews/makita-xfd131.json`, `content/reviews/dewalt-dcd800.json`, `content/reviews/bosch-gsr18v-400.json`, `content/reviews/milwaukee-2904.json`
- Create: `app/reviews/page.tsx`, `app/reviews/[slug]/page.tsx`

- [ ] **Step 1: Author `content/reviews/makita-xfd131.json`** — exemplar structure (specs below are from training data; **verify before committing**, then write the full 800+ word body):

```json
{
  "slug": "makita-xfd131",
  "title": "Makita XFD131 18V Cordless Drill Review (2026)",
  "brand": "makita",
  "category": "cordless-drills",
  "model": "XFD131",
  "rating": 4.5,
  "priceRange": "$150–$200",
  "affiliate": [
    { "merchant": "Home Depot", "url": null, "campaignId": 0, "productUrl": "https://www.homedepot.com/" }
  ],
  "pros": [
    "Brushless motor delivers 440 in-lbs of torque",
    "Compact 6.9\" head fits tight spaces",
    "Kit includes 3.0Ah battery and rapid charger",
    "All-metal 1/2\" chuck holds bits securely"
  ],
  "cons": [
    "Single battery in the kit",
    "No belt-hook installed out of the box",
    "Pricier than comparable Ryobi options"
  ],
  "bestFor": "DIY homeowners and light-trade users who want pro-grade reliability in a compact 18V drill",
  "skipIf": "You only drill a few holes a year — a $60 budget drill will do",
  "specs": {
    "voltage": "18V LXT",
    "motor": "Brushless",
    "maxTorque": "440 in-lbs",
    "speed": "0–500 / 0–1,900 RPM",
    "chuck": "1/2\" all-metal",
    "weight": "3.4 lbs (with battery)",
    "battery": "3.0Ah Li-ion (1 included)",
    "warranty": "3-year limited"
  },
  "faq": [
    { "q": "Is the Makita XFD131 good for beginners?", "a": "Yes — the XFD131 is beginner-friendly thanks to its light 3.4 lb body, two-speed gearbox, and forgiving clutch, while leaving plenty of headroom as your projects grow." }
  ],
  "body": "(write 800+ words: who it's for, build quality, drilling performance by material, battery/charging, ergonomics, value vs DeWalt DCD800 and Milwaukee 2904, who should buy)",
  "datePublished": "2026-06-12",
  "dateModified": "2026-06-12",
  "related": ["dewalt-dcd800", "makita-xfd131-vs-dewalt-dcd800", "best-cordless-drill-2026"]
}
```
Author the other three (`dewalt-dcd800` — DeWalt 20V MAX XR DCD800; `bosch-gsr18v-400` — Bosch GSR18V-400; `milwaukee-2904` — Milwaukee M18 FUEL 2904-20) with the same structure, web-verified specs, full bodies, and 5+ FAQ each.

- [ ] **Step 2: Create `app/reviews/page.tsx`**

```tsx
import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import ReviewCard from '@/components/reviews/ReviewCard';
import JsonLd from '@/components/seo/JsonLd';
import { getReviews } from '@/lib/content';
import { itemListJsonLd } from '@/lib/schema';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Power Tool Reviews',
  description:
    'Hands-on style reviews of cordless drills, saws, and power tools from Makita, DeWalt, Bosch, and Milwaukee — with pros, cons, and clear buy/skip verdicts.',
  path: '/reviews',
});

export default function ReviewsPage() {
  const reviews = getReviews();
  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          'Power tool reviews',
          reviews.map((r) => ({ name: r.title, url: `${SITE_URL}/reviews/${r.slug}` }))
        )}
      />
      <PageHero
        title="Power tool reviews"
        subtitle="Every review ends with a clear verdict: buy it, or skip it — and what to get instead."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <ReviewCard key={r.slug} review={r} />
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 3: Create `app/reviews/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Prose from '@/components/layout/Prose';
import AdSlot from '@/components/monetization/AdSlot';
import AffiliateCTA from '@/components/monetization/AffiliateCTA';
import WhereToBuyStrip from '@/components/monetization/WhereToBuyStrip';
import ProsCons from '@/components/reviews/ProsCons';
import RatingStars from '@/components/reviews/RatingStars';
import SpecTable from '@/components/reviews/SpecTable';
import VerdictBox from '@/components/reviews/VerdictBox';
import FAQSection from '@/components/seo/FAQSection';
import JsonLd from '@/components/seo/JsonLd';
import { getReview, getReviews } from '@/lib/content';
import { breadcrumbJsonLd, faqJsonLd, productReviewJsonLd } from '@/lib/schema';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return getReviews().map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const review = getReview(params.slug);
  if (!review) return {};
  return pageMetadata({
    title: review.title,
    description: `${review.title}: rated ${review.rating}/5. ${review.bestFor}.`,
    path: `/reviews/${review.slug}`,
  });
}

export default function ReviewPage({ params }: { params: { slug: string } }) {
  const review = getReview(params.slug);
  if (!review) notFound();
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Reviews', href: '/reviews' },
    { name: review.model, href: `/reviews/${review.slug}` },
  ];
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={[
          productReviewJsonLd(review, SITE_URL),
          faqJsonLd(review.faq),
          breadcrumbJsonLd(crumbs.map((c) => ({ name: c.name, url: `${SITE_URL}${c.href}` }))),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
        {review.title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-stone-500">
        <RatingStars rating={review.rating} />
        <span>
          Updated <time dateTime={review.dateModified}>{review.dateModified}</time>
        </span>
      </div>
      <VerdictBox
        rating={review.rating}
        bestFor={review.bestFor}
        skipIf={review.skipIf}
        priceRange={review.priceRange}
      />
      <AffiliateCTA links={review.affiliate} productName={review.model} />
      <SpecTable specs={review.specs} />
      <ProsCons pros={review.pros} cons={review.cons} />
      <Prose markdown={review.body} />
      <AdSlot slot="0000000000" />
      <FAQSection faq={review.faq} />
      <WhereToBuyStrip />
    </article>
  );
}
```

- [ ] **Step 4: Build + eyeball one page**

```bash
pnpm build && rg -c 'application/ld\+json' out/reviews/makita-xfd131.html
```
Expected: build exit 0; count ≥ 1 (JSON-LD present).

- [ ] **Step 5: Commit**

```bash
git add content/reviews app/reviews
git commit -m "feat: review routes + 4 seed drill reviews

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 11: Comparisons (`/compare`)

**Files:**
- Create: `components/compare/ComparisonTable.tsx`, `content/compare/makita-xfd131-vs-dewalt-dcd800.json`, `content/compare/milwaukee-2904-vs-bosch-gsr18v-400.json`, `app/compare/page.tsx`, `app/compare/[slug]/page.tsx`

- [ ] **Step 1: `components/compare/ComparisonTable.tsx`**

```tsx
import type { Compare } from '@/types/compare';

export default function ComparisonTable({ compare }: { compare: Compare }) {
  const mark = (adv: string | undefined, side: 'a' | 'b') =>
    adv === side ? 'font-semibold text-green-800 bg-green-50' : 'text-stone-700';
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[480px] overflow-hidden rounded-xl border border-stone-200 text-sm">
        <thead>
          <tr className="bg-stone-900 text-left text-white">
            <th className="px-4 py-3">Spec</th>
            <th className="px-4 py-3">{compare.productA.name}</th>
            <th className="px-4 py-3">{compare.productB.name}</th>
          </tr>
        </thead>
        <tbody>
          {compare.rows.map((row, i) => (
            <tr key={row.label} className={i % 2 ? 'bg-white' : 'bg-stone-50'}>
              <th scope="row" className="px-4 py-3 text-left font-semibold text-stone-900">
                {row.label}
              </th>
              <td className={`px-4 py-3 ${mark(row.advantage, 'a')}`}>{row.a}</td>
              <td className={`px-4 py-3 ${mark(row.advantage, 'b')}`}>{row.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Author the two comparison JSON files** per `types/compare.ts`. Each: 8–12 spec rows with `advantage` marks, a `verdict` that names the winner in the first sentence, 800+ word body, 5+ FAQ, `related` pointing at both reviews and `best-cordless-drill-2026`.

- [ ] **Step 3: Create `app/compare/page.tsx` and `app/compare/[slug]/page.tsx`** — same pattern as Task 10 Steps 2–3 with these differences: loaders `getCompares()`/`getCompare()`; index hero title "Tool comparisons"; detail page renders, in order: `Breadcrumbs`, `h1`, dates line, a verdict callout (below), `ComparisonTable`, `AffiliateCTA` for the winner's review affiliate links (look up via `getReview(compare.winner === 'a' ? compare.productA.reviewSlug : compare.productB.reviewSlug)`, skip when `winner === 'tie'`), `Prose`, `AdSlot`, `FAQSection`, `WhereToBuyStrip`. JSON-LD: `faqJsonLd` + `breadcrumbJsonLd` (no Product schema — two products on one page dilutes it). Verdict callout markup:

```tsx
<aside className="mt-8 rounded-2xl border-2 border-amber-300 bg-amber-50 p-6">
  <h2 className="text-xl font-bold text-stone-900">The short answer</h2>
  <p className="mt-2 leading-relaxed text-stone-700">{compare.verdict}</p>
</aside>
```

- [ ] **Step 4: Build**

```bash
pnpm build
```
Expected: exit 0, `out/compare/makita-xfd131-vs-dewalt-dcd800.html` exists.

- [ ] **Step 5: Commit**

```bash
git add components/compare content/compare app/compare
git commit -m "feat: comparison routes + 2 seed head-to-heads

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 12: Buying guides (`/guides`)

**Files:**
- Create: `components/guides/RankedPickCard.tsx`, `content/guides/best-cordless-drill-2026.json`, `content/guides/best-drill-for-beginners.json`, `content/guides/best-budget-cordless-drills.json`, `app/guides/page.tsx`, `app/guides/[slug]/page.tsx`

- [ ] **Step 1: `components/guides/RankedPickCard.tsx`**

```tsx
import Link from 'next/link';
import { SmartCtaButton } from '@/components/monetization/SmartCtaButton';
import type { GuidePick } from '@/types/guide';

export default function RankedPickCard({ pick }: { pick: GuidePick }) {
  return (
    <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 font-bold text-white">
          {pick.rank}
        </span>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
          {pick.awardLabel}
        </span>
      </div>
      <h3 className="mt-3 text-xl font-bold text-stone-900">{pick.name}</h3>
      <p className="mt-2 leading-relaxed text-stone-700">{pick.summary}</p>
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <ul className="space-y-1">
          {pick.pros.map((p) => (
            <li key={p} className="text-green-800">✓ {p}</li>
          ))}
        </ul>
        <ul className="space-y-1">
          {pick.cons.map((c) => (
            <li key={c} className="text-red-800">✗ {c}</li>
          ))}
        </ul>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        {pick.affiliate?.url && (
          <SmartCtaButton
            href={pick.affiliate.url}
            className="inline-block rounded-xl bg-amber-600 px-5 py-2.5 font-semibold text-white hover:bg-amber-700"
          >
            Check price at {pick.affiliate.merchant}
          </SmartCtaButton>
        )}
        {pick.reviewSlug && (
          <Link href={`/reviews/${pick.reviewSlug}`} className="font-medium text-amber-700 underline">
            Read our full review →
          </Link>
        )}
      </div>
      {pick.affiliate?.url && (
        <p className="mt-2 text-xs text-stone-500">We may earn a commission from this link.</p>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Author the three guide JSON files** per `types/guide.ts`. `best-cordless-drill-2026`: 5 picks ranked (XFD131, DCD800, 2904, GSR18V-400 + one budget pick e.g. Ryobi PCL206), each pick's `reviewSlug` set where a review exists, `affiliate.url` null for now (CPA sync fills it). `intro` answers "what is the best cordless drill in 2026" in sentence one. 800+ word body covering how we evaluate, 5+ FAQ.

- [ ] **Step 3: Create `app/guides/page.tsx` and `app/guides/[slug]/page.tsx`** — same pattern as Task 10 Steps 2–3 with: loaders `getGuides()`/`getGuide()`; detail page order: `Breadcrumbs`, `h1`, dates, intro paragraph (`<p className="mt-4 text-lg leading-relaxed text-stone-700">{guide.intro}</p>`), `itemListJsonLd(guide.title, picks…)` + `faqJsonLd` + `breadcrumbJsonLd`, then `guide.picks.map(p => <RankedPickCard key={p.rank} pick={p} />)`, `Prose`, `AdSlot`, `FAQSection`, `WhereToBuyStrip`.

- [ ] **Step 4: Build**

```bash
pnpm build
```
Expected: exit 0, `out/guides/best-cordless-drill-2026.html` exists.

- [ ] **Step 5: Commit**

```bash
git add components/guides content/guides app/guides
git commit -m "feat: guide routes + 3 seed buying guides

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 13: Brand & category hubs

**Files:**
- Create: `content/brands/makita.json`, `content/brands/bosch.json`, `content/categories/cordless-drills.json`
- Create: `app/brands/page.tsx`, `app/brands/[brand]/page.tsx`, `app/categories/page.tsx`, `app/categories/[category]/page.tsx`

- [ ] **Step 1: Author brand/category JSON** per `types/brand.ts` / `types/category.ts`. Brand hubs: 400+ word markdown description (history, pro vs DIY lines, battery platform), `knownFor` list, 5 FAQ. Category hub: 400+ words on what matters when buying (voltage, brushless, torque, chuck), 4+ `buyingFactors`, 5 FAQ. **No affiliate links on hubs** (spec rule).

- [ ] **Step 2: Create the four route files.** `app/brands/[brand]/page.tsx` (params key `brand`; same generateStaticParams/metadata pattern as Task 10) renders: Breadcrumbs, `h1` ("Makita power tools"), `Prose` of description, "Known for" pill list, a grid of `ReviewCard` for `getReviews().filter(r => r.brand === params.brand)`, `FAQSection` + `faqJsonLd` + `breadcrumbJsonLd`. `app/categories/[category]/page.tsx` (params key `category`): same plus a `buyingFactors` section:

```tsx
<div className="mt-8 grid gap-4 sm:grid-cols-2">
  {category.buyingFactors.map((f) => (
    <div key={f.title} className="rounded-xl border border-stone-200 bg-white p-5">
      <h3 className="font-bold text-stone-900">{f.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{f.text}</p>
    </div>
  ))}
</div>
```
Index pages list hubs as link cards (name + one-line description), with `itemListJsonLd`.

- [ ] **Step 3: Build**

```bash
pnpm build
```
Expected: exit 0; `out/brands/makita.html`, `out/categories/cordless-drills.html` exist.

- [ ] **Step 4: Commit**

```bash
git add content/brands content/categories app/brands app/categories
git commit -m "feat: brand and category hub routes + seed hubs

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 14: Homepage

**Files:**
- Modify: `app/page.tsx` (replace the coming-soon placeholder)

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import WhereToBuyStrip from '@/components/monetization/WhereToBuyStrip';
import ReviewCard from '@/components/reviews/ReviewCard';
import { getCategories, getGuides, getReviews } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'shabitools — Honest Home & Power Tool Reviews',
  description:
    'Independent reviews, head-to-head comparisons, and buying guides for Makita, DeWalt, Bosch, and Milwaukee power tools. Clear verdicts: buy it or skip it.',
  path: '',
});

export default function HomePage() {
  const reviews = getReviews().slice(0, 6);
  const guides = getGuides().slice(0, 3);
  const categories = getCategories();
  return (
    <>
      <PageHero
        title="Power tool reviews you can actually use"
        subtitle="We test the claims, compare the specs, and end every review with a straight answer: buy it, or skip it."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/guides/best-cordless-drill-2026"
            className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white shadow hover:bg-amber-700"
          >
            Best cordless drills 2026
          </Link>
          <Link
            href="/reviews"
            className="rounded-xl border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-800 hover:border-amber-400"
          >
            Browse all reviews
          </Link>
        </div>
      </PageHero>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-stone-900">Latest reviews</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <ReviewCard key={r.slug} review={r} />
          ))}
        </div>
        <h2 className="mt-14 text-2xl font-bold text-stone-900">Buying guides</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm hover:border-amber-300 hover:shadow-md"
            >
              <h3 className="font-bold text-stone-900">{g.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-stone-600">{g.intro}</p>
            </Link>
          ))}
        </div>
        <h2 className="mt-14 text-2xl font-bold text-stone-900">Shop by category</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="rounded-full border border-stone-300 px-5 py-2 font-medium text-stone-700 hover:border-amber-400 hover:text-amber-700"
            >
              {c.name}
            </Link>
          ))}
        </div>
        <WhereToBuyStrip max={8} />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Build + verify**

```bash
pnpm build && rg -c "Latest reviews" out/index.html
```
Expected: 1.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: homepage with featured reviews, guides, categories

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 15: Trust & legal pages

**Files:**
- Create: `app/about/page.tsx`, `app/contact/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/affiliate-disclosure/page.tsx`

- [ ] **Step 1: Create all five pages.** Each is a server component using `pageMetadata` + `PageHero` + prose in a `max-w-3xl` container. Required content:
  - **/about** (E-E-A-T): who runs shabitools, the review methodology (spec verification, cross-source comparison, price tracking), why readers can trust verdicts, and an honest line that the site earns affiliate commissions.
  - **/contact**: email contact (`mailto:` link — static site, no form backend) + response expectations.
  - **/affiliate-disclosure** (FTC): plain-language disclosure that links to Admitad-network merchants earn commission, that this never changes the price, and that rankings are not sold.
  - **/privacy**: AdSense cookies/personalized ads disclosure (Google requirement), affiliate click tracking, no accounts/no data sold.
  - **/terms**: standard ToS, content is informational, no warranty.

- [ ] **Step 2: Build**

```bash
pnpm build && ls out/about.html out/affiliate-disclosure.html out/privacy.html out/terms.html out/contact.html
```
Expected: all five files listed.

- [ ] **Step 3: Commit**

```bash
git add app/about app/contact app/privacy app/terms app/affiliate-disclosure
git commit -m "feat: trust and legal pages

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 16: 404 page refresh

**Files:**
- Modify: `app/not-found.tsx`

- [ ] **Step 1: Update `app/not-found.tsx`** to link to `/reviews`, `/guides`, `/stores` with the new visual style (PageHero + link buttons). Keep it short.

- [ ] **Step 2: Build + commit**

```bash
pnpm build
git add app/not-found.tsx
git commit -m "feat: 404 page for new IA

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Phase 3 — Admitad CPC layer (port from aibuzz)

### Task 17: Port harvest/merge/copy scripts

**Files:**
- Create: `scripts/admitadLogin.js`, `scripts/harvestPartnerPrograms.js`, `scripts/mergePartnerPrograms.js`, `scripts/generateLandingCopy.js` (all copied from `/Users/guym/Projects/aibuzz/scripts/` then edited)
- Modify: `package.json`, `.gitignore`

- [ ] **Step 1: Copy + install devDeps**

```bash
mkdir -p scripts
cp /Users/guym/Projects/aibuzz/scripts/admitadLogin.js scripts/
cp /Users/guym/Projects/aibuzz/scripts/harvestPartnerPrograms.js scripts/
cp /Users/guym/Projects/aibuzz/scripts/mergePartnerPrograms.js scripts/
cp /Users/guym/Projects/aibuzz/scripts/generateLandingCopy.js scripts/
pnpm add -D playwright slugify dotenv
pnpm exec playwright install chromium
```

- [ ] **Step 2: Edit `scripts/admitadLogin.js` and `scripts/harvestPartnerPrograms.js`** — remove the aibuzz default website id; require env. In BOTH files replace the website-id constant with:

```js
const WEBSITE_ID = process.env.HARVEST_WEBSITE_ID;
if (!WEBSITE_ID) {
  throw new Error('Set HARVEST_WEBSITE_ID to the shabitools ad-space id (Admitad dashboard URL …/websites/<id>/…)');
}
```
(In `admitadLogin.js` the variable may be named `WEBSITE_ID` with a different default — same treatment. Read the copied file first.)

- [ ] **Step 3: Add category + blocklist filtering to `scripts/harvestPartnerPrograms.js`.** Near the existing `KEYWORDS` const add:

```js
// Comma-separated catalog category ids, e.g. HARVEST_CATEGORIES=11,57
const CATEGORIES = (process.env.HARVEST_CATEGORIES || '').trim();
// Programs matching this regex are dropped even if a category/keyword matches.
const BLOCKLIST = process.env.HARVEST_BLOCKLIST
  ? new RegExp(process.env.HARVEST_BLOCKLIST, 'i')
  : /flower|fitness|insurance|halloween|incontinen|casino|bet|dating|pharma/i;
```
Where the script builds the paged list URL (`…/offers/all_partners_programs/?limit=…&offset=…`), append the category filter:

```js
const listUrl = `${API_BASE}/all_partners_programs/?limit=100&offset=${offset}` +
  (CATEGORIES ? `&categories=${encodeURIComponent(CATEGORIES)}` : '');
```
Where programs are filtered by `KEYWORDS`, also drop blocklisted ones:

```js
if (BLOCKLIST.test(program.name)) continue;
```

- [ ] **Step 4: Add a category-listing mode** so the user can pick home/DIY ids (the ids in `admitad/PLAN.md` are dev-tool categories — do not reuse). At the top of the harvest IIFE, after login validation, add:

```js
if (process.env.PRINT_CATEGORIES) {
  const res = await apiGet(`${API_BASE}/partners_programs_filter_data/`);
  console.log(res.body);
  await context.close();
  return;
}
```
Run later (needs login + ad-space id) as:
`HARVEST_WEBSITE_ID=<id> PRINT_CATEGORIES=1 node scripts/harvestPartnerPrograms.js`

- [ ] **Step 5: Rewrite the DeepSeek prompt in `scripts/generateLandingCopy.js`.** Find the system-prompt string describing the site (mentions "aibuzz.world" / AI-tech) and replace with:

```
You write landing-page copy for shabitools.com, an independent US home & power
tools review site for DIY homeowners and tradespeople. Each landing page
introduces an online store or brand program where readers can buy tools and
home-improvement gear. Voice: practical, trustworthy, no hype. Audience: people
shopping for power tools (drills, saws, sanders), hand tools, and workshop
equipment. Always return strict JSON with keys: headline, subheadline, intro,
benefits (array of 4-6 strings), howItWorks (array of 3-4 strings), faq (array
of {q,a}, 4-6 items), ctaLabel, metaTitle (<=60 chars), metaDescription
(<=160 chars). Write in English. Do not invent discounts or prices.
```
Keep the rest of the script (idempotency, concurrency pool) untouched.

- [ ] **Step 6: `mergePartnerPrograms.js`** — read the copied file; verify its reserved-route guard reads this repo's `app/` dir (it scans `APP_DIR` — path already relative, OK) and that output is `content/admitad-landings.json`. No code change expected; confirm only.

- [ ] **Step 7: Add scripts + gitignore entries.** In `package.json`:

```json
"partners:login": "node scripts/admitadLogin.js",
"partners:harvest": "node scripts/harvestPartnerPrograms.js",
"partners:manual": "node scripts/mergePartnerPrograms.js",
"partners:copy": "node scripts/generateLandingCopy.js",
"partners:sync": "pnpm partners:manual && pnpm partners:copy"
```
In `.gitignore` add:

```
.admitad-profile/
.env.local
```

- [ ] **Step 8: Syntax-check + commit**

```bash
node --check scripts/admitadLogin.js && node --check scripts/harvestPartnerPrograms.js && \
node --check scripts/mergePartnerPrograms.js && node --check scripts/generateLandingCopy.js
git add scripts package.json pnpm-lock.yaml .gitignore
git commit -m "feat: port Admitad harvest/merge/copy scripts for home-tools niche

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 18: Store landing pages (`/stores`, `/stores/[slug]`)

**Files:**
- Create: `lib/partnerLandings.ts` (NOT needed — `getStoreLandings` in `lib/content.ts` already covers it; skip), `components/landings/StoreLanding.tsx`, `app/stores/page.tsx`, `app/stores/[slug]/page.tsx`
- Create: `content/admitad-landings.json` (empty scaffold so builds pass pre-harvest)

- [ ] **Step 1: Scaffold empty landings file**

```json
{ "entries": [] }
```
Write to `content/admitad-landings.json` (committed — harvest output replaces it later).

- [ ] **Step 2: `components/landings/StoreLanding.tsx`** — port the structure of `/Users/guym/Projects/aibuzz/components/landings/CampaignLanding.tsx` but restyle in the shabitools system. Implement fresh (cleaner than editing 287 lines of aibuzz styling):

```tsx
import { SmartCtaButton } from '@/components/monetization/SmartCtaButton';
import FAQSection from '@/components/seo/FAQSection';
import type { StoreLanding as StoreLandingData } from '@/types/landing';

export default function StoreLanding({ landing }: { landing: StoreLandingData }) {
  const goHref = `/go/${landing.slug}`;
  const copy = landing.content;
  const cta = (label: string) => (
    <div>
      <SmartCtaButton
        href={goHref}
        className="inline-block rounded-xl bg-amber-600 px-8 py-3.5 text-lg font-semibold text-white shadow hover:bg-amber-700"
      >
        {label}
      </SmartCtaButton>
      <p className="mt-2 text-xs text-stone-500">
        Sponsored link — we may earn a commission, at no extra cost to you.
      </p>
    </div>
  );
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <header className="text-center">
        {landing.image && (
          // eslint-disable-next-line @next/next/no-img-element -- remote CDN logo, unoptimized by design (static export)
          <img src={landing.image} alt={`${landing.name} logo`} className="mx-auto h-16 w-auto object-contain" loading="lazy" />
        )}
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          {copy?.headline ?? landing.name}
        </h1>
        <p className="mt-3 text-lg text-stone-600">{copy?.subheadline ?? landing.description ?? ''}</p>
        <div className="mt-6">{cta(copy?.ctaLabel ?? `Visit ${landing.name}`)}</div>
      </header>
      {copy && (
        <>
          <p className="mt-10 leading-relaxed text-stone-700">{copy.intro}</p>
          <h2 className="mt-10 text-2xl font-bold text-stone-900">Why shop here</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {copy.benefits.map((b) => (
              <li key={b} className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-700">
                ✓ {b}
              </li>
            ))}
          </ul>
          <h2 className="mt-10 text-2xl font-bold text-stone-900">How it works</h2>
          <ol className="mt-4 space-y-3">
            {copy.howItWorks.map((step, i) => (
              <li key={step} className="flex gap-3 text-stone-700">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <FAQSection faq={copy.faq} />
        </>
      )}
      <div className="mt-12 text-center">{cta(copy?.ctaLabel ?? `Visit ${landing.name}`)}</div>
    </article>
  );
}
```

- [ ] **Step 3: `app/stores/[slug]/page.tsx`** — note the **placeholder param** trick (Next 14 static export rejects an empty `generateStaticParams`; port of aibuzz behavior):

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StoreLanding from '@/components/landings/StoreLanding';
import JsonLd from '@/components/seo/JsonLd';
import { getStoreLanding, getStoreLandings } from '@/lib/content';
import { faqJsonLd } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  const landings = getStoreLandings();
  // Next 14 export fails on an empty array — emit a placeholder that 404s.
  if (!landings.length) return [{ slug: '__placeholder' }];
  return landings.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const landing = getStoreLanding(params.slug);
  if (!landing) return { robots: { index: false } };
  return pageMetadata({
    title: landing.content?.metaTitle ?? `${landing.name} — Tools & Deals`,
    description:
      landing.content?.metaDescription ??
      `Shop ${landing.name} for power tools and home-improvement gear.`,
    path: `/stores/${landing.slug}`,
  });
}

export default function StorePage({ params }: { params: { slug: string } }) {
  const landing = getStoreLanding(params.slug);
  if (!landing) notFound();
  return (
    <>
      {landing.content?.faq?.length ? <JsonLd data={faqJsonLd(landing.content.faq)} /> : null}
      <StoreLanding landing={landing} />
    </>
  );
}
```

- [ ] **Step 4: `app/stores/page.tsx`** — index with ItemList JSON-LD:

```tsx
import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import JsonLd from '@/components/seo/JsonLd';
import { getStoreLandings } from '@/lib/content';
import { itemListJsonLd } from '@/lib/schema';
import { pageMetadata, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Tool Stores & Deals',
  description:
    'Online stores we link to for power tools, hand tools, and home-improvement gear — with current programs and deals.',
  path: '/stores',
});

export default function StoresPage() {
  const stores = getStoreLandings();
  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          'Tool stores',
          stores.map((s) => ({ name: s.name, url: `${SITE_URL}/stores/${s.slug}` }))
        )}
      />
      <PageHero
        title="Tool stores & deals"
        subtitle="Stores we partner with. Links are sponsored — see our affiliate disclosure."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {stores.length === 0 && (
          <p className="text-stone-600">Store pages are coming soon — check back shortly.</p>
        )}
        {stores.map((s) => (
          <Link
            key={s.slug}
            href={`/stores/${s.slug}`}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm hover:border-amber-300 hover:shadow-md"
          >
            <h2 className="font-bold text-stone-900">{s.name}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-stone-600">
              {s.content?.subheadline ?? s.description ?? ''}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 5: Build (placeholder path)**

```bash
pnpm build && ls out/stores.html
```
Expected: exit 0; stores index exists; `out/stores/__placeholder.html` exists and 404s (it calls `notFound()`).

- [ ] **Step 6: Commit**

```bash
git add components/landings app/stores content/admitad-landings.json
git commit -m "feat: store landing pages for Admitad CPC programs

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 19: `/go/` redirects via Pages `_redirects` — TDD

**Files:**
- Create: `scripts/generateGoRedirects.js`
- Test: `scripts/__tests__/generateGoRedirects.test.ts`
- Modify: `package.json` (build chain), `app/robots.ts`

- [ ] **Step 1: Write the failing test**

```ts
// scripts/__tests__/generateGoRedirects.test.ts
import { describe, expect, it } from 'vitest';
import { buildRedirectLines } from '../generateGoRedirects.js';

describe('buildRedirectLines', () => {
  it('emits legacy /tools rules plus one 302 per linked entry', () => {
    const lines = buildRedirectLines([
      { slug: 'acme-tools-us', admitad: { gotolink: 'https://tatrck.com/h/abc' } },
      { slug: 'no-link', admitad: { gotolink: null } },
      {
        slug: 'vevor-us',
        admitad: { gotolink: 'https://tatrck.com/h/def', cpcGotolink: 'https://tatrck.com/h/ghi' },
      },
    ]);
    expect(lines[0]).toBe('/tools / 301');
    expect(lines[1]).toBe('/tools/* / 301');
    expect(lines).toContain('/go/acme-tools-us https://tatrck.com/h/abc 302');
    expect(lines).toContain('/go/vevor-us~cpc https://tatrck.com/h/ghi 302');
    expect(lines.join('\n')).not.toContain('no-link');
  });

  it('throws past the Cloudflare 2000-static-rule limit', () => {
    const entries = Array.from({ length: 2001 }, (_, i) => ({
      slug: `s${i}`,
      admitad: { gotolink: 'https://tatrck.com/h/x' },
    }));
    expect(() => buildRedirectLines(entries)).toThrow(/2000/);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:unit
```

- [ ] **Step 3: Implement `scripts/generateGoRedirects.js`**

```js
#!/usr/bin/env node
/**
 * Generate public/_redirects for Cloudflare Pages:
 *  - legacy /tools/* → / (301, preserve old SEO equity)
 *  - /go/<slug> → tracking link (302, server-side) — the ad-blocker fix:
 *    page HTML only ever contains first-party /go/ URLs, never tatrck.com.
 * Source of truth: content/admitad-landings.json. Run before every build.
 */
const fs = require('fs');
const path = require('path');

const LEGACY = ['/tools / 301', '/tools/* / 301'];
const LIMIT = 2000; // Cloudflare Pages static-redirect cap

function buildRedirectLines(entries) {
  const lines = [...LEGACY];
  for (const e of entries) {
    const link = e?.admitad?.gotolink;
    if (e?.slug && typeof link === 'string' && /^https:\/\//.test(link)) {
      lines.push(`/go/${e.slug} ${link} 302`);
      const cpc = e.admitad.cpcGotolink;
      if (typeof cpc === 'string' && /^https:\/\//.test(cpc)) {
        lines.push(`/go/${e.slug}~cpc ${cpc} 302`);
      }
    }
  }
  if (lines.length > LIMIT) {
    throw new Error(`${lines.length} redirect rules exceed Cloudflare's ${LIMIT} static-rule limit`);
  }
  return lines;
}

module.exports = { buildRedirectLines };

if (require.main === module) {
  const dataFile = path.join(__dirname, '..', 'content', 'admitad-landings.json');
  let entries = [];
  try {
    entries = JSON.parse(fs.readFileSync(dataFile, 'utf8')).entries || [];
  } catch {
    /* pre-harvest: legacy rules only */
  }
  const lines = buildRedirectLines(entries);
  const out = path.join(__dirname, '..', 'public', '_redirects');
  fs.writeFileSync(out, lines.join('\n') + '\n');
  console.log(`[go-redirects] wrote ${lines.length} rules (${lines.length - LEGACY.length} affiliate) to public/_redirects`);
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:unit
```

- [ ] **Step 5: Chain into the build** (explicit chaining — pnpm does not auto-run pre/post hooks). In `package.json` change:

```json
"build": "node scripts/generateGoRedirects.js && next build",
```

- [ ] **Step 6: Disallow `/go/` in `app/robots.ts`** — set rules to:

```ts
rules: { userAgent: '*', allow: '/', disallow: ['/go/'] },
```
(Read the existing file and patch the `rules` value, keeping the sitemap reference.)

- [ ] **Step 7: Build + verify `_redirects` ships**

```bash
pnpm build && head -3 out/_redirects && rg -c "Disallow: /go/" out/robots.txt
```
Expected: first lines are the `/tools` rules; robots count 1.

- [ ] **Step 8: Commit**

```bash
git add scripts/generateGoRedirects.js scripts/__tests__ package.json app/robots.ts public/_redirects
git commit -m "feat: first-party /go/ 302 redirects via Pages _redirects

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
(If `public/_redirects` is generated-only, that's fine to commit — it's deterministic from committed content.)

### Task 20: Run the harvest (BLOCKED on user — manual Admitad steps)

**Pre-requisites the user must complete first** (re-state when reaching this task):
1. Create the shabitools ad space in the Admitad dashboard → note `websiteId`.
2. Connect the ad space to the partner catalog (one-time approval).
3. Provide `DEEPSEEK_API_KEY` in `.env.local` and `HARVEST_WEBSITE_ID` in `.env`.

- [ ] **Step 1: Login (user-interactive, real Chrome)** — or reuse the aibuzz session:

```bash
# Option A: fresh login (opens a browser; user signs in)
HARVEST_WEBSITE_ID=<id> pnpm partners:login
# Option B: reuse aibuzz session
cp -R /Users/guym/Projects/aibuzz/.admitad-profile .admitad-profile
```

- [ ] **Step 2: Discover home/DIY category ids**

```bash
HARVEST_WEBSITE_ID=<id> PRINT_CATEGORIES=1 node scripts/harvestPartnerPrograms.js | head -100
```
Pick ids for Home Improvement / DIY / Garden / Household appliances from the printed tree.

- [ ] **Step 3: Filtered harvest** (categories + US keyword bias + blocklist defaults):

```bash
HARVEST_WEBSITE_ID=<id> HARVEST_CATEGORIES=<ids> pnpm partners:harvest
jq '.programs | length' content/partner-programs.json
```
Expected: roughly 50–150 programs. If far more, tighten with `HARVEST_KEYWORDS='tool|hardware|drill|saw|garden|depot|vevor|diy|workshop|fix|build'`.

- [ ] **Step 4: Merge + generate copy + rebuild redirects + build**

```bash
pnpm partners:sync && pnpm build
```
Expected: `content/admitad-landings.json` entries with `content` filled; build green; `out/_redirects` now has one 302 line per store.

- [ ] **Step 5: Verify zero tracker leaks**

```bash
rg -l "tatrck" out --glob '*.html'
```
Expected: NO output (the postbuild guard in Task 23 automates this).

- [ ] **Step 6: Commit harvested content**

```bash
git add content/partner-programs.json content/admitad-landings.json public/_redirects
git commit -m "content: harvest US home-improvement partner programs

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Phase 4 — CPA layer (official Admitad API)

### Task 21: `scripts/admitadSync.js` — fill CPA deeplinks into content — TDD

**Files:**
- Create: `scripts/admitadSync.js`
- Test: `scripts/__tests__/admitadSync.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write the failing test** (test the pure transform, not the network):

```ts
// scripts/__tests__/admitadSync.test.ts
import { describe, expect, it } from 'vitest';
import { fillAffiliateUrls } from '../admitadSync.js';

describe('fillAffiliateUrls', () => {
  const deeplinkFor = async (campaignId: number, productUrl: string) =>
    `https://ad.admitad.com/g/${campaignId}/?ulp=${encodeURIComponent(productUrl)}`;

  it('fills url for entries with campaignId+productUrl, leaves others alone', async () => {
    const doc = {
      affiliate: [
        { merchant: 'Home Depot', url: null, campaignId: 123, productUrl: 'https://homedepot.com/p/1' },
        { merchant: 'CPC store', url: '/go/acme-tools-us' },
      ],
    };
    const { updated, changed } = await fillAffiliateUrls(doc, deeplinkFor);
    expect(changed).toBe(1);
    expect(updated.affiliate[0].url).toContain('ad.admitad.com/g/123');
    expect(updated.affiliate[1].url).toBe('/go/acme-tools-us');
  });

  it('skips docs without affiliate arrays', async () => {
    const { changed } = await fillAffiliateUrls({ slug: 'x' }, deeplinkFor);
    expect(changed).toBe(0);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test:unit
```

- [ ] **Step 3: Implement `scripts/admitadSync.js`**

```js
#!/usr/bin/env node
/**
 * Fill CPA deeplinks into content JSON via the official Admitad API.
 * Looks for affiliate entries shaped {merchant, url, campaignId, productUrl}
 * in content/reviews/*.json and content/guides/*.json (guide picks) and
 * regenerates `url` for every entry that has campaignId + productUrl.
 *
 * Env: ADMITAD_BASE64_HEADER (base64 of client_id:client_secret),
 *      ADMITAD_API_URL, ADMITAD_WEBSITE_ID.
 * Usage: pnpm admitad:sync   (then commit the changed content files)
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const API = process.env.ADMITAD_API_URL || 'https://api.admitad.com';

async function getToken() {
  const res = await fetch(`${API}/token/`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.ADMITAD_BASE64_HEADER}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.ADMITAD_CLIENT_ID,
      scope: 'deeplink_generator',
    }),
  });
  if (!res.ok) throw new Error(`token ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).access_token;
}

async function fetchDeeplink(token, websiteId, campaignId, productUrl) {
  const url = `${API}/deeplink/${websiteId}/advcampaign/${campaignId}/?ulp=${encodeURIComponent(productUrl)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`deeplink ${campaignId} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const link = Array.isArray(data) ? data[0] : data?.deeplink?.[0] ?? data?.deeplink;
  if (typeof link !== 'string') throw new Error(`unexpected deeplink payload for ${campaignId}`);
  return link;
}

/** Pure transform: walks affiliate arrays (top-level and inside picks[]). */
async function fillAffiliateUrls(doc, deeplinkFor) {
  let changed = 0;
  const fill = async (entry) => {
    if (entry && entry.campaignId && entry.productUrl) {
      entry.url = await deeplinkFor(entry.campaignId, entry.productUrl);
      changed += 1;
    }
  };
  if (Array.isArray(doc.affiliate)) for (const e of doc.affiliate) await fill(e);
  if (Array.isArray(doc.picks)) for (const p of doc.picks) await fill(p.affiliate);
  return { updated: doc, changed };
}

module.exports = { fillAffiliateUrls };

if (require.main === module) {
  (async () => {
    const websiteId = process.env.ADMITAD_WEBSITE_ID;
    if (!websiteId) throw new Error('Set ADMITAD_WEBSITE_ID (ad-space id)');
    const token = await getToken();
    const deeplinkFor = (cid, ulp) => fetchDeeplink(token, websiteId, cid, ulp);
    let total = 0;
    for (const dir of ['reviews', 'guides']) {
      const full = path.join(__dirname, '..', 'content', dir);
      if (!fs.existsSync(full)) continue;
      for (const f of fs.readdirSync(full).filter((x) => x.endsWith('.json'))) {
        const file = path.join(full, f);
        const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
        const { updated, changed } = await fillAffiliateUrls(doc, deeplinkFor);
        if (changed) {
          fs.writeFileSync(file, JSON.stringify(updated, null, 2) + '\n');
          total += changed;
          console.log(`[admitad-sync] ${dir}/${f}: ${changed} link(s)`);
        }
      }
    }
    console.log(`[admitad-sync] done — ${total} deeplink(s) filled`);
  })().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test:unit
```

- [ ] **Step 5: Add script + commit**

In `package.json`: `"admitad:sync": "node scripts/admitadSync.js"`.

```bash
git add scripts/admitadSync.js scripts/__tests__/admitadSync.test.ts package.json
git commit -m "feat: official-API CPA deeplink sync into content JSON

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 22: Join programs + wire real CPA links (BLOCKED on user)

- [ ] **Step 1: List candidate CPA programs for the user.** Run with token from Task 21 env:

```bash
node -e "
require('dotenv').config();
(async () => {
  const API = process.env.ADMITAD_API_URL || 'https://api.admitad.com';
  const res = await fetch(API + '/token/', { method: 'POST', headers: { Authorization: 'Basic ' + process.env.ADMITAD_BASE64_HEADER, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'client_credentials', client_id: process.env.ADMITAD_CLIENT_ID, scope: 'advcampaigns websites' }) });
  const token = (await res.json()).access_token;
  const camps = await (await fetch(API + '/advcampaigns/website/' + process.env.ADMITAD_WEBSITE_ID + '/?limit=200', { headers: { Authorization: 'Bearer ' + token } })).json();
  for (const c of camps.results || []) console.log(c.id, '|', c.name, '|', c.connection_status, '|', c.actions?.[0]?.payment_size || '');
})().catch(e => { console.error(e.message); process.exit(1); });
"
```
Present the home-improvement merchants to the user; they join 3–5 in the dashboard.

- [ ] **Step 2: After approval, set `campaignId` + real `productUrl`** in each review's `affiliate` array and guide picks (deep product URLs on the merchant site).

- [ ] **Step 3: Sync + verify + commit**

```bash
pnpm admitad:sync && pnpm build
git add content
git commit -m "content: live CPA deeplinks on reviews and guides

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Phase 5 — SEO / AEO / GEO hardening

### Task 23: Sitemap, build guard, llms.txt

**Files:**
- Modify: `app/sitemap.ts`, `package.json`
- Create: `scripts/checkBuild.js`, test `scripts/__tests__/checkBuild.test.ts`, `public/llms.txt`

- [ ] **Step 1: Replace `app/sitemap.ts`** — auto-generate from content:

```ts
import type { MetadataRoute } from 'next';
import {
  getBrands,
  getCategories,
  getCompares,
  getGuides,
  getReviews,
  getStoreLandings,
} from '@/lib/content';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '',
    '/reviews',
    '/compare',
    '/guides',
    '/brands',
    '/categories',
    '/stores',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/affiliate-disclosure',
  ].map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: 'weekly' as const }));

  const content = [
    ...getReviews().map((r) => ({ path: `/reviews/${r.slug}`, mod: r.dateModified })),
    ...getCompares().map((c) => ({ path: `/compare/${c.slug}`, mod: c.dateModified })),
    ...getGuides().map((g) => ({ path: `/guides/${g.slug}`, mod: g.dateModified })),
    ...getBrands().map((b) => ({ path: `/brands/${b.slug}`, mod: b.dateModified })),
    ...getCategories().map((c) => ({ path: `/categories/${c.slug}`, mod: c.dateModified })),
    ...getStoreLandings().map((s) => ({ path: `/stores/${s.slug}`, mod: undefined })),
  ].map((e) => ({
    url: `${SITE_URL}${e.path}`,
    ...(e.mod ? { lastModified: e.mod } : {}),
    changeFrequency: 'monthly' as const,
  }));

  return [...staticPaths, ...content];
}
```

- [ ] **Step 2: Write the failing test for the build guard**

```ts
// scripts/__tests__/checkBuild.test.ts
import { describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { auditOutDir } from '../checkBuild.js';

function makeOut(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shabi-out-'));
  for (const [rel, body] of Object.entries(files)) {
    const full = path.join(dir, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, body);
  }
  return dir;
}

describe('auditOutDir', () => {
  it('passes a clean small build', () => {
    const dir = makeOut({ 'index.html': '<a href="/go/x">go</a>', 'reviews/a.html': 'ok' });
    expect(auditOutDir(dir, 1500)).toMatchObject({ pageCount: 2, leaks: [] });
  });

  it('reports tatrck leaks', () => {
    const dir = makeOut({ 'bad.html': '<a href="https://tatrck.com/h/x">x</a>' });
    expect(auditOutDir(dir, 1500).leaks).toEqual([path.join(dir, 'bad.html')]);
  });

  it('flags page-cap violations', () => {
    const dir = makeOut({ 'a.html': '1', 'b.html': '2' });
    expect(auditOutDir(dir, 1).overCap).toBe(true);
  });
});
```

- [ ] **Step 3: Run — expect FAIL**

```bash
pnpm test:unit
```

- [ ] **Step 4: Implement `scripts/checkBuild.js`**

```js
#!/usr/bin/env node
/**
 * Post-build guard: (1) hard 1,500-page cap; (2) zero tatrck.com tracker
 * leaks in HTML (every monetized link must go through first-party /go/).
 * Fails the build (exit 1) on violation.
 */
const fs = require('fs');
const path = require('path');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const full = path.join(dir, d.name);
    return d.isDirectory() ? walk(full) : [full];
  });
}

function auditOutDir(outDir, cap) {
  const html = walk(outDir).filter((f) => f.endsWith('.html'));
  const leaks = html.filter((f) => fs.readFileSync(f, 'utf8').includes('tatrck.com'));
  return { pageCount: html.length, overCap: html.length > cap, leaks };
}

module.exports = { auditOutDir };

if (require.main === module) {
  const out = path.join(__dirname, '..', 'out');
  const { pageCount, overCap, leaks } = auditOutDir(out, 1500);
  console.log(`[check-build] ${pageCount}/1500 pages`);
  if (overCap) {
    console.error('[check-build] FAIL: page cap exceeded');
    process.exit(1);
  }
  if (leaks.length) {
    console.error(`[check-build] FAIL: tatrck.com leaked in:\n${leaks.join('\n')}`);
    process.exit(1);
  }
  console.log('[check-build] OK: under cap, zero tracker leaks');
}
```

- [ ] **Step 5: Run — expect PASS, then chain into build**

```bash
pnpm test:unit
```
In `package.json`:

```json
"build": "node scripts/generateGoRedirects.js && next build && node scripts/checkBuild.js",
```

- [ ] **Step 6: Create `public/llms.txt`**

```
# shabitools.com

Independent US reviews, comparisons, and buying guides for home & power tools
(Makita, DeWalt, Bosch, Milwaukee, Ryobi). Every review includes specs,
pros/cons, a rating out of 5, and a buy-it-if / skip-it-if verdict.

## Key sections
- /reviews — single-product reviews with spec tables and FAQs
- /compare — head-to-head tool comparisons with a declared winner
- /guides — ranked best-of buying guides
- /brands — brand background hubs
- /categories — category buying advice

Content is written and fact-checked by shabitools. Affiliate links are
disclosed at /affiliate-disclosure and never affect rankings.
```

- [ ] **Step 7: Build + verify + commit**

```bash
pnpm build && rg -c "reviews/makita-xfd131" out/sitemap.xml && ls out/llms.txt
git add app/sitemap.ts scripts/checkBuild.js scripts/__tests__/checkBuild.test.ts public/llms.txt package.json
git commit -m "feat: content-driven sitemap, build guards (1500-page cap, tracker leak), llms.txt

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Phase 6 — Tests, final verification

### Task 24: Playwright smoke tests

**Files:**
- Modify/Create: `tests/simple-check.spec.ts`

- [ ] **Step 1: Rewrite `tests/simple-check.spec.ts`** for the new IA:

```ts
import { expect, test } from '@playwright/test';

test('homepage renders hero, nav, and review cards', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/power tool/i);
  await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
  await expect(page.locator('a[href^="/reviews/"]').first()).toBeVisible();
});

test('review page has verdict, pros/cons, FAQ, and JSON-LD', async ({ page }) => {
  await page.goto('/reviews/makita-xfd131');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Makita');
  await expect(page.getByText('Our verdict')).toBeVisible();
  await expect(page.getByText('Pros')).toBeVisible();
  await expect(page.getByText('Frequently asked questions')).toBeVisible();
  expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0);
});

test('guide page renders ranked picks', async ({ page }) => {
  await page.goto('/guides/best-cordless-drill-2026');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/best cordless drill/i);
  await expect(page.getByText('Best overall')).toBeVisible();
});

test('no tracker URLs in rendered HTML', async ({ page }) => {
  for (const path of ['/', '/reviews/makita-xfd131', '/stores']) {
    await page.goto(path);
    expect(await page.content()).not.toContain('tatrck.com');
  }
});
```

- [ ] **Step 2: Check `playwright.config.ts` serves the static build** (it should run `pnpm dev` or serve `out/` — read it; if it uses a dev-server webServer config, leave as is).

- [ ] **Step 3: Run**

```bash
pnpm test:simple
```
Expected: 4 passed.

- [ ] **Step 4: Commit**

```bash
git add tests
git commit -m "test: smoke tests for new IA + tracker-leak check

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 25: Final verification sweep (no deploy)

- [ ] **Step 1: Full gate**

```bash
pnpm exec tsc --noEmit && pnpm test:unit && pnpm build && pnpm test:simple
```
Expected: all green; `[check-build]` prints page count ≤ 1500 and zero leaks.

- [ ] **Step 2: Manual spot-checks**

```bash
rg -c 'rel="sponsored nofollow' out/reviews/makita-xfd131.html   # ≥1 when CTAs live
rg -o '<title>[^<]*' out/reviews/makita-xfd131.html               # unique, ≤60 chars target
head -5 out/_redirects
rg -c 'verify-admitad' out/index.html                             # 1
```

- [ ] **Step 3: Report to user** — page count, what's blocked on manual Admitad steps (Tasks 20 & 22), and that deploy awaits their go-ahead (`pnpm deploy:production`). Post-deploy checklist for them: submit sitemap in Google Search Console, click Verify in Admitad, create 2 AdSense ad units and replace the `"0000000000"` slot ids.
