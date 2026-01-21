import { Metadata } from 'next';
import PageSpeedCompare from '@/components/PageSpeedCompare/PageSpeedCompare';
import Overview from '@/components/PageSpeedCompare/Overview/Overview';
import overviewData from '@/data/tools/page-speed-compare/overview.json';

export const metadata: Metadata = {
  title: 'Page Speed Compare - Test & Compare Website Performance | iziTools',
  description: overviewData.description,
  keywords: 'page speed test, lighthouse compare, website performance, core web vitals, performance comparison',
  alternates: {
    canonical: 'https://izitools.com/tools/page-speed-compare',
  },
};

export default function PageSpeedComparePage() {
  return (
    <>
      <PageSpeedCompare />
      <Overview />
    </>
  );
}
