import Link from 'next/link';
import { getStoreLandings } from '@/lib/content';

export default function WhereToBuyStrip({ max = 4 }: { max?: number }) {
  const stores = getStoreLandings().slice(0, max);
  if (!stores.length) return null;
  return (
    <aside className="mt-10 rounded-2xl border border-stone-200 bg-white p-5">
      <p className="text-sm font-semibold text-stone-900">Tool stores we link to</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {stores.map((s) => (
          <li key={s.slug}>
            <a
              href={`/go/${s.slug}`}
              rel="sponsored nofollow noopener"
              target="_blank"
              className="inline-block rounded-full border border-stone-300 px-4 py-1.5 text-sm font-medium text-stone-700 hover:border-amber-400 hover:text-amber-700"
            >
              {s.name}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-stone-500">
        Sponsored links — see our <Link href="/affiliate-disclosure" className="underline">affiliate disclosure</Link>.{' '}
        <Link href="/stores" className="underline">All stores</Link>
      </p>
    </aside>
  );
}
