# ShabiTools Advisor — "Ask Anything, Get a Buying Answer"

**Date:** 2026-06-21
**Status:** Approved design — ready for implementation planning

## Summary

A new flagship feature for shabitools: a natural-language buying advisor. A user
asks a question in plain language — *"good cordless drill around $300"* or
*"I want to build a wood balcony, what tools do I need?"* — and receives a short
answer plus **3–9 product cards** of real Amazon products with live prices and
the site's affiliate tag.

Every product card is grounded in **real Amazon Product Advertising API (PA-API)**
data, so links never 404 and the LLM never hallucinates a product. The feature is
designed to (a) differentiate the site, (b) monetize via Amazon Associates, and
(c) capture user demand data that drives the future content roadmap.

## Goals

- Let users ask anything and get a curated, trustworthy buying answer.
- Return real, in-stock Amazon products with valid affiliate links (no dead/invented links).
- Handle two question shapes with one design:
  - **Single-product** ("a good drill ~$300") → one group of cards.
  - **Project / multi-tool** ("tools to build a wood balcony") → grouped toolkit answer.
- Keep running cost low (DeepSeek + aggressive caching).
- Persist every interaction to a DB so the owner can later script demand analysis
  and generate the most-requested reviews/products with an AI skill.
- Strengthen on-site SEO and trust by blending live Amazon data with the site's
  own editorial reviews, and by generating shareable/indexable answer pages.

## Non-goals (explicitly out of scope for v1)

- Conversational multi-turn follow-ups ("make it cheaper", "more heavy-duty"). *(Phase 2)*
- Auto-drafting full review JSON stubs from demand data. *(Phase 2)*
- An interactive admin dashboard. The owner will query D1 via a script instead.
- Non-Amazon merchants in the advisor cards (Admitad etc.). Amazon-only for v1.

## Decisions (locked during brainstorming)

| Decision | Choice |
|---|---|
| Product source | **Live Amazon PA-API** (`SearchItems`), cached in DB |
| PA-API access | Owner has working keys (Access Key + Secret + qualifying account) |
| Hosting of live endpoint | **Cloudflare Pages Function** (site is static `output: export`) |
| Database | **Cloudflare D1** (SQLite), co-located, free-tier |
| Placement | **Dedicated `/advisor` page + homepage hero** search box |
| LLM | **DeepSeek** (`deepseek-chat`) — cheap; key already in `.env` |
| Demand data consumption | **Store cleanly in D1**; owner runs an export script + AI skill later |
| Shareable answer pages | **In v1** (SEO growth loop) |

## Architecture

Fits the existing static Cloudflare Pages deployment (`next build` → `out/` →
`wrangler pages deploy`).

- **Frontend (static, Next export):**
  - `/advisor` page — search box, loading state, rendered answer + cards.
  - Homepage hero search box that routes the question to `/advisor`.
  - Answers render client-side from the API JSON response.
- **Backend (edge):**
  - A **Cloudflare Pages Function** at `functions/api/advisor.ts` handling
    `POST /api/advisor`. Holds `DEEPSEEK_API_KEY`, PA-API Access/Secret keys, and
    the Associates tag **server-side only** (never `NEXT_PUBLIC_*`).
  - An outbound click redirect (e.g. `functions/go/[...].ts` or a logging beacon)
    to record `clicks` before forwarding to the tagged Amazon URL.
- **Database:** Cloudflare D1 bound to the Pages project.

> **Build note for implementation:** confirm how Pages Functions ship with the
> existing `wrangler pages deploy out` flow (a root-level `functions/` directory
> is picked up by `wrangler pages deploy`). Verify D1 binding config in
> `wrangler.toml` / Pages dashboard. This is a known integration point to test
> early, since the project currently has no `functions/` directory.

## Request pipeline (per question)

Two cheap LLM calls, grounded by real Amazon data in between.

1. **Plan** — DeepSeek call #1 ("planner").
   - Input: the raw user question.
   - Output (structured JSON): intent summary + one or more **search groups**.
     Each group: `label`, `keywords`, optional `priceMin`/`priceMax`,
     `categoryGuess`, `whyNeeded`.
   - Single-product question → 1 group. Project question → N groups.
2. **Fetch** — PA-API `SearchItems`, one call per group.
   - Returns real products: title, image, price, ASIN, features, rating.
   - Add Associates tag → tracked affiliate URL.
   - **Cached** by normalized keywords+price (TTL ~24h) — mandatory because
     PA-API is rate-limited (~1 req/sec, ~8,640/day).
3. **Write** — DeepSeek call #2 ("writer").
   - Input: the question + the **real fetched products only**.
   - Output: a short intro paragraph + a one-line "why this fits you" per chosen
     card (3–9 cards total). Grounded selection = no hallucinated products.
4. **Enrich** — internal-review match.
   - For each chosen product, attempt a match against the site catalog
     (`content/reviews`, `content/categories`, `content/brands`) by
     brand+category and/or model/ASIN.
   - On match: attach a **"Read our full review →"** internal link. On no match:
     record it as a **content gap** (demand signal).
