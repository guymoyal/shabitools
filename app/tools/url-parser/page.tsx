import { Metadata } from 'next';
import URLParser from '@/components/URLParser/URLParser';
import Overview from '@/components/URLParser/Overview/Overview';
import overviewData from '@/data/tools/url-parser/overview.json';
import toolSchema from '@/schemas/tools/tool-template.json';

const schema = {
  ...toolSchema,
  name: overviewData.title,
  description: overviewData.description,
  url: 'https://izitools.com/tools/url-parser',
  featureList: overviewData.features.map((f: any) => f.title),
};

export const metadata: Metadata = {
  title: 'URL Parser & Analyzer - Parse URLs Online | iziTools',
  description: overviewData.description,
  keywords: 'url parser, url analyzer, url components, seo url',
  alternates: {
    canonical: 'https://izitools.com/tools/url-parser',
  },
  other: {
    'application/ld+json': JSON.stringify(schema),
  },
};

export default function URLParserPage() {
  return (
    <>
      <URLParser />
      <Overview />
    </>
  );
}
