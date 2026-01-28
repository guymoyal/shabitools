import { Metadata } from 'next';
import Base64Encoder from '@/components/Base64Encoder/Base64Encoder';
import Overview from '@/components/Base64Encoder/Overview/Overview';
import overviewData from '@/data/tools/base64-encoder/overview.json';

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder - Encode Decode Base64 Online | shabitools',
  description: overviewData.description,
  keywords: 'base64 encoder, base64 decoder, base64 image, encode base64, decode base64, data url',
  alternates: {
    canonical: 'https://shabitools.com/tools/base64-encoder',
  },
};

export default function Base64EncoderPage() {
  return (
    <>
      <Base64Encoder />
      <Overview />
    </>
  );
}