5. **Render + Log.**
   - Response JSON: intro, grouped cards (with optional total estimated kit cost
     for project questions), and an `answerHash`.
   - Persist the full interaction to D1 (see schema).

### Alternative pipelines considered (and rejected for v1)

- **Single agentic LLM with PA-API as a tool** — more flexible but more
  round-trips, harder cost/latency control, variable DeepSeek tool-use
  reliability. Rejected for v1.
- **Rule-based keywords, no planner LLM** — cheaper but loses project
  decomposition and intent quality. The planner LLM is what makes the feature
  feel magic. Rejected.

## Card structure (uniform)

Each card renders from the same shape:

- Product image
- Title
- Live price (+ currency)
- Star rating (when PA-API provides it)
- One-line "why it fits you" (from the writer LLM)
- **View on Amazon →** (tagged affiliate link, via the logging redirect)
- Optional **Read our full review →** (internal link when matched)

Project answers group cards under their `label` (e.g. "Cutting", "Driving",
"Sanding", "Fasteners") with an optional total estimated cost.

## Shareable / indexable answer pages (v1)

- Each answer is keyed by `answerHash` = hash of the normalized question.
- A shareable URL (e.g. `/advisor/a/<answerHash>`) renders a stored answer.
- Cached answers are served without re-running the pipeline (cost + speed win).
- Growth loop: real user questions become indexable "best X for Y" pages, feeding
  SEO and reinforcing the demand dataset.

> **Implementation note:** because the site is statically exported, answer pages
> are served by a Pages Function reading D1 (dynamic), not by Next SSG. Decide at
> plan time whether indexable pages are server-rendered by the function with
> proper meta tags, and how they enter the sitemap.

## Data model (Cloudflare D1)

- **`questions`**: `id`, `created_at`, `raw_question`, `normalized_question`,
  `parsed_intent` (JSON), `ip_hash`, `country`, `answer_hash`.
- **`answer_cards`**: `id`, `question_id`, `group_label`, `asin`, `title`,
  `price`, `currency`, `image_url`, `rating`, `position`,
  `internal_match` (review slug or NULL = content gap), `affiliate_url`.
- **`clicks`**: `id`, `asin`, `question_id`, `created_at`.
- **`search_cache`**: `cache_key` (normalized keywords+price), `payload` (PA-API
  JSON), `expires_at`.

A `search_cache` row may alternatively live in Cloudflare KV; D1 is the default
to keep everything in one store. Decide at plan time.

## Demand export (owner workflow)

- `scripts/exportDemand.js` queries D1 (via `wrangler d1 execute`) and outputs:
  - Top questions by frequency.
  - Most-requested products **with `internal_match` NULL** → the content backlog.
  - Click-through by product/question.
- Output is consumed by the owner's separate AI generation skill to produce the
  most-valuable new reviews/category pages.

## Cost & abuse control

- 2 small DeepSeek calls + a few PA-API calls per *uncached* question →
  fractions of a cent; PA-API and D1 are free-tier.
- **Caching**: by normalized question (`answerHash`, short TTL) and by search
  terms (`search_cache`, ~24h, also keeps prices fresh). Repeat/viral questions
  cost ≈ nothing.
- **Per-IP rate limit** (D1 or KV counter) to cap cost and respect PA-API limits.
- Server-side secret handling: DeepSeek + PA-API credentials only in the Pages
  Function environment; never shipped to the browser.

## Error handling

- DeepSeek planner/writer failure → graceful fallback message; log the failure.
- PA-API empty results or rate-limit (429) → return whatever groups succeeded;
  show a "couldn't find good matches" state for empty groups; never crash.
- No internal match → not an error; it's recorded as a content gap.
- Malformed/empty question → client-side validation + server guard.

## Testing

- Unit: planner-output parsing, search-group → PA-API param mapping, affiliate
  URL tagging (reuse/extend `lib/affiliate.ts`), internal-match logic, caching
  key normalization.
- Integration: mocked PA-API + DeepSeek responses through the full pipeline →
  asserted card JSON.
- E2E (Playwright, consistent with existing suite): homepage hero → `/advisor`
  → rendered cards for a single-product and a project question.

## Scope split

- **v1**: homepage hero + `/advisor`; full plan→fetch→write→enrich→render
  pipeline; uniform cards with internal-review links; shareable/indexable answer
  pages; D1 logging; caching; per-IP rate limiting; `exportDemand.js`.
- **Phase 2**: conversational follow-ups; auto-drafted review stubs from demand;
  richer admin/analytics; Admitad/multi-merchant cards.

## Open questions for implementation planning

1. PA-API region/marketplace + exact `SearchItems` resources to request.
2. Pages Functions + D1 wiring against the current `wrangler pages deploy out`
   flow (verify early).
3. Indexable answer-page rendering + sitemap inclusion approach.
4. `search_cache` in D1 vs KV.
