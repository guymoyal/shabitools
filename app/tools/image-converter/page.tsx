import { Metadata } from 'next';
import ImageConverter from '@/components/ImageConverter/ImageConverter';
import Overview from '@/components/ImageConverter/Overview/Overview';
import overviewData from '@/data/tools/image-converter/overview.json';
import toolSchema from '@/schemas/tools/tool-template.json';

const schema = {
  ...toolSchema,
  name: overviewData.title,
  description: overviewData.description,
  url: 'https://izitools.com/tools/image-converter',
  featureList: overviewData.features.map((f: any) => f.title),
};

export const metadata: Metadata = {
  title: 'Image Format Converter - Convert Images Online | iziTools',
  description: overviewData.description,
  keywords: 'image converter, image format converter, png to jpeg, jpeg to webp, image conversion',
  alternates: {
    canonical: 'https://izitools.com/tools/image-converter',
  },
  other: {
    'application/ld+json': JSON.stringify(schema),
  },
};

export default function ImageConverterPage() {
  return (
    <>
      <ImageConverter />
      <Overview />
    </>
  );
}
