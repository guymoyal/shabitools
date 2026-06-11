# shabitools.com — Home & Power Tools Review Site: Design Spec

**Date:** 2026-06-12
**Status:** Approved design — supersedes the conflicting parts of `docs/HOME_TOOLS_PIVOT_PLAN.md` and `admitad/PLAN.md`, merging both into one architecture.
**Reference implementation for the Admitad layer:** `/Users/guym/Projects/aibuzz`

## 1. Goal

Pivot shabitools.com from a developer-tools hub into a US-targeted home & power tools review site (Makita, Bosch, DeWalt, Milwaukee, etc.) that earns from:

1. **CPA/CPS** — Admitad retailer deeplinks (Home Depot, Ace Hardware, Acme Tools, VEVOR…) as primary "Check price" CTAs on reviews/comparisons/guides.
2. **CPC** — Admitad no-approval partner-catalog links (Takeads/`tatrck.com`) rendered as `/stores/[slug]` merchant landing pages and secondary "Where to buy" strips.
3. **AdSense** — 2–3 manual, fixed-size, lazy-loaded slots per page (no auto-ads).

Both link types are tracked in the Admitad dashboard; rebalance toward the higher-EPC type after ~30 days of data.

**Key fact:** Makita/DeWalt/Milwaukee don't run their own Admitad programs. Monetization is via retailers that sell those brands. Verified against the aibuzz 3,519-program catalog dump: a US home-improvement/DIY filter yields roughly 50–150 programs.

## 2. Decisions (locked)

| Decision | Choice |
|---|---|
| Target market | US-first; English content for US buyers |
| Monetization | Both CPA (primary CTAs) + CPC (landings/strips), measured via Admitad EPC |
| Launch content | ~15 flagship editorial pages + ~100–150 filtered merchant landings |
| AdSense | Keep, manual slots only, lazy-loaded after content |
| Page cap | **Hard 1,500-page limit** enforced by a postbuild script that fails the build |
| Stack | Unchanged: Next.js 14 App Router, TypeScript, Tailwind, `output: 'export'`, `trailingSlash: false` |
| Deploy | Unchanged: `pnpm deploy:production` → Cloudflare Pages; no deploy without explicit user request |
| CMS | None — JSON files in `content/` |

## 3. Site architecture

### Routes

```
/                                Homepage: hero, featured reviews, categories, top stores
/reviews, /reviews/[slug]        Product reviews
/compare, /compare/[slug]        Head-to-head comparisons
/guides, /guides/[slug]          Buying guides ("Best cordless drill 2026")
/brands, /brands/[brand]         Brand hubs (makita, bosch, dewalt…) — informational, no affiliate CTAs
/categories, /categories/[cat]   Category hubs (cordless-drills, saws…) — informational
/stores, /stores/[slug]          CPC merchant landing pages (AI copy, FAQ, CTA)
/go/[slug]                       First-party redirect for ALL tracked links (noindex, robots-disallowed)
/about, /contact, /privacy, /terms, /affiliate-disclosure
```

`/stores/[slug]` (not root-level `/[slug]` as in aibuzz) — clearer entity, no reserved-route collisions. All internal links without trailing slashes (`trailingSlash: false`).

### Folder structure

```
app/            routes above + robots.ts + sitemap.ts
components/
  Header/ Footer/ Logo/                    (kept, redesigned)
  layout/      Breadcrumbs, PageHero
  reviews/     ReviewCard, ProsCons, SpecTable, VerdictBox, BuySkipBox
  compare/     ComparisonTable
  guides/      GuideCard, RankedPickCard
  seo/         JsonLd, FAQSection
  monetization/ AffiliateCTA, WhereToBuyStrip, AdSlot
  landings/    StoreLanding (ported from aibuzz CampaignLanding, restyled)
content/
  reviews/*.json  compare/*.json  guides/*.json  brands/*.json  categories/*.json
  partner-programs.json           (harvest output)
  admitad-landings.json           (merged + DeepSeek copy)
lib/
  content.ts    typed loaders for content/
  admitad.ts    official-API OAuth + deeplink generation (build-time only, server-only)
  partnerLandings.ts              (ported from aibuzz)
  schema.ts     JSON-LD generators (Product, Review, FAQPage, BreadcrumbList, ItemList)
  seo.ts        metadata helpers
scripts/
  admitadLogin.js, harvestPartnerPrograms.js, mergePartnerPrograms.js,
  generateLandingCopy.js          (ported from aibuzz, adapted — see §4 Phase 3)
  admitad-sync.ts                 (CPA deeplink refresh into content JSON)
  check-page-cap.js               (postbuild: count out/**/*.html, fail if > 1500)
types/
  review.ts compare.ts guide.ts brand.ts category.ts landing.ts
```

### Review content schema (per `HOME_TOOLS_PIVOT_PLAN.md` §9)

slug, title, brand, category, model, rating, priceRange, affiliate {url, merchant}, pros[], cons[], bestFor, skipIf, specs{}, faq[] (5+ Q/A), body (markdown, 800+ words), datePublished, dateModified, related[].

## 4. Implementation phases

### Phase 0 — Finish cleanup
- Delete remaining legacy dev-tool components (HashGenerator, SQLFormatter, Base64ImageConverter, CSSValidator, HTMLMinifier, HTMLValidator, ImageCompressor, JavaScriptMinifier, URLEncoder, XMLFormatter).
- Prune deps: `qrcode`, `@types/qrcode`, `marked`.
- Commit the ~294 pending deletions.
- Move hardcoded Admitad verify code in `app/layout.tsx` to `ADMITAD_VERIFY_CODE` env var.
- `pnpm build` green.

