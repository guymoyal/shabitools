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
          className="group flex items-center justify-center bg-[#FFDD00] hover:bg-[#FFD700] text-gray-900 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Buy me a coffee"
        >
          <span className="text-xl">☕</span>
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
        className={`inline-flex items-center justify-center bg-[#FFDD00] hover:bg-[#FFD700] text-gray-900 w-10 h-10 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 ${className}`}
        aria-label="Buy me a coffee"
      >
        <span className="text-lg">☕</span>
      </Link>
    );
  }

  // Inline variant (default)
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Link
        href={coffeeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center bg-[#FFDD00] hover:bg-[#FFD700] text-gray-900 w-10 h-10 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
        aria-label="Buy me a coffee"
      >
        <span className="text-lg">☕</span>
      </Link>
    </div>
  );
}
