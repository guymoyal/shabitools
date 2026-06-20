import Link from 'next/link';

const SIGNALS = [
  {
    title: 'Independent reviews',
    text: 'We are not owned by any tool brand or retailer. Commissions never change our verdicts.',
    href: '/about',
    link: 'Our methodology',
  },
  {
    title: 'Specs you can verify',
    text: 'Every review cross-checks manufacturer data and owner feedback — we label what we have not bench-tested.',
    href: '/editorial-policy',
    link: 'Editorial policy',
  },
  {
    title: 'Corrections welcome',
    text: 'Models change and prices move. Email us a correction and we date-stamp the fix on the page.',
    href: '/contact',
    link: 'Contact us',
  },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-stone-200 bg-stone-50" aria-labelledby="trust-heading">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 id="trust-heading" className="text-center text-2xl font-bold text-stone-900">
          How we review tools
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-stone-600">
          shabitools exists to help you buy the right tool once — with honest analysis, not hype.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {SIGNALS.map((s) => (
            <div key={s.title} className="rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="font-bold text-stone-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{s.text}</p>
              <Link href={s.href} className="mt-3 inline-block text-sm font-semibold text-amber-700 hover:text-amber-800">
                {s.link} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
