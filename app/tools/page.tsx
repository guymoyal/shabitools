'use client';

import { useState } from 'react';
import Link from 'next/link';
import toolsData from '@/data/tools.json';
import { Tool } from '@/types';

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState<string | null>(null);

  // Group tools by category
  const toolsByCategory = toolsData.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  const categories = Object.keys(toolsByCategory);
  const featuredTools = toolsData.filter((tool) => tool.featured);

  const getCategoryColor = (category: string) => {
    if (category === 'Developer Tools') return 'bg-blue-500';
    if (category === 'Design Tools') return 'bg-purple-500';
    if (category === 'General Tools') return 'bg-green-500';
    return 'bg-gray-500';
  };

  const getCategoryBgColor = (category: string) => {
    if (category === 'Developer Tools') return 'bg-blue-50 dark:bg-blue-900/20';
    if (category === 'Design Tools') return 'bg-purple-50 dark:bg-purple-900/20';
    if (category === 'General Tools') return 'bg-green-50 dark:bg-green-900/20';
    return 'bg-gray-50 dark:bg-gray-800';
  };

  const getCategoryBorderColor = (category: string) => {
    if (category === 'Developer Tools') return 'border-blue-200 dark:border-blue-800';
    if (category === 'Design Tools') return 'border-purple-200 dark:border-purple-800';
    if (category === 'General Tools') return 'border-green-200 dark:border-green-800';
    return 'border-gray-200 dark:border-gray-700';
  };

  const filteredCategories = selectedCategory 
    ? [selectedCategory] 
    : categories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-4 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            All Tools
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse our complete collection of free web tools organized by category. Find exactly what you need, faster.
          </p>
        </div>

        {/* Category Filter - Desktop */}
        <div className="hidden md:flex justify-center gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === null
                ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === category
                  ? `${getCategoryColor(category)} text-white shadow-lg scale-105`
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Category Filter - Mobile */}
        <div className="md:hidden mb-8 space-y-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
              selectedCategory === null
                ? 'bg-primary-600 dark:bg-primary-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <div key={category}>
              <button
                onClick={() => setMobileCategoryOpen(mobileCategoryOpen === category ? null : category)}
                className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-between ${
                  selectedCategory === category
                    ? `${getCategoryColor(category)} text-white`
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <span>{category}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${mobileCategoryOpen === category ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileCategoryOpen === category && (
                <div className="mt-2 space-y-2 pl-4">
                  {toolsByCategory[category].map((tool, index) => (
                    <Link
                      key={index}
                      href={tool.link}
                      className="block px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{tool.icon}</span>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{tool.title}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{tool.description.substring(0, 60)}...</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Featured Tools */}
        {!selectedCategory && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Featured Tools</h2>
              <div className="h-1 flex-1 bg-gradient-to-r from-purple-600 to-transparent rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTools.map((tool, index) => (
                <Link
                  key={index}
                  href={tool.link}
                  className="group relative rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary-600 dark:hover:ring-primary-500 transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform">{tool.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{tool.description}</p>
                      <span className={`inline-block mt-3 text-xs px-3 py-1 rounded-full ${getCategoryBgColor(tool.category)} ${getCategoryBorderColor(tool.category)} border text-gray-700 dark:text-gray-300`}>
                        {tool.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tools by Category */}
        {filteredCategories.map((category) => (
          <div key={category} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className={`h-1 w-12 ${getCategoryColor(category)} rounded-full`}></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{category}</h2>
              <div className={`h-1 flex-1 ${getCategoryColor(category)}/30 rounded-full`}></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {toolsByCategory[category].length} {toolsByCategory[category].length === 1 ? 'tool' : 'tools'}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {toolsByCategory[category].map((tool, index) => (
                <Link
                  key={index}
                  href={tool.link}
                  className="group relative rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary-600 dark:hover:ring-primary-500 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform">{tool.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{tool.description}</p>
                      {tool.tags && tool.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {tool.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
