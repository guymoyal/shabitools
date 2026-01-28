import { Metadata } from 'next';
import RegexTester from '@/components/RegexTester/RegexTester';
import Overview from '@/components/RegexTester/Overview/Overview';
import overviewData from '@/data/tools/regex-tester/overview.json';

export const metadata: Metadata = {
  title: 'Regex Tester - Test Regular Expressions Online | shabitools',
  description: overviewData.description,
  keywords: 'regex tester, regular expression tester, regex online, test regex, regex visualizer',
  alternates: {
    canonical: 'https://shabitools.com/tools/regex-tester',
  },
};

export default function RegexTesterPage() {
  return (
    <>
      <RegexTester />
      <Overview />
    </>
  );
}
