import { Metadata } from 'next';
import ColorContrastChecker from '@/components/ColorContrastChecker/ColorContrastChecker';
import Overview from '@/components/ColorContrastChecker/Overview/Overview';
import overviewData from '@/data/tools/color-contrast-checker/overview.json';

export const metadata: Metadata = {
  title: 'Color Contrast Checker - WCAG Accessibility Compliance Tool | iziTools',
  description: overviewData.description,
  keywords: 'color contrast checker, wcag checker, accessibility checker, contrast ratio, color accessibility',
  alternates: {
    canonical: 'https://izitools.com/tools/color-contrast-checker',
  },
};

export default function ColorContrastCheckerPage() {
  return (
    <>
      <ColorContrastChecker />
      <Overview />
    </>
  );
}
