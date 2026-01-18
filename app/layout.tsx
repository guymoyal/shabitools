import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import headerData from '@/data/header.json';
import footerData from '@/data/footer.json';
import toolsData from '@/data/tools.json';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'iziTools - Free Web Tools for Developers',
  description: 'A comprehensive collection of free, easy-to-use web utilities to streamline your workflow and boost productivity',
  keywords: 'web tools, developer tools, free tools, online utilities, productivity tools',
  authors: [{ name: 'iziTools' }],
  openGraph: {
    title: 'iziTools - Free Web Tools for Developers',
    description: 'A comprehensive collection of free, easy-to-use web utilities',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header data={headerData} tools={toolsData} />
        <main>{children}</main>
        <Footer data={footerData} />
      </body>
    </html>
  );
}
