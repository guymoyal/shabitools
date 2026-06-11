import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav
        className="mx-auto flex max-w-5xl items-center px-4 py-4 sm:px-6"
        aria-label="Main navigation"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/images/logo.png"
            alt="shabitools"
            className="h-10 w-auto transition-transform group-hover:scale-105"
          />
          <span className="text-xl font-bold text-gray-900">shabitools</span>
        </Link>
      </nav>
    </header>
  );
}
