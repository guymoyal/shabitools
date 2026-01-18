import type { Metadata } from 'next';
import Link from 'next/link';
import toolsData from '@/data/tools.json';
import { Tool } from '@/types';

export const metadata: Metadata = {
  title: 'All Tools - iziTools',
  description: 'Browse all available web tools for developers, designers, and general users. Free, easy-to-use utilities to streamline your workflow.',
  keywords: 'web tools, developer tools, design tools, free tools, online utilities',
  openGraph: {
    title: 'All Tools - iziTools',
    description: 'Browse all available web tools for developers, designers, and general users.',
    type: 'website',
  },
};

export default function ToolsPage() {
  // Group tools by category
  const toolsByCategory = toolsData.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  const categories = Object.keys(toolsByCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-4 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            All Tools
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our complete collection of free web tools for developers, designers, and general users.
          </p>
        </div>

        {/* Featured Tools */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Tools</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {toolsData
              .filter((tool) => tool.featured)
              .map((tool, index) => (
                <Link
                  key={index}
                  href={tool.link}
                  className="group relative rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200 hover:ring-primary-600 transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{tool.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">{tool.description}</p>
                      <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-primary-50 text-primary-700">
                        {tool.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Tools by Category */}
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {toolsByCategory[category].map((tool, index) => (
                <Link
                  key={index}
                  href={tool.link}
                  className="group relative rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200 hover:ring-primary-600 transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{tool.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">{tool.description}</p>
                      {tool.tags && tool.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {tool.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600"
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
