import type { Metadata } from 'next';
import VisualDiff from '@/components/VisualDiff/VisualDiff';
import Overview from '@/components/VisualDiff/Overview/Overview';
import overviewData from '@/data/tools/visual-diff/overview.json';

export const metadata: Metadata = {
  title: `${overviewData.title} - iziTools`,
  description: overviewData.description,
  keywords: 'website comparison, visual diff, page compare, design comparison, visual testing, QA testing',
  alternates: {
    canonical: 'https://izitools.com/tools/visual-diff',
  },
  openGraph: {
    title: `${overviewData.title} - iziTools`,
    description: overviewData.subtitle,
    type: 'website',
  },
};

export default function VisualDiffPage() {
  return (
    <>
      <VisualDiff />
      <Overview />
    </>
  );
}
