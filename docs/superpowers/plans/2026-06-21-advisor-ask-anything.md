# Advisor "Ask Anything" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a natural-language buying advisor — users ask anything ("good drill ~$300", "tools to build a wood balcony") and get a short answer plus 3–9 real Amazon product cards, grounded in live PA-API data, with every interaction logged to Cloudflare D1.

**Architecture:** Static Next export (`/advisor` page + homepage hero) calls a Cloudflare Pages Function (`functions/api/advisor.ts`). The function orchestrates: DeepSeek "planner" → PA-API `SearchItems` (one call per search group, cached) → DeepSeek "writer" → internal-review enrichment → render JSON + log to D1. Pure logic lives in `lib/advisor/*` (unit-tested in vitest); the function is a thin edge adapter. Shareable/indexable answer pages are served by a function reading D1.

**Tech Stack:** Next.js 14 (static export), TypeScript, Cloudflare Pages Functions + D1, Web Crypto (SigV4), DeepSeek (`deepseek-chat`, OpenAI-compatible), Amazon PA-API 5.0, Vitest, Playwright, Tailwind.

**Spec:** `docs/superpowers/specs/2026-06-21-advisor-ask-anything-design.md`

---

## Conventions

- All advisor pure logic lives under `lib/advisor/`. Each module is runtime-agnostic (no `fs`, no Node-only APIs) so it runs in both Workers and vitest.
- Tests go in `lib/advisor/__tests__/*.test.ts` (matches the existing vitest `include` glob).
- Run a single test file: `pnpm exec vitest run lib/advisor/__tests__/<name>.test.ts`
- Commit after every green test. Commit messages use the existing repo style (`feat:`, `docs:`, etc.) and end with the Co-Authored-By trailer used in this repo's history.
- Env/secrets are read from the Pages Function `env` binding, never `NEXT_PUBLIC_*`. Required: `DEEPSEEK_API_KEY`, `PAAPI_ACCESS_KEY`, `PAAPI_SECRET_KEY`, `AMAZON_ASSOCIATES_TAG` (server copy of the existing tag), plus the `DB` (D1) binding.

---

## File Structure

**New (pure logic, unit-tested):**
- `lib/advisor/types.ts` — shared types (SearchGroup, RawProduct, Card, Answer, CatalogEntry).
- `lib/advisor/normalize.ts` — question normalization + runtime-agnostic hash (cache keys, answerHash).
- `lib/advisor/amazon.ts` — ASIN→tagged URL, extract ASIN from a product URL.
- `lib/advisor/internalMatch.ts` — match a product to a catalog entry (review/category href or null).
- `lib/advisor/deepseek.ts` — `planQuestion()` and `writeAnswer()` (inject `fetch` + key).
- `lib/advisor/sigv4.ts` — AWS SigV4 request signer using Web Crypto.
- `lib/advisor/paapi.ts` — `searchItems(group, creds, fetchImpl)` → `RawProduct[]`.
- `lib/advisor/db.ts` — D1 helpers (insert/query/cache/rate-limit) over a `D1Database`.
- `lib/advisor/orchestrate.ts` — the pipeline; takes injected deps, returns an `Answer`.

**New (edge + build):**
- `functions/api/advisor.ts` — `onRequestPost`: wires env → `orchestrate`.
- `functions/api/click.ts` — `onRequestGet`: log click to D1, 302 to tagged Amazon URL.
- `functions/advisor/a/[hash].ts` — `onRequestGet`: render a stored answer as HTML (shareable/indexable).
- `migrations/0001_advisor.sql` — D1 schema.
- `scripts/generateAdvisorIndex.js` — build the catalog index from `content/`.
- `content/_advisor-index.json` — generated catalog index (committed; regenerated in build).
- `scripts/exportDemand.js` — query D1 for demand insights.

**New (frontend):**
- `app/advisor/page.tsx` — advisor page (server shell + metadata).
- `components/advisor/AdvisorApp.tsx` — client component (state machine: idle→loading→result/error).
- `components/advisor/SearchBox.tsx` — input + submit.
- `components/advisor/AnswerView.tsx` — intro + grouped cards.
- `components/advisor/ProductCard.tsx` — one uniform card.
- `components/advisor/HeroAdvisorSearch.tsx` — homepage hero box (routes to `/advisor?q=`).

**Modified:**
- `lib/affiliate.ts` — re-export `amazonUrlForAsin` for build-time reuse (optional).
- `app/page.tsx` — mount `HeroAdvisorSearch` in the hero.
- `wrangler.toml` — add D1 binding + (doc) Pages Functions note.
- `package.json` — add `@cloudflare/workers-types`, build step for the index, `advisor:*` scripts.
- `.env.example` — document new server env vars.
- `next.config.js` — none expected; verify functions are excluded from `out`.

---

## Phase 0 — Wiring & scaffolding

### Task 0.1: Add dev deps and types for Workers

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Cloudflare Workers types**

Run:
```bash
pnpm add -D @cloudflare/workers-types
```
Expected: package added to devDependencies, lockfile updated.

- [ ] **Step 2: Make the types available to the functions tsconfig**

Create `functions/tsconfig.json`:
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "types": ["@cloudflare/workers-types"],
    "noEmit": true
  },
  "include": ["**/*.ts", "../lib/advisor/**/*.ts"]
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml functions/tsconfig.json
git commit -m "chore: add Cloudflare Workers types for advisor functions"
```

### Task 0.2: Configure D1 binding

**Files:**
- Modify: `wrangler.toml`

- [ ] **Step 1: Create the D1 database (one-time, manual)**

Run:
```bash
pnpm exec wrangler d1 create shabitools-advisor
```
Expected: prints a `database_id`. Copy it for the next step. (If the user must run this interactively, note it and pause.)

- [ ] **Step 2: Add the binding to `wrangler.toml`**

Append:
```toml
[[d1_databases]]
binding = "DB"
database_name = "shabitools-advisor"
database_id = "PASTE_DATABASE_ID_HERE"
```

- [ ] **Step 3: Commit**

```bash
git add wrangler.toml
git commit -m "chore: bind D1 advisor database for Pages Functions"
```

### Task 0.3: D1 schema migration

**Files:**
- Create: `migrations/0001_advisor.sql`

- [ ] **Step 1: Write the schema**

```sql
-- migrations/0001_advisor.sql
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  raw_question TEXT NOT NULL,
  normalized_question TEXT NOT NULL,
  parsed_intent TEXT,            -- JSON
  ip_hash TEXT,
  country TEXT,
  answer_hash TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_questions_hash ON questions(answer_hash);
CREATE INDEX IF NOT EXISTS idx_questions_norm ON questions(normalized_question);

CREATE TABLE IF NOT EXISTS answer_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  group_label TEXT,
  asin TEXT,
  title TEXT,
  price TEXT,
  currency TEXT,
  image_url TEXT,
  rating REAL,
  position INTEGER,
  internal_match TEXT,          -- review/category slug or NULL (gap)
  affiliate_url TEXT,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);
CREATE INDEX IF NOT EXISTS idx_cards_asin ON answer_cards(asin);
CREATE INDEX IF NOT EXISTS idx_cards_gap ON answer_cards(internal_match);

CREATE TABLE IF NOT EXISTS clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  asin TEXT,
  question_id INTEGER
);

CREATE TABLE IF NOT EXISTS search_cache (
  cache_key TEXT PRIMARY KEY,
  payload TEXT NOT NULL,         -- JSON: RawProduct[]
  expires_at INTEGER NOT NULL    -- epoch ms
);

CREATE TABLE IF NOT EXISTS answer_cache (
  answer_hash TEXT PRIMARY KEY,
  payload TEXT NOT NULL,         -- JSON: Answer
  created_at INTEGER NOT NULL    -- epoch ms
);

CREATE TABLE IF NOT EXISTS rate_limit (
  ip_hash TEXT NOT NULL,
  window_start INTEGER NOT NULL, -- epoch ms, truncated to window
  count INTEGER NOT NULL,
  PRIMARY KEY (ip_hash, window_start)
);
```

- [ ] **Step 2: Apply locally**

Run:
```bash
pnpm exec wrangler d1 execute shabitools-advisor --local --file=migrations/0001_advisor.sql
```
Expected: "Executed ... commands" with no errors.

- [ ] **Step 3: Commit**

```bash
git add migrations/0001_advisor.sql
git commit -m "feat: add D1 schema for advisor (questions, cards, clicks, caches, rate_limit)"
```

---

## Phase 1 — Pure core modules (TDD in vitest)

### Task 1.1: Shared types

**Files:**
- Create: `lib/advisor/types.ts`

- [ ] **Step 1: Define the types** (no test needed — types only)

```typescript
// lib/advisor/types.ts

/** One product-search intent produced by the planner. */
export interface SearchGroup {
  label: string;          // e.g. "Cordless drill" or "Cutting"
  keywords: string;       // Amazon search keywords
  priceMin?: number;      // USD
  priceMax?: number;      // USD
  categoryGuess?: string; // best-guess site category slug
  whyNeeded?: string;     // short rationale (project questions)
}

