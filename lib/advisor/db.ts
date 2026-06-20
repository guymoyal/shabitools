// lib/advisor/db.ts
import type { Answer, Card, RawProduct } from './types';

// Loose D1 typing so the module compiles in vitest without workers-types.
type D1 = {
  prepare(sql: string): {
    bind(...v: any[]): any;
    run(): Promise<any>; first(): Promise<any>; all(): Promise<any>;
  };
};

export async function getCachedSearch(db: D1, key: string, nowMs: number): Promise<RawProduct[] | null> {
  const row = await db.prepare('SELECT payload, expires_at FROM search_cache WHERE cache_key = ?')
    .bind(key).first();
  if (!row || Number(row.expires_at) <= nowMs) return null;
  return JSON.parse(row.payload);
}

export async function putCachedSearch(db: D1, key: string, products: RawProduct[], expiresAt: number): Promise<void> {
  await db.prepare(
    'INSERT INTO search_cache (cache_key, payload, expires_at) VALUES (?, ?, ?) ' +
    'ON CONFLICT(cache_key) DO UPDATE SET payload = excluded.payload, expires_at = excluded.expires_at')
    .bind(key, JSON.stringify(products), expiresAt).run();
}

export async function getCachedAnswer(db: D1, hash: string): Promise<Answer | null> {
  const row = await db.prepare('SELECT payload FROM answer_cache WHERE answer_hash = ?').bind(hash).first();
  return row ? JSON.parse(row.payload) : null;
}

export async function putCachedAnswer(db: D1, answer: Answer, nowMs: number): Promise<void> {
  await db.prepare(
    'INSERT INTO answer_cache (answer_hash, payload, created_at) VALUES (?, ?, ?) ' +
    'ON CONFLICT(answer_hash) DO UPDATE SET payload = excluded.payload, created_at = excluded.created_at')
    .bind(answer.answerHash, JSON.stringify(answer), nowMs).run();
}

/** Returns true if the request is allowed (under cap) and records the hit. */
export async function checkRateLimit(db: D1, ipHash: string, nowMs: number, windowMs: number, cap: number): Promise<boolean> {
  const windowStart = Math.floor(nowMs / windowMs) * windowMs;
  const row = await db.prepare('SELECT count FROM rate_limit WHERE ip_hash = ? AND window_start = ?')
    .bind(ipHash, windowStart).first();
  const current = row ? Number(row.count) : 0;
  if (current >= cap) return false;
  await db.prepare(
    'INSERT INTO rate_limit (ip_hash, window_start, count) VALUES (?, ?, 1) ' +
    'ON CONFLICT(ip_hash, window_start) DO UPDATE SET count = count + 1')
    .bind(ipHash, windowStart).run();
  return true;
}

export async function logQuestionAndCards(
  db: D1, params: { rawQuestion: string; normalized: string; intent: string;
    ipHash: string; country: string; answer: Answer; },
): Promise<void> {
  const q = await db.prepare(
    'INSERT INTO questions (raw_question, normalized_question, parsed_intent, ip_hash, country, answer_hash) ' +
    'VALUES (?, ?, ?, ?, ?, ?) RETURNING id')
    .bind(params.rawQuestion, params.normalized, params.intent, params.ipHash, params.country, params.answer.answerHash)
    .first();
  const questionId = q?.id;
  for (const group of params.answer.groups) {
    for (const c of group.cards) {
      await db.prepare(
        'INSERT INTO answer_cards (question_id, group_label, asin, title, price, currency, image_url, rating, position, internal_match, affiliate_url) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(questionId, c.groupLabel, c.asin, c.title, c.price, c.currency, c.imageUrl, c.rating, c.position,
          c.internalHref ? c.internalHref.split('/').pop() : null, c.affiliateUrl).run();
    }
  }
}

export async function logClick(db: D1, asin: string): Promise<void> {
  await db.prepare('INSERT INTO clicks (asin) VALUES (?)').bind(asin).run();
}
