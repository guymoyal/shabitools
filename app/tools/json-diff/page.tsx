import { Metadata } from 'next';
import JSONDiff from '@/components/JSONDiff/JSONDiff';
import Overview from '@/components/JSONDiff/Overview/Overview';
import overviewData from '@/data/tools/json-diff/overview.json';
import toolSchema from '@/schemas/tools/tool-template.json';

const schema = {
  ...toolSchema,
  name: overviewData.title,
  description: overviewData.description,
  url: 'https://shabitools.com/tools/json-diff',
  featureList: overviewData.features.map((f: any) => f.title),
};

export const metadata: Metadata = {
  title: 'JSON Diff Tool - Compare JSON Objects Online | shabitools',
  description: overviewData.description,
  keywords: 'json diff, json compare, json difference, json comparison',
  alternates: {
    canonical: 'https://shabitools.com/tools/json-diff',
  },
  other: {
    'application/ld+json': JSON.stringify(schema),
  },
};

export default function JSONDiffPage() {
  return (
    <>
      <JSONDiff />
      <Overview />
    </>
  );
}
