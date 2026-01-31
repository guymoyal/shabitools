import type { Metadata } from 'next';
import VisualDiff from '@/components/VisualDiff/VisualDiff';
import Overview from '@/components/VisualDiff/Overview/Overview';
import overviewData from '@/data/tools/visual-diff/overview.json';

export const metadata: Metadata = {
  title: `${overviewData.title} - Free Visual Website Comparison Tool | shabitools`,
  description: overviewData.description,
  keywords: 'visual page compare, website comparison tool, visual diff, page diff, design comparison, visual testing, QA testing, website tester, visual regression, side by side comparison, overlay comparison',
  alternates: {
    canonical: 'https://shabitools.com/tools/visual-diff',
  },
  openGraph: {
    title: `${overviewData.title} - Free Visual Website Comparison Tool | shabitools`,
    description: overviewData.subtitle,
    type: 'website',
    url: 'https://shabitools.com/tools/visual-diff',
    images: [
      {
        url: '/images/logo.png',
        width: 200,
        height: 200,
        alt: 'shabitools Visual Page Compare Tool',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: `${overviewData.title} - shabitools`,
    description: overviewData.subtitle,
  },
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: overviewData.title,
      description: overviewData.description,
      url: 'https://shabitools.com/tools/visual-diff',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: overviewData.features.map((f: any) => f.title),
    }),
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
