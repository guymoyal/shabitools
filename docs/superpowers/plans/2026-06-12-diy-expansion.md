# DIY Expansion (200+ Pages, Images, Projects) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Grow shabitools.com from 26 to ~205 pages — image pipeline on every page, new DIY-projects content type with HowTo schema, and content waves (56 reviews, 23 comparisons, 32 guides, 44 projects, 8 brands, 14 categories).

**Architecture:** Same stack (Next 14 App Router, static export, Cloudflare Pages). Images: authored manifest fragments in `content/images/*.json` → `scripts/fetchImages.js` (direct URLs + Pexels API) → optimized WebP in `public/images/` + dimensions in `content/images.meta.json` → `lib/images.ts` + `<SiteImage>`. Content waves are parallel-safe: each agent owns disjoint JSON files and its own manifest fragment; the controller commits per wave after `pnpm test:unit && pnpm build` pass.

**Tech Stack:** sharp (build-time image processing), Pexels API (`PEXELS_API_KEY` in `.env.local`), existing Vitest/Playwright setup.

**Spec:** `docs/superpowers/specs/2026-06-12-diy-expansion-design.md` (+ the base pivot design doc).

---

## Global rules (every task)

- Branch `home-tools-pivot`. Never push. Never deploy. Never commit `.env*` or `.admitad-profile/`.
- Honesty policy: analytical voice, web-verified specs, NO fabricated hands-on testing claims ("we tested", "in our shop" are forbidden). Projects give safe conventional instructions; electrical/plumbing/structural projects include a "when to call a pro" note.
- All monetized links render via existing components (rel="sponsored nofollow noopener", FTC micro-disclosure). New content seeds affiliate entries with `campaignId: 0` placeholders exactly like existing files (sync fills them after Task 22 of the pivot plan).
- FAQ shape is `{ "q": ..., "a": ... }`. Dates are real (2026-06-12 or actual write date).
- After every task/wave: `pnpm test:unit` green, `pnpm build` green (cap + tracker guards).

---

### Task E1: Image pipeline (manifest → fetch → lib → component)

**Files:**
- Create: `lib/images.ts`, `components/ui/SiteImage.tsx`, `scripts/fetchImages.js`, `content/images/core.json` (empty map `{}`), `content/images.meta.json` (empty map `{}`), `lib/__tests__/images.test.ts`, `scripts/__tests__/fetchImages.test.ts`, `public/images/.gitkeep`
- Modify: `package.json` (add `sharp` devDep; script `"images:fetch": "node scripts/fetchImages.js"`), `.env.example` (add `PEXELS_API_KEY=`)

**Manifest format** — every file in `content/images/` is a JSON map merged together (fragments avoid wave-agent merge conflicts):

```json
{
  "reviews/makita-xfd131": { "source": "https://cdn.makitatools.com/.../XFD131.jpg", "alt": "Makita XFD131 18V cordless drill driver" },
  "categories/circular-saws": { "source": "pexels:circular saw cutting wood workshop", "alt": "Circular saw cutting a board in a workshop" }
}
```

`content/images.meta.json` (written by the fetch script, committed) maps the same ids to `{ "width": 1200, "height": 800, "credit": "Photo by X on Pexels" | null }`.

- [ ] **Step 1: Failing tests for `lib/images.ts`**

