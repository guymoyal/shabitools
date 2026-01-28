import { Metadata } from 'next';
import Hero from '@/components/Hero/Hero';
import Tabs from '@/components/Tabs/Tabs';
import FAQ from '@/components/FAQ/FAQ';
import heroData from '@/data/hero.json';
import tabsData from '@/data/tabs.json';
import faqData from '@/data/faq.json';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://shabitools.com',
  },
};

export default function Home() {
  return (
    <>
      <Hero data={heroData} />
      <Tabs data={tabsData} />
      <FAQ data={faqData} />
    </>
  );
}
