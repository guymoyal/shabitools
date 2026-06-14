import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Affiliate Disclosure',
  description:
    'How shabitools uses affiliate links and display advertising — in plain language. Commissions never influence our rankings, ratings, or verdicts.',
  path: '/affiliate-disclosure',
});

export default function AffiliateDisclosurePage() {
  return (
    <>
      <PageHero
        title="Affiliate disclosure"
        subtitle="Plain-English transparency about how we earn money and how that does — and doesn't — affect what you read."
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-2xl font-bold text-stone-900">We use affiliate links</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          Many pages on shabitools contain affiliate links. This includes links to Amazon, links
          served through the Admitad affiliate network, and links routed through our own{' '}
          <code className="rounded bg-stone-100 px-1 py-0.5 text-sm">/go/</code> redirects. If you
          click one of these links and then buy something, we may earn a commission. That commission
          comes out of the retailer&rsquo;s margin — it costs you nothing extra, and you pay exactly
          the same price you would have paid going to the store directly.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Amazon Associates</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          shabitools is a participant in the Amazon Services LLC Associates Program, an affiliate
          advertising program designed to provide a means for sites to earn advertising fees by
          advertising and linking to Amazon.com.{' '}
          <strong>As an Amazon Associate I earn from qualifying purchases.</strong>
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Money never buys a verdict</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          This is the part that matters most. Affiliate commissions never influence our rankings,
          ratings, pros and cons, or buy/skip verdicts. We do not move a tool up a list because it
          pays more, and we do not soften criticism of a product we earn a commission on. Our
          editorial conclusions are formed first; the links are added afterward to whichever
          retailers carry the tool. To keep things clear, links we are compensated for are marked
          with the{' '}
          <code className="rounded bg-stone-100 px-1 py-0.5 text-sm">rel=&quot;sponsored&quot;</code>{' '}
          attribute.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Display advertising</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          We also show display advertising through Google AdSense. These ads are served by Google and
          are kept separate from our editorial content. Advertisers cannot edit, approve, or
          influence our reviews, and the presence of an ad on a page has no bearing on what that page
          recommends.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">
          How to spot an affiliate link
        </h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          You can identify the links we may earn from throughout the site. They typically appear as:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-stone-700 leading-relaxed">
          <li>
            <strong>&ldquo;Check price at&hellip;&rdquo; buttons</strong> on reviews and roundups
            that send you to a retailer to see the current price.
          </li>
          <li>
            <strong>&ldquo;Stores we link to&rdquo; strips</strong> that list the merchants carrying
            a given tool.
          </li>
          <li>
            <strong>Store pages</strong> that group together the retailers we partner with.
          </li>
        </ul>
        <p className="mt-4 text-stone-700 leading-relaxed">
          If you ever have a question about whether a particular link is an affiliate link, assume
          any outbound &ldquo;buy&rdquo; or &ldquo;check price&rdquo; link may be one, and feel free
          to email us. We would rather over-disclose than leave you guessing.
        </p>
      </div>
    </>
  );
}