```ts
// lib/__tests__/images.test.ts
import { describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { loadImageIndex, imageFromIndex } from '@/lib/images';

function fixture() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'img-'));
  fs.mkdirSync(path.join(base, 'images'));
  fs.writeFileSync(
    path.join(base, 'images', 'a.json'),
    JSON.stringify({ 'reviews/x': { source: 'https://e.com/x.jpg', alt: 'X drill' } })
  );
  fs.writeFileSync(
    path.join(base, 'images', 'b.json'),
    JSON.stringify({ 'categories/saws': { source: 'pexels:saw', alt: 'Saw' } })
  );
  fs.writeFileSync(
    path.join(base, 'images.meta.json'),
    JSON.stringify({ 'reviews/x': { width: 1200, height: 800, credit: null } })
  );
  return base;
}

describe('image index', () => {
  it('merges manifest fragments and joins meta', () => {
    const idx = loadImageIndex(fixture());
    const img = imageFromIndex(idx, 'reviews/x');
    expect(img).toEqual({
      src: '/images/reviews/x.webp',
      srcSm: '/images/reviews/x-sm.webp',
      alt: 'X drill',
      width: 1200,
      height: 800,
    });
  });
  it('returns null when image not yet fetched (no meta)', () => {
    const idx = loadImageIndex(fixture());
    expect(imageFromIndex(idx, 'categories/saws')).toBeNull();
  });
  it('returns null for unknown id', () => {
    expect(imageFromIndex(loadImageIndex(fixture()), 'nope/nope')).toBeNull();
  });
});
```

- [ ] **Step 2: Run, verify FAIL** — `pnpm test:unit -- images` (module missing)

- [ ] **Step 3: Implement `lib/images.ts`**

```ts
import fs from 'fs';
import path from 'path';

export interface SiteImageData {
  src: string;
  srcSm: string;
  alt: string;
  width: number;
  height: number;
}

interface ManifestEntry { source: string; alt: string }
interface MetaEntry { width: number; height: number; credit: string | null }
export interface ImageIndex { manifest: Record<string, ManifestEntry>; meta: Record<string, MetaEntry> }

const DEFAULT_BASE = path.join(process.cwd(), 'content');
const indexCache = new Map<string, ImageIndex>();

export function loadImageIndex(base: string = DEFAULT_BASE): ImageIndex {
  if (indexCache.has(base)) return indexCache.get(base)!;
  const dir = path.join(base, 'images');
  const manifest: Record<string, ManifestEntry> = {};
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      Object.assign(manifest, JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
    }
  }
  const metaFile = path.join(base, 'images.meta.json');
  const meta = fs.existsSync(metaFile) ? JSON.parse(fs.readFileSync(metaFile, 'utf8')) : {};
  const idx = { manifest, meta };
  indexCache.set(base, idx);
  return idx;
}

export function imageFromIndex(idx: ImageIndex, id: string): SiteImageData | null {
  const m = idx.manifest[id];
  const d = idx.meta[id];
  if (!m || !d) return null;
  return {
    src: `/images/${id}.webp`,
    srcSm: `/images/${id}-sm.webp`,
    alt: m.alt,
    width: d.width,
    height: d.height,
  };
}

/** Main entry for pages/components. Null until `pnpm images:fetch` has run for this id. */
export const getImage = (id: string) => imageFromIndex(loadImageIndex(), id);
```

- [ ] **Step 4: Tests pass** — `pnpm test:unit -- images`

- [ ] **Step 5: `components/ui/SiteImage.tsx`** (server component, plain `<img>` — static export has no next/image optimizer)

```tsx
import type { SiteImageData } from '@/lib/images';

export default function SiteImage({
  image,
  className,
  sizes = '(max-width: 640px) 100vw, 640px',
  priority = false,
}: {
  image: SiteImageData | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!image) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      srcSet={`${image.srcSm} 640w, ${image.src} ${image.width}w`}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
    />
  );
}
```

- [ ] **Step 6: Failing test for fetch-script pure logic**

```ts
// scripts/__tests__/fetchImages.test.ts
import { describe, expect, it } from 'vitest';
// @ts-expect-error CJS script
import { pendingIds, parseSource } from '../fetchImages.js';

describe('fetchImages helpers', () => {
  it('parseSource splits url vs pexels', () => {
    expect(parseSource('https://e.com/a.jpg')).toEqual({ kind: 'url', value: 'https://e.com/a.jpg' });
    expect(parseSource('pexels:cordless drill')).toEqual({ kind: 'pexels', value: 'cordless drill' });
  });
  it('pendingIds = manifest ids missing from meta', () => {
    const manifest = { a: { source: 'x', alt: '' }, b: { source: 'y', alt: '' } };
    expect(pendingIds(manifest, { a: { width: 1, height: 1, credit: null } })).toEqual(['b']);
  });
});
```

