import { Metadata } from 'next';
import QRGenerator from '@/components/QRGenerator/QRGenerator';
import Overview from '@/components/QRGenerator/Overview/Overview';
import overviewData from '@/data/tools/qr-generator/overview.json';

export const metadata: Metadata = {
  title: 'QR Code Generator - Create QR Codes Online Free | iziTools',
  description: overviewData.description,
  keywords: 'qr code generator, qr code maker, generate qr code, qr code online, create qr code',
  alternates: {
    canonical: 'https://izitools.com/tools/qr-generator',
  },
};

export default function QRGeneratorPage() {
  return (
    <>
      <QRGenerator />
      <Overview />
    </>
  );
}
