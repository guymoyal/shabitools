import { Metadata } from 'next';
import TimestampConverter from '@/components/TimestampConverter/TimestampConverter';
import Overview from '@/components/TimestampConverter/Overview/Overview';
import overviewData from '@/data/tools/timestamp-converter/overview.json';
import toolSchema from '@/schemas/tools/tool-template.json';

const schema = {
  ...toolSchema,
  name: overviewData.title,
  description: overviewData.description,
  url: 'https://izitools.com/tools/timestamp-converter',
  featureList: overviewData.features.map((f: any) => f.title),
};

export const metadata: Metadata = {
  title: 'Timestamp Converter - Convert Unix Timestamp to Date | iziTools',
  description: overviewData.description,
  keywords: 'timestamp converter, unix timestamp, epoch converter, timestamp to date',
  alternates: {
    canonical: 'https://izitools.com/tools/timestamp-converter',
  },
  other: {
    'application/ld+json': JSON.stringify(schema),
  },
};

export default function TimestampConverterPage() {
  return (
    <>
      <TimestampConverter />
      <Overview />
    </>
  );
}
