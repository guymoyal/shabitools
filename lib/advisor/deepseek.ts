// lib/advisor/deepseek.ts
import type { Plan, RawProduct } from './types';

export interface DeepSeekOpts { apiKey: string; fetchImpl?: typeof fetch; }
const ENDPOINT = 'https://api.deepseek.com/chat/completions';

async function chatJson(messages: { role: string; content: string }[], opts: DeepSeekOpts): Promise<any> {
  const f = opts.fetchImpl ?? fetch;
  const res = await f(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${opts.apiKey}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) throw new Error(`deepseek ${ (res as any).status ?? '' }`);
  const data = await res.json() as any;
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('deepseek: empty content');
  return JSON.parse(content); // throws on malformed JSON
}

const PLAN_SYSTEM = `You turn a shopper's question into Amazon product searches.
Return ONLY JSON: {"intent": string, "groups": [{"label": string, "keywords": string,
"priceMin"?: number, "priceMax"?: number, "categoryGuess"?: string, "whyNeeded"?: string}]}.
For a single-product question return ONE group. For a project ("what tools to build X")
return one group per distinct tool/material needed. keywords are concise Amazon search terms.
Infer price bounds from phrases like "around $300" (e.g. priceMax 330). Max 6 groups.`;

export async function planQuestion(question: string, opts: DeepSeekOpts): Promise<Plan> {
  const json = await chatJson([
    { role: 'system', content: PLAN_SYSTEM },
    { role: 'user', content: question },
  ], opts);
  if (!json || !Array.isArray(json.groups)) throw new Error('deepseek: bad plan shape');
  return { intent: String(json.intent ?? ''), groups: json.groups };
}

const WRITE_SYSTEM = `You are a tool-buying expert. Given the shopper's question and a list of
REAL Amazon products (with asin, title, price, rating, features), choose the best 3 to 9 and
write a tight answer. Use ONLY the provided asins — never invent products.
Return ONLY JSON: {"intro": string, "picks": [{"asin": string, "why": string}]}.
"intro" is 1-2 sentences. "why" is one sentence on why it fits THIS shopper.`;

export interface WriteResult { intro: string; picks: { asin: string; why: string }[]; }

export async function writeAnswer(question: string, products: RawProduct[], opts: DeepSeekOpts): Promise<WriteResult> {
  const slim = products.map((p) => ({ asin: p.asin, title: p.title, price: p.price,
    rating: p.rating, features: p.features.slice(0, 5) }));
  const json = await chatJson([
    { role: 'system', content: WRITE_SYSTEM },
    { role: 'user', content: JSON.stringify({ question, products: slim }) },
  ], opts);
  if (!json || !Array.isArray(json.picks)) throw new Error('deepseek: bad write shape');
  return { intro: String(json.intro ?? ''), picks: json.picks };
}
