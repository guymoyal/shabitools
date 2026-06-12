import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About shabitools',
  description:
    'shabitools is an independent US home and power tools review site. Learn how we research tools, how we make money, and why you can trust our recommendations.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About shabitools"
        subtitle="An independent guide to home and power tools, built to help you buy the right tool the first time."
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-2xl font-bold text-stone-900">What shabitools is</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          shabitools is an independent US-focused review site covering home and power tools —
          cordless drills, saws, sanders, outdoor power equipment, and the everyday gear that fills
          a workshop or garage. We are not owned by, or operated on behalf of, any tool manufacturer
          or retailer. Our goal is simple: cut through marketing claims and confusing model numbers
          so you can choose a tool with confidence and avoid buying the wrong one.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Our review methodology</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          We want to be honest about how we work, because that honesty is the whole point of a
          review site. Our reviews are analytical rather than hands-on lab tests. We verify
          manufacturer specifications against multiple retail listings to catch errors and
          discontinued models, cross-compare competing tools on like-for-like numbers such as torque,
          battery capacity, weight, and noise, and track street prices over time so a &ldquo;deal&rdquo;
          is judged against what the tool actually sells for. We then synthesize the consistent
          patterns that emerge from large numbers of verified owner reports — the failures, quirks,
          and strengths that show up again and again.
        </p>
        <p className="mt-4 text-stone-700 leading-relaxed">
          What we do <strong>not</strong> do is claim hands-on testing we have not performed. We do
          not run instrumented bench tests in a lab, and we will never pretend a number came from our
          own torque meter when it did not. Where a figure comes from the manufacturer or a third
          party, we treat it as such. That distinction matters, and we keep it clear throughout the
          site.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">How we make money</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          shabitools is free to read. We fund the site through affiliate commissions — when you buy a
          tool through one of our links, we may earn a commission at no extra cost to you — and
          through display advertising. These earnings keep the lights on, but they never affect how
          we rank, rate, or recommend a tool. A higher commission does not buy a better verdict. For
          the full details, see our{' '}
          <a href="/affiliate-disclosure" className="text-amber-700 underline hover:text-amber-800">
            affiliate disclosure
          </a>
          .
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Why trust us</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          We get things wrong sometimes — specs change, models get revised, and prices move. When
          that happens, we want to fix it. If you spot a factual error, email us and we will review
          it, correct it, and date-stamp the update on the page so you can see when it last changed.
          We would rather be corrected than be wrong, and we treat reader corrections as one of the
          most valuable forms of feedback we receive.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">Contact</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          Questions, corrections, or suggestions? Head to our{' '}
          <a href="/contact" className="text-amber-700 underline hover:text-amber-800">
            contact page
          </a>{' '}
          — we read every message and aim to reply within a few business days.
        </p>
      </div>
    </>
  );
}
