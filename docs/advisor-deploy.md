# Advisor deployment

## Secrets (Cloudflare Pages → Settings → Environment variables, mark as Secret)
- DEEPSEEK_API_KEY
- PAAPI_ACCESS_KEY
- PAAPI_SECRET_KEY
- AMAZON_ASSOCIATES_TAG

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
