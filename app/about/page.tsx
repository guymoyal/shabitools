import { Metadata } from 'next';
import Link from 'next/link';
import aboutData from '@/data/about.json';

export const metadata: Metadata = {
  title: 'About Us - iziTools',
  description: 'Learn about iziTools - Free web tools for developers and creators',
  alternates: {
    canonical: 'https://izitools.com/about',
  },
};

export default function AboutPage() {
  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            {aboutData.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {aboutData.subtitle}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{aboutData.mission.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {aboutData.mission.content}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {aboutData.mission.commitment}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">What We Offer</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {aboutData.offerings.map((offering: any, index: number) => (
                <div key={index} className={`p-4 rounded-lg ${getColorClasses(offering.color)} border`}>
                  <div className="text-3xl mb-2">{offering.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{offering.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{offering.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Our Values</h2>
            <div className="space-y-4">
              {aboutData.values.map((value: any, index: number) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{value.icon} {value.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{value.content}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{aboutData.technology.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {aboutData.technology.content}
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              {aboutData.technology.stack.map((tech: any, index: number) => (
                <li key={index}><strong>{tech.name}</strong> - {tech.description}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{aboutData.getInvolved.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {aboutData.getInvolved.content}
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              {aboutData.getInvolved.ways.map((way: any, index: number) => (
                <li key={index}>
                  <strong>{way.title}:</strong> {way.description}
                  {way.link && <Link href={way.link} className="text-primary-600 dark:text-primary-400 hover:underline"> Let us know</Link>}
                </li>
              ))}
            </ul>
          </section>

          <section className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{aboutData.cta.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {aboutData.cta.content}
            </p>
            <Link
              href={aboutData.cta.link}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
            >
              {aboutData.cta.buttonText}
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
