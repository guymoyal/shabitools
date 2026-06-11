import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-900">Page not found</h2>
      <p className="mt-2 text-gray-600">This page doesn&apos;t exist or has been removed.</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
