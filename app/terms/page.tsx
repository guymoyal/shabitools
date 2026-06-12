import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Use',
  description:
    'The terms under which you use shabitools. Our content is informational, not professional advice — always verify specs and prices with the merchant before buying.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms of use"
        subtitle="The ground rules for using shabitools and the content we publish."
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-2xl font-bold text-stone-900">Information, not professional advice</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          Everything on shabitools is published for general informational purposes. Our reviews,
          comparisons, and buying guides are intended to help you make a more informed purchase, but
          they are not professional, safety, electrical, or trade advice. Power tools can be
          dangerous when used incorrectly — always read and follow the manufacturer&rsquo;s
          instructions and any applicable safety guidance for your situation.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Specs and prices change</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          Product specifications, availability, and prices change frequently and vary by retailer and
          region. We work to keep our information accurate, but figures on this site may be out of
          date by the time you read them. Before you buy, always verify the current specification and
          price directly with the merchant. We are not responsible for discrepancies between what is
          stated here and what a retailer offers at the time of purchase.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">No warranty</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          The content on shabitools is provided &ldquo;as is,&rdquo; without warranties of any kind,
          express or implied, including any warranty of merchantability or fitness for a particular
          purpose. We do not guarantee that any tool we discuss will be suitable for your specific
          project, and the decision to purchase and use any tool is yours.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">External links</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          We link to retailers and other external sites for your convenience. Those links are not a
          blanket endorsement of everything on the destination site beyond the specific review or
          recommendation stated here, and we have no control over the content, products, or policies
          of third-party sites. Visiting them is at your own discretion.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Limitation of liability</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          To the fullest extent permitted by law, shabitools and its operators are not liable for any
          loss or damage arising from your use of this site or your reliance on its content,
          including any purchase decisions you make based on it.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Content ownership</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          The text, layout, and original content on shabitools belong to us. You are welcome to read
          and share links to our pages, but scraping, copying, or republishing our content — in whole
          or in part — without our written permission is not allowed.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Changes to these terms</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          We may update these terms from time to time as the site evolves. When we do, the revised
          terms take effect when posted, and the page&rsquo;s last-modified date reflects the most
          recent change. Continued use of the site after an update means you accept the current
          terms.
        </p>
      </div>
    </>
  );
}
