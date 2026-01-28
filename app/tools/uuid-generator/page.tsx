import { Metadata } from 'next';
import UUIDGenerator from '@/components/UUIDGenerator/UUIDGenerator';
import Overview from '@/components/UUIDGenerator/Overview/Overview';

export const metadata: Metadata = {
  title: 'UUID Generator - Generate UUIDs Online | shabitools',
  description: 'Generate RFC 4122 compliant UUIDs',
  keywords: 'uuid generator, guid generator, unique identifier',
  alternates: {
    canonical: 'https://shabitools.com/tools/uuid-generator',
  },
};

export default function UUIDGeneratorPage() {
  return (
    <>
      <UUIDGenerator />
      <Overview />
    </>
  );
}
