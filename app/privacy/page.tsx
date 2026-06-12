import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'How shabitools handles your privacy. We collect no personal data directly; third parties like Google AdSense and affiliate networks use cookies as described here.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy policy"
        subtitle="What data is and isn't collected when you visit shabitools."
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-stone-700 leading-relaxed">
          <strong>Effective date:</strong> June 2026
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">What we collect</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          shabitools does not have user accounts, and we do not directly collect personal data from
          you. There is nothing to log in to, no newsletter sign-up that stores your details on our
          servers, and no contact form that captures your information. When you email us, we receive
          whatever you choose to put in that message and nothing more.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Advertising cookies</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          We use Google AdSense to display ads. Google and its partners use cookies and similar
          technologies to serve ads, including, where applicable, personalized ads based on your
          prior visits to this and other websites. You can learn how Google uses information from
          sites that use its services in{' '}
          <a
            href="https://policies.google.com/technologies/ads"
            className="text-amber-700 underline hover:text-amber-800"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google&rsquo;s advertising policies
          </a>
          . You can opt out of personalized advertising at any time through your{' '}
          <a
            href="https://adssettings.google.com"
            className="text-amber-700 underline hover:text-amber-800"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Ads Settings
          </a>
          .
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Affiliate cookies</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          When you click an affiliate link on our site — including links through affiliate networks
          such as Admitad — the network and the merchant may set tracking cookies. These cookies let
          the merchant attribute a resulting purchase back to us so we can be credited a commission.
          They are set by those third parties under their own privacy policies, not by us.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Analytics</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          If and when we use analytics to understand which pages are popular and how the site
          performs, that data is aggregated and used only to improve the site. We do not attempt to
          identify individual visitors from it.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Your data is not sold</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          We do not sell your personal data. The cookies and tracking described above are operated by
          the relevant third parties for advertising and affiliate attribution; managing your cookie
          and ad preferences with Google and your browser gives you control over most of them.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Questions</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          If you have any questions about privacy on shabitools, email us at{' '}
          <a
            href="mailto:contact@shabitools.com"
            className="text-amber-700 underline hover:text-amber-800"
          >
            contact@shabitools.com
          </a>{' '}
          and we will be glad to help.
        </p>
      </div>
    </>
  );
}
