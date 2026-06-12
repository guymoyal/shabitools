import Link from 'next/link';
import Image from 'next/image';

const NAV = [
  { name: 'Reviews', href: '/reviews' },
  { name: 'Compare', href: '/compare' },
  { name: 'Guides', href: '/guides' },
  { name: 'Projects', href: '/projects' },
  { name: 'Brands', href: '/brands' },
  { name: 'Stores', href: '/stores' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="shabitools" width={36} height={36} priority />
          <span className="text-lg font-extrabold tracking-tight text-stone-900">
            shabi<span className="text-amber-600">tools</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-stone-600 hover:text-amber-700"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700">
            Menu
          </summary>
          <nav
            className="absolute right-0 mt-2 w-44 rounded-xl border border-stone-200 bg-white p-2 shadow-lg"
            aria-label="Mobile"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-amber-50"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
