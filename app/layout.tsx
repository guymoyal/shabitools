import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://shabitools.com'),
  title: {
    default: 'shabitools — Home Tools Reviews',
    template: '%s | shabitools',
  },
  description:
    'Honest reviews and buying guides for home and power tools — Bosch, Makita, DeWalt, and more. New site launching soon.',
  authors: [{ name: 'shabitools' }],
  robots: { index: true, follow: true },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  alternates: {
    canonical: 'https://shabitools.com',
  },
  openGraph: {
    title: 'shabitools — Home Tools Reviews',
    description:
      'Honest reviews and buying guides for home and power tools. New site launching soon.',
    type: 'website',
    url: 'https://shabitools.com',
    images: [{ url: '/images/logo.png', width: 200, height: 200, alt: 'shabitools Logo' }],
  },
  other: {
    'google-adsense-account': 'ca-pub-2201239508910470',
    ...(process.env.ADMITAD_VERIFY_CODE
      ? { 'verify-admitad': process.env.ADMITAD_VERIFY_CODE }
      : {}),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://pagead2.googlesyndication.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://googleads.g.doubleclick.net"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-gray-900`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
