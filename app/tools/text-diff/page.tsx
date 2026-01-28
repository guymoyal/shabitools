import { Metadata } from 'next';
import TextDiff from '@/components/TextDiff/TextDiff';
import Overview from '@/components/TextDiff/Overview/Overview';
import overviewData from '@/data/tools/text-diff/overview.json';
import toolSchema from '@/schemas/tools/tool-template.json';

const schema = {
  ...toolSchema,
  name: overviewData.title,
  description: overviewData.description,
  url: 'https://shabitools.com/tools/text-diff',
  featureList: overviewData.features.map((f: any) => f.title),
};

export const metadata: Metadata = {
  title: 'Text Diff Tool - Compare Text Files Online | shabitools',
  description: overviewData.description,
  keywords: 'text diff, text compare, text difference, text comparison',
  alternates: {
    canonical: 'https://shabitools.com/tools/text-diff',
  },
  other: {
    'application/ld+json': JSON.stringify(schema),
  },
};

export default function TextDiffPage() {
  return (
    <>
      <TextDiff />
      <Overview />
    </>
  );
}
