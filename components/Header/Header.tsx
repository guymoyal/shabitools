import Link from 'next/link';
import { HeaderData, Tool } from '@/types';
import Search from '@/components/Search';

interface HeaderProps {
  data: HeaderData;
  tools?: Tool[];
}

export default function Header({ data, tools = [] }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-4 lg:px-8" aria-label="Global">
        <div className="flex items-center gap-x-4 lg:gap-x-12">
          <Link href={data.logo.href} className="text-2xl font-bold text-primary-600 hover:text-primary-700">
            {data.logo.text}
          </Link>
          <div className="hidden lg:flex lg:gap-x-8">
            {data.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center flex-1 max-w-md">
          {tools.length > 0 && (
            <Search 
              tools={tools} 
              placeholder="Search tools..."
              className="hidden md:block w-full"
            />
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700"
              aria-label="Open main menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex">
            <Link
              href={data.cta.href}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors whitespace-nowrap"
            >
              {data.cta.label}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
