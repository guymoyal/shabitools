import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import headerData from '@/data/header.json';
import footerData from '@/data/footer.json';
import toolsData from '@/data/tools.json';
import websiteSchema from '@/schemas/website.json';
import organizationSchema from '@/schemas/organization.json';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'shabitools - Free Web Tools for Developers',
  description: 'A comprehensive collection of free, easy-to-use web utilities to streamline your workflow and boost productivity',
  keywords: 'web tools, developer tools, free tools, online utilities, productivity tools',
  authors: [{ name: 'shabitools' }],
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo-simple.svg',
    apple: '/logo-simple.svg',
  },
  alternates: {
    canonical: 'https://shabitools.com',
  },
  openGraph: {
    title: 'shabitools - Free Web Tools for Developers',
    description: 'A comprehensive collection of free, easy-to-use web utilities',
    type: 'website',
    images: [
      {
        url: '/logo.svg',
        width: 200,
        height: 200,
        alt: 'shabitools Logo',
      },
    ],
  },
  other: {
    'application/ld+json': JSON.stringify([websiteSchema, organizationSchema]),
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
        <Header data={headerData} tools={toolsData} />
        <main>{children}</main>
        <Footer data={footerData} />
      </body>
    </html>
  );
}
