# shabitools → Home Tools Reviews Site — Master Plan

> **Goal:** Transform shabitools.com from a developer-tools hub into an SEO/AEO/GEO-optimized home & power tools review site (Bosch, Makita, DeWalt, etc.) monetized via Admitad affiliate links and display ads.
>
> **Domain:** shabitools.com (keep logo + domain; rebrand content entirely)
>
> **Deployment:** Unchanged — Next.js static export → Cloudflare Pages (`pnpm deploy:production`)

---

## Table of Contents

1. [Current State](#1-current-state)
2. [Target Vision](#2-target-vision)
3. [What We Keep vs Remove](#3-what-we-keep-vs-remove)
4. [Environment Variables](#4-environment-variables)
5. [Site Architecture](#5-site-architecture)
6. [Implementation Phases](#6-implementation-phases)
7. [Admitad Integration](#7-admitad-integration)
8. [SEO / AEO / GEO Strategy](#8-seo--aeo--geo-strategy)
9. [Content Templates](#9-content-templates)
10. [Deployment (Unchanged)](#10-deployment-unchanged)
11. [Success Metrics](#11-success-metrics)
12. [Claude Implementation Prompt](#12-claude-implementation-prompt)

---

## 1. Current State

| Item | Status |
|------|--------|
| Stack | Next.js 14, TypeScript, Tailwind, static export (`output: 'export'`) |
| Hosting | Cloudflare Pages via `wrangler pages deploy out --branch main` |
| CI | GitHub Actions on push to `main` |
| Admitad | Site verified (`verify-admitad` meta tag live on production) |
| API creds | In `.env` (see §4) |
| Homepage | Partially reset — "Coming soon" placeholder exists |
| Legacy code | **Still present** — old `/tools/*` pages, dev-tool components, `data/`, `docs/tools/`, `backend/` need full removal |

**Partial work already done:**
- `app/layout.tsx` — updated metadata for home tools, Admitad + AdSense meta kept
- `app/page.tsx` — coming-soon landing
- `components/Header`, `Footer` — simplified (logo only)

---

## 2. Target Vision

A specialist review site focused on **home & power tools** for DIY homeowners and tradespeople.

**Primary content types:**
- Product reviews (single tool)
- Head-to-head comparisons (e.g. Makita vs Bosch drill)
- Buying guides ("Best cordless drill for…")
- Brand hubs (Bosch, Makita, DeWalt, Milwaukee, Ryobi…)
- Category hubs (drills, saws, sanders, multi-tools…)

**Monetization:**
1. **Admitad** — contextual affiliate links and CTAs on review/comparison pages
2. **Google AdSense** — display ads on informational pages (already configured)
3. Future: sponsored placements, email list (optional)

**Differentiation (avoid thin affiliate spam):**
- Real pros/cons per product
- "Buy if / Skip if" decision blocks
- Spec comparison tables
- FAQ sections optimized for AI answer engines
- "Last updated" dates on all review content

---

## 3. What We Keep vs Remove

### Keep
```
app/layout.tsx, app/page.tsx, app/globals.css, app/not-found.tsx
app/robots.ts, app/sitemap.ts, app/icon.svg
components/Header/, components/Footer/, components/Logo/
public/images/logo.png
next.config.js, tailwind.config.ts, wrangler.toml
package.json, pnpm-lock.yaml, playwright.config.ts
.github/workflows/deploy.yml
.env (local secrets — never commit)
```

### Remove entirely
```
app/tools/**           — all 28+ developer tool pages
app/api/**             — server routes (incompatible with static-only pivot anyway)
app/about, app/blog, app/contact, app/privacy, app/terms  — rewrite fresh later
components/*             — except Header, Footer, Logo
data/**                  — old tools JSON
docs/tools/**, tasks/**  — old dev-tool docs
backend/**               — converter microservices
schemas/**               — old structured data
scripts/**               — old automation
types/index.ts           — old dev-tool types (replace with review types)
Most root *.md files     — old AdSense/dev-tool summaries
```

### Dependencies to prune (after cleanup)
Remove unused packages from `package.json`:
- `qrcode`, `@types/qrcode`, `marked` (were for dev tools)

---

## 4. Environment Variables

All Admitad secrets live in `.env` (local) and Cloudflare Pages dashboard (production).

### Required `.env` keys

```env
# Admitad API (already in .env)
ADMITAD_CLIENT_ID=
ADMITAD_CLIENT_SECRET=
ADMITAD_BASE64_HEADER=
ADMITAD_API_URL=https://api.admitad.com

# Add these for the new site
ADMITAD_VERIFY_CODE=45daf07b7b          # site verification meta tag
NEXT_PUBLIC_SITE_URL=https://shabitools.com

# Optional — other AI keys if used for content generation (keep private)
DEEPSEEK_API_KEY=
GEMINI_API_KEY=
```

### Cloudflare Pages env vars
Set the same Admitad vars in **Cloudflare Dashboard → Pages → shabitools → Settings → Environment variables** for production builds if any build-time Admitad sync is added later.

### Security rules
- Never commit `.env`
- Never expose `ADMITAD_CLIENT_SECRET` to the browser
- Only `NEXT_PUBLIC_*` vars are client-safe
- Admitad API calls must run at **build time** or via a future edge function — not in client bundles with secrets

---

## 5. Site Architecture

### Target URL structure

```
/                                    Homepage (featured reviews, categories)
/reviews/                            All reviews index
/reviews/[slug]                      Single product review
/compare/                            Comparisons index
/compare/[slug]                      Head-to-head (e.g. makita-dhp484-vs-bosch-gsr18v)
/guides/                             Buying guides index
/guides/[slug]                       Best-of guide (e.g. best-cordless-drill-2026)
/brands/                             Brand directory
/brands/[brand]                      Brand hub (bosch, makita, dewalt…)
/categories/                         Category directory
/categories/[category]               Category hub (drills, saws, sanders…)
/about                               E-E-A-T trust page
/contact                             Contact form
/privacy                             Privacy policy (AdSense + affiliate disclosure)
/terms                               Terms of service
/affiliate-disclosure                FTC-compliant affiliate notice
```

### Target folder structure

```
app/
  layout.tsx
  page.tsx
  globals.css
  not-found.tsx
  robots.ts
  sitemap.ts
  reviews/
    page.tsx
    [slug]/page.tsx
  compare/
    page.tsx
    [slug]/page.tsx
  guides/
    page.tsx
    [slug]/page.tsx
  brands/
    page.tsx
    [brand]/page.tsx
  categories/
    page.tsx
    [category]/page.tsx
  about/page.tsx
  contact/page.tsx
  privacy/page.tsx
  terms/page.tsx
  affiliate-disclosure/page.tsx

components/
  Header/
  Footer/
  Logo/
  layout/
    Breadcrumbs.tsx
    PageHero.tsx
  reviews/
    ReviewCard.tsx
    ReviewBody.tsx
    ProsCons.tsx
    SpecTable.tsx
    VerdictBox.tsx
    AffiliateCTA.tsx
  compare/
    ComparisonTable.tsx
  guides/
    GuideCard.tsx
  seo/
    JsonLd.tsx
    FAQSection.tsx
  ads/
    AdSlot.tsx
    AdmitadLink.tsx

content/
  reviews/
    makita-dhp484.json
    bosch-gsr18v-55.json
  compare/
    makita-dhp484-vs-bosch-gsr18v.json
  guides/
    best-cordless-drill-2026.json
  brands/
    makita.json
  categories/
    cordless-drills.json

lib/
  content.ts          # load + type content JSON
  admitad.ts          # build-time affiliate link helpers (server-only)
  seo.ts              # metadata helpers
  schema.ts           # JSON-LD generators

types/
  review.ts
  compare.ts
  guide.ts
```

### Content storage approach (Phase 1)
Start with **JSON/Markdown files in `content/`** — no CMS yet. Static export means all pages are pre-rendered at build time. Migrate to a headless CMS later if volume grows.

---

## 6. Implementation Phases

### Phase 0 — Full cleanup (Day 1)
- [ ] Delete all legacy dev-tool code (see §3)
- [ ] Prune unused npm dependencies
- [ ] Confirm `pnpm build` passes with only new shell
- [ ] Deploy clean "coming soon" to production
- [ ] Add `ADMITAD_VERIFY_CODE` to `.env`; read it in `layout.tsx` instead of hardcoding

### Phase 1 — Foundation (Days 2–4)
- [ ] Define TypeScript types for Review, Compare, Guide, Brand, Category
- [ ] Build `lib/content.ts` to load content from `content/`
- [ ] Create shared layout components: Breadcrumbs, PageHero, FAQSection
- [ ] Build index pages: `/reviews`, `/compare`, `/guides`, `/brands`, `/categories`
- [ ] Update `sitemap.ts` to auto-generate from content files
- [ ] Add JSON-LD schema components (Product, Review, FAQPage, BreadcrumbList)
- [ ] Redesign Header/Footer with real navigation

### Phase 2 — First 10 flagship pages (Days 5–10)
Pick one wedge category first: **cordless drills**.

| # | Type | Example slug | Purpose |
|---|------|--------------|---------|
| 1 | Category hub | `/categories/cordless-drills` | SEO pillar |
| 2 | Brand hub | `/brands/makita` | Brand authority |
| 3 | Brand hub | `/brands/bosch` | Brand authority |
| 4 | Review | `/reviews/makita-dhp484` | Product deep-dive |
| 5 | Review | `/reviews/bosch-gsr18v-55` | Product deep-dive |
| 6 | Compare | `/compare/makita-dhp484-vs-bosch-gsr18v` | High-intent traffic |
| 7 | Guide | `/guides/best-cordless-drill-2026` | Money keyword |
| 8 | Guide | `/guides/best-drill-for-beginners` | Long-tail |
| 9 | About | `/about` | E-E-A-T |
| 10 | Affiliate disclosure | `/affiliate-disclosure` | Compliance |

Each page minimum:
- 800+ words unique content
- Pros/cons block
- Spec table
- FAQ (5+ questions)
- Affiliate CTA
- Internal links to 3+ related pages
- `datePublished` + `dateModified`

### Phase 3 — Admitad wiring (Days 8–12)
- [ ] Build `lib/admitad.ts` — OAuth token + program/deeplink lookup (build-time script)
- [ ] Create `AffiliateCTA` and `AdmitadLink` components
- [ ] Place affiliate links: review verdict, comparison winner, guide recommendations
- [ ] Add FTC disclosure snippet near every affiliate block
- [ ] Script: `pnpm admitad:sync` — refresh affiliate URLs into content JSON at build time

### Phase 4 — Ads & layout (Days 10–14)
- [ ] `AdSlot` component with named positions: `header-banner`, `in-content`, `sidebar`, `footer`
- [ ] Re-add AdSense auto-ads OR manual slots (content-first — ads load after main content)
- [ ] Mobile layout audit — no ad overlap, CLS < 0.1
- [ ] Affiliate-to-content ratio: max 1 primary CTA per product section

### Phase 5 — SEO / AEO / GEO hardening (Ongoing)
- [ ] Unique title/description per page (no duplicates)
- [ ] Canonical URLs on every page
- [ ] Open Graph + Twitter cards
- [ ] `metadataBase` set to `https://shabitools.com`
- [ ] Structured FAQ on every review and guide
- [ ] "Last updated" visible on all content pages
- [ ] Internal linking mesh between reviews ↔ compare ↔ guides ↔ categories
- [ ] Submit sitemap to Google Search Console
- [ ] Monitor AI citation patterns (Perplexity, ChatGPT search, Google AI Overviews)

### Phase 6 — Scale content (Week 3+)
- [ ] Add 5 reviews/week in chosen categories
- [ ] Expand to saws, sanders, multi-tools
- [ ] Add Playwright tests per page type
- [ ] Consider headless CMS (Sanity, Contentful) when JSON files become unwieldy

---

## 7. Admitad Integration

### Site verification (done)
Meta tag in root layout:
```html
<meta name="verify-admitad" content="45daf07b7b" />
```
Move value to `ADMITAD_VERIFY_CODE` in `.env`.

### Affiliate link flow (recommended for static site)

```
Build time:
  1. Script reads ADMITAD_CLIENT_ID + ADMITAD_CLIENT_SECRET from env
  2. Gets OAuth token from Admitad API
  3. Looks up programs for target merchants (Amazon, tool retailers)
  4. Generates deeplinks for product URLs
  5. Writes affiliate URLs into content JSON

Runtime (browser):
  AffiliateCTA renders pre-built deeplink from static JSON
  No secrets in client bundle
```

### Admitad API endpoints to use
| Endpoint | Purpose |
|----------|---------|
| `POST /token/` | OAuth2 client credentials |
| `GET /advcampaigns/` | List available programs |
| `GET /deeplink/` | Generate tracked affiliate URLs |

### Component: `AffiliateCTA`
```tsx
// Renders: "Check price on [Merchant]" button
// Props: affiliateUrl, merchantName, productName, price?
// Always shows: "We may earn a commission" micro-disclosure
```

### Placement rules
| Page type | Placement |
|-----------|-----------|
| Review | After verdict + inline after specs |
| Compare | Under winner recommendation |
| Guide | Each product pick in ranked list |
| Category/Brand hub | No affiliate links (informational only) |

---

## 8. SEO / AEO / GEO Strategy

### On-page SEO checklist (every content page)
- [ ] Primary keyword in H1, URL slug, first 100 words
- [ ] Secondary keywords in H2s
- [ ] Meta title: `{Keyword} — {Brand} Review 2026 | shabitools` (≤60 chars)
- [ ] Meta description: 150–160 chars with CTA
- [ ] Alt text on all product images
- [ ] Canonical URL
- [ ] Breadcrumb navigation + BreadcrumbList schema

### AEO (Answer Engine Optimization)
- FAQ section with natural-language questions
- Direct answer in first sentence of each FAQ answer
- Comparison tables with clear column headers
- "Best for" / "Not ideal for" blocks
- Structured lists (numbered rankings in guides)

### GEO (Generative Engine Optimization)
- Entity-rich writing: brand names, model numbers, specs, use cases
- Citable facts: "The Makita DHP484 weighs 1.9 kg and delivers 62 Nm torque"
- Author/date attribution
- Consistent taxonomy (same category names across site)
- JSON-LD: `Product`, `Review`, `ItemList`, `FAQPage`

### Technical SEO
- Static HTML (already SSG — good for crawlers)
- Fast LCP: hero image WebP, lazy-load below fold
- `robots.txt` allows all content, blocks `/_next/`
- Dynamic `sitemap.xml` from content index
- 301 redirects from old `/tools/*` URLs → homepage or relevant new pages (add `_redirects` or Cloudflare bulk redirects)

---

## 9. Content Templates

### Review JSON schema (minimal)
```json
{
  "slug": "makita-dhp484",
  "title": "Makita DHP484 Cordless Drill Review",
  "brand": "makita",
  "category": "cordless-drills",
  "model": "DHP484",
  "rating": 4.5,
  "priceRange": "$150–$200",
  "affiliate": {
    "url": "https://...",
    "merchant": "Amazon"
  },
  "pros": ["Compact", "Brushless motor", "Great battery life"],
  "cons": ["Premium price", "Charger sold separately"],
  "bestFor": "DIY enthusiasts who want pro-grade reliability",
  "skipIf": "You only need a budget drill for occasional use",
  "specs": {
    "voltage": "18V",
    "torque": "62 Nm",
    "weight": "1.9 kg",
    "chuck": "13 mm"
  },
  "faq": [
    { "q": "Is the Makita DHP484 good for beginners?", "a": "..." }
  ],
  "body": "Markdown content here...",
  "datePublished": "2026-06-11",
  "dateModified": "2026-06-11",
  "related": ["bosch-gsr18v-55", "best-cordless-drill-2026"]
}
```

### Page sections (review template)
1. Hero — product image, rating, quick verdict
2. Quick specs table
3. Pros & cons
4. Full review body (800+ words)
5. Affiliate CTA
6. FAQ
7. Related reviews / comparisons
8. Ad slot (in-content)

---

## 10. Deployment (Unchanged)

### Local dev
```bash
pnpm install
pnpm dev          # http://localhost:3000
```

### Build
```bash
pnpm build        # outputs to /out
```

### Deploy to production
```bash
pnpm deploy:production
# equivalent to: pnpm build && wrangler pages deploy out --branch main
```

### Preview deploy
```bash
pnpm deploy:preview
```

### CI/CD
Push to `main` → GitHub Actions builds and deploys to Cloudflare Pages automatically.

### Post-deploy checklist
- [ ] https://shabitools.com loads
- [ ] Admitad verify meta tag present
- [ ] sitemap.xml valid
- [ ] robots.txt correct
- [ ] No old /tools/* pages indexed (set up redirects)

---

## 11. Success Metrics

| Metric | Target (90 days) |
|--------|------------------|
| Indexed pages | 30+ quality pages |
| Organic sessions | 1,000/month |
| Avg. position (target keywords) | Top 20 for 5+ terms |
| Admitad clicks | Track via Admitad dashboard |
| Admitad EPC | > $0.10/click |
| Core Web Vitals | All green |
| Bounce rate | < 65% on review pages |

---

## 12. Claude Implementation Prompt

Copy everything inside the block below and paste it as your first message to Claude.

---

```markdown
# Project: Rebuild shabitools.com as a Home Tools Review Site

## Context
You are working on the **shabitools** repository — a Next.js 14 static site deployed to Cloudflare Pages.

The site is pivoting from a developer-tools hub to a **home & power tools review site** (Bosch, Makita, DeWalt, Milwaukee, etc.). The old content is irrelevant and should be removed. The logo at `public/images/logo.png` stays.

A partial reset has started:
- `app/layout.tsx` — new metadata, Admitad verify tag, AdSense account meta
- `app/page.tsx` — "coming soon" placeholder
- `components/Header/Header.tsx` — logo only
- `components/Footer/Footer.tsx` — minimal

**Legacy code still exists** and must be fully deleted: `app/tools/`, `app/api/`, old `components/*` (except Header/Footer/Logo), `data/`, `backend/`, `docs/tools/`, `tasks/`, `schemas/`, old `types/`.

## Tech constraints (do not change)
- Next.js 14 App Router, TypeScript, Tailwind CSS
- Static export only: `output: 'export'` in `next.config.js`
- No server-side API routes in production (static hosting on Cloudflare Pages)
- Deploy: `pnpm deploy:production` → builds to `/out` → `wrangler pages deploy out --branch main`
- GitHub Actions deploys on push to `main`
- Keep Playwright tests; update them for new pages

## Environment variables (in `.env` — never commit secrets)
```
ADMITAD_CLIENT_ID
ADMITAD_CLIENT_SECRET
ADMITAD_BASE64_HEADER
ADMITAD_API_URL=https://api.admitad.com
ADMITAD_VERIFY_CODE=45daf07b7b
NEXT_PUBLIC_SITE_URL=https://shabitools.com
```

Admitad API secrets must NEVER appear in client bundles. Affiliate deeplinks should be generated at build time or stored in content JSON — not fetched with secrets in the browser.

## Your mission — execute in order

### Step 1: Full cleanup
1. Delete all legacy dev-tool code listed above
2. Remove unused deps: `qrcode`, `@types/qrcode`, `marked`
3. Ensure `pnpm build` passes cleanly
4. Move `ADMITAD_VERIFY_CODE` from hardcoded layout to env var

### Step 2: Foundation
1. Create `types/review.ts`, `types/compare.ts`, `types/guide.ts`
2. Create `content/` directory with JSON content files
3. Create `lib/content.ts` to load content at build time
4. Create `lib/seo.ts` and `lib/schema.ts` for metadata + JSON-LD
5. Build shared components: Breadcrumbs, PageHero, ProsCons, SpecTable, VerdictBox, FAQSection, AffiliateCTA, AdSlot
6. Redesign Header with nav: Reviews, Compare, Guides, Brands, Categories
7. Redesign Footer with legal links + affiliate disclosure

### Step 3: Page routes
Create these route groups with index + `[slug]` dynamic pages:
- `/reviews/[slug]`
- `/compare/[slug]`
- `/guides/[slug]`
- `/brands/[brand]`
- `/categories/[category]`
Plus static pages: `/about`, `/contact`, `/privacy`, `/terms`, `/affiliate-disclosure`

All pages must export `generateMetadata()` and `generateStaticParams()` from content files.

### Step 4: Seed content (cordless drills wedge)
Create 8–10 real content JSON files:
- 2 brand hubs (makita, bosch)
- 1 category hub (cordless-drills)
- 2 product reviews
- 1 comparison
- 2 buying guides
- about + affiliate-disclosure pages

Each review/guide must have: 800+ words, pros/cons, specs, FAQ (5+), affiliate CTA placeholder, related links, dates.

### Step 5: Admitad integration
1. Create `lib/admitad.ts` — OAuth token + deeplink generation (Node.js, build-time only)
2. Create `scripts/admitad-sync.ts` + `pnpm admitad:sync` script
3. Wire `AffiliateCTA` component with FTC micro-disclosure on every affiliate block
4. Read credentials from env vars only

### Step 6: SEO / AEO / GEO
1. JSON-LD on every page: Product, Review, FAQPage, BreadcrumbList as appropriate
2. Auto-generate `sitemap.ts` from all content files
3. Unique meta title + description per page
4. `metadataBase: new URL('https://shabitools.com')`
5. Visible "Last updated" date on content pages
6. Internal linking between related content

### Step 7: Ads
1. Re-add AdSense with content-first loading (ads after main content)
2. Named `AdSlot` positions: header-banner, in-content, sidebar
3. Do not let ads exceed content — max 3 ad slots per page

### Step 8: Redirects
Add Cloudflare-compatible redirects from old URLs:
- `/tools` → `/`
- `/tools/*` → `/`
(Use `public/_redirects` or document Cloudflare bulk redirect rules)

### Step 9: Tests + deploy
1. Update Playwright tests for homepage + one review page + one guide page
2. Run `pnpm build` — must pass with zero errors
3. Run `pnpm test:simple` — must pass
4. Do NOT deploy unless I ask — just confirm build is green

## Design direction
- Clean, trustworthy review site aesthetic — not gadget blog spam
- Color palette: warm neutrals + amber/orange accent (tools/construction feel)
- Mobile-first, excellent readability for long-form reviews
- Product images prominent; comparison tables responsive
- Keep existing logo — do not replace it

## Code quality rules
- Match existing project conventions
- Minimal scope per change — no over-engineering
- No CMS yet — JSON files in `content/` for Phase 1
- Comments only for non-obvious logic
- No secrets in code or git

## Reference
Full plan document: `docs/HOME_TOOLS_PIVOT_PLAN.md`

Start with Step 1 (full cleanup), show me what you deleted, then proceed step by step. Ask before making major architectural decisions I haven't specified.
```

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Deploy prod | `pnpm deploy:production` |
| Deploy preview | `pnpm deploy:preview` |
| Tests | `pnpm test:simple` |
| Admitad sync (future) | `pnpm admitad:sync` |

| File | Purpose |
|------|---------|
| `.env` | All secrets (Admitad, AI keys) |
| `wrangler.toml` | Cloudflare Pages config |
| `next.config.js` | Static export settings |
| `content/` | Review/guide JSON (to create) |
| `docs/HOME_TOOLS_PIVOT_PLAN.md` | This document |

---

*Last updated: 2026-06-11*
