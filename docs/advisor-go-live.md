# Advisor — Go-Live Guide (what to do later)

The "ask anything → Amazon product cards" advisor is **fully built and tested**. It runs
in two modes; you flip between them with one environment variable.

| `ADVISOR_SOURCE` | Product source | When |
| --- | --- | --- |
| `seed` (default) | `content/products.json` — your hand-curated list | Now, while PA-API access is pending |
| `live` | Amazon PA-API (live search, infinite catalog) | After you unlock PA-API |

Everything else (the DeepSeek AI that plans the question + writes the answer, the database,
caching, the shareable answer pages, the affiliate links) is **identical in both modes**.
Going live is a one-line switch — no rewrite.

---

## Why we're in seed mode (the blocker)

Amazon's Product Advertising API (and the newer Creators API) both require:

1. An **approved** Associates account, **and**
2. **10 qualifying sales in the trailing 30 days.**

Until then there is no API to call. There is no workaround — it's Amazon's hard gate.
So we ship the feature on a curated seed catalog *now*, which is also how you generate the
sales that unlock the API.

> **Status: the catalog is already populated** with **224 auto-curated products across 22
> categories** (`content/products.json`) — researched top-sellers, each ASIN spot-checked.
> They were curated automatically, not hand-verified one by one, so before you heavily
> promote the page, spot-check prices and a sample of links. This same file powers BOTH the
> homepage product grid AND the AI advisor.

---

## Phase 1 — Maintain the catalog (already populated)

The catalog lives at **`content/products.json`** and already has ~224 products. To add, edit,
or remove products, edit that file. Each entry needs these fields (the affiliate URL is
generated for you from the ASIN + your tag — you do **not** store full links):

```json
{
  "asin": "B08XXXXXXX",          // the real 10-char Amazon ASIN (from the product URL: /dp/B08XXXXXXX)
  "title": "DEWALT 20V MAX Cordless Drill (DCD777C2)",
  "imageUrl": null,              // leave null — real product images need PA-API (Phase 3)
  "price": "$99.00",             // maintained by hand until PA-API
  "currency": "USD",
  "features": ["Brushless motor", "2 batteries", "1.5 Ah"],   // shown on the card + to the AI
  "tags": ["drill", "cordless drill", "power drill"],          // search synonyms — helps the AI match
  "category": "cordless-drills", // a category slug (also used to group the homepage grid)
  "priceValue": 99               // numeric price, used for "under $150" style filtering
}
```

Notes:
- An invalid/non-10-char ASIN is auto-skipped, so a typo never renders a broken link.
- Categories without a `content/categories/<slug>.json` page still show on the homepage
  (humanized name, no banner link) — add a category page later to enable the banner + link.
- To get an ASIN with no API: open the product on amazon.com and copy the `/dp/XXXXXXXXXX`
  part of the URL, or use **SiteStripe** (the Associates toolbar).

After editing, rebuild (`pnpm build`) — malformed JSON fails the build immediately.

## Phase 2 — Ship seed mode & drive sales

1. Make sure the Cloudflare Pages env var **`ADVISOR_SOURCE=seed`** (or just leave it unset — seed is the default).
2. Set the other secrets that seed mode *does* use: **`DEEPSEEK_API_KEY`** and **`AMAZON_ASSOCIATES_TAG`**.
   (You do **not** need PA-API keys in seed mode.)
3. Deploy. The advisor + homepage hero now work for real visitors.
4. Promote the `/advisor` page, add SiteStripe links across your review pages, and drive
   traffic → **rack up the 10 qualifying sales / 30 days.**

Watch demand while you're here:

```bash
pnpm advisor:demand   # top questions, content gaps, clicks (reads remote D1)
```

Use that to decide which products to add to the seed next.

## Phase 3 — Unlock PA-API & flip to live

Once you have 10 qualifying sales in the trailing 30 days:

1. Go to Associates → **Tools → Product Advertising API** (or **Creators API**). The
   "Request access / Create credentials" button should now be active.
2. Create an Application → generate credentials. Amazon shows:
   - **Access Key** → `PAAPI_ACCESS_KEY`
   - **Secret Key** → `PAAPI_SECRET_KEY`  ⚠️ **shown once — copy it immediately.**
3. In **Cloudflare Pages → Settings → Environment variables (Secret)** set:
   - `PAAPI_ACCESS_KEY`
   - `PAAPI_SECRET_KEY`
   - `AMAZON_ASSOCIATES_TAG` (same store id, e.g. `shabitools-20`)
   - `DEEPSEEK_API_KEY` (already set)
4. **Smoke-test before flipping the switch.** New credentials can return
   `AssociateNotEligible` for up to 48h (or until the 10 sales clear). Test live first:
   - Locally: put the keys in `.env`, set `ADVISOR_SOURCE=live`, then
     `pnpm exec wrangler pages dev out --d1 DB=shabitools-advisor` and
     `curl -X POST localhost:8788/api/advisor -d '{"question":"a good cordless drill under $150"}'`.
   - If you get real cards → eligible. If you get `AssociateNotEligible` / empty → wait and retry.
5. Only once live calls succeed, set **`ADVISOR_SOURCE=live`** in Cloudflare and redeploy.
   The advisor now uses live Amazon search. (You can delete `content/products.json`
   entries or leave them — they're ignored in live mode.)

> Keys existing ≠ keys working. The flag is deliberately separate from key presence so the
> site never silently breaks the moment you paste credentials.

---

## Reference: where things live

- Product source toggle: `functions/api/advisor.ts` (`ADVISOR_SOURCE`).
- Seed matcher: `lib/advisor/seedSearch.ts` (token-overlap scoring, price bounds, invalid-ASIN filter).
- Seed data: `content/products.json`.
- Live PA-API client: `lib/advisor/paapi.ts` + `lib/advisor/sigv4.ts`.
- Deploy basics (D1, secrets, functions): `docs/advisor-deploy.md`.
- Demand export: `scripts/exportDemand.js` (`pnpm advisor:demand`).
