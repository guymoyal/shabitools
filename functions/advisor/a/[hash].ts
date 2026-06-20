// functions/advisor/a/[hash].ts
import { getCachedAnswer } from '../../../lib/advisor/db';
import type { Answer } from '../../../lib/advisor/types';

interface Env { DB: any; }

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}

function renderHtml(answer: Answer): string {
  const cards = answer.groups.flatMap((g) => g.cards);
  const cardHtml = cards.map((c) => `
    <article style="border:1px solid #e7e5e4;border-radius:12px;padding:16px;max-width:320px">
      ${c.imageUrl ? `<img src="${esc(c.imageUrl)}" alt="${esc(c.title)}" style="height:160px;object-fit:contain;width:100%"/>` : ''}
      <h3 style="font-size:14px">${esc(c.title)}</h3>
      ${c.price ? `<p style="color:#ea580c;font-weight:700">${esc(c.price)}</p>` : ''}
      <p style="font-size:14px;color:#57534e">${esc(c.why)}</p>
      <a href="/api/click?asin=${esc(c.asin)}" rel="sponsored nofollow" style="color:#ea580c;font-weight:600">View on Amazon →</a>
    </article>`).join('');
  const title = `${esc(answer.question)} — shabitools Advisor`;
  return `<!doctype html><html lang="en"><head>
    <meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>${title}</title>
    <meta name="description" content="${esc(answer.intro).slice(0, 160)}"/>
    <link rel="canonical" href="https://shabitools.com/advisor/a/${esc(answer.answerHash)}"/>
    </head><body style="font-family:system-ui;max-width:1024px;margin:0 auto;padding:24px">
    <h1>${esc(answer.question)}</h1>
    <p>${esc(answer.intro)}</p>
    <div style="display:flex;flex-wrap:wrap;gap:16px">${cardHtml}</div>
    <p style="font-size:12px;color:#a8a29e;margin-top:24px">As an Amazon Associate we earn from qualifying purchases.</p>
    </body></html>`;
}

export const onRequestGet: any = async (ctx: any) => {
  const hash = ctx.params.hash as string;
  const answer = await getCachedAnswer(ctx.env.DB, hash);
  if (!answer) return new Response('Not found', { status: 404 });
  return new Response(renderHtml(answer), { headers: { 'content-type': 'text/html; charset=utf-8' } });
};
