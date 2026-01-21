import { Metadata } from 'next';
import LoremIpsum from '@/components/LoremIpsum/LoremIpsum';
import Overview from '@/components/LoremIpsum/Overview/Overview';
import overviewData from '@/data/tools/lorem-ipsum/overview.json';
import toolSchema from '@/schemas/tools/tool-template.json';

const schema = {
  ...toolSchema,
  name: overviewData.title,
  description: overviewData.description,
  url: 'https://izitools.com/tools/lorem-ipsum',
  featureList: overviewData.features.map((f: any) => f.title),
};

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator - Generate Placeholder Text | iziTools',
  description: overviewData.description,
  keywords: 'lorem ipsum generator, placeholder text, dummy text, lorem ipsum online',
  alternates: {
    canonical: 'https://izitools.com/tools/lorem-ipsum',
  },
  other: {
    'application/ld+json': JSON.stringify(schema),
  },
};

export default function LoremIpsumPage() {
  return (
    <>
      <LoremIpsum />
      <Overview />
    </>
  );
}
