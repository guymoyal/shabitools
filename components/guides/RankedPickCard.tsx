import Link from 'next/link';
import SiteImage from '@/components/ui/SiteImage';
import { getImage } from '@/lib/images';
import { SmartCtaButton } from '@/components/monetization/SmartCtaButton';
import { resolveAffiliateUrl } from '@/lib/affiliate';
import type { GuidePick } from '@/types/guide';

export default function RankedPickCard({ pick }: { pick: GuidePick }) {
  const thumb = pick.reviewSlug ? getImage(`reviews/${pick.reviewSlug}`) : null;
  const affiliateHref = pick.affiliate ? resolveAffiliateUrl(pick.affiliate) : null;
  return (
    <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start gap-4 sm:flex-nowrap">
        {thumb && (
          <div className="w-28 shrink-0 aspect-[3/2] overflow-hidden rounded-lg bg-stone-100">
            <SiteImage
              image={thumb}
              sizes="112px"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 font-bold text-white">
              {pick.rank}
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
              {pick.awardLabel}
            </span>
          </div>
          <h3 className="mt-3 text-xl font-bold text-stone-900">{pick.name}</h3>
        </div>
      </div>
      <p className="mt-2 leading-relaxed text-stone-700">{pick.summary}</p>
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <ul className="space-y-1">
          {pick.pros.map((p) => (
            <li key={p} className="text-green-800">✓ {p}</li>
          ))}
        </ul>
        <ul className="space-y-1">
          {pick.cons.map((c) => (
            <li key={c} className="text-red-800">✗ {c}</li>
          ))}
        </ul>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        {affiliateHref && (
          <SmartCtaButton
            href={affiliateHref}
            className="inline-block rounded-xl bg-amber-600 px-5 py-2.5 font-semibold text-white hover:bg-amber-700"
          >
            Check price at {pick.affiliate!.merchant}
          </SmartCtaButton>
        )}
        {pick.reviewSlug && (
          <Link href={`/reviews/${pick.reviewSlug}`} className="font-medium text-amber-700 underline">
            Read our full review →
          </Link>
        )}
      </div>
      {affiliateHref && (
        <p className="mt-2 text-xs text-stone-500">We may earn a commission from this link.</p>
      )}
    </section>
  );
}
