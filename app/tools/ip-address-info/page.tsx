import { Metadata } from 'next';
import IPAddressInfo from '@/components/IPAddressInfo/IPAddressInfo';
import Overview from '@/components/IPAddressInfo/Overview/Overview';
import overviewData from '@/data/tools/ip-address-info/overview.json';
import toolSchema from '@/schemas/tools/tool-template.json';

const schema = {
  ...toolSchema,
  name: overviewData.title,
  description: overviewData.description,
  url: 'https://shabitools.com/tools/ip-address-info',
  featureList: overviewData.features.map((f: any) => f.title),
};

export const metadata: Metadata = {
  title: 'IP Address Info - IP Lookup & Geolocation | shabitools',
  description: overviewData.description,
  keywords: 'ip address info, ip lookup, ip geolocation, ip address checker',
  alternates: {
    canonical: 'https://shabitools.com/tools/ip-address-info',
  },
  other: {
    'application/ld+json': JSON.stringify(schema),
  },
};

export default function IPAddressInfoPage() {
  return (
    <>
      <IPAddressInfo />
      <Overview />
    </>
  );
}
