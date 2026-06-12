// Content generator: calls the DeepSeek API (OpenAI-compatible) to author
// content JSON files from a task list. Build-time only; the key lives in
// .env/.env.local and never reaches the client bundle.
//
// Usage: node scripts/generateContent.mjs <tasks-file.json> [--concurrency 4]
// Task shape: { type, slug, outFile, instructions, contextFiles: [paths] }
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

const API_KEY = process.env.DEEPSEEK_API_KEY;
if (!API_KEY) {
  console.error('DEEPSEEK_API_KEY missing in .env/.env.local');
  process.exit(1);
}

const BANNED = [
  /\bwe (tested|tried|used|ran)\b/i,
  /\bin our (shop|workshop|hands)\b/i,
  /hands-on/i,
  /The spec sheet shows/i,
  /\bearns a\b/i,
  /honest limit/i,
  /screws all day/i,
  /in today's market/i,
  /punches above its weight/i,
];

const MIN_WORDS = { compare: 500, guide: 500, project: 700, review: 800 };

const SYSTEM = `You are a senior editor for shabitools.com, a home/DIY tool review site.
You output ONLY a single JSON object matching the exemplar structure exactly (same keys, same nesting, same value types). No markdown fences, no commentary.
Hard rules:
- Analytical reviewer voice. NEVER claim hands-on testing (no "we tested/tried/used/ran", "in our shop/workshop/hands", "hands-on").
- Banned phrases: "The spec sheet shows", "earns a", "honest limit", "screws all day", "in today's market", "punches above its weight".
- Every spec/number must come from the provided source files; do not invent specs.
- FAQ entries are objects {"q": "...", "a": "..."}.
- datePublished and dateModified: "2026-06-12".
- body is markdown (## headings) and must meet the minimum word count given in the task.
- Affiliate placeholders keep url null and campaignId 0; productUrl copied from the source review.`;

function wordCount(s) {
  return String(s || '').split(/\s+/).filter(Boolean).length;
}

function localChecks(task, obj) {
  const errs = [];
  if (obj.slug !== task.slug) errs.push(`slug must be "${task.slug}"`);
  const text = JSON.stringify(obj);
  for (const re of BANNED) {
    const m = text.match(re);
    if (m) errs.push(`banned phrase "${m[0]}" present — reword it`);
  }
  const min = MIN_WORDS[task.type] ?? 500;
  const wc = wordCount(obj.body);
  if (wc < min) errs.push(`body has ${wc} words, needs >= ${min}`);
  if (Array.isArray(obj.faq) && obj.faq.some((f) => !f || !f.q || !f.a))
    errs.push('every faq entry needs non-empty q and a');
  return errs;
}

async function callDeepseek(messages) {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      response_format: { type: 'json_object' },
      max_tokens: 8000,
      temperature: 1.0,
    }),
  });
  if (!res.ok) throw new Error(`DeepSeek ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

async function runTask(task) {
  const context = (task.contextFiles || [])
    .map((f) => `--- FILE ${f} ---\n${fs.readFileSync(f, 'utf8')}`)
    .join('\n\n');
  const min = MIN_WORDS[task.type] ?? 500;
  const userMsg = `${task.instructions}\n\nMinimum body word count: ${min}.\nTarget slug: ${task.slug}\n\nSource and exemplar files:\n\n${context}`;
  const messages = [
    { role: 'system', content: SYSTEM },
    { role: 'user', content: userMsg },
  ];
  for (let attempt = 1; attempt <= 3; attempt++) {
    const raw = await callDeepseek(messages);
    let obj;
    try {
      obj = JSON.parse(raw);
    } catch {
      messages.push({ role: 'assistant', content: raw });
      messages.push({ role: 'user', content: 'That was not valid JSON. Output the corrected full JSON object only.' });
      continue;
    }
    const errs = localChecks(task, obj);
    if (errs.length === 0) {
      fs.mkdirSync(path.dirname(task.outFile), { recursive: true });
      fs.writeFileSync(task.outFile, JSON.stringify(obj, null, 2) + '\n');
      return { slug: task.slug, ok: true, attempt };
    }
    messages.push({ role: 'assistant', content: raw });
    messages.push({
      role: 'user',
      content: `Fix these problems and output the corrected full JSON object only:\n- ${errs.join('\n- ')}`,
    });
  }
  return { slug: task.slug, ok: false };
}

const tasksFile = process.argv[2];
const tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
const ciArg = process.argv.indexOf('--concurrency');
const CONC = ciArg > -1 ? Number(process.argv[ciArg + 1]) : 4;

const pending = tasks.filter((t) => !fs.existsSync(t.outFile));
console.log(`${tasks.length} tasks, ${pending.length} to generate (rest exist)`);

const results = [];
let i = 0;
async function worker() {
  while (i < pending.length) {
    const t = pending[i++];
    try {
      const r = await runTask(t);
      results.push(r);
      console.log(`${r.ok ? 'OK ' : 'FAIL'} ${t.slug} (attempt ${r.attempt ?? '-'})`);
    } catch (e) {
      results.push({ slug: t.slug, ok: false });
      console.log(`ERR  ${t.slug}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
const failed = results.filter((r) => !r.ok);
console.log(`done: ${results.length - failed.length} ok, ${failed.length} failed`);
if (failed.length) process.exit(1);
