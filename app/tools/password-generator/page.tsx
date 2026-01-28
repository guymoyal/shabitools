import { Metadata } from 'next';
import PasswordGenerator from '@/components/PasswordGenerator/PasswordGenerator';
import Overview from '@/components/PasswordGenerator/Overview/Overview';

export const metadata: Metadata = {
  title: 'Password Generator - Generate Secure Random Passwords | shabitools',
  description: 'Generate secure random passwords with customizable options',
  keywords: 'password generator, secure password, random password, password creator',
  alternates: {
    canonical: 'https://shabitools.com/tools/password-generator',
  },
};

export default function PasswordGeneratorPage() {
  return (
    <>
      <PasswordGenerator />
      <Overview />
    </>
  );
}
