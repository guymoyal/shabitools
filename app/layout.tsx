import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import BuyMeACoffee from '@/components/BuyMeACoffee/BuyMeACoffee';
import AutoAds from '@/components/Ads/AutoAds';
import headerData from '@/data/header.json';
import footerData from '@/data/footer.json';
import toolsData from '@/data/tools.json';
import websiteSchema from '@/schemas/website.json';
import organizationSchema from '@/schemas/organization.json';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'shabitools - Free Developer Tools Hub | Code Tools & Developer Apps',
  description: 'Free developer tools hub with 28+ code tools, developer apps, and dev tools. JSON formatter, regex tester, API tester, and more free tools for developers.',
  keywords: 'dev tools, developer tools, developers free tools, developers apps, code tools, developer tools hub, free tools, web tools, online utilities, productivity tools, developer utilities, coding tools, programming tools',
  authors: [{ name: 'shabitools' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  alternates: {
    canonical: 'https://shabitools.com',
  },
  openGraph: {
    title: 'shabitools - Free Developer Tools Hub | Code Tools & Developer Apps',
    description: 'Free developer tools hub with 28+ code tools, developer apps, and dev tools. JSON formatter, regex tester, API tester, and more.',
    type: 'website',
    images: [
      {
        url: '/images/logo.png',
        width: 200,
        height: 200,
        alt: 'shabitools Logo',
      },
    ],
  },
  other: {
    'application/ld+json': JSON.stringify([websiteSchema, organizationSchema]),
    'google-adsense-account': 'ca-pub-2201239508910470',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}>
        <AutoAds />
        <Header data={headerData} tools={toolsData} />
        <main>{children}</main>
        <Footer data={footerData} />
        <BuyMeACoffee variant="floating" />
      </body>
    </html>
  );
}
