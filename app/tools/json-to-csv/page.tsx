import { Metadata } from 'next';
import JSONToCSV from '@/components/JSONToCSV/JSONToCSV';
import Overview from '@/components/JSONToCSV/Overview/Overview';
import overviewData from '@/data/tools/json-to-csv/overview.json';
import toolSchema from '@/schemas/tools/tool-template.json';

const schema = {
  ...toolSchema,
  name: overviewData.title,
  description: overviewData.description,
  url: 'https://shabitools.com/tools/json-to-csv',
  featureList: overviewData.features.map((f: any) => f.title),
};

export const metadata: Metadata = {
  title: 'JSON to CSV Converter - Convert JSON to CSV Online | shabitools',
  description: overviewData.description,
  keywords: 'json to csv, json converter, csv converter, data conversion',
  alternates: {
    canonical: 'https://shabitools.com/tools/json-to-csv',
  },
  other: {
    'application/ld+json': JSON.stringify(schema),
  },
};

export default function JSONToCSVPage() {
  return (
    <>
      <JSONToCSV />
      <Overview />
    </>
  );
}
