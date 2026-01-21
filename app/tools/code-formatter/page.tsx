import { Metadata } from 'next';
import CodeFormatter from '@/components/CodeFormatter/CodeFormatter';
import Overview from '@/components/CodeFormatter/Overview/Overview';
import overviewData from '@/data/tools/code-formatter/overview.json';

export const metadata: Metadata = {
  title: 'Code Formatter - Format Code in Multiple Languages | iziTools',
  description: overviewData.description,
  keywords: 'code formatter, javascript formatter, python formatter, code beautifier, format code',
  alternates: {
    canonical: 'https://izitools.com/tools/code-formatter',
  },
};

export default function CodeFormatterPage() {
  return (
    <>
      <CodeFormatter />
      <Overview />
    </>
  );
}
