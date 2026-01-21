import { Metadata } from 'next';
import EmailValidator from '@/components/EmailValidator/EmailValidator';
import Overview from '@/components/EmailValidator/Overview/Overview';
import overviewData from '@/data/tools/email-validator/overview.json';
import toolSchema from '@/schemas/tools/tool-template.json';

const schema = {
  ...toolSchema,
  name: overviewData.title,
  description: overviewData.description,
  url: 'https://izitools.com/tools/email-validator',
  featureList: overviewData.features.map((f: any) => f.title),
};

export const metadata: Metadata = {
  title: 'Email Validator - Validate Email Address Online | iziTools',
  description: overviewData.description,
  keywords: 'email validator, validate email, email checker, email validation tool',
  alternates: {
    canonical: 'https://izitools.com/tools/email-validator',
  },
  other: {
    'application/ld+json': JSON.stringify(schema),
  },
};

export default function EmailValidatorPage() {
  return (
    <>
      <EmailValidator />
      <Overview />
    </>
  );
}
