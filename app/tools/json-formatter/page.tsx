import { Metadata } from 'next';
import JSONFormatter from '@/components/JSONFormatter/JSONFormatter';
import Overview from '@/components/JSONFormatter/Overview/Overview';
import overviewData from '@/data/tools/json-formatter/overview.json';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator - Format, Validate, Minify JSON | iziTools',
  description: overviewData.description,
  keywords: 'json formatter, json validator, json beautifier, format json, json minifier',
  alternates: {
    canonical: 'https://izitools.com/tools/json-formatter',
  },
};

export default function JSONFormatterPage() {
  return (
    <>
      <JSONFormatter />
      <Overview />
    </>
  );
}
