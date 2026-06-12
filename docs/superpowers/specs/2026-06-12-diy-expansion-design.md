# shabitools.com — DIY Expansion to 200+ Pages: Design Addendum

**Date:** 2026-06-12
**Status:** Approved — extends `2026-06-12-home-tools-pivot-design.md` (which remains in force).
**User decisions (locked):** Mixed images (manufacturer product photos on money pages + free-license stock elsewhere) · Balanced DIY hub content mix · Pexels API key provided by user in `.env.local`.

## 1. Goal

Grow the launched 26-page editorial wedge into a ~205-page home-DIY destination with images on every page: tool reviews, head-to-head comparisons, buying guides, **DIY how-to projects** (new content type), brand hubs, and category hubs. Same stack, same guards (hard 1,500-page cap, zero `tatrck.com` leaks, FTC disclosure, editorial honesty: analytical voice, web-verified specs, NO fabricated hands-on claims).

## 2. Target page inventory (~205)

| Type | Now | Target | Notes |
|---|---|---|---|
| Reviews | 4 | 60 | ~4 per category, web-verified specs, product hero image |
| Comparisons | 2 | 25 | two product images side by side |
| Guides | 3 | 35 | product image per ranked pick |
| **Projects (new)** | 0 | 45 | HowTo JSON-LD, tools/materials lists linking to reviews + affiliate CTAs, stock hero |
| Brand hubs | 2 | 10 | makita, bosch + dewalt, milwaukee, ryobi, craftsman, ridgid, skil, metabo-hpt, ego |
| Category hubs | 1 | 15 | cordless-drills + impact-drivers, circular-saws, miter-saws, table-saws, jigsaws, reciprocating-saws, sanders, angle-grinders, oscillating-tools, routers, shop-vacuums, lawn-care, pressure-washers, tool-storage |
| Index pages | 6 | 7 | + `/projects` |
| Static/legal | 8 | 8 | unchanged |

Stores landings (Task 20, blocked on user) add ~100–150 later — total stays well under the 1,500 cap.

## 3. Image pipeline

**Sources:** (a) direct manufacturer/retailer product-image URLs collected by content authors during spec verification; (b) Pexels API search (`PEXELS_API_KEY` in `.env.local`, never committed) for workshop/DIY stock. Stock credit recorded; Pexels license requires no attribution but we keep provenance.

**Data flow:**
- `content/images.json` — authored manifest: `{ "<id>": { "source": "https://…" | "pexels:<search query>", "alt": "…" } }`. Ids are paths like `reviews/makita-xfd131`, `projects/build-a-workbench`, `categories/cordless-drills`.
- `scripts/fetchImages.js` (`pnpm images:fetch`) — for each manifest id without an existing output: download (direct URL, or top Pexels result for `pexels:` sources), process with `sharp` → `public/images/<id>.webp` (max 1200w, q78) + `public/images/<id>-sm.webp` (640w); record `{width, height, credit}` into `content/images.meta.json` (committed). Idempotent; skips existing; fails loudly per-image but continues, summary at end.
- `lib/images.ts` — `getImage(id)` → `{ src, srcSm, alt, width, height } | null` (null when not yet fetched — pages render without the image, build never breaks on a missing image).
- `components/ui/SiteImage.tsx` — plain `<img>` (static export: no next/image optimizer): explicit width/height (CLS-safe), `srcset` with `-sm` variant, `loading="lazy"` + `decoding="async"` by default, `priority` prop for above-fold heroes (eager + `fetchpriority="high"`).

**Placement:** review hero + card thumbnails; comparison: both products; guide: per ranked pick; project: hero (+ optional per-step); category/brand/homepage heroes: stock. Every content page sets `og:image` from its hero (also fixes the missing-Twitter-card minor). `pageMetadata` gains optional `image` param.

`public/images/` is committed (static export needs the files at deploy; keeps builds reproducible).

## 4. New content type: Project

`types/project.ts`:
slug, title, description, category, difficulty (`beginner|intermediate|advanced`), timeRequired (human, e.g. "4–6 hours") + timeRequiredIso ("PT5H") for schema, estCost, toolsNeeded[] `{name, reviewSlug?, affiliate?: AffiliateLink}`, materials[], steps[] `{name, text}` (5+), faq[] `{q,a}` (4+), body (markdown 700+ words: intro, planning advice, mistakes to avoid), datePublished, dateModified, related[].

`lib/schema.ts` adds `howToJsonLd(project, siteUrl)` → HowTo (name, description, totalTime, estimatedCost, tool[], supply[], step[] as HowToStep) — plus FAQPage as on other pages.

Routes `/projects` (index, ItemList) + `/projects/[slug]`: hero image, difficulty/time/cost stat strip, "Tools you'll need" box (links to internal reviews; affiliate CTA when present, with micro-disclosure), materials list, numbered steps, prose body, FAQ, related links. Header nav becomes Reviews · Compare · Guides · Projects · Brands · Stores. Homepage gains a "Build something this weekend" projects section. Sitemap + llms.txt updated.

## 5. Content authoring rules (unchanged + additions)

- Analytical reviewer voice; specs web-verified at write time; never claim hands-on testing. Projects give real, safe, conventional build instructions — standard DIY practice only, with a safety note where relevant (PPE, electrical disclaimers: "consult a licensed electrician" for wiring tasks).
- Each review: 800+ words, rating, specs, pros/cons, buy-if/skip-if, 5+ FAQ, 3+ related, affiliate entries (campaignId 0 until Task 22), product image URL captured into `content/images.json` during verification.
- Anti-template rule: stock phrases may not repeat across files in a batch.
- All datePublished honest (actual write date).

## 6. Execution model (scale adaptation of subagent-driven-development)

- **Infra tasks** (image pipeline, Project type/routes, wiring images into existing components/pages): full per-task implementer + spec review + quality review, as before.
- **Content waves**: agents author disjoint JSON files in waves; controller commits per wave. Per-wave review = one reviewer auditing every file in the wave for schema compliance, honesty policy, URL sanity, FAQ shape `{q,a}`, anti-template repetition — not per-file double review (volume adaptation).
- After each wave: `pnpm test:unit` + `pnpm build` (page-cap + tracker guards) must pass before commit.
- Final: full-branch review + Playwright suite + `pnpm images:fetch` once key present.

## 7. AdSense recovery

AdSense rejected the live site for **"Low value content"** (2026-06-12). Fixes: (a) `public/ads.txt` with the user's publisher line; (b) this expansion itself — volume, images, informational projects content, clear E-E-A-T signals; (c) request AdSense review only AFTER the expansion is deployed and Google has recrawled (submit sitemap in Search Console, wait ~1–2 weeks for indexing before clicking "Request review" — premature re-review risks a longer cooldown).

## 8. Risks

- **Scaled-content policy:** ~180 new pages at once is bulk publishing. Mitigation: genuinely differentiated, verified, entity-rich content; projects/guides give informational (not purely commercial) balance; growth continues weekly afterward. User accepts the launch-size tradeoff (explicit "at least 200 pages").
- **Image copyright:** manufacturer product images on review pages = accepted low risk (user decision); stock strictly free-license via Pexels.
- **Spec accuracy at volume:** every spec table web-verified by its author agent; wave reviewer spot-checks 2 files per wave against the live web.
