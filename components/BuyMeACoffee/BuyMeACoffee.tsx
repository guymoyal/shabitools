'use client';

import Link from 'next/link';

interface BuyMeACoffeeProps {
  username?: string;
  variant?: 'floating' | 'inline' | 'button';
  className?: string;
}

export default function BuyMeACoffee({ 
  username = 'guymo',
  variant = 'inline',
  className = ''
}: BuyMeACoffeeProps) {
  const coffeeUrl = `https://buymeacoffee.com/${username}`;

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Link
          href={coffeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 bg-[#FFDD00] hover:bg-[#FFD700] text-gray-900 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <span className="text-2xl">☕</span>
          <span className="font-semibold text-sm whitespace-nowrap">Buy me a coffee</span>
        </Link>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <Link
        href={coffeeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 bg-[#FFDD00] hover:bg-[#FFD700] text-gray-900 px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 ${className}`}
      >
        <span className="text-xl">☕</span>
        <span>Buy me a coffee</span>
      </Link>
    );
  }

  // Inline variant (default)
  return (
    <div className={`bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">☕</span>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Enjoying this tool?
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              Support shabitools development
            </p>
          </div>
        </div>
        <Link
          href={coffeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#FFDD00] hover:bg-[#FFD700] text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap"
        >
          <span>Buy me a coffee</span>
        </Link>
      </div>
    </div>
  );
}
