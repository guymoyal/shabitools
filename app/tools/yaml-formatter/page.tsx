import { Metadata } from 'next';
import YAMLFormatter from '@/components/YAMLFormatter/YAMLFormatter';
import Overview from '@/components/YAMLFormatter/Overview/Overview';
import overviewData from '@/data/tools/yaml-formatter/overview.json';
import toolSchema from '@/schemas/tools/tool-template.json';

const schema = {
  ...toolSchema,
  name: overviewData.title,
  description: overviewData.description,
  url: 'https://izitools.com/tools/yaml-formatter',
  featureList: overviewData.features.map((f: any) => f.title),
};

export const metadata: Metadata = {
  title: 'YAML Formatter & Validator - Format YAML Online | iziTools',
  description: overviewData.description,
  keywords: 'yaml formatter, yaml validator, yaml to json, yaml editor',
  alternates: {
    canonical: 'https://izitools.com/tools/yaml-formatter',
  },
  other: {
    'application/ld+json': JSON.stringify(schema),
  },
};

export default function YAMLFormatterPage() {
  return (
    <>
      <YAMLFormatter />
      <Overview />
    </>
  );
}
