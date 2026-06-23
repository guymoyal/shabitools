# Advisor deployment

> **Two modes.** The advisor runs on a curated seed catalog (`ADVISOR_SOURCE=seed`,
> the default) until Amazon PA-API access is unlocked, then flips to live
> (`ADVISOR_SOURCE=live`). Full walkthrough: **docs/advisor-go-live.md**.

## Env vars (Cloudflare Pages → Settings → Environment variables)
- ADVISOR_SOURCE — `seed` (default) or `live`
- DEEPSEEK_API_KEY — needed in both modes
- AMAZON_ASSOCIATES_TAG — needed in both modes
- PAAPI_ACCESS_KEY — live mode only (mark Secret)
- PAAPI_SECRET_KEY — live mode only (mark Secret)

## D1
- Binding name `DB` → database `shabitools-advisor` (see wrangler.toml).
- Apply schema to remote once:
  `pnpm exec wrangler d1 execute shabitools-advisor --remote --file=migrations/0001_advisor.sql`

## Functions
- `functions/` deploys automatically with `wrangler pages deploy out`.
- Verify after deploy: POST /api/advisor returns cards; GET /advisor/a/<hash> renders.

## Rate limits
- PA-API ~1 req/sec — the 24h search_cache absorbs most load.
- Per-IP cap is 15 questions/min (functions/api/advisor.ts).
