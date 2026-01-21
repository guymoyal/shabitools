import { Metadata } from 'next';
import HTMLEncoder from '@/components/HTMLEncoder/HTMLEncoder';
import Overview from '@/components/HTMLEncoder/Overview/Overview';
import overviewData from '@/data/tools/html-encoder/overview.json';
import toolSchema from '@/schemas/tools/tool-template.json';

const schema = {
  ...toolSchema,
  name: overviewData.title,
  description: overviewData.description,
  url: 'https://izitools.com/tools/html-encoder',
  featureList: overviewData.features.map((f: any) => f.title),
};

export const metadata: Metadata = {
  title: 'HTML Encoder & Decoder - Escape HTML Entities Online | iziTools',
  description: overviewData.description,
  keywords: 'html encoder, html decoder, html escape, html entities, xss prevention',
  alternates: {
    canonical: 'https://izitools.com/tools/html-encoder',
  },
  other: {
    'application/ld+json': JSON.stringify(schema),
  },
};

export default function HTMLEncoderPage() {
  return (
    <>
      <HTMLEncoder />
      <Overview />
    </>
  );
}
