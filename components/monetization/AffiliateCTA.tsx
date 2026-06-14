import { SmartCtaButton } from './SmartCtaButton';
import { resolveAffiliateUrl } from '@/lib/affiliate';
import type { AffiliateLink } from '@/types/content';

export default function AffiliateCTA({
  links,
  productName,
  title,
}: {
  links: AffiliateLink[];
  productName: string;
  title?: string;
}) {
  const live = links
    .map((l) => ({ ...l, href: resolveAffiliateUrl(l) }))
    .filter((l): l is AffiliateLink & { href: string } => Boolean(l.href));
  if (!live.length) return null;
  return (
    <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-6 text-center">
      <p className="font-semibold text-stone-900">{title ?? `Where to buy the ${productName}`}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {live.map((l) => (
          <SmartCtaButton
            key={l.merchant}
            href={l.href}
            className="inline-block rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-amber-700"
          >
            Check price at {l.merchant}
          </SmartCtaButton>
        ))}
      </div>
      <p className="mt-3 text-xs text-stone-500">
        We may earn a commission if you buy through these links, at no extra cost to you.
      </p>
    </div>
  );
}
