import { Metadata } from 'next';
import Link from 'next/link';
import termsData from '@/data/terms.json';

export const metadata: Metadata = {
  title: 'Terms of Service - iziTools',
  description: 'Terms of Service for iziTools - Read our terms and conditions',
  alternates: {
    canonical: 'https://izitools.com/terms',
  },
};

export default function TermsOfServicePage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            {termsData.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last updated: {formatDate(termsData.lastUpdated)}
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            {termsData.sections.map((section: any, index: number) => (
              <section key={index} className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{section.title}</h2>
                {section.content && (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{section.content}</p>
                )}
                {section.restrictions && (
                  <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                    {section.restrictions.map((restriction: string, idx: number) => (
                      <li key={idx}>{restriction}</li>
                    ))}
                  </ul>
                )}
                {section.rights && (
                  <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                    {section.rights.map((right: string, idx: number) => (
                      <li key={idx}>{right}</li>
                    ))}
                  </ul>
                )}
                {section.prohibited && (
                  <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                    {section.prohibited.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.note && (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{section.note}</p>
                )}
                {section.additional && (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{section.additional}</p>
                )}
                {section.contact && (
                  <ul className="list-none mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                    <li>Email: {section.contact.email}</li>
                    <li>Website: <Link href={section.contact.contactPage} className="text-primary-600 dark:text-primary-400 hover:underline">Contact Page</Link></li>
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
