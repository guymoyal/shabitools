import type { FaqItem } from '@/types/content';

export default function FAQSection({ faq }: { faq: FaqItem[] }) {
  if (!faq.length) return null;
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-stone-900">Frequently asked questions</h2>
      <dl className="mt-6 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
        {faq.map((f) => (
          <div key={f.q} className="p-5">
            <dt className="font-semibold text-stone-900">{f.q}</dt>
            <dd className="mt-2 leading-relaxed text-stone-600">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