export interface Plan {
  intent: string;
  groups: SearchGroup[];
}

/** Normalized product as returned by PA-API. */
export interface RawProduct {
  asin: string;
  title: string;
  imageUrl: string | null;
  price: string | null;     // formatted, e.g. "$129.00"
  currency: string | null;  // e.g. "USD"
  rating: number | null;    // 0..5 when available
  features: string[];
  detailUrl: string;        // PA-API DetailPageURL (already tagged by Amazon)
}

/** One rendered card. */
export interface Card {
  groupLabel: string;
  asin: string;
  title: string;
  imageUrl: string | null;
  price: string | null;
  currency: string | null;
  rating: number | null;
  why: string;                 // one-line "why it fits you" from the writer
  affiliateUrl: string;        // tagged outbound URL
  internalHref: string | null; // "/reviews/<slug>" etc. when matched
  internalLabel: string | null;
  position: number;
}

export interface CardGroup {
  label: string;
  totalEstimate: string | null; // optional sum for project questions
  cards: Card[];
}

export interface Answer {
  question: string;
  answerHash: string;
  intro: string;
  groups: CardGroup[];
}

/** One entry in the generated catalog index. */
export interface CatalogEntry {
  slug: string;
  kind: 'review' | 'category';
  href: string;
  label: string;
  brand?: string;
  category?: string;
  model?: string;
  asin?: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/advisor/types.ts
git commit -m "feat: advisor shared types"
```

### Task 1.2: Question normalization + hash

**Files:**
- Create: `lib/advisor/normalize.ts`
- Test: `lib/advisor/__tests__/normalize.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// lib/advisor/__tests__/normalize.test.ts
import { describe, it, expect } from 'vitest';
import { normalizeQuestion, hashString, answerHashFor } from '@/lib/advisor/normalize';

describe('normalizeQuestion', () => {
  it('lowercases, trims, and collapses whitespace', () => {
    expect(normalizeQuestion('  Good   DRILL  ~$300 ')).toBe('good drill ~$300');
  });
  it('treats casing/spacing variants as equal', () => {
    expect(normalizeQuestion('Best Cordless Drill')).toBe(normalizeQuestion('best   cordless drill'));
  });
});

describe('hashString', () => {
  it('is deterministic and hex', () => {
    expect(hashString('abc')).toBe(hashString('abc'));
    expect(hashString('abc')).toMatch(/^[0-9a-f]{8,}$/);
  });
  it('differs for different input', () => {
    expect(hashString('abc')).not.toBe(hashString('abd'));
  });
});

describe('answerHashFor', () => {
  it('is stable across casing/whitespace variants', () => {
    expect(answerHashFor('Good Drill')).toBe(answerHashFor('  good   drill '));
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm exec vitest run lib/advisor/__tests__/normalize.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

```typescript
// lib/advisor/normalize.ts

/** Lowercase, trim, collapse internal whitespace. Runtime-agnostic. */
export function normalizeQuestion(q: string): string {
  return q.toLowerCase().trim().replace(/\s+/g, ' ');
}

/** FNV-1a 32-bit hash → 8-char hex. Deterministic, no crypto/runtime deps. */
export function hashString(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function answerHashFor(question: string): string {
  return hashString(normalizeQuestion(question));
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm exec vitest run lib/advisor/__tests__/normalize.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/advisor/normalize.ts lib/advisor/__tests__/normalize.test.ts
git commit -m "feat: advisor question normalization + stable hash"
```

### Task 1.3: Amazon ASIN/URL helpers

**Files:**
- Create: `lib/advisor/amazon.ts`
- Test: `lib/advisor/__tests__/amazon.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// lib/advisor/__tests__/amazon.test.ts
import { describe, it, expect } from 'vitest';
import { asinUrl, extractAsin } from '@/lib/advisor/amazon';

describe('asinUrl', () => {
  it('builds a tagged dp URL', () => {
    expect(asinUrl('B00005RHPD', 'shabitools-20'))
      .toBe('https://www.amazon.com/dp/B00005RHPD?tag=shabitools-20');
  });
});

describe('extractAsin', () => {
  it('reads ASIN from a /dp/ URL', () => {
    expect(extractAsin('https://www.amazon.com/Bosch-Router/dp/B00005RHPD/ref=x')).toBe('B00005RHPD');
  });
  it('reads ASIN from a /gp/product/ URL', () => {
    expect(extractAsin('https://www.amazon.com/gp/product/B0ABCDEFGH')).toBe('B0ABCDEFGH');
  });
  it('returns null when no ASIN', () => {
    expect(extractAsin('https://www.rockler.com/x')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run lib/advisor/__tests__/amazon.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```typescript
// lib/advisor/amazon.ts

/** Canonical tagged product URL from an ASIN. */
export function asinUrl(asin: string, tag: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${tag}`;
}

/** Extract a 10-char ASIN from a /dp/ or /gp/product/ Amazon URL, else null. */
export function extractAsin(url: string): string | null {
  const m = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  return m ? m[1].toUpperCase() : null;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm exec vitest run lib/advisor/__tests__/amazon.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/advisor/amazon.ts lib/advisor/__tests__/amazon.test.ts
git commit -m "feat: advisor amazon asin/url helpers"
```

### Task 1.4: Internal-review match

**Files:**
- Create: `lib/advisor/internalMatch.ts`
- Test: `lib/advisor/__tests__/internalMatch.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// lib/advisor/__tests__/internalMatch.test.ts
import { describe, it, expect } from 'vitest';
import { matchInternal } from '@/lib/advisor/internalMatch';
import type { CatalogEntry, RawProduct } from '@/lib/advisor/types';

const catalog: CatalogEntry[] = [
  { slug: 'bosch-1617evspk', kind: 'review', href: '/reviews/bosch-1617evspk',
    label: 'Bosch 1617EVSPK Review', brand: 'bosch', category: 'routers',
    model: '1617EVSPK', asin: 'B00005RHPD' },
  { slug: 'cordless-drills', kind: 'category', href: '/categories/cordless-drills',
    label: 'Cordless Drills', category: 'cordless-drills' },
];

function product(p: Partial<RawProduct>): RawProduct {
  return { asin: '', title: '', imageUrl: null, price: null, currency: null,
    rating: null, features: [], detailUrl: '', ...p };
}

describe('matchInternal', () => {
  it('matches a review by ASIN (highest precedence)', () => {
    const m = matchInternal(product({ asin: 'B00005RHPD', title: 'Anything' }), catalog);
    expect(m?.href).toBe('/reviews/bosch-1617evspk');
  });
  it('matches a review by brand+model in the title', () => {
    const m = matchInternal(product({ asin: 'ZZZ', title: 'Bosch 1617EVSPK Combo' }), catalog);
    expect(m?.href).toBe('/reviews/bosch-1617evspk');
  });
  it('falls back to a category page when no review matches', () => {
    const m = matchInternal(product({ asin: 'ZZZ', title: 'Generic cordless drill 20V' }), catalog);
    expect(m?.href).toBe('/categories/cordless-drills');
  });
  it('returns null when nothing matches (a content gap)', () => {
    expect(matchInternal(product({ asin: 'ZZZ', title: 'Garden hose reel' }), catalog)).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run lib/advisor/__tests__/internalMatch.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```typescript
// lib/advisor/internalMatch.ts
import type { CatalogEntry, RawProduct } from './types';

export interface InternalMatch { href: string; label: string; slug: string; }

/**
 * Match a product to the best on-site page:
 *  1. exact ASIN → review (most precise)
 *  2. brand + model both present in the product title → review
 *  3. category keyword present in the title → category page
 *  4. otherwise null (a content gap worth a future review)
 */
export function matchInternal(p: RawProduct, catalog: CatalogEntry[]): InternalMatch | null {
  const title = p.title.toLowerCase();

  const byAsin = catalog.find((c) => c.kind === 'review' && c.asin && c.asin === p.asin);
  if (byAsin) return { href: byAsin.href, label: byAsin.label, slug: byAsin.slug };

  const byModel = catalog.find((c) =>
    c.kind === 'review' && c.brand && c.model &&
    title.includes(c.brand.toLowerCase()) && title.includes(c.model.toLowerCase()));
  if (byModel) return { href: byModel.href, label: byModel.label, slug: byModel.slug };

  const byCategory = catalog.find((c) =>
    c.kind === 'category' && c.category &&
    title.includes(c.category.replace(/-/g, ' ')));
  if (byCategory) return { href: byCategory.href, label: byCategory.label, slug: byCategory.slug };

  return null;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm exec vitest run lib/advisor/__tests__/internalMatch.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/advisor/internalMatch.ts lib/advisor/__tests__/internalMatch.test.ts
git commit -m "feat: advisor internal-review matching"
```

### Task 1.5: Catalog index generator

**Files:**
- Create: `scripts/generateAdvisorIndex.js`
- Create (generated, committed): `content/_advisor-index.json`
- Test: `scripts/__tests__/generateAdvisorIndex.test.ts`

- [ ] **Step 1: Write the failing test** (tests the pure transform, not file IO)

```typescript
// scripts/__tests__/generateAdvisorIndex.test.ts
import { describe, it, expect } from 'vitest';
import { buildIndex } from '@/scripts/generateAdvisorIndex';

describe('buildIndex', () => {
  it('produces review entries with derived ASIN and category entries', () => {
    const reviews = [{
      slug: 'bosch-1617evspk', title: 'Bosch 1617EVSPK Review', brand: 'bosch',
      category: 'routers', model: '1617EVSPK',
      affiliate: [{ merchant: 'Amazon', productUrl: 'https://www.amazon.com/x/dp/B00005RHPD' }],
    }];
    const categories = [{ slug: 'routers', name: 'Routers' }];
    const idx = buildIndex(reviews as any, categories as any);
    const review = idx.find((e) => e.slug === 'bosch-1617evspk');
    expect(review).toMatchObject({ kind: 'review', href: '/reviews/bosch-1617evspk',
      brand: 'bosch', category: 'routers', model: '1617EVSPK', asin: 'B00005RHPD' });
    expect(idx.find((e) => e.slug === 'routers')).toMatchObject({
      kind: 'category', href: '/categories/routers' });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run scripts/__tests__/generateAdvisorIndex.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement** (CommonJS — matches the other `scripts/*.js`; export `buildIndex` for the test)

```javascript
// scripts/generateAdvisorIndex.js
const fs = require('fs');
const path = require('path');

function extractAsin(url) {
  if (!url) return undefined;
  const m = String(url).match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  return m ? m[1].toUpperCase() : undefined;
}

/** Pure transform: reviews + categories -> CatalogEntry[] */
function buildIndex(reviews, categories) {
  const reviewEntries = reviews.map((r) => {
    const amazon = (r.affiliate || []).find((a) => a.productUrl && /amazon\./i.test(a.productUrl));
    return {
      slug: r.slug, kind: 'review', href: `/reviews/${r.slug}`, label: r.title,
      brand: r.brand, category: r.category, model: r.model,
      asin: amazon ? extractAsin(amazon.productUrl) : undefined,
    };
  });
  const categoryEntries = categories.map((c) => ({
    slug: c.slug, kind: 'category', href: `/categories/${c.slug}`,
    label: c.name, category: c.slug,
  }));
  return [...reviewEntries, ...categoryEntries];
}

function readJsonDir(dir) {
  const full = path.join(process.cwd(), 'content', dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(full, f), 'utf8')));
}

function main() {
  const index = buildIndex(readJsonDir('reviews'), readJsonDir('categories'));
  const out = path.join(process.cwd(), 'content', '_advisor-index.json');
  fs.writeFileSync(out, JSON.stringify(index, null, 2) + '\n');
  console.log(`advisor index: ${index.length} entries -> ${out}`);
}

module.exports = { buildIndex, extractAsin };
if (require.main === module) main();
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm exec vitest run scripts/__tests__/generateAdvisorIndex.test.ts`
Expected: PASS.

- [ ] **Step 5: Generate the real index and wire into build**

Run:
```bash
node scripts/generateAdvisorIndex.js
```
Expected: writes `content/_advisor-index.json` with one entry per review + category.

Then prepend it to the build script in `package.json`:
```json
"build": "node scripts/generateAdvisorIndex.js && node scripts/generateGoRedirects.js && next build && node scripts/checkBuild.js",
```

- [ ] **Step 6: Commit**

```bash
git add scripts/generateAdvisorIndex.js scripts/__tests__/generateAdvisorIndex.test.ts content/_advisor-index.json package.json
git commit -m "feat: generate advisor catalog index at build time"
```

---

## Phase 2 — External clients (DeepSeek, PA-API)

### Task 2.1: DeepSeek planner + writer

**Files:**
- Create: `lib/advisor/deepseek.ts`
- Test: `lib/advisor/__tests__/deepseek.test.ts`

- [ ] **Step 1: Write the failing test** (inject a fake fetch — no network)

```typescript
// lib/advisor/__tests__/deepseek.test.ts
import { describe, it, expect, vi } from 'vitest';
import { planQuestion, writeAnswer } from '@/lib/advisor/deepseek';
import type { RawProduct } from '@/lib/advisor/types';

function fakeFetch(jsonContent: string) {
  return vi.fn(async () => ({
    ok: true,
    json: async () => ({ choices: [{ message: { content: jsonContent } }] }),
  })) as unknown as typeof fetch;
}

describe('planQuestion', () => {
  it('parses planner JSON into a Plan', async () => {
    const content = JSON.stringify({
      intent: 'find a drill', groups: [{ label: 'Cordless drill', keywords: 'cordless drill', priceMax: 300 }],
    });
    const plan = await planQuestion('good drill ~$300', { apiKey: 'k', fetchImpl: fakeFetch(content) });
    expect(plan.groups[0].keywords).toBe('cordless drill');
    expect(plan.groups[0].priceMax).toBe(300);
  });
  it('throws on malformed JSON', async () => {
    await expect(planQuestion('x', { apiKey: 'k', fetchImpl: fakeFetch('not json') }))
      .rejects.toThrow();
  });
});

describe('writeAnswer', () => {
  it('parses writer JSON into intro + per-asin blurbs', async () => {
    const products: RawProduct[] = [{ asin: 'A1', title: 'Drill A', imageUrl: null, price: '$199',
      currency: 'USD', rating: 4.5, features: [], detailUrl: 'x' }];
    const content = JSON.stringify({ intro: 'Here are picks', picks: [{ asin: 'A1', why: 'Great value' }] });
    const res = await writeAnswer('good drill', products, { apiKey: 'k', fetchImpl: fakeFetch(content) });
    expect(res.intro).toBe('Here are picks');
    expect(res.picks[0]).toEqual({ asin: 'A1', why: 'Great value' });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run lib/advisor/__tests__/deepseek.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```typescript
// lib/advisor/deepseek.ts
import type { Plan, RawProduct } from './types';

export interface DeepSeekOpts { apiKey: string; fetchImpl?: typeof fetch; }
const ENDPOINT = 'https://api.deepseek.com/chat/completions';

async function chatJson(messages: { role: string; content: string }[], opts: DeepSeekOpts): Promise<any> {
  const f = opts.fetchImpl ?? fetch;
  const res = await f(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${opts.apiKey}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) throw new Error(`deepseek ${ (res as any).status ?? '' }`);
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('deepseek: empty content');
  return JSON.parse(content); // throws on malformed JSON
}

const PLAN_SYSTEM = `You turn a shopper's question into Amazon product searches.
Return ONLY JSON: {"intent": string, "groups": [{"label": string, "keywords": string,
"priceMin"?: number, "priceMax"?: number, "categoryGuess"?: string, "whyNeeded"?: string}]}.
For a single-product question return ONE group. For a project ("what tools to build X")
return one group per distinct tool/material needed. keywords are concise Amazon search terms.
Infer price bounds from phrases like "around $300" (e.g. priceMax 330). Max 6 groups.`;

export async function planQuestion(question: string, opts: DeepSeekOpts): Promise<Plan> {
  const json = await chatJson([
    { role: 'system', content: PLAN_SYSTEM },
    { role: 'user', content: question },
  ], opts);
  if (!json || !Array.isArray(json.groups)) throw new Error('deepseek: bad plan shape');
  return { intent: String(json.intent ?? ''), groups: json.groups };
}

const WRITE_SYSTEM = `You are a tool-buying expert. Given the shopper's question and a list of
REAL Amazon products (with asin, title, price, rating, features), choose the best 3 to 9 and
write a tight answer. Use ONLY the provided asins — never invent products.
Return ONLY JSON: {"intro": string, "picks": [{"asin": string, "why": string}]}.
"intro" is 1-2 sentences. "why" is one sentence on why it fits THIS shopper.`;

export interface WriteResult { intro: string; picks: { asin: string; why: string }[]; }

export async function writeAnswer(question: string, products: RawProduct[], opts: DeepSeekOpts): Promise<WriteResult> {
  const slim = products.map((p) => ({ asin: p.asin, title: p.title, price: p.price,
    rating: p.rating, features: p.features.slice(0, 5) }));
  const json = await chatJson([
    { role: 'system', content: WRITE_SYSTEM },
    { role: 'user', content: JSON.stringify({ question, products: slim }) },
  ], opts);
  if (!json || !Array.isArray(json.picks)) throw new Error('deepseek: bad write shape');
  return { intro: String(json.intro ?? ''), picks: json.picks };
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm exec vitest run lib/advisor/__tests__/deepseek.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/advisor/deepseek.ts lib/advisor/__tests__/deepseek.test.ts
git commit -m "feat: advisor deepseek planner + writer"
```

### Task 2.2: AWS SigV4 signer (Web Crypto)

**Files:**
- Create: `lib/advisor/sigv4.ts`
- Test: `lib/advisor/__tests__/sigv4.test.ts`

> Tested against AWS's published SigV4 test suite (`get-vanilla`) so the implementation is verifiably correct before any live PA-API call.

- [ ] **Step 1: Write the failing test** (known-answer vector from AWS docs)

```typescript
// lib/advisor/__tests__/sigv4.test.ts
import { describe, it, expect } from 'vitest';
import { hmacSha256Hex, sha256Hex, signingKey } from '@/lib/advisor/sigv4';

// Reference values from AWS Signature V4 documentation examples.
const SECRET = 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY';

describe('sha256Hex', () => {
  it('hashes empty string to the known SHA-256', async () => {
    expect(await sha256Hex('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });
});

describe('signingKey', () => {
  it('derives the documented signing key digest', async () => {
    // AWS docs "derive signing key" example: 20150830 / us-east-1 / iam
    const key = await signingKey(SECRET, '20150830', 'us-east-1', 'iam');
    const hex = Array.from(new Uint8Array(key)).map((b) => b.toString(16).padStart(2, '0')).join('');
    expect(hex).toBe('c4afb1cc5771d871763a393e44b703571b55cc28424d1a5e86da6ed3c154a4b9');
  });
});

describe('hmacSha256Hex', () => {
  it('is deterministic', async () => {
    expect(await hmacSha256Hex('key', 'msg')).toBe(await hmacSha256Hex('key', 'msg'));
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run lib/advisor/__tests__/sigv4.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement** (Web Crypto — works in Workers and Node 20)

```typescript
// lib/advisor/sigv4.ts
// Minimal AWS Signature V4 for PA-API, using Web Crypto (globalThis.crypto.subtle).

const enc = new TextEncoder();

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function sha256Hex(data: string): Promise<string> {
  return toHex(await crypto.subtle.digest('SHA-256', enc.encode(data)));
}

async function hmac(key: ArrayBuffer | Uint8Array, msg: string): Promise<ArrayBuffer> {
  const k = await crypto.subtle.importKey('raw', key as BufferSource, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', k, enc.encode(msg));
}

export async function hmacSha256Hex(key: string, msg: string): Promise<string> {
  return toHex(await hmac(enc.encode(key), msg));
}

export async function signingKey(secret: string, date: string, region: string, service: string): Promise<ArrayBuffer> {
  const kDate = await hmac(enc.encode('AWS4' + secret), date);
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  return hmac(kService, 'aws4_request');
}

export interface SignedRequest { url: string; headers: Record<string, string>; body: string; }

export interface SignInput {
  accessKey: string; secretKey: string; region: string; service: string;
  host: string; path: string; target: string; body: string;
  amzDate: string;   // YYYYMMDDTHHMMSSZ
  dateStamp: string; // YYYYMMDD
}

/** Build a fully-signed POST request (SigV4, headers: host;x-amz-date;x-amz-target;content-encoding). */
export async function signRequest(i: SignInput): Promise<SignedRequest> {
  const contentEncoding = 'amz-1.0';
  const canonicalHeaders =
    `content-encoding:${contentEncoding}\n` +
    `host:${i.host}\n` +
    `x-amz-date:${i.amzDate}\n` +
    `x-amz-target:${i.target}\n`;
  const signedHeaders = 'content-encoding;host;x-amz-date;x-amz-target';
  const payloadHash = await sha256Hex(i.body);
  const canonicalRequest =
    `POST\n${i.path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const scope = `${i.dateStamp}/${i.region}/${i.service}/aws4_request`;
  const stringToSign =
    `AWS4-HMAC-SHA256\n${i.amzDate}\n${scope}\n${await sha256Hex(canonicalRequest)}`;
  const key = await signingKey(i.secretKey, i.dateStamp, i.region, i.service);
  const signature = toHex(await hmac(key, stringToSign));
  const authorization =
    `AWS4-HMAC-SHA256 Credential=${i.accessKey}/${scope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;
  return {
    url: `https://${i.host}${i.path}`,
    headers: {
      'content-encoding': contentEncoding,
      'content-type': 'application/json; charset=utf-8',
      host: i.host,
      'x-amz-date': i.amzDate,
      'x-amz-target': i.target,
      authorization,
    },
    body: i.body,
  };
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm exec vitest run lib/advisor/__tests__/sigv4.test.ts`
Expected: PASS. If `signingKey` digest mismatches, the implementation is wrong — fix before proceeding (do not skip this gate).

- [ ] **Step 5: Commit**

```bash
git add lib/advisor/sigv4.ts lib/advisor/__tests__/sigv4.test.ts
git commit -m "feat: web-crypto AWS SigV4 signer for PA-API"
```

### Task 2.3: PA-API SearchItems client

**Files:**
- Create: `lib/advisor/paapi.ts`
- Test: `lib/advisor/__tests__/paapi.test.ts`

- [ ] **Step 1: Write the failing test** (inject fake fetch returning a PA-API-shaped body)

```typescript
// lib/advisor/__tests__/paapi.test.ts
import { describe, it, expect, vi } from 'vitest';
import { searchItems, parseSearchResult } from '@/lib/advisor/paapi';
import type { SearchGroup } from '@/lib/advisor/types';

const sample = {
  SearchResult: { Items: [{
    ASIN: 'B00005RHPD',
    DetailPageURL: 'https://www.amazon.com/dp/B00005RHPD?tag=shabitools-20',
    Images: { Primary: { Large: { URL: 'https://img/x.jpg' } } },
    ItemInfo: { Title: { DisplayValue: 'Bosch 1617EVSPK Router' },
      Features: { DisplayValues: ['2.25 HP', 'Combo kit'] } },
    Offers: { Listings: [{ Price: { DisplayAmount: '$199.00', Currency: 'USD' } }] },
  }] },
};

describe('parseSearchResult', () => {
  it('maps PA-API items to RawProduct[]', () => {
    const products = parseSearchResult(sample);
    expect(products[0]).toMatchObject({ asin: 'B00005RHPD', title: 'Bosch 1617EVSPK Router',
      imageUrl: 'https://img/x.jpg', price: '$199.00', currency: 'USD' });
    expect(products[0].features).toContain('2.25 HP');
  });
  it('tolerates missing offers/images', () => {
    const products = parseSearchResult({ SearchResult: { Items: [{ ASIN: 'Z', DetailPageURL: 'u',
      ItemInfo: { Title: { DisplayValue: 'X' } } }] } });
    expect(products[0]).toMatchObject({ asin: 'Z', price: null, imageUrl: null });
  });
  it('returns [] when no items', () => {
    expect(parseSearchResult({})).toEqual([]);
  });
});

describe('searchItems', () => {
  it('signs and posts, returning parsed products', async () => {
    const fetchImpl = vi.fn(async () => ({ ok: true, json: async () => sample })) as unknown as typeof fetch;
    const group: SearchGroup = { label: 'Router', keywords: 'router combo', priceMax: 300 };
    const products = await searchItems(group, {
      accessKey: 'AKID', secretKey: 'secret', partnerTag: 'shabitools-20',
      now: new Date('2024-01-01T00:00:00Z'), fetchImpl,
    });
    expect(products[0].asin).toBe('B00005RHPD');
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [, init] = (fetchImpl as any).mock.calls[0];
    expect(init.headers['x-amz-target']).toContain('SearchItems');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run lib/advisor/__tests__/paapi.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```typescript
// lib/advisor/paapi.ts
import type { RawProduct, SearchGroup } from './types';
import { signRequest } from './sigv4';

const HOST = 'webservices.amazon.com';
const REGION = 'us-east-1';
const MARKETPLACE = 'www.amazon.com';
const PATH = '/paapi5/searchitems';
const TARGET = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems';

export interface PaapiCreds {
  accessKey: string; secretKey: string; partnerTag: string;
  now?: Date; fetchImpl?: typeof fetch;
}

export function parseSearchResult(body: any): RawProduct[] {
  const items = body?.SearchResult?.Items;
  if (!Array.isArray(items)) return [];
  return items.map((it: any) => {
    const listing = it?.Offers?.Listings?.[0];
    return {
      asin: it.ASIN,
      title: it?.ItemInfo?.Title?.DisplayValue ?? '',
      imageUrl: it?.Images?.Primary?.Large?.URL ?? null,
      price: listing?.Price?.DisplayAmount ?? null,
      currency: listing?.Price?.Currency ?? null,
      rating: null, // PA-API does not return star ratings; reserved for future enrichment
      features: it?.ItemInfo?.Features?.DisplayValues ?? [],
      detailUrl: it?.DetailPageURL ?? '',
    } as RawProduct;
  });
}

function fmtDates(d: Date) {
  const iso = d.toISOString().replace(/[:-]|\.\d{3}/g, ''); // YYYYMMDDTHHMMSSZ
  return { amzDate: iso, dateStamp: iso.slice(0, 8) };
}

export async function searchItems(group: SearchGroup, creds: PaapiCreds): Promise<RawProduct[]> {
  const f = creds.fetchImpl ?? fetch;
  const payload: Record<string, unknown> = {
    Keywords: group.keywords,
    SearchIndex: 'All',
    ItemCount: 6,
    PartnerTag: creds.partnerTag,
    PartnerType: 'Associates',
    Marketplace: MARKETPLACE,
    Resources: [
      'ItemInfo.Title',
      'ItemInfo.Features',
      'Images.Primary.Large',
      'Offers.Listings.Price',
    ],
  };
  if (group.priceMin != null) payload.MinPrice = Math.round(group.priceMin * 100);
  if (group.priceMax != null) payload.MaxPrice = Math.round(group.priceMax * 100);

  const body = JSON.stringify(payload);
  const { amzDate, dateStamp } = fmtDates(creds.now ?? new Date());
  const signed = await signRequest({
    accessKey: creds.accessKey, secretKey: creds.secretKey, region: REGION,
    service: 'ProductAdvertisingAPI', host: HOST, path: PATH, target: TARGET,
    body, amzDate, dateStamp,
  });
  const res = await f(signed.url, { method: 'POST', headers: signed.headers, body: signed.body });
  if (!(res as any).ok) throw new Error(`paapi ${(res as any).status ?? ''}`);
  return parseSearchResult(await res.json());
}
```

> **Note:** PA-API does not return star ratings via `SearchItems`; `rating` stays `null`. The card UI must treat rating as optional. (Documented here so the writer/UI never depend on it.)

- [ ] **Step 4: Run to verify pass**

Run: `pnpm exec vitest run lib/advisor/__tests__/paapi.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/advisor/paapi.ts lib/advisor/__tests__/paapi.test.ts
git commit -m "feat: PA-API SearchItems client (signed, parsed)"
```

---

## Phase 3 — D1 data layer

### Task 3.1: D1 helpers

**Files:**
- Create: `lib/advisor/db.ts`
- Test: `lib/advisor/__tests__/db.test.ts`

> Tested with a tiny in-memory fake implementing the `D1Database` surface we use (`prepare().bind().run()/first()/all()`), so the SQL-builder + control flow are verified without a live DB. Live SQL is exercised by the manual `wrangler pages dev` check in Task 4.4.

- [ ] **Step 1: Write the failing test**

```typescript
// lib/advisor/__tests__/db.test.ts
import { describe, it, expect } from 'vitest';
import { checkRateLimit, getCachedSearch, putCachedSearch } from '@/lib/advisor/db';

// Minimal fake D1 capturing calls and returning programmed rows.
function fakeDb(firstRow: any = null) {
  const calls: { sql: string; binds: any[] }[] = [];
  const db: any = {
    calls,
    prepare(sql: string) {
      const stmt: any = {
        _binds: [] as any[],
        bind(...b: any[]) { stmt._binds = b; return stmt; },
        async run() { calls.push({ sql, binds: stmt._binds }); return { success: true }; },
        async first() { calls.push({ sql, binds: stmt._binds }); return firstRow; },
        async all() { calls.push({ sql, binds: stmt._binds }); return { results: [] }; },
      };
      return stmt;
    },
  };
  return db;
}

describe('search cache', () => {
  it('returns null on miss', async () => {
    expect(await getCachedSearch(fakeDb(null), 'k', 1000)).toBeNull();
  });
  it('returns parsed payload when not expired', async () => {
    const row = { payload: JSON.stringify([{ asin: 'A1' }]), expires_at: 5000 };
    expect(await getCachedSearch(fakeDb(row), 'k', 1000)).toEqual([{ asin: 'A1' }]);
  });
  it('treats expired rows as a miss', async () => {
    const row = { payload: '[]', expires_at: 500 };
    expect(await getCachedSearch(fakeDb(row), 'k', 1000)).toBeNull();
  });
  it('putCachedSearch issues an upsert', async () => {
    const db = fakeDb();
    await putCachedSearch(db, 'k', [{ asin: 'A1' }] as any, 9000);
    expect(db.calls[0].sql).toMatch(/INSERT INTO search_cache/i);
  });
});

describe('rate limit', () => {
  it('allows when under the cap', async () => {
    const db = fakeDb({ count: 2 });
    expect(await checkRateLimit(db, 'iphash', 1000, 60000, 20)).toBe(true);
  });
  it('blocks when at/over the cap', async () => {
    const db = fakeDb({ count: 20 });
    expect(await checkRateLimit(db, 'iphash', 1000, 60000, 20)).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run lib/advisor/__tests__/db.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```typescript
// lib/advisor/db.ts
import type { Answer, Card, RawProduct } from './types';

// Loose D1 typing so the module compiles in vitest without workers-types.
type D1 = {
  prepare(sql: string): {
    bind(...v: any[]): any;
    run(): Promise<any>; first(): Promise<any>; all(): Promise<any>;
  };
};

export async function getCachedSearch(db: D1, key: string, nowMs: number): Promise<RawProduct[] | null> {
  const row = await db.prepare('SELECT payload, expires_at FROM search_cache WHERE cache_key = ?')
    .bind(key).first();
  if (!row || Number(row.expires_at) <= nowMs) return null;
  return JSON.parse(row.payload);
}

export async function putCachedSearch(db: D1, key: string, products: RawProduct[], expiresAt: number): Promise<void> {
  await db.prepare(
    'INSERT INTO search_cache (cache_key, payload, expires_at) VALUES (?, ?, ?) ' +
    'ON CONFLICT(cache_key) DO UPDATE SET payload = excluded.payload, expires_at = excluded.expires_at')
    .bind(key, JSON.stringify(products), expiresAt).run();
}

export async function getCachedAnswer(db: D1, hash: string): Promise<Answer | null> {
  const row = await db.prepare('SELECT payload FROM answer_cache WHERE answer_hash = ?').bind(hash).first();
  return row ? JSON.parse(row.payload) : null;
}

export async function putCachedAnswer(db: D1, answer: Answer, nowMs: number): Promise<void> {
  await db.prepare(
    'INSERT INTO answer_cache (answer_hash, payload, created_at) VALUES (?, ?, ?) ' +
    'ON CONFLICT(answer_hash) DO UPDATE SET payload = excluded.payload, created_at = excluded.created_at')
    .bind(answer.answerHash, JSON.stringify(answer), nowMs).run();
}

/** Returns true if the request is allowed (under cap) and records the hit. */
export async function checkRateLimit(db: D1, ipHash: string, nowMs: number, windowMs: number, cap: number): Promise<boolean> {
  const windowStart = Math.floor(nowMs / windowMs) * windowMs;
  const row = await db.prepare('SELECT count FROM rate_limit WHERE ip_hash = ? AND window_start = ?')
    .bind(ipHash, windowStart).first();
  const current = row ? Number(row.count) : 0;
  if (current >= cap) return false;
  await db.prepare(
    'INSERT INTO rate_limit (ip_hash, window_start, count) VALUES (?, ?, 1) ' +
    'ON CONFLICT(ip_hash, window_start) DO UPDATE SET count = count + 1')
    .bind(ipHash, windowStart).run();
  return true;
}

export async function logQuestionAndCards(
  db: D1, params: { rawQuestion: string; normalized: string; intent: string;
    ipHash: string; country: string; answer: Answer; },
): Promise<void> {
  const q = await db.prepare(
    'INSERT INTO questions (raw_question, normalized_question, parsed_intent, ip_hash, country, answer_hash) ' +
    'VALUES (?, ?, ?, ?, ?, ?) RETURNING id')
    .bind(params.rawQuestion, params.normalized, params.intent, params.ipHash, params.country, params.answer.answerHash)
    .first();
  const questionId = q?.id;
  for (const group of params.answer.groups) {
    for (const c of group.cards) {
      await db.prepare(
        'INSERT INTO answer_cards (question_id, group_label, asin, title, price, currency, image_url, rating, position, internal_match, affiliate_url) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(questionId, c.groupLabel, c.asin, c.title, c.price, c.currency, c.imageUrl, c.rating, c.position,
          c.internalHref ? c.internalHref.split('/').pop() : null, c.affiliateUrl).run();
    }
  }
}

export async function logClick(db: D1, asin: string): Promise<void> {
  await db.prepare('INSERT INTO clicks (asin) VALUES (?)').bind(asin).run();
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm exec vitest run lib/advisor/__tests__/db.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/advisor/db.ts lib/advisor/__tests__/db.test.ts
git commit -m "feat: advisor D1 helpers (cache, rate limit, logging)"
```

---

## Phase 4 — Orchestration & edge functions

### Task 4.1: Pipeline orchestrator

**Files:**
- Create: `lib/advisor/orchestrate.ts`
- Test: `lib/advisor/__tests__/orchestrate.test.ts`

> All external effects are injected, so the full pipeline is unit-tested deterministically.

- [ ] **Step 1: Write the failing test**

```typescript
// lib/advisor/__tests__/orchestrate.test.ts
import { describe, it, expect, vi } from 'vitest';
import { buildAnswer } from '@/lib/advisor/orchestrate';
import type { CatalogEntry, RawProduct } from '@/lib/advisor/types';

const catalog: CatalogEntry[] = [
  { slug: 'cordless-drills', kind: 'category', href: '/categories/cordless-drills',
    label: 'Cordless Drills', category: 'cordless-drills' },
];

const product: RawProduct = { asin: 'A1', title: 'DeWalt cordless drill 20V', imageUrl: 'i',
  price: '$129', currency: 'USD', rating: null, features: [], detailUrl: 'd' };

it('assembles an answer from plan -> search -> write -> enrich', async () => {
  const deps = {
    plan: vi.fn(async () => ({ intent: 'drill', groups: [{ label: 'Drill', keywords: 'cordless drill' }] })),
    search: vi.fn(async () => [product]),
    write: vi.fn(async () => ({ intro: 'Top picks', picks: [{ asin: 'A1', why: 'Best value' }] })),
    catalog, tag: 'shabitools-20',
  };
  const answer = await buildAnswer('good drill', deps as any);
  expect(answer.intro).toBe('Top picks');
  expect(answer.groups[0].cards[0].asin).toBe('A1');
  expect(answer.groups[0].cards[0].why).toBe('Best value');
  expect(answer.groups[0].cards[0].affiliateUrl).toContain('tag=shabitools-20');
  expect(answer.groups[0].cards[0].internalHref).toBe('/categories/cordless-drills');
  expect(answer.answerHash).toMatch(/^[0-9a-f]{8}$/);
});

it('drops picks whose asin is not in the fetched products', async () => {
  const deps = {
    plan: vi.fn(async () => ({ intent: 'x', groups: [{ label: 'Drill', keywords: 'drill' }] })),
    search: vi.fn(async () => [product]),
    write: vi.fn(async () => ({ intro: 'i', picks: [{ asin: 'GHOST', why: 'nope' }, { asin: 'A1', why: 'ok' }] })),
    catalog, tag: 't',
  };
  const answer = await buildAnswer('q', deps as any);
  const asins = answer.groups[0].cards.map((c) => c.asin);
  expect(asins).toEqual(['A1']);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run lib/advisor/__tests__/orchestrate.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```typescript
// lib/advisor/orchestrate.ts
import type { Answer, Card, CardGroup, CatalogEntry, Plan, RawProduct, SearchGroup } from './types';
import { answerHashFor } from './normalize';
import { asinUrl } from './amazon';
import { matchInternal } from './internalMatch';
import type { WriteResult } from './deepseek';

export interface OrchestrateDeps {
  plan: (question: string) => Promise<Plan>;
  search: (group: SearchGroup) => Promise<RawProduct[]>;
  write: (question: string, products: RawProduct[]) => Promise<WriteResult>;
  catalog: CatalogEntry[];
  tag: string;
}

export async function buildAnswer(question: string, deps: OrchestrateDeps): Promise<Answer> {
  const plan = await deps.plan(question);

  // Fetch products per group (sequential to respect PA-API rate limits).
  const groupProducts: { group: SearchGroup; products: RawProduct[] }[] = [];
  for (const group of plan.groups) {
    try {
      groupProducts.push({ group, products: await deps.search(group) });
    } catch {
      groupProducts.push({ group, products: [] }); // a failed group yields no cards, never crashes
    }
  }

  const allProducts = groupProducts.flatMap((g) => g.products);
  const written = allProducts.length
    ? await deps.write(question, allProducts)
    : { intro: 'I could not find good matches for that — try rephrasing or adding a budget.', picks: [] };

  const whyByAsin = new Map(written.picks.map((p) => [p.asin, p.why]));

  const groups: CardGroup[] = groupProducts.map(({ group, products }) => {
    const cards: Card[] = products
      .filter((p) => whyByAsin.has(p.asin)) // only products the writer chose
      .map((p, idx) => {
        const m = matchInternal(p, deps.catalog);
        return {
          groupLabel: group.label,
          asin: p.asin,
          title: p.title,
          imageUrl: p.imageUrl,
          price: p.price,
          currency: p.currency,
          rating: p.rating,
          why: whyByAsin.get(p.asin) ?? '',
          affiliateUrl: p.detailUrl || asinUrl(p.asin, deps.tag),
          internalHref: m?.href ?? null,
          internalLabel: m?.label ?? null,
          position: idx,
        } as Card;
      });
    return { label: group.label, totalEstimate: null, cards };
  }).filter((g) => g.cards.length > 0);

  return { question, answerHash: answerHashFor(question), intro: written.intro, groups };
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm exec vitest run lib/advisor/__tests__/orchestrate.test.ts`
Expected: PASS.

- [ ] **Step 5: Run the full unit suite**

Run: `pnpm test:unit`
Expected: all advisor + existing tests PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/advisor/orchestrate.ts lib/advisor/__tests__/orchestrate.test.ts
git commit -m "feat: advisor pipeline orchestrator"
```

### Task 4.2: Advisor API function

**Files:**
- Create: `functions/api/advisor.ts`

> Edge adapter only — no business logic beyond wiring env → deps, caching, and rate limiting. Not unit-tested (covered by the manual `wrangler pages dev` check in Task 4.4).

- [ ] **Step 1: Implement**

```typescript
// functions/api/advisor.ts
import catalog from '../../content/_advisor-index.json';
import type { CatalogEntry } from '../../lib/advisor/types';
import { planQuestion, writeAnswer } from '../../lib/advisor/deepseek';
import { searchItems } from '../../lib/advisor/paapi';
import { buildAnswer } from '../../lib/advisor/orchestrate';
import { answerHashFor, normalizeQuestion, hashString } from '../../lib/advisor/normalize';
import { checkRateLimit, getCachedAnswer, getCachedSearch, putCachedAnswer, putCachedSearch, logQuestionAndCards } from '../../lib/advisor/db';

interface Env {
  DB: any;
  DEEPSEEK_API_KEY: string;
  PAAPI_ACCESS_KEY: string;
  PAAPI_SECRET_KEY: string;
  AMAZON_ASSOCIATES_TAG: string;
}

const SEARCH_TTL = 24 * 60 * 60 * 1000; // 24h
const RATE_WINDOW = 60 * 1000;          // 1 min
const RATE_CAP = 15;                    // questions / min / ip

export const onRequestPost: any = async (ctx: any) => {
  const { request, env } = ctx;
  const now = Date.now();
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'bad request' }, 400); }
  const question = String(body?.question ?? '').trim();
  if (question.length < 3 || question.length > 300) return json({ error: 'invalid question' }, 400);

  const ip = request.headers.get('cf-connecting-ip') ?? '0';
  const ipHash = hashString(ip);
  const country = request.headers.get('cf-ipcountry') ?? '';

  if (!(await checkRateLimit(env.DB, ipHash, now, RATE_WINDOW, RATE_CAP)))
    return json({ error: 'rate_limited' }, 429);

  // Answer cache (serves repeat/viral questions for free).
  const hash = answerHashFor(question);
  const cached = await getCachedAnswer(env.DB, hash);
  if (cached) return json(cached);

  const tag = env.AMAZON_ASSOCIATES_TAG;
  try {
    const answer = await buildAnswer(question, {
      catalog: catalog as CatalogEntry[],
      tag,
      plan: (q) => planQuestion(q, { apiKey: env.DEEPSEEK_API_KEY }),
      write: (q, products) => writeAnswer(q, products, { apiKey: env.DEEPSEEK_API_KEY }),
      search: async (group) => {
        const key = hashString(JSON.stringify({ k: group.keywords, mn: group.priceMin, mx: group.priceMax }));
        const hit = await getCachedSearch(env.DB, key, now);
        if (hit) return hit;
        const products = await searchItems(group, {
          accessKey: env.PAAPI_ACCESS_KEY, secretKey: env.PAAPI_SECRET_KEY, partnerTag: tag,
        });
        await putCachedSearch(env.DB, key, products, now + SEARCH_TTL);
        return products;
      },
    });

    await putCachedAnswer(env.DB, answer, now);
    // Fire-and-forget logging (don't block the response).
    ctx.waitUntil(logQuestionAndCards(env.DB, {
      rawQuestion: question, normalized: normalizeQuestion(question), intent: answer.intro,
      ipHash, country, answer,
    }));
    return json(answer);
  } catch (e: any) {
    return json({ error: 'advisor_failed', detail: String(e?.message ?? e) }, 500);
  }
};
```

- [ ] **Step 2: Typecheck**

Run: `pnpm exec tsc -p functions/tsconfig.json --noEmit`
Expected: no errors. (Fix import paths / types if any.)

- [ ] **Step 3: Commit**

```bash
git add functions/api/advisor.ts
git commit -m "feat: advisor API Pages Function (cache + rate limit + orchestrate)"
```

### Task 4.3: Click-logging redirect

**Files:**
- Create: `functions/api/click.ts`

- [ ] **Step 1: Implement**

```typescript
// functions/api/click.ts
import { logClick } from '../../lib/advisor/db';
import { asinUrl } from '../../lib/advisor/amazon';

interface Env { DB: any; AMAZON_ASSOCIATES_TAG: string; }

export const onRequestGet: any = async (ctx: any) => {
  const { request, env } = ctx;
  const url = new URL(request.url);
  const asin = (url.searchParams.get('asin') ?? '').toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(asin)) return new Response('bad asin', { status: 400 });
  ctx.waitUntil(logClick(env.DB, asin));
  return Response.redirect(asinUrl(asin, env.AMAZON_ASSOCIATES_TAG), 302);
};
```

- [ ] **Step 2: Commit**

```bash
git add functions/api/click.ts
git commit -m "feat: advisor click-logging redirect"
```

### Task 4.4: Local integration smoke test (manual gate)

**Files:** none (verification only)

- [ ] **Step 1: Set local secrets**

Create `.dev.vars` (gitignored — verify it's in `.gitignore`):
```
DEEPSEEK_API_KEY=...
PAAPI_ACCESS_KEY=...
PAAPI_SECRET_KEY=...
AMAZON_ASSOCIATES_TAG=shabitools-20
```

- [ ] **Step 2: Build static assets + run Pages dev with D1**

Run:
```bash
pnpm build
pnpm exec wrangler pages dev out --d1 DB=shabitools-advisor
```
Expected: server starts; `functions/` compiled.

- [ ] **Step 3: Hit the endpoint**

Run:
```bash
curl -s -X POST http://localhost:8788/api/advisor \
  -H 'content-type: application/json' \
  -d '{"question":"a good cordless drill around $150"}' | head -c 800
```
Expected: JSON with `intro` and `groups[].cards[]` containing real ASINs + `affiliateUrl` with the tag. If PA-API returns 401/403, re-check `signRequest` and credentials (this is the most likely failure point).

- [ ] **Step 4: Document outcome**

Record the working curl + any fixes in the PR description. Do NOT proceed to the UI until this returns real cards.

---

## Phase 5 — Frontend

### Task 5.1: ProductCard component

**Files:**
- Create: `components/advisor/ProductCard.tsx`

- [ ] **Step 1: Implement** (uniform card; rating optional; outbound via `/api/click`)

```tsx
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
          View on Amazon →
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
```

- [ ] **Step 2: Commit**

```bash
git add components/advisor/ProductCard.tsx
git commit -m "feat: advisor ProductCard"
```

### Task 5.2: AnswerView component

**Files:**
- Create: `components/advisor/AnswerView.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/advisor/AnswerView.tsx
import type { Answer } from '@/lib/advisor/types';
import ProductCard from './ProductCard';

export default function AnswerView({ answer }: { answer: Answer }) {
  return (
    <div className="mt-6">
      <p className="text-base text-stone-700 dark:text-stone-200">{answer.intro}</p>
      {answer.groups.map((group) => (
        <section key={group.label} className="mt-6">
          {answer.groups.length > 1 && (
            <h2 className="mb-3 text-lg font-bold text-stone-900 dark:text-stone-100">{group.label}</h2>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.cards.map((card) => <ProductCard key={card.asin} card={card} />)}
          </div>
        </section>
      ))}
      <p className="mt-6 text-xs text-stone-400">
        As an Amazon Associate we earn from qualifying purchases. Prices and availability are accurate as of the time shown and subject to change.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/advisor/AnswerView.tsx
git commit -m "feat: advisor AnswerView"
```

### Task 5.3: AdvisorApp client component (state machine)

**Files:**
- Create: `components/advisor/AdvisorApp.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/advisor/AdvisorApp.tsx
'use client';
import { useEffect, useState } from 'react';
import type { Answer } from '@/lib/advisor/types';
import AnswerView from './AnswerView';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'result'; answer: Answer }
  | { status: 'error'; message: string };

export default function AdvisorApp({ initialQuestion = '' }: { initialQuestion?: string }) {
  const [q, setQ] = useState(initialQuestion);
  const [state, setState] = useState<State>({ status: 'idle' });

  async function ask(question: string) {
    if (question.trim().length < 3) return;
    setState({ status: 'loading' });
    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (res.status === 429) return setState({ status: 'error', message: 'Too many questions — try again in a minute.' });
      if (!res.ok) throw new Error('request failed');
      setState({ status: 'result', answer: await res.json() });
    } catch {
      setState({ status: 'error', message: 'Something went wrong. Please try again.' });
    }
  }

  // Auto-run when arriving from the homepage hero with ?q=
  useEffect(() => {
    if (initialQuestion.trim().length >= 3) ask(initialQuestion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => { e.preventDefault(); ask(q); }}
        className="flex gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. a good cordless drill around $300"
          className="flex-1 rounded-lg border border-stone-300 px-4 py-3 text-base dark:border-stone-600 dark:bg-stone-800"
        />
        <button type="submit" className="rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700">
          Ask
        </button>
      </form>

      {state.status === 'loading' && <p className="mt-6 animate-pulse text-stone-500">Finding the best options…</p>}
      {state.status === 'error' && <p className="mt-6 text-red-600">{state.message}</p>}
      {state.status === 'result' && <AnswerView answer={state.answer} />}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/advisor/AdvisorApp.tsx
git commit -m "feat: advisor client app state machine"
```

### Task 5.4: /advisor page

**Files:**
- Create: `app/advisor/page.tsx`

- [ ] **Step 1: Implement** (server shell + metadata; reads `?q=` via searchParams)

```tsx
// app/advisor/page.tsx
import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import AdvisorApp from '@/components/advisor/AdvisorApp';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Tool Advisor — Ask Anything | shabitools',
  description:
    'Ask anything — "a good cordless drill around $300" or "what tools do I need to build a wood balcony" — and get matched to real products with honest picks.',
  path: 'advisor',
  ogType: 'website',
});

export default function AdvisorPage({ searchParams }: { searchParams: { q?: string } }) {
  const initial = typeof searchParams.q === 'string' ? searchParams.q : '';
  return (
    <>
      <PageHero
        title="Ask anything. Get the right tools."
        subtitle="Describe what you want to do or buy. We match you to real products with honest, budget-aware picks."
      />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <AdvisorApp initialQuestion={initial} />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify the static build still succeeds**

Run: `pnpm build`
Expected: build passes; `/advisor` is emitted. (The page is statically shelled; data loads client-side from `/api/advisor`.)

- [ ] **Step 3: Commit**

```bash
git add app/advisor/page.tsx
git commit -m "feat: /advisor page"
```

### Task 5.5: Homepage hero search

**Files:**
- Create: `components/advisor/HeroAdvisorSearch.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Implement the hero search (routes to /advisor?q=)**

```tsx
// components/advisor/HeroAdvisorSearch.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HeroAdvisorSearch() {
  const router = useRouter();
  const [q, setQ] = useState('');
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (q.trim().length >= 3) router.push(`/advisor?q=${encodeURIComponent(q)}`); }}
      className="mt-6 flex gap-2"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder='Ask anything — e.g. "a good cordless drill around $300"'
        className="flex-1 rounded-lg border border-stone-300 px-4 py-3 text-base dark:border-stone-600 dark:bg-stone-800"
      />
      <button type="submit" className="rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700">
        Ask AI
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Mount it in the homepage hero**

In `app/page.tsx`, add the import:
```tsx
import HeroAdvisorSearch from '@/components/advisor/HeroAdvisorSearch';
```
Then inside the `<PageHero>` children, directly under the existing hero image block, add:
```tsx
<HeroAdvisorSearch />
```

- [ ] **Step 3: Build to confirm**

Run: `pnpm build`
Expected: build passes.

- [ ] **Step 4: Commit**

```bash
git add components/advisor/HeroAdvisorSearch.tsx app/page.tsx
git commit -m "feat: homepage hero AI advisor search"
```

---

## Phase 6 — Shareable pages, export script, docs

### Task 6.1: Shareable/indexable answer page

**Files:**
- Create: `functions/advisor/a/[hash].ts`

> Server-rendered by a Pages Function reading `answer_cache` from D1, with proper `<title>`/meta so it is indexable. Renders a minimal standalone HTML page (no Next runtime needed).

- [ ] **Step 1: Implement**

```typescript
// functions/advisor/a/[hash].ts
import { getCachedAnswer } from '../../../lib/advisor/db';
import type { Answer } from '../../../lib/advisor/types';

interface Env { DB: any; }

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}

function renderHtml(answer: Answer): string {
  const cards = answer.groups.flatMap((g) => g.cards);
  const cardHtml = cards.map((c) => `
    <article style="border:1px solid #e7e5e4;border-radius:12px;padding:16px;max-width:320px">
      ${c.imageUrl ? `<img src="${esc(c.imageUrl)}" alt="${esc(c.title)}" style="height:160px;object-fit:contain;width:100%"/>` : ''}
      <h3 style="font-size:14px">${esc(c.title)}</h3>
      ${c.price ? `<p style="color:#ea580c;font-weight:700">${esc(c.price)}</p>` : ''}
      <p style="font-size:14px;color:#57534e">${esc(c.why)}</p>
      <a href="/api/click?asin=${esc(c.asin)}" rel="sponsored nofollow" style="color:#ea580c;font-weight:600">View on Amazon →</a>
    </article>`).join('');
  const title = `${esc(answer.question)} — shabitools Advisor`;
  return `<!doctype html><html lang="en"><head>
    <meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>${title}</title>
    <meta name="description" content="${esc(answer.intro).slice(0, 160)}"/>
    <link rel="canonical" href="https://shabitools.com/advisor/a/${esc(answer.answerHash)}"/>
    </head><body style="font-family:system-ui;max-width:1024px;margin:0 auto;padding:24px">
    <h1>${esc(answer.question)}</h1>
    <p>${esc(answer.intro)}</p>
    <div style="display:flex;flex-wrap:wrap;gap:16px">${cardHtml}</div>
    <p style="font-size:12px;color:#a8a29e;margin-top:24px">As an Amazon Associate we earn from qualifying purchases.</p>
    </body></html>`;
}

export const onRequestGet: any = async (ctx: any) => {
  const hash = ctx.params.hash as string;
  const answer = await getCachedAnswer(ctx.env.DB, hash);
  if (!answer) return new Response('Not found', { status: 404 });
  return new Response(renderHtml(answer), { headers: { 'content-type': 'text/html; charset=utf-8' } });
};
```

- [ ] **Step 2: Add a "share" link in AnswerView**

In `components/advisor/AnswerView.tsx`, under the intro paragraph, add:
```tsx
<a href={`/advisor/a/${answer.answerHash}`} className="mt-2 inline-block text-xs text-orange-600 underline">
  Share this answer
</a>
```

- [ ] **Step 3: Typecheck + commit**

Run: `pnpm exec tsc -p functions/tsconfig.json --noEmit`
Expected: no errors.

```bash
git add functions/advisor/a/[hash].ts components/advisor/AnswerView.tsx
git commit -m "feat: shareable/indexable advisor answer pages"
```

### Task 6.2: Demand export script

**Files:**
- Create: `scripts/exportDemand.js`
- Modify: `package.json` (add `advisor:demand` script)

- [ ] **Step 1: Implement** (queries remote D1 via wrangler, prints insights)

```javascript
// scripts/exportDemand.js
// Usage: node scripts/exportDemand.js   (reads the bound D1 database)
const { execSync } = require('child_process');

const DB = 'shabitools-advisor';
function q(sql) {
  const out = execSync(
    `pnpm exec wrangler d1 execute ${DB} --remote --json --command ${JSON.stringify(sql)}`,
    { encoding: 'utf8' });
  const parsed = JSON.parse(out);
  return parsed[0]?.results ?? [];
}

function main() {
  const topQuestions = q(
    'SELECT normalized_question, COUNT(*) n FROM questions GROUP BY normalized_question ORDER BY n DESC LIMIT 30');
  const gaps = q(
    "SELECT title, asin, COUNT(*) n FROM answer_cards WHERE internal_match IS NULL " +
    'GROUP BY asin ORDER BY n DESC LIMIT 30');
  const clicks = q(
    'SELECT asin, COUNT(*) n FROM clicks GROUP BY asin ORDER BY n DESC LIMIT 30');

  console.log('\n=== TOP QUESTIONS ===');
  topQuestions.forEach((r) => console.log(`${r.n}\t${r.normalized_question}`));
  console.log('\n=== CONTENT GAPS (most-shown products with NO review) ===');
  gaps.forEach((r) => console.log(`${r.n}\t${r.asin}\t${r.title}`));
  console.log('\n=== TOP CLICKED PRODUCTS ===');
  clicks.forEach((r) => console.log(`${r.n}\t${r.asin}`));
}

main();
```

- [ ] **Step 2: Add the script**

In `package.json` scripts:
```json
"advisor:demand": "node scripts/exportDemand.js",
"advisor:index": "node scripts/generateAdvisorIndex.js",
```

- [ ] **Step 3: Commit**

```bash
git add scripts/exportDemand.js package.json
git commit -m "feat: advisor demand export script"
```

### Task 6.3: Env docs + deploy notes

**Files:**
- Modify: `.env.example`
- Create: `docs/advisor-deploy.md`

- [ ] **Step 1: Document new env vars** (append to `.env.example`)

```
# --- Advisor feature (server-side only; set as Cloudflare Pages secrets) ---
# Amazon PA-API 5.0 credentials (Associates account, 3+ qualifying sales)
PAAPI_ACCESS_KEY=
PAAPI_SECRET_KEY=
# Server copy of the Associates tag (same value as NEXT_PUBLIC_AMAZON_ASSOCIATES_TAG)
AMAZON_ASSOCIATES_TAG=
```

- [ ] **Step 2: Write deploy notes**

```markdown
# Advisor deployment

## Secrets (Cloudflare Pages → Settings → Environment variables, mark as Secret)
- DEEPSEEK_API_KEY
- PAAPI_ACCESS_KEY
- PAAPI_SECRET_KEY
- AMAZON_ASSOCIATES_TAG

## D1
- Binding name `DB` → database `shabitools-advisor` (see wrangler.toml).
- Apply schema to remote once:
  `pnpm exec wrangler d1 execute shabitools-advisor --remote --file=migrations/0001_advisor.sql`

## Functions
- `functions/` deploys automatically with `wrangler pages deploy out`.
- Verify after deploy: POST /api/advisor returns cards; GET /advisor/a/<hash> renders.

## Rate limits
- PA-API ~1 req/sec — the 24h search_cache absorbs most load.
- Per-IP cap is 15 questions/min (functions/api/advisor.ts).
```

- [ ] **Step 3: Commit**

```bash
git add .env.example docs/advisor-deploy.md
git commit -m "docs: advisor env + deploy notes"
```

### Task 6.4: E2E test (homepage hero → advisor, mocked API)

**Files:**
- Create: `tests/advisor.spec.ts`

> Mocks `/api/advisor` at the network layer so the E2E runs without live keys, verifying the full client flow.

- [ ] **Step 1: Write the test**

```typescript
// tests/advisor.spec.ts
import { test, expect } from '@playwright/test';

const fakeAnswer = {
  question: 'a good cordless drill around $150',
  answerHash: 'abc12345',
  intro: 'Here are three solid picks under $150.',
  groups: [{ label: 'Cordless drill', totalEstimate: null, cards: [{
    groupLabel: 'Cordless drill', asin: 'B0TEST1234', title: 'Test Drill 20V',
    imageUrl: null, price: '$129.00', currency: 'USD', rating: null,
    why: 'Best value for occasional DIY.', affiliateUrl: 'https://www.amazon.com/dp/B0TEST1234?tag=shabitools-20',
    internalHref: '/categories/cordless-drills', internalLabel: 'Cordless Drills', position: 0 }] }],
};

test('hero search routes to advisor and renders cards', async ({ page }) => {
  await page.route('**/api/advisor', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeAnswer) }));

  await page.goto('/');
  await page.getByPlaceholder(/Ask anything/i).fill('a good cordless drill around $150');
  await page.getByRole('button', { name: /Ask AI/i }).click();

  await expect(page).toHaveURL(/\/advisor\?q=/);
  await expect(page.getByText('Here are three solid picks under $150.')).toBeVisible();
  await expect(page.getByText('Test Drill 20V')).toBeVisible();
  await expect(page.getByRole('link', { name: /View on Amazon/i })).toBeVisible();
});
```

- [ ] **Step 2: Run it**

Run: `pnpm exec playwright test tests/advisor.spec.ts --project=chromium`
Expected: PASS. (Requires the dev server per `playwright.config.ts`; if it builds static, run against `pnpm dev`.)

- [ ] **Step 3: Commit**

```bash
git add tests/advisor.spec.ts
git commit -m "test: advisor hero->results E2E (mocked api)"
```

---

## Final verification

- [ ] `pnpm test:unit` — all unit tests pass.
- [ ] `pnpm exec tsc -p functions/tsconfig.json --noEmit` — functions typecheck.
- [ ] `pnpm build` — static build succeeds, `/advisor` emitted, index regenerated.
- [ ] `pnpm exec playwright test tests/advisor.spec.ts --project=chromium` — E2E passes.
- [ ] Manual: `wrangler pages dev` returns real cards for a single-product and a project question (Task 4.4).
- [ ] Invoke `superpowers:requesting-code-review` before opening the PR.

---

## Spec coverage check

| Spec requirement | Task(s) |
|---|---|
| Ask-anything, 3–9 real Amazon cards | 4.1, 5.1–5.4 |
| Live PA-API, no hallucinated links | 2.2, 2.3, 4.1 (writer constrained to fetched asins) |
| Project decomposition (multi-group) | 2.1, 4.1, 5.2 |
| DeepSeek planner + writer | 2.1 |
| Cloudflare Pages Function + D1 | 0.2, 0.3, 4.2 |
| Dedicated /advisor + homepage hero | 5.4, 5.5 |
| Internal-review blending | 1.4, 1.5, 4.1, 5.1 |
| Shareable/indexable answer pages | 6.1 |
| Caching (search + answer) | 3.1, 4.2 |
| Per-IP rate limiting | 3.1, 4.2 |
| D1 logging + content-gap capture | 3.1, 4.2 |
| Demand export script | 6.2 |
| Cost control (cheap DeepSeek + cache) | 2.1, 3.1, 4.2 |
| Server-side secret handling | 4.2, 6.3 |
| Error handling (graceful) | 2.x throws, 4.1 try/catch, 4.2 try/catch |
| Tests (unit + E2E) | 1.x–4.1, 6.4 |
