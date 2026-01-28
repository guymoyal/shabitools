import { Metadata } from 'next';
import Link from 'next/link';
import privacyData from '@/data/privacy.json';

export const metadata: Metadata = {
  title: 'Privacy Policy - shabitools',
  description: 'Privacy Policy for shabitools - Learn how we protect your data and privacy',
  alternates: {
    canonical: 'https://shabitools.com/privacy',
  },
};

export default function PrivacyPolicyPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            {privacyData.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last updated: {formatDate(privacyData.lastUpdated)}
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            {privacyData.sections.map((section: any, index: number) => (
              <section key={index} className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{section.title}</h2>
                {section.content && (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{section.content}</p>
                )}
                {section.subsections && section.subsections.map((subsection: any, subIndex: number) => (
                  <div key={subIndex} className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{subsection.title}</h3>
                    {subsection.content && (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{subsection.content}</p>
                    )}
                    {subsection.points && (
                      <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                        {subsection.points.map((point: string, pointIndex: number) => (
                          <li key={pointIndex}>{point}</li>
                        ))}
                      </ul>
                    )}
                    {subsection.note && (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{subsection.note}</p>
                    )}
                  </div>
                ))}
                {section.points && (
                  <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                    {section.points.map((point: string, pointIndex: number) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                )}
                {section.services && (
                  <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                    {section.services.map((service: any, serviceIndex: number) => (
                      <li key={serviceIndex}>
                        <strong>{service.name}:</strong> {service.description}
                      </li>
                    ))}
                  </ul>
                )}
                {section.cookieTypes && (
                  <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                    {section.cookieTypes.map((cookie: any, cookieIndex: number) => (
                      <li key={cookieIndex}>
                        <strong>{cookie.name}:</strong> {cookie.description}
                      </li>
                    ))}
                  </ul>
                )}
                {section.rights && (
                  <>
                    <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                      {section.rights.map((right: string, rightIndex: number) => (
                        <li key={rightIndex}>{right}</li>
                      ))}
                    </ul>
                    {section.note && (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{section.note}</p>
                    )}
                  </>
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
