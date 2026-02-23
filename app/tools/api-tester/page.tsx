import { Metadata } from 'next';
import APITester from '@/components/APITester/APITester';
import Overview from '@/components/APITester/Overview/Overview';
import overviewData from '@/data/tools/api-tester/overview.json';

interface APITesterPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: APITesterPageProps): Promise<Metadata> {
  const toolName = overviewData.title;
  const pageDescription = `${overviewData.description} ${overviewData.technicalVerdict || ''}`.trim();
  const pageKeywords = [
    overviewData.keywords || [],
    overviewData.features.map((f: { title: string }) => f.title.toLowerCase()),
    overviewData.useCases.map((uc: string) => uc.toLowerCase()),
  ]
    .flat()
    .filter(Boolean)
    .join(', ');

  return {
    title: `${toolName} - REST API Testing Tool Online | shabitools`,
    description: pageDescription,
    keywords: pageKeywords,
    alternates: {
      canonical: `https://shabitools.com/tools/${params.slug}`,
    },
  };
}

export default function APITesterPage() {
  return (
    <>
      <APITester />
      <Overview />
    </>
  );
}
