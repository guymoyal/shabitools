import { Metadata } from 'next';
import CSSMinifier from '@/components/CSSMinifier/CSSMinifier';
import Overview from '@/components/CSSMinifier/Overview/Overview';
import overviewData from '@/data/tools/css-minifier/overview.json';

export const metadata: Metadata = {
  title: 'CSS Minifier - Minify and Optimize CSS Online | iziTools',
  description: overviewData.description,
  keywords: 'css minifier, css compressor, minify css, css optimizer, compress css',
  alternates: {
    canonical: 'https://izitools.com/tools/css-minifier',
  },
};

export default function CSSMinifierPage() {
  return (
    <>
      <CSSMinifier />
      <Overview />
    </>
  );
}
