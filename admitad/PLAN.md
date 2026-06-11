# shabitools × Admitad — Partner Landing Pages & Ads Plan

**Date:** 2026-06-11
**Status:** PLAN ONLY — nothing implemented in this repo yet.
**Reference implementation (fully working, copy from here):** `/Users/guym/Projects/aibuzz`
(see its `docs/HARVEST.md`, `scripts/`, `components/landings/`, `app/[slug]/`, `app/go/[slug]/`).
A pharma/beauty variant of this plan exists at `/Users/guym/Projects/swiftherb/admitad/PLAN.md`.

## Goal

Monetize **shabitools.com** (free developer-tools hub, Next.js 14 static export) with:
1. **Landing pages** — one per Admitad **no-approval** partner-network program
   ("Affiliate programs from partners", Takeads/`tatrck.com` links), filtered to the
   developer/tech niche, at `shabitools.com/<program-slug>` with AI-generated copy.
2. **Ads/affiliate placements** — tasteful sponsored links across existing pages.

## What was proven on aibuzz.world (2026-06-11) — reuse, don't rediscover

- **Official Admitad publisher API** can't join programs (attach API retired, 410) and does
  NOT expose the no-approval partner catalog. The dashboard's **internal API** does:
  - Catalog: `GET https://catalog.store.admitad.com/en/catalog/api/v1/website/{adSpaceId}/offers/all_partners_programs/?limit=100&offset=0` (3,519 programs total)
  - Category filter: `&categories=<id>` (verified single id; test comma form for multiple)
  - Link generation: `POST .../offers/{campaignId}/goto_link/generate_partners_programs/`
    → `{"goto_link": "https://tatrck.com/h/…"}` (CSRF: `X-CSRFToken` header from `csrftoken`
    cookie, in-page fetch with `credentials: 'include'`)
- **Login:** Playwright persistent profile, real Chrome (`channel: 'chrome'`,
  `--disable-blink-features=AutomationControlled`, drop `--enable-automation`), otherwise
  Google SSO refuses. Session saved at `/Users/guym/Projects/aibuzz/.admitad-profile/` —
  can be reused (point PROFILE_DIR there) or re-login in this repo. Gitignore the profile.
- **Ad-blocker fix (critical):** EasyList/AdGuard hide any `<a href^="https://tatrck.com/">`
  and `$document`-block tatrck.com. Never link tatrck directly — route every CTA through a
  first-party `/go/<slug>` noindex redirect page (JS `location.replace` + visible fallback
  link), robots-disallow `/go/`. `rzekl.com` (regular Admitad links) is NOT on the lists.
- **DeepSeek copy:** ~$1.3 per 1,000 pages (deepseek-chat, JSON mode), idempotent generator
  with COPY_CONCURRENCY worker pool; ~99% success first pass, re-run fills failures.
- **Cloudflare free tier:** static assets are free/unlimited requests; limit 20,000 files
  per deploy — fine for a filtered niche set (aibuzz at 3,520 pages = 14.5k files).

## Relevant partner-catalog categories for a developer-tools site

| id | Category |
|---|---|
| 122 | Online Services > IT Services & Soft |
| 98 | Online Services > Online Education |
| 206 | Online Services > B2B Online Services |
| 391 | June AI Fest (AI-related programs; seasonal) |
| 20 | Online Services > Telecommunications (VPNs etc. often here) |

(Re-fetch `partners_programs_filter_data` for the live tree; ids above from the 2026-06-11 dump.)

## Prerequisites — Admitad account steps (manual, in dashboard)

1. **Create an ad space for shabitools.com** (Add ad space) — note its `websiteId`
   (appears in the store URL `…/websites/<id>/…`).
   - Heads-up: ad-space IDs can change if re-registered (happened with aibuzz:
     2945005 → 2951457). Re-check the id if API calls 404.
2. **Verify the site:** Admitad gives a `<meta name="verify-admitad" content="…">` tag —
   add it in `app/layout.tsx` `metadata.verification.other`, deploy, click Verify.
3. **Connect the ad space to the partner catalog:** select the shabitools ad space →
   "Affiliate programs from partners" tab → Get link on any program → "Connect my ad space"
   → submit the short form (monthly active users + contact) → wait for the one-time approval.
   After that, every partner-network program is approval-free.
