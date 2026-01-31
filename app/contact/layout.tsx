import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Send Feedback | shabitools',
  description: 'Have a question, suggestion, or feedback? Contact shabitools. We\'d love to hear from you! Send us your feedback, bug reports, or tool suggestions.',
  keywords: 'contact shabitools, feedback, bug report, tool suggestions, support, contact form',
  alternates: {
    canonical: 'https://shabitools.com/contact',
  },
  openGraph: {
    title: 'Contact Us - Send Feedback | shabitools',
    description: 'Have a question, suggestion, or feedback? Contact shabitools. We\'d love to hear from you!',
    type: 'website',
    url: 'https://shabitools.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
