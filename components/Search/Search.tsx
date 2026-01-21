'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import Link from 'next/link';
import { Tool } from '@/types';

interface SearchProps {
  tools: Tool[];
  onSearch?: (results: Tool[]) => void;
  placeholder?: string;
  className?: string;
}

export default function Search({ 
  tools, 
  onSearch, 
  placeholder = 'Search for tools...',
  className = '' 
}: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    return tools.filter((tool) => {
      const matchesTitle = tool.title.toLowerCase().includes(query);
      const matchesDescription = tool.description.toLowerCase().includes(query);
      const matchesCategory = tool.category.toLowerCase().includes(query);
      const matchesTags = tool.tags?.some((tag) => tag.toLowerCase().includes(query));
      
      return matchesTitle || matchesDescription || matchesCategory || matchesTags;
    }).slice(0, 8); // Limit to 8 results
  }, [searchQuery, tools]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsOpen(value.length > 0);
    
    if (onSearch) {
      const query = value.toLowerCase();
      const results = tools.filter((tool) => {
        const matchesTitle = tool.title.toLowerCase().includes(query);
        const matchesDescription = tool.description.toLowerCase().includes(query);
        const matchesCategory = tool.category.toLowerCase().includes(query);
        const matchesTags = tool.tags?.some((tag) => tag.toLowerCase().includes(query));
        
        return matchesTitle || matchesDescription || matchesCategory || matchesTags;
      });
      onSearch(results);
    }
  };

  const handleBlur = () => {
    // Delay to allow link clicks
    setTimeout(() => setIsOpen(false), 200);
  };

  const handleFocus = () => {
    if (searchQuery.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="h-5 w-5 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6"
            />
      </div>

      {isOpen && filteredTools.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5">
          <div className="py-2" role="menu">
            {filteredTools.map((tool, index) => (
              <Link
                key={index}
                href={tool.link}
                className="flex items-start gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                role="menuitem"
              >
                {tool.icon && (
                  <span className="text-2xl flex-shrink-0">{tool.icon}</span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {tool.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                    {tool.description}
                  </p>
                  <span className="inline-block mt-1 text-xs px-2 py-1 rounded bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                    {tool.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {isOpen && searchQuery.length > 0 && filteredTools.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5">
          <div className="px-4 py-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No tools found matching &quot;{searchQuery}&quot;</p>
          </div>
        </div>
      )}
    </div>
  );
}
