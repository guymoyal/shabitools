import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const inter = Inter({ subsets: ['latin'] });

const GA_MEASUREMENT_ID = 'G-6LSJNET09C';

export const metadata: Metadata = {
  metadataBase: new URL('https://shabitools.com'),
  title: {
    default: 'shabitools — Home Tools Reviews',
    template: '%s | shabitools',
  },
  description:
    'Independent reviews, comparisons, buying guides, and DIY projects for home and power tools — Bosch, Makita, DeWalt, Milwaukee, and more.',
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
      'Independent power tool reviews, head-to-head comparisons, ranked buying guides, and step-by-step DIY projects.',
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
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-gray-900`}>
        {/* Google Analytics — deferred load (after the page is interactive) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