4. Optionally join instant-approval regular programs (e.g. AliExpress WW) for `rzekl.com`
   links exposed via the official API.

## Implementation tasks (port from aibuzz — exact files)

1. **Scripts** → `scripts/` (CJS, need `slugify`, `playwright`, `dotenv` devDeps;
   `pnpm add -D playwright slugify dotenv && pnpm exec playwright install chromium`):
   - `aibuzz/scripts/admitadLogin.js` — set WEBSITE_ID default to the new shabitools ad space id
   - `aibuzz/scripts/harvestPartnerPrograms.js` — set HARVEST_WEBSITE_ID default; add
     `HARVEST_CATEGORIES` support (append `&categories=` to the list URL); writes
     `content/partner-programs.json`
   - `aibuzz/scripts/mergePartnerPrograms.js` — merges into `content/admitad-landings.json`,
     preserves generated copy, reserved-route guard reads `app/`
   - `aibuzz/scripts/generateLandingCopy.js` — change the prompt's site description from
     "AI/tech site (aibuzz.world)" to "developer-tools site (shabitools.com)";
     needs `DEEPSEEK_API_KEY` in `.env.local`
   - `aibuzz/scripts/lib/admitadApi.js` + `aibuzz/scripts/fetchAdmitadPrograms.js` — only if
     also using official-API programs (AliExpress etc.)
2. **Rendering** → port from aibuzz:
   - `lib/partnerLandings.ts` (data loader)
   - `components/landings/CampaignLanding.tsx` (hero / benefits / how-it-works / FAQ /
     CTA + disclosure) — restyle to shabitools' design system
   - `app/[slug]/page.tsx` — landing route, `dynamicParams = false`, placeholder slug when
     empty (Next 14 export rejects empty generateStaticParams), per-page canonical
     `https://shabitools.com/<slug>`, FAQPage JSON-LD
   - `app/go/[slug]/page.tsx` — first-party redirect (ad-block fix, noindex)
   - `app/partners/page.tsx` — index with ItemList JSON-LD
   - sitemap additions + `robots` disallow `/go/`
   - **NOTE: shabitools has `trailingSlash: false`** (aibuzz is true) — internal links must
     be `/partners` and `/go/<slug>` without trailing slashes; adjust ported code.
3. **Ads on existing pages:** port `components/ads/AffiliateStrip.tsx` +
   `lib/monetization.ts` + `content/affiliate-picks.json` pattern from aibuzz; place the
   strip on the homepage, blog posts, and tool pages. Lead with monetized links
   (via `/go/…`), label clearly ("Deals & tools we recommend"), `rel="sponsored nofollow"`.
   Coexists with AdSense (this repo already has AdSense docs/setup).
4. **package.json scripts:** `partners:login`, `partners:harvest`, `partners:manual`,
   `partners:copy`, `partners:sync` (mirror aibuzz, pnpm-flavored).
5. **Harvest filtered**: `HARVEST_WEBSITE_ID=<newId> HARVEST_CATEGORIES=122,98,206 pnpm partners:harvest`
   — expect a few hundred programs, not thousands (SEO-safer for an established site).
6. **Generate + build + verify**: `pnpm partners:sync && pnpm build`; check a few pages,
   confirm zero `tatrck` strings in page HTML (everything via `/go/`), FAQ JSON-LD present.
7. **Deploy** with the repo's existing `deploy:production` flow.

## Pipeline (once implemented)

```bash
pnpm partners:login      # once, or when the session expires
pnpm partners:harvest    # pull niche programs + tracking links (internal API)
pnpm partners:sync       # merge + DeepSeek copy (idempotent, resumable)
pnpm build               # static export with landing pages
# deploy when ready (deploy:production)
```

## Risks / notes

- **SEO:** keep the set niche-filtered (hundreds, not 3,519) — mass thin pages risk
  Google's scaled-content policies; shabitools has existing rankings to protect.
- **Attribution:** links must be generated under the **shabitools ad space** — links from
  another ad space technically work but risk commission rejection for source mismatch.
- **Internal API fragility:** undocumented endpoints; harvester fails loudly. Session
  expiry → re-run login.
- **AdSense coexistence:** affiliate strips + AdSense are fine together; keep total ad
  density reasonable (Core Web Vitals + AdSense policy).
- Don't commit: `.admitad-profile/`, `.env.local`, network-log dumps.
