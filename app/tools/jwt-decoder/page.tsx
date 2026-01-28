import { Metadata } from 'next';
import JWTDecoder from '@/components/JWTDecoder/JWTDecoder';
import Overview from '@/components/JWTDecoder/Overview/Overview';
import overviewData from '@/data/tools/jwt-decoder/overview.json';
import toolSchema from '@/schemas/tools/tool-template.json';

const schema = {
  ...toolSchema,
  name: overviewData.title,
  description: overviewData.description,
  url: 'https://shabitools.com/tools/jwt-decoder',
  featureList: overviewData.features.map((f: any) => f.title),
};

export const metadata: Metadata = {
  title: 'JWT Decoder & Validator - Decode JSON Web Tokens Online | shabitools',
  description: overviewData.description,
  keywords: 'jwt decoder, jwt validator, decode jwt, jwt token, json web token',
  alternates: {
    canonical: 'https://shabitools.com/tools/jwt-decoder',
  },
  other: {
    'application/ld+json': JSON.stringify(schema),
  },
};

export default function JWTDecoderPage() {
  return (
    <>
      <JWTDecoder />
      <Overview />
    </>
  );
}
