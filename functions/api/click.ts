// functions/api/click.ts
import { logClick } from '../../lib/advisor/db';
import { asinUrl } from '../../lib/advisor/amazon';

interface Env { DB: any; AMAZON_ASSOCIATES_TAG: string; }

export const onRequestGet: any = async (ctx: any) => {
  const { request, env } = ctx;
  const url = new URL(request.url);
  const asin = (url.searchParams.get('asin') ?? '').toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(asin)) return new Response('bad asin', { status: 400 });
  ctx.waitUntil(logClick(env.DB, asin));
  return Response.redirect(asinUrl(asin, env.AMAZON_ASSOCIATES_TAG), 302);
};
