import { Metadata } from 'next';
import APITester from '@/components/APITester/APITester';
import Overview from '@/components/APITester/Overview/Overview';
import overviewData from '@/data/tools/api-tester/overview.json';

export const metadata: Metadata = {
  title: 'API Tester - REST API Testing Tool Online | iziTools',
  description: overviewData.description,
  keywords: 'api tester, rest client, http client, api testing, postman alternative, rest api tester',
  alternates: {
    canonical: 'https://izitools.com/tools/api-tester',
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
