import { Metadata } from 'next';
import Link from 'next/link';
import contactData from '@/data/contact.json';

export const metadata: Metadata = {
  title: 'Contact Us - iziTools',
  description: 'Get in touch with iziTools - We\'d love to hear from you',
  alternates: {
    canonical: 'https://izitools.com/contact',
  },
};

export default function ContactPage() {
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
            {contactData.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {contactData.subtitle}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Get in Touch</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {contactData.description}
              </p>

              <div className="space-y-4">
                {contactData.contacts.map((contact: any, index: number) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{contact.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      <a href={`mailto:${contact.email}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                        {contact.email}
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">What Can We Help With?</h2>
              <div className="space-y-4">
                {contactData.helpCategories.map((category: any, index: number) => (
                  <div key={index} className={`p-4 rounded-lg ${getColorClasses(category.color)} border`}>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{category.icon} {category.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{category.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{contactData.responseTime.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {contactData.responseTime.content}
            </p>
          </div>

          <div className="mt-8 p-6 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{contactData.faq.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {contactData.faq.content}
            </p>
            <Link
              href={contactData.faq.link}
              className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              {contactData.faq.linkText} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
