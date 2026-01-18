import type { Metadata } from 'next';
import VisualDiff from '@/components/VisualDiff/VisualDiff';

export const metadata: Metadata = {
  title: 'Visual Page Compare - iziTools',
  description: 'Visually compare two versions of a website with side-by-side matching, overlay, blend, and onion modes. Perfect for testing design changes and spotting differences.',
  keywords: 'website comparison, visual diff, page compare, design comparison, visual testing',
  openGraph: {
    title: 'Visual Page Compare - iziTools',
    description: 'Visually compare two versions of a website with side-by-side matching, overlay, blend, and onion modes.',
    type: 'website',
  },
};

export default function VisualDiffPage() {
  return <VisualDiff />;
}
