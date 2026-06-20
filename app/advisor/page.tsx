// app/advisor/page.tsx
import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import AdvisorApp from '@/components/advisor/AdvisorApp';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Tool Advisor — Ask Anything | shabitools',
  description:
    'Ask anything — &quot;a good cordless drill around $300&quot; or &quot;what tools do I need to build a wood balcony&quot; — and get matched to real products with honest picks.',
  path: '/advisor',
  ogType: 'website',
});

export default function AdvisorPage() {
  return (
    <>
      <PageHero
        title="Ask anything. Get the right tools."
        subtitle="Describe what you want to do or buy. We match you to real products with honest, budget-aware picks."
      />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <AdvisorApp />
      </div>
    </>
  );
}
