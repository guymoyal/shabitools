import { Metadata } from 'next';
import APITester from '@/components/APITester/APITester';
import Overview from '@/components/APITester/Overview/Overview';
import overviewData from '@/data/tools/api-tester/overview.json';

export const metadata: Metadata = {
  title: `${overviewData.title} - REST API Testing Tool Online | shabitools`,
  description: `${overviewData.description} ${overviewData.technicalVerdict || ''}`.trim(),
  keywords: [
    ...overviewData.features.map((f: { title: string }) => f.title.toLowerCase()),
    ...overviewData.useCases.map((uc: string) => uc.toLowerCase()),
    'api tester',
    'rest api',
    'http client',
    'api testing',
    'postman alternative'
  ].join(', '),
  alternates: {
    canonical: 'https://shabitools.com/tools/api-tester',
  },
};

export default function APITesterPage() {
  return (
    <>
      <APITester />
      <Overview />
    </>
  );
}
