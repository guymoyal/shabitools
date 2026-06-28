// functions/api/advisor.ts
import catalog from '../../content/_advisor-index.json';
import seedProducts from '../../content/products.json';
import type { CatalogEntry } from '../../lib/advisor/types';
import { planQuestion, writeAnswer } from '../../lib/advisor/deepseek';
import { searchItems } from '../../lib/advisor/paapi';
import { searchSeed } from '../../lib/advisor/seedSearch';
import type { SeedProduct } from '../../lib/advisor/seedSearch';
import { buildAnswer } from '../../lib/advisor/orchestrate';
import { answerHashFor, normalizeQuestion, hashString } from '../../lib/advisor/normalize';
import { checkRateLimit, getCachedAnswer, getCachedSearch, putCachedAnswer, putCachedSearch, logQuestionAndCards } from '../../lib/advisor/db';

interface Env {
  DB: any;
  DEEPSEEK_API_KEY: string;
  PAAPI_ACCESS_KEY: string;
  PAAPI_SECRET_KEY: string;
  AMAZON_ASSOCIATES_TAG: string;
  // 'live' = call Amazon PA-API. Anything else (incl. unset) = offline seed catalog.
  // Keep this 'seed' until PA-API calls actually succeed: keys can exist but return
  // AssociateNotEligible for up to 48h / until 10 qualifying sales clear.
  ADVISOR_SOURCE?: string;
}

const SEARCH_TTL = 24 * 60 * 60 * 1000; // 24h
const RATE_WINDOW = 60 * 1000;          // 1 min
const RATE_CAP = 15;                    // questions / min / ip

export const onRequestPost: any = async (ctx: any) => {
  const { request, env } = ctx;
  const now = Date.now();
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

  // Everything is inside try/catch so the worker NEVER throws an unhandled
  // exception (CF error 1101); failures return a JSON error with detail instead.
  try {
    let body: any;
    try { body = await request.json(); } catch { return json({ error: 'bad request' }, 400); }
    const question = String(body?.question ?? '').trim();
    if (question.length < 3 || question.length > 300) return json({ error: 'invalid question' }, 400);

    const ip = request.headers.get('cf-connecting-ip') ?? '0';
    const ipHash = hashString(ip);
    const country = request.headers.get('cf-ipcountry') ?? '';
    // D1 is OPTIONAL: caching, rate-limiting and demand logging are skipped if the
    // binding is absent, so the AI still answers even without the database attached.
    const db = env.DB;

    if (db) {
      // Answer cache first — serve repeat/viral questions for free, WITHOUT
      // spending the caller's rate budget (a cache hit costs no DeepSeek calls).
      const hash = answerHashFor(question);
      const cached = await getCachedAnswer(db, hash);
      if (cached) return json(cached);
      // Only the expensive path (cache miss) counts against the per-IP limit.
      if (!(await checkRateLimit(db, ipHash, now, RATE_WINDOW, RATE_CAP)))
        return json({ error: 'rate_limited' }, 429);
    }

    const tag = env.AMAZON_ASSOCIATES_TAG;
    const live = env.ADVISOR_SOURCE === 'live'; // default: offline seed catalog
    const answer = await buildAnswer(question, {
      catalog: catalog as CatalogEntry[],
      tag,
      plan: (q) => planQuestion(q, { apiKey: env.DEEPSEEK_API_KEY }),
      write: (q, products) => writeAnswer(q, products, { apiKey: env.DEEPSEEK_API_KEY }),
      search: async (group) => {
        // Seed mode: match against the curated catalog (no PA-API, no cache needed).
        if (!live) return searchSeed(group, seedProducts as SeedProduct[]);
        const key = hashString(JSON.stringify({ k: group.keywords, mn: group.priceMin, mx: group.priceMax }));
        if (db) {
          const hit = await getCachedSearch(db, key, now);
          if (hit) return hit;
        }
        const products = await searchItems(group, {
          accessKey: env.PAAPI_ACCESS_KEY, secretKey: env.PAAPI_SECRET_KEY, partnerTag: tag,
        });
        if (db) await putCachedSearch(db, key, products, now + SEARCH_TTL);
        return products;
      },
    });

    if (db) {
      await putCachedAnswer(db, answer, now);
      // Fire-and-forget logging (don't block the response).
      ctx.waitUntil(logQuestionAndCards(db, {
        rawQuestion: question, normalized: normalizeQuestion(question), intent: answer.intent,
        ipHash, country, answer,
      }));
    }
    return json(answer);
  } catch (e: any) {
    return json({ error: 'advisor_failed', detail: String(e?.message ?? e) }, 500);
  }
};
