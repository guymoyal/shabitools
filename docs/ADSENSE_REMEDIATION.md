# AdSense "Low Value Content" — Remediation Plan

**Branch:** `fix/adsense-low-value-content`  
**Violation:** Low value content (site does not meet publisher network criteria)  
**Date:** 2026-06-11

---

## What Google is flagging

AdSense reviewers look for:

1. **Enough unique, useful content** — not placeholder or thin listing pages
2. **Clear site purpose** — who you are, why readers should trust you
3. **Good UX** — navigation, no dead/empty sections, content before monetization
4. **Policy compliance** — privacy policy, affiliate disclosure, no doorway pages

---

## Issues found on shabitools.com

| Issue | Risk | Fix in this branch |
|-------|------|-------------------|
| Root metadata still said "launching soon" | Site looks unfinished | Updated `app/layout.tsx` descriptions |
| Index pages were card grids only | Thin content on `/reviews`, `/guides`, etc. | Added `IndexEditorial` sections (~150 words each) |
| Empty `/stores` in nav + sitemap | "Coming soon" signals low value | Hide Stores nav until landings exist; noindex empty stores page; remove from sitemap |
| Duplicate affiliate CTAs on every review | Looks affiliate-first, not editorial | One CTA after content (reviews + comparisons) |
| `WhereToBuyStrip` on every article | Monetization clutter (stores empty anyway) | Removed from content pages |
| No dedicated editorial policy | Weak E-E-A-T | New `/editorial-policy` page |
| Privacy policy vague on analytics | Trust mismatch (GA is live) | Documented Google Analytics explicitly |
| Homepage lacked trust signals | Reviewer lands on cards + affiliate strip | Added `TrustStrip` + "What you'll find here" section |

---

## What was already good

- **60+ reviews** (~800+ words each), 35 guides, comparisons, projects, brand/category hubs
- About, contact, privacy, terms, affiliate disclosure pages exist
- `ads.txt` configured (`pub-2201239508910470`)
- Admitad verification meta tag present
- Old `/tools/*` URLs redirect to homepage
- `AdSlot` only renders when `NEXT_PUBLIC_ADSENSE_SLOT` is set (no empty ad placeholders)

---

## Before you click "I confirm that I have fixed the issues"

Do **not** request review immediately after deploy. Google recommends:

1. **Deploy this branch** to production
2. **Search Console** — submit `https://shabitools.com/sitemap.xml`
3. **Wait 1–2 weeks** for recrawl and indexing of new editorial pages
4. **Manually spot-check** 5 URLs:
   - `/` — trust strip + editorial section visible
   - `/reviews` — intro text above grid
   - `/editorial-policy` — loads with substance
   - `/reviews/[any-slug]` — one affiliate CTA at bottom, long body text
   - `/stores` — helpful message (not bare "coming soon"); not in main nav
5. **Then** request AdSense review

Premature re-review can trigger a longer cooldown if the crawler still sees old signals.

---

## Optional follow-ups (not in this branch)

- Add author bios with photos on review pages
- Reduce templated phrasing across similar Ryobi/Makita reviews (anti-template audit)
- Add 2–3 more purely informational articles (safety guides, maintenance how-tos)
- Populate store landings only when Admitad programs are approved — then re-enable Stores nav
- Set `NEXT_PUBLIC_ADSENSE_SLOT` only **after** approval

---

## Deploy

```bash
git checkout fix/adsense-low-value-content
pnpm build
pnpm deploy:production
```

Or merge to `main` and let GitHub Actions deploy.
