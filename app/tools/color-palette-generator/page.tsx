import { Metadata } from 'next';
import ColorPaletteGenerator from '@/components/ColorPaletteGenerator/ColorPaletteGenerator';
import Overview from '@/components/ColorPaletteGenerator/Overview/Overview';
import overviewData from '@/data/tools/color-palette-generator/overview.json';
import toolSchema from '@/schemas/tools/tool-template.json';

const schema = {
  ...toolSchema,
  name: overviewData.title,
  description: overviewData.description,
  url: 'https://izitools.com/tools/color-palette-generator',
  featureList: overviewData.features.map((f: any) => f.title),
};

export const metadata: Metadata = {
  title: 'Color Palette Generator - Generate Color Palettes Online | iziTools',
  description: overviewData.description,
  keywords: 'color palette generator, color scheme, color picker, palette generator',
  alternates: {
    canonical: 'https://izitools.com/tools/color-palette-generator',
  },
  other: {
    'application/ld+json': JSON.stringify(schema),
  },
};

export default function ColorPaletteGeneratorPage() {
  return (
    <>
      <ColorPaletteGenerator />
      <Overview />
    </>
  );
}
