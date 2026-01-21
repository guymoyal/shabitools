import { Metadata } from 'next';
import Link from 'next/link';
import blogData from '@/data/blog.json';

export const metadata: Metadata = {
  title: 'Blog - iziTools',
  description: 'Latest news, updates, and tips from iziTools',
  alternates: {
    canonical: 'https://izitools.com/blog',
  },
};

export default function BlogPage() {
  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            {blogData.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {blogData.subtitle}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{blogData.comingSoon.icon}</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {blogData.comingSoon.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 max-w-md mx-auto">
              {blogData.comingSoon.content}
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {blogData.comingSoon.cta.text}
              </p>
              <Link
                href={blogData.comingSoon.cta.link}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
              >
                {blogData.comingSoon.cta.buttonText}
              </Link>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {blogData.expectations.title}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {blogData.expectations.categories.map((category: any, index: number) => (
                <div key={index} className={`p-4 rounded-lg ${getColorClasses(category.color)} border`}>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{category.icon} {category.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