- [ ] **Step 7: Implement `scripts/fetchImages.js`** — requirements:
  - Loads `.env` + `.env.local` via dotenv (same pattern as `scripts/admitadSync.js`).
  - Reads all `content/images/*.json`, merges; reads `content/images.meta.json`.
  - Exports `parseSource(src)` and `pendingIds(manifest, meta)`; only runs `main()` when `require.main === module`.
  - For each pending id: resolve bytes — `url` kind: plain `fetch` with a desktop browser User-Agent header (manufacturer CDNs often 403 default agents); `pexels` kind: `GET https://api.pexels.com/v1/search?query=…&per_page=3&orientation=landscape` with `Authorization: PEXELS_API_KEY`, take first photo's `src.large2x`, credit `Photo by ${photographer} on Pexels`. If kind is pexels and no key: skip with a clear message (not a failure).
  - `sharp(buffer).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 78 })` → `public/images/<id>.webp` (mkdir -p the nested dir); same at width 640 → `<id>-sm.webp`. Read output metadata for `{width, height}` of the large variant; write meta entry with credit.
  - Per-image try/catch: log failure, continue; rewrite `content/images.meta.json` (sorted keys, 2-space indent, trailing newline) after the loop; summary line `[images] fetched N, skipped-no-key K, failed F`; `process.exit(1)` only if F > 0.
  - 300ms delay between remote fetches.
- [ ] **Step 8: Tests pass** — `pnpm test:unit`
- [ ] **Step 9:** `pnpm add -D sharp`; add `images:fetch` script + `.env.example` line; `pnpm build` still green
- [ ] **Step 10: Commit** — `feat: image pipeline (manifest fragments, Pexels/URL fetch, sharp WebP, SiteImage)`

---

### Task E2: Project content type + HowTo JSON-LD + content validator

**Files:**
- Create: `types/project.ts`, `lib/__tests__/schema-howto.test.ts`, `lib/__tests__/content-validation.test.ts`
- Modify: `lib/content.ts` (getProjects/getProject), `lib/schema.ts` (howToJsonLd)

- [ ] **Step 1: `types/project.ts`**

```ts
import type { AffiliateLink, ContentDates, FaqItem } from './content';

export interface ProjectTool {
  name: string;
  reviewSlug?: string; // internal link to our review when we have one
  affiliate?: AffiliateLink;
}

export interface ProjectStep {
  name: string;
  text: string;
}

export interface Project extends ContentDates {
  slug: string;
  title: string;
  description: string; // 150–160 chars, used for meta description
  category: string; // category slug
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeRequired: string; // human, "4–6 hours"
  timeRequiredIso: string; // ISO 8601 for HowTo schema, "PT5H"
  estCost: string; // "$80–$140"
  toolsNeeded: ProjectTool[];
  materials: string[];
  steps: ProjectStep[]; // 5+
  faq: FaqItem[]; // 4+
  body: string; // markdown 700+ words: intro, planning, mistakes to avoid
  related: string[];
}
```

