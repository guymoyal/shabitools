import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-extrabold text-stone-900">Page not found</h1>
      <p className="mt-4 text-stone-600">We couldn&apos;t find what you&apos;re looking for. Explore our resources below.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/reviews"
          className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white shadow hover:bg-amber-700"
        >
          Reviews
        </Link>
        <Link
          href="/guides"
          className="rounded-xl border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-800 hover:border-amber-400"
        >
          Guides
        </Link>
        <Link
          href="/stores"
          className="rounded-xl border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-800 hover:border-amber-400"
        >
          Stores
        </Link>
      </div>
    </div>
  );
}
