import { SmartCtaButton } from '@/components/monetization/SmartCtaButton';
import FAQSection from '@/components/seo/FAQSection';
import type { StoreLanding as StoreLandingData } from '@/types/landing';

export default function StoreLanding({ landing }: { landing: StoreLandingData }) {
  const goHref = `/go/${landing.slug}`;
  const copy = landing.content;
  const cta = (label: string) => (
    <div>
      <SmartCtaButton
        href={goHref}
        className="inline-block rounded-xl bg-amber-600 px-8 py-3.5 text-lg font-semibold text-white shadow hover:bg-amber-700"
      >
        {label}
      </SmartCtaButton>
      <p className="mt-2 text-xs text-stone-500">
        Sponsored link — we may earn a commission, at no extra cost to you.
      </p>
    </div>
  );
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <header className="text-center">
        {landing.image && (
          // eslint-disable-next-line @next/next/no-img-element -- remote CDN logo, static export
          <img src={landing.image} alt={`${landing.name} logo`} className="mx-auto h-16 w-auto object-contain" loading="lazy" />
        )}
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          {copy?.headline ?? landing.name}
        </h1>
        <p className="mt-3 text-lg text-stone-600">{copy?.subheadline ?? landing.description ?? ''}</p>
        <div className="mt-6">{cta(copy?.ctaLabel ?? `Visit ${landing.name}`)}</div>
      </header>
      {copy && (
        <>
          <p className="mt-10 leading-relaxed text-stone-700">{copy.intro}</p>
          <h2 className="mt-10 text-2xl font-bold text-stone-900">Why shop here</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {copy.benefits.map((b) => (
              <li key={b} className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-700">
                ✓ {b}
              </li>
            ))}
          </ul>
          <h2 className="mt-10 text-2xl font-bold text-stone-900">How it works</h2>
          <ol className="mt-4 space-y-3">
            {copy.howItWorks.map((step, i) => (
              <li key={step} className="flex gap-3 text-stone-700">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <FAQSection faq={copy.faq} />
        </>
      )}
      <div className="mt-12 text-center">{cta(copy?.ctaLabel ?? `Visit ${landing.name}`)}</div>
    </article>
  );
}
