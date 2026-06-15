# SEO / E-E-A-T Structured Data — Design

**Date:** 2026-06-16
**Branch:** `seo/eeat-structured-data`

## Context

`shabitools.com` is an affiliate/comparison content site for home & power tools
(Next.js SSG → Cloudflare Pages). Baseline SEO is already strong: canonical/OG/Twitter
via `pageMetadata`, JSON-LD for Product/Review, FAQ, Breadcrumb, ItemList, HowTo, a
sitemap with `lastModified`, robots, GA.

The remaining gaps are E-E-A-T (no author/publisher entity anywhere) and freshness
(`dateModified` is in none of the JSON-LD schemas — only `datePublished` on reviews).
The About page already carries an honest "Our review methodology" section, so the
correct E-E-A-T move is a **named editorial-team Organization** entity — not a
fabricated individual person, which would contradict that honest stance and risks
Google reviews-spam penalties.

**Local SEO was explicitly rejected** as out of scope: the site has no physical
location or service area, so it is the wrong lever and any local signals would be spam.

## Scope

### 1. Editorial entity + freshness in structured data (core)
- Add a shared honest entity in `lib/schema.ts`:
  - `EDITORIAL_ORG(siteUrl)` → `{ '@type': 'Organization', name: 'shabitools Editorial Team', url: <about/methodology> }`
  - `PUBLISHER(siteUrl)` → Organization `shabitools` with `logo` ImageObject.
- Enrich `productReviewJsonLd`: add `dateModified`, set `Review.author` to the editorial
  org (with `url`), add top-level `publisher`. Keep existing `datePublished` and
  `reviewRating`. Do **not** add `aggregateRating` (no aggregate data — would be fabricated).
- Add `articleJsonLd(guide, siteUrl, image?)` → `Article` with `headline`,
  `datePublished`, `dateModified`, `author` (editorial org), `publisher`, and `image`
  when available. Emitted alongside the existing `itemListJsonLd` on guide pages.
- Add `datePublished` + `dateModified` to `howToJsonLd` (HowTo supports both).

### 2. On-page byline (reinforces schema)
- Small "By shabitools Editorial Team · Updated <date>" line on review and guide pages,
  linking to the About methodology section. Replaces/augments the existing bare
  "Updated <date>" line. Honest and minimal.

### 3. Honest guide internal-linking fix
- In `itemListJsonLd` usage on guide pages, link each pick to its **review page** when
  `pick.reviewSlug` exists (today every item URL points back at the guide itself).
- **Not** adding `Offer`/price `Product` schema: `GuidePick` carries no price data, and
  fabricating prices triggers reviews-spam penalties. Documented limitation.

### 4. Fill OG-image gaps
- `app/brands/[brand]/page.tsx` and `app/stores/[slug]/page.tsx` pass
  `ogImage(getImage(...))` (brand logos / store images) instead of falling back to the
  site logo. Reviews/guides/compares/categories/projects already have per-page OG images.

### 5. Delete stale doc
- Remove `SEO_FINAL_CHECKLIST.md` (describes a non-existent "developer tools / code
  tools" site with `/tools/[name]` URLs that do not exist — actively misleading).

## Testing

- TDD: extend `lib/__tests__/schema.test.ts` and `schema-howto.test.ts` to assert:
  - review schema has `dateModified`, `author` (with url), `publisher`;
  - new `articleJsonLd` shape (headline, both dates, author, publisher);
  - guide ItemList item URL resolves to the review when `reviewSlug` is set;
  - HowTo carries both dates.
- Run `pnpm test:unit` (vitest) and `pnpm build` (includes `checkBuild.js`).

## Out of scope
- Local SEO (rejected — wrong site type).
- Offer/price Product schema for guides (no data; would be fabricated).
- Listing/hub OG images and the root-layout default OG (low value).
