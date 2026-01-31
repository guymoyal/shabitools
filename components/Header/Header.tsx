'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HeaderData, Tool } from '@/types';
import Search from '@/components/Search';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';

interface HeaderProps {
  data: HeaderData;
  tools?: Tool[];
}

export default function Header({ data, tools = [] }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-4 lg:px-8" aria-label="Global">
        <div className="flex items-center gap-x-4 lg:gap-x-12">
          <Link href={data.logo.href} className="flex items-center gap-2 group">
            <img 
              src="/images/logo.png" 
              alt="shabitools Logo" 
              className="h-10 w-auto transition-transform group-hover:scale-110"
            />
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              {data.logo.text}
            </span>
          </Link>
          <div className="hidden lg:flex lg:gap-x-8">
            {data.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center flex-1 max-w-xs">
          {tools.length > 0 && (
            <Search 
              tools={tools} 
              placeholder="Search tools..."
              className="hidden md:block w-full"
            />
          )}
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-4 py-4 space-y-4">
            {tools.length > 0 && (
              <div className="md:hidden">
                <Search 
                  tools={tools} 
                  placeholder="Search tools..."
                  className="w-full"
                />
              </div>
            )}
            <div className="space-y-2">
              {data.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