- [ ] **Step 2: Failing test for `howToJsonLd`** — asserts `@type: 'HowTo'`, name, description, `totalTime: timeRequiredIso`, `estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: estCost }`, `tool[]` as `{ '@type': 'HowToTool', name }`, `supply[]` as `HowToSupply`, `step[]` as `{ '@type': 'HowToStep', position, name, text, url: `${siteUrl}/projects/${slug}#step-${position}` }`.
- [ ] **Step 3: Implement in `lib/schema.ts`** (follow existing generators' style); run test → PASS.
- [ ] **Step 4: Loaders** — in `lib/content.ts`: `getProjects = () => loadCollection<Project>('projects')`, `getProject = loadOne` (mirror existing pairs). Create empty dir keep-file not needed (loadCollection tolerates missing dir).
- [ ] **Step 5: Content-validation test** — `lib/__tests__/content-validation.test.ts` validates EVERY file in `content/{reviews,compare,guides,brands,categories,projects}` (this is the at-scale guard; it runs in `pnpm test:unit` forever after). Rules:
  - Required fields present per type (use the interfaces above as the checklist); `slug` matches filename; dates `YYYY-MM-DD`.
  - Word counts: review body ≥ 800; project body ≥ 700; guide/compare body ≥ 500; category/brand description ≥ 200.
  - `faq.length` ≥ 5 (reviews, categories) / ≥ 4 (others); every FAQ uses `{q, a}` keys.
  - Reviews: rating between 3 and 5 with one decimal; ≥ 4 pros, ≥ 2 cons; ≥ 5 specs; ≥ 3 related; every `related` slug exists in some collection.
  - Projects: ≥ 5 steps, ≥ 3 toolsNeeded, ≥ 3 materials; difficulty in enum; `timeRequiredIso` matches `/^PT(\d+H)?(\d+M)?$/`; every `toolsNeeded[].reviewSlug` exists in reviews.
  - Guides: every `picks[].reviewSlug` (when set) exists; ranks are 1..n contiguous.
  - Compare: `productA/productB.reviewSlug` exist; `winner` in `a|b|tie`.
  - Every review, compare, guide, project, category has a manifest image entry `<collection>/<slug>` in the merged `content/images/` maps (brands exempt).
  - Honesty tripwire: body must NOT match `/\bwe (tested|tried|used|ran)\b|\bin our (shop|workshop|hands)\b|hands-on/i`.
- [ ] **Step 6:** Existing 26-page content will fail the image-entry rule until Task E4 adds entries — write the test now but ship the image-entry assertion behind the same expectation (E4 lands entries in the very next task; run order in this task must end green, so seed `content/images/core.json` entries for the 12 existing review/compare/guide/category files in THIS task if simpler — implementer's choice, but `pnpm test:unit` must be green at commit time).
- [ ] **Step 7: Commit** — `feat: Project type, HowTo JSON-LD, whole-corpus content validation`

---

### Task E3: /projects routes, nav, homepage section, sitemap, seed project

**Files:**
- Create: `components/projects/ProjectCard.tsx`, `components/projects/ToolsNeededBox.tsx`, `components/projects/StepList.tsx`, `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`, `content/projects/build-a-simple-workbench.json`, + its image manifest entry in `content/images/core.json`
- Modify: `components/Header.tsx` (nav + mobile menu: add Projects between Guides and Brands), `components/Footer.tsx` (add Projects link), `app/page.tsx` (add "Build something this weekend" section: 3 newest projects via ProjectCard), `app/sitemap.ts` (projects collection + /projects index), `public/llms.txt` (mention projects section)

Patterns: copy the guides routes/components structure exactly (PageHero, Breadcrumbs, JsonLd, FAQSection, pageMetadata, generateStaticParams, notFound for unknown slugs). Project page renders, in order: Breadcrumbs → hero `SiteImage(getImage('projects/<slug>'), priority)` → title + description → stat strip (difficulty badge, time, est. cost) → ToolsNeededBox → materials checklist → StepList (`<ol>`, each step gets `id="step-N"` matching the HowTo schema URLs) → Prose body → AdSlot (in-content) → FAQSection → related links. JSON-LD: howToJsonLd + faqJsonLd + breadcrumbJsonLd. ToolsNeededBox links `reviewSlug` → `/reviews/<slug>`; when `affiliate.url` set, render existing AffiliateCTA (micro-disclosure included); never render a CTA without a url.

The seed project (write it fully — it is the exemplar for Wave D): "How to Build a Simple Sturdy Workbench (2x4s + Plywood)". Beginner, PT6H, "$75–$120", tools: drill (reviewSlug `makita-xfd131`), circular saw, speed square, clamps, tape measure; 7+ steps; 5 FAQ; 750+ word body; safety note about eye/ear protection. Image entry: `projects/build-a-simple-workbench` → `pexels:DIY workbench garage woodworking`.

- [ ] Steps: components → routes → seed content → nav/footer/homepage/sitemap/llms → `pnpm test:unit && pnpm build` (page count +2) → commit `feat: DIY projects section (/projects, HowTo schema, seed workbench project)`

---

### Task E4: Wire images into all existing surfaces + og:image

**Files:**
- Modify: `lib/seo.ts` (optional `image` param), `app/reviews/[slug]/page.tsx`, `components/reviews/ReviewCard.tsx`, `app/compare/[slug]/page.tsx`, `app/guides/[slug]/page.tsx` + `components/guides/RankedPickCard.tsx`, `app/categories/[category]/page.tsx`, `app/brands/[brand]/page.tsx`, `app/page.tsx`, `content/images/core.json` (entries for ALL existing content), relevant index pages (cards get thumbs)

- [ ] **Step 1: `pageMetadata` image support**

```ts
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  ogType?: 'website' | 'article';
  image?: { url: string; width: number; height: number; alt: string };
}): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  const images = opts.image
    ? [{ url: `${SITE_URL}${opts.image.url}`, width: opts.image.width, height: opts.image.height, alt: opts.image.alt }]
    : undefined;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: { title: opts.title, description: opts.description, url, type: opts.ogType ?? 'article', images },
    twitter: { card: 'summary_large_image', title: opts.title, description: opts.description, images: images?.map((i) => i.url) },
  };
}
```

Each content page's `generateMetadata` passes its hero via `getImage(...)` (skip when null).

- [ ] **Step 2: Surfaces** — review page hero (priority, right of the verdict box on desktop / above on mobile), ReviewCard thumbnail (object-cover, fixed aspect), compare page (two product images above the table, side by side), RankedPickCard thumb, category page hero (stock, decorative), brand page hero, homepage hero image (priority). All via `SiteImage`; pages must render cleanly when `getImage` returns null (pre-fetch state).
- [ ] **Step 3: Manifest entries in `content/images/core.json`** for every existing page: 4 reviews → real manufacturer/retailer product-image URLs (find via web on the manufacturer product pages; verify each URL returns an image); 2 compares reuse nothing (compare pages use the two reviews' images — no own entry needed; adjust the E2 validation rule: compare images = both review entries exist); 3 guides → `pexels:` workshop queries; 1 category + homepage + 2 brands → `pexels:` queries (brand pages: generic toolset imagery, NOT logos).
- [ ] **Step 4:** `pnpm test:unit && pnpm build` green → commit `feat: images across all page types + og:image/twitter cards`

---

### Wave A: Category + brand hubs (21 files, 3 parallel agents, no commits by agents)

New categories (14): impact-drivers, circular-saws, miter-saws, table-saws, jigsaws, reciprocating-saws, sanders, angle-grinders, oscillating-multi-tools, routers, shop-vacuums, string-trimmers, leaf-blowers, pressure-washers.
New brands (8): dewalt, milwaukee, ryobi, craftsman, ridgid, skil, metabo-hpt, ego.

- Agent A1: categories 1–7. Agent A2: categories 8–14. Agent A3: all 8 brands.
- Match the existing exemplars exactly (`content/categories/cordless-drills.json`, `content/brands/makita.json`): categories need 5 buyingFactors + 5 FAQ + 250+ word description; brands need founded/headquarters/knownFor + 4 FAQ, web-verified facts.
- Each agent also writes its manifest fragment `content/images/wave-a<N>.json` with `categories/<slug>` → `pexels:<specific scene query>` entries (brands exempt).
- Wave reviewer (one agent): audit all 21 files + fragments against the rules; spot-web-check 2 facts. Controller: `pnpm test:unit && pnpm build` → commit `content: 14 category hubs + 8 brand hubs`.

### Wave B: 56 reviews (10 parallel agents, grouped by category)

4 reviews per new category (14 × 4 = 56), models spread across the 10 brands with ≥1 budget option (Ryobi/Skil/Craftsman) per category. Agents pick CURRENT, really-existing, US-available models and **must web-verify**: model number, key specs (≥5), realistic street price range, and capture a manufacturer/retailer product-image URL into their fragment `content/images/wave-b<N>.json`.

- Each agent: 5–6 reviews, full schema per `content/reviews/makita-xfd131.json` exemplar (800+ words, rating 3.6–4.8 one decimal, 4+ pros / 2+ cons, bestFor/skipIf, 5 FAQ, affiliate entries `{merchant, url: null, campaignId: 0, productUrl: <real retailer product URL>}` for 2 merchants, related = other reviews in same category incl. same-wave slugs — controller supplies each agent the full slug list of the wave to link against).
- Anti-template rule: agents receive the list of banned recycled phrases from the pivot (e.g. "The spec sheet shows", "honest limit") and must not share openers/closers across their own files.
- Wave reviewer: schema/honesty/anti-template audit on all 56 + deep web-spot-check of 3 random reviews' specs and image URLs. Controller: tests+build → commit `content: 56 tool reviews across 14 categories`.

### Wave C: 23 comparisons + 32 guides (9 parallel agents)

- Comparisons (agents C1–C4, ~6 each): same-category pairs from Wave B reviews (`productA/productB.reviewSlug` must exist). Exemplar: existing compare files. Winner reasoning concrete, 8+ spec rows with `advantage` marks, 4 FAQ, 500+ word body. Compare pages reuse review images (no manifest entry).
- Guides (agents C5–C9, ~6–7 each): "Best <category> 2026" for all 14 categories + audience/budget variants ("Best impact driver for automotive work", "Best budget circular saws under $100", …). 4–6 picks each, `reviewSlug` links to our reviews where they exist, contiguous ranks, awardLabels, per-pick affiliate placeholders, 4 FAQ, 500+ words, fragment entries `guides/<slug>` → `pexels:` query.
- Wave reviewer + controller commit: `content: 23 comparisons + 32 buying guides`.

### Wave D: 44 projects (8 parallel agents, ~5–6 each)

Topic spread (controller assigns exact lists): woodworking builds (bookshelf, floating shelves, planter box, garden bench, shoe rack, coat rack, picture frames, sandbox, dog house, raised garden bed…), home repair (patch drywall, fix a squeaky door, replace a faucet, re-caulk a bathtub, fix a running toilet, patch concrete…), installs (ceiling fan†, smart thermostat†, shelving anchors, curtain rods, TV wall mount…), outdoor (fence repair, deck board replacement, pressure-wash a driveway, gutter cleaning…). † = must include licensed-electrician note.

- Exemplar: `content/projects/build-a-simple-workbench.json`. Each: full Project schema, real tool lists with `reviewSlug` links into our 60 reviews, 5–9 steps, 4+ FAQ, 700+ word body, fragment entry `projects/<slug>` → `pexels:` query.
- Wave reviewer (safety emphasis: instructions conventional and safe, pro-notes present) + controller commit: `content: 44 DIY project guides`.

---

### Task F1: Fetch all images

- [ ] Requires `PEXELS_API_KEY` in `.env.local` (user). `pnpm images:fetch` → expect ~190 ids fetched; rerun-safe. Manufacturer-URL failures: replace bad URLs in fragments (agent fix) and rerun.
- [ ] Eyeball 6 random outputs (open files) — correct subject, not broken/tiny.
- [ ] `pnpm test:unit && pnpm build` → commit `assets: fetched + optimized WebP images` (public/images + images.meta.json).

### Task F2: Playwright + final verification + AdSense readiness

- [ ] Add to `tests/simple-check.spec.ts`: project page renders steps + HowTo JSON-LD present; a review page hero `<img>` exists with width/height attrs; og:image meta present on a review page. `pnpm build && pnpm test:simple` all green.
- [ ] Final sweep: `tsc --noEmit`, `pnpm test:unit`, `pnpm build` (expect ~205/1500 pages, zero leaks), spot-check 5 pages' HTML.
- [ ] Final whole-expansion review agent (opus): content quality sample, image rendering, schema validity (paste one HowTo into validator logic mentally), internal-link integrity.
- [ ] Commit any fixes; report AdSense-readiness checklist to user. **Do not deploy.**
