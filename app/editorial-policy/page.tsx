import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Editorial Policy',
  description:
    'How shabitools researches, writes, and updates power tool reviews, comparisons, buying guides, and DIY project content.',
  path: '/editorial-policy',
});

export default function EditorialPolicyPage() {
  return (
    <>
      <PageHero
        title="Editorial policy"
        subtitle="How we research, write, rate, and update every page on shabitools."
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-2xl font-bold text-stone-900">Our mission</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          shabitools publishes independent analysis of home and power tools for US buyers. We help
          readers compare specs, understand trade-offs, and choose gear that fits their budget and
          projects — without marketing fluff or pay-to-play rankings.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">How reviews are produced</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          Our reviews are research-driven, not hands-on lab tests unless explicitly stated. We
          verify manufacturer specifications against multiple retail listings, compare competing models
          on like-for-like numbers (torque, battery capacity, weight, noise, warranty), and synthesize
          patterns from large volumes of verified owner feedback. When a figure comes from the
          manufacturer or a third party, we treat it as such — we do not invent bench-test results.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Ratings and verdicts</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          Star ratings reflect overall value for the intended buyer: build quality signals, spec
          competitiveness, kit completeness, ecosystem fit, and reported reliability. A high rating
          does not mean &ldquo;best for everyone&rdquo; — every review includes &ldquo;buy if&rdquo;
          and &ldquo;skip if&rdquo; guidance so you can self-select.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Comparisons and buying guides</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          Head-to-head comparisons declare a winner based on stated criteria (value, pro use, beginner
          fit, etc.) and explain the margin. Buying guides rank products in tiers with reasoning for
          each placement. Rankings are editorial judgments, not sponsored placements.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">DIY project guides</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          Project content follows conventional DIY practice: standard materials, realistic time and
          cost estimates, and safety notes where relevant. Electrical or structural work includes
          reminders to consult licensed professionals when appropriate. Projects link to tool reviews
          when a specific model is recommended, never the other way around.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Affiliate links and ads</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          We earn commissions through affiliate programs and display advertising. These fund the site
          but do not influence ratings, rankings, or which products we cover. See our{' '}
          <a href="/affiliate-disclosure" className="text-amber-700 underline hover:text-amber-800">
            affiliate disclosure
          </a>{' '}
          for details.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Updates and corrections</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          Tool lines change frequently. We display a &ldquo;last updated&rdquo; date on content
          pages and revise articles when models are discontinued, specs change, or readers report
          errors. Email{' '}
          <a href="mailto:contact@shabitools.com" className="text-amber-700 underline hover:text-amber-800">
            contact@shabitools.com
          </a>{' '}
          with the page URL and what needs fixing.
        </p>
      </div>
    </>
  );
}
