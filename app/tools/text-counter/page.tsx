import { Metadata } from 'next';
import TextCounter from '@/components/TextCounter/TextCounter';
import Overview from '@/components/TextCounter/Overview/Overview';

export const metadata: Metadata = {
  title: 'Text Counter - Count Words, Characters, Paragraphs | iziTools',
  description: 'Count words, characters, and paragraphs in your text',
  keywords: 'text counter, word counter, character counter, text statistics',
  alternates: {
    canonical: 'https://izitools.com/tools/text-counter',
  },
};

export default function TextCounterPage() {
  return (
    <>
      <TextCounter />
      <Overview />
    </>
  );
}