### Phase 1 — Foundation
- Types, `lib/content.ts`, `lib/schema.ts`, `lib/seo.ts`.
- Design system: warm neutrals + amber/orange accent, mobile-first, Tailwind only (no UI libraries), server components by default.
- Header nav: Reviews · Compare · Guides · Brands · Stores. Footer: legal links + affiliate disclosure.

### Phase 2 — Editorial core (cordless-drills wedge, ~15 pages)
Seed: 2 brand hubs (makita, bosch) · 1 category hub (cordless-drills) · 4 reviews · 2 comparisons · 3 guides · about/contact/privacy/terms/affiliate-disclosure.
Every review/guide: quick-verdict hero with rating, spec table, pros/cons, Buy if / Skip if, FAQ (5+), related links (3+), visible published/updated dates, 800+ words.

### Phase 3 — CPC layer (port from aibuzz)
- Port scripts with changes: new shabitools ad-space `websiteId`; harvest filtered to US home-improvement/DIY/garden category IDs (re-fetch `partners_programs_filter_data` — the IDs in `admitad/PLAN.md` are dev-tools categories, wrong for this niche) **plus** keyword allowlist (tool, hardware, drill, saw, garden, depot, vevor, …) and blocklist (flowers, fitness, insurance, halloween, …).
- DeepSeek copy prompt rewritten for a home-tools reviewer voice (`DEEPSEEK_API_KEY` in `.env.local`).
- `/stores/[slug]` + `/stores` index (ItemList JSON-LD); `dynamicParams = false`; placeholder slug when content empty (Next 14 export rejects empty `generateStaticParams`).
- **Ad-blocker fix (critical, proven on aibuzz):** never link `tatrck.com` directly — every tracked link goes through first-party `/go/[slug]` (JS `location.replace` + visible fallback link, noindex, robots-disallow `/go/`). Build verification: zero `tatrck` strings in page HTML.
- `rel="sponsored nofollow"` on all monetized links.
- package.json scripts: `partners:login`, `partners:harvest`, `partners:manual`, `partners:copy`, `partners:sync`.

### Phase 4 — CPA layer
- `lib/admitad.ts`: official API — `POST /token/` (OAuth2 client credentials), `GET /advcampaigns/`, `GET /deeplink/`. Build-time only; secrets never in client bundles.
- `scripts/admitad-sync.ts` + `pnpm admitad:sync` writes deeplinks into content JSON.
- `AffiliateCTA` ("Check price at [Merchant]") with FTC micro-disclosure ("We may earn a commission") on every affiliate block.
- Placement: reviews → after verdict + after specs; comparisons → under winner; guides → each ranked pick; brand/category hubs → none.

### Phase 5 — SEO / AEO / GEO
- **SEO:** unique title/description per page, canonicals, `metadataBase: https://shabitools.com`, OG/Twitter cards, Breadcrumbs + BreadcrumbList, sitemap auto-generated from content files, `public/_redirects` mapping old `/tools/*` URLs → relevant new pages (preserve domain equity).
- **AEO:** FAQPage schema on all content pages, direct-answer-first FAQ phrasing, clean comparison-table headers, numbered rankings in guides.
- **GEO:** entity-dense citable sentences (brand + model + spec + number), consistent taxonomy, author/date attribution, Product/Review/ItemList JSON-LD, `llms.txt`.

### Phase 6 — Performance, ads, guardrails, tests
- Targets: Lighthouse ≥95 mobile, LCP <2.0s, CLS <0.05. Means: static export, `next/font` self-hosted, WebP/AVIF with explicit dimensions, near-zero client JS, lazy-load below fold.
- AdSense: manual `AdSlot` positions (`in-content`, `footer`), fixed dimensions, lazy-loaded after content paint; max 3 per page.
- Page-cap guard: `scripts/check-page-cap.js` runs postbuild, prints HTML count from `out/`, exits non-zero above 1,500. Budget ≈ 150–200 pages at launch.
- Playwright smoke tests: homepage, one review, one guide, one store landing, one `/go/` redirect.
- Deploy only on explicit user request.

## 5. Environment & security

`.env` (never committed): `ADMITAD_CLIENT_ID`, `ADMITAD_CLIENT_SECRET`, `ADMITAD_BASE64_HEADER`, `ADMITAD_API_URL`, `ADMITAD_VERIFY_CODE=45daf07b7b`, `NEXT_PUBLIC_SITE_URL=https://shabitools.com`, `DEEPSEEK_API_KEY`.
Also gitignored: `.admitad-profile/`, network-log dumps.
Admitad API calls run at build time only; only `NEXT_PUBLIC_*` reaches the client.

## 6. Manual steps owned by the user

1. Create the shabitools ad space in the Admitad dashboard; provide its `websiteId` (note: IDs can change if re-registered — re-check on 404).
2. One-time "Connect my ad space" approval for the partner catalog.
3. Run `pnpm partners:login` once (real-Chrome Playwright login; or reuse the aibuzz session profile via `PROFILE_DIR`).
4. Join 3–5 CPA retailer programs from a list Claude provides.

## 7. Risks

- **Scaled-content policy:** keep landings filtered to ~100–150, grow editorial weekly; never bulk-publish near the 1,500 cap.
- **Internal-API fragility:** harvest endpoints are undocumented; scripts fail loudly; session expiry → re-run login.
- **Attribution:** all tracked links must be generated under the shabitools ad space, not aibuzz's, or commissions risk rejection.
- **Niche pivot:** old `/tools/*` equity is partially lost; redirects mitigate.

## 8. Success metrics (90 days)

Indexed pages 30+ editorial · organic 1,000 sessions/mo · top-20 for 5+ target terms · Admitad EPC > $0.10/click · all Core Web Vitals green.
