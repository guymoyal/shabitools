# Advisor — Go-Live Guide (what to do later)

The "ask anything → Amazon product cards" advisor is **fully built and tested**. It runs
in two modes; you flip between them with one environment variable.

| `ADVISOR_SOURCE` | Product source | When |
| --- | --- | --- |
| `seed` (default) | `content/advisor-seed.json` — your hand-curated list | Now, while PA-API access is pending |
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

> ⚠️ **Do NOT deploy the advisor to production with the example/placeholder seed entries.**
> Real visitors clicking fake links hurts the user experience and can jeopardize the
> Associates approval you're trying to earn. Placeholder rows (ASIN `EXAMPLE...`) are
> auto-skipped by the code, so a half-filled seed file degrades to an honest
> "no good matches" message rather than broken links — but you still want real products
> in there before promoting the page.

---

## Phase 1 — Fill the seed catalog (do this first)

Edit **`content/advisor-seed.json`**. Replace the `EXAMPLE...` rows with real products.

For each product you only need **four facts** (the affiliate URL is generated for you from
the ASIN + your tag):

```json
{
  "asin": "B08XXXXXXX",          // the real 10-char Amazon ASIN (from the product URL: /dp/B08XXXXXXX)
  "title": "DEWALT 20V MAX Cordless Drill (DCD777C2)",
  "imageUrl": "https://m.media-amazon.com/images/I/xxxx.jpg",  // optional, can be null
  "price": "$99.00",             // what it costs today (you maintain this by hand in seed mode)
  "currency": "USD",
  "features": ["Brushless motor", "2 batteries", "1.5 Ah"],   // optional, shown to the AI
  "tags": ["drill", "cordless drill", "power drill"],          // search synonyms — helps matching
  "category": "cordless-drills", // a slug from content/categories — enables the internal review link
  "priceValue": 99               // numeric price, used for "under $150" style filtering
}
```

**How to get the four facts** (no API needed):
- Open the product on amazon.com.
- **ASIN**: in the URL after `/dp/` (e.g. `/dp/B08XXXXXXX`), or in the "Product information" section.
- **Image**: right-click the main image → copy image address (the `m.media-amazon.com/images/...` URL).
- **Title / price**: copy from the page.
- Build your **affiliate link** with **SiteStripe** (the toolbar Amazon shows when you're logged into Associates) — but you don't paste it here; the code builds it from the ASIN + your tag.

**Tips for good matching:**
- Aim for **~15–30 products** across your main categories (drills, saws, sanders, etc.).
- Put synonyms and use-cases in `tags` — that's what the matcher scores against.
- Set `category` to a real slug under `content/categories/` so each card links to your review.

To verify your edits load, run the unit suite (it won't validate *content*, but it will catch
malformed JSON when the function imports it):

```bash
npx vitest run lib/advisor/__tests__/seedSearch.test.ts
```

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
   The advisor now uses live Amazon search. (You can delete `content/advisor-seed.json`
   entries or leave them — they're ignored in live mode.)

> Keys existing ≠ keys working. The flag is deliberately separate from key presence so the
> site never silently breaks the moment you paste credentials.

---

## Reference: where things live

- Product source toggle: `functions/api/advisor.ts` (`ADVISOR_SOURCE`).
- Seed matcher: `lib/advisor/seedSearch.ts` (token-overlap scoring, price bounds, invalid-ASIN filter).
- Seed data: `content/advisor-seed.json`.
- Live PA-API client: `lib/advisor/paapi.ts` + `lib/advisor/sigv4.ts`.
- Deploy basics (D1, secrets, functions): `docs/advisor-deploy.md`.
- Demand export: `scripts/exportDemand.js` (`pnpm advisor:demand`).
