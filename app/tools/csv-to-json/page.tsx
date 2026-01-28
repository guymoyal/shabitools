import { Metadata } from 'next';
import CSVToJSON from '@/components/CSVToJSON/CSVToJSON';
import Overview from '@/components/CSVToJSON/Overview/Overview';
import overviewData from '@/data/tools/csv-to-json/overview.json';
import toolSchema from '@/schemas/tools/tool-template.json';

const schema = {
  ...toolSchema,
  name: overviewData.title,
  description: overviewData.description,
  url: 'https://shabitools.com/tools/csv-to-json',
  featureList: overviewData.features.map((f: any) => f.title),
};

export const metadata: Metadata = {
  title: 'CSV to JSON Converter - Convert CSV to JSON Online | shabitools',
  description: overviewData.description,
  keywords: 'csv to json, csv converter, json converter, data conversion',
  alternates: {
    canonical: 'https://shabitools.com/tools/csv-to-json',
  },
  other: {
    'application/ld+json': JSON.stringify(schema),
  },
};

export default function CSVToJSONPage() {
  return (
    <>
      <CSVToJSON />
      <Overview />
    </>
  );
}
