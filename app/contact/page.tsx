import type { Metadata } from 'next';
import PageHero from '@/components/layout/PageHero';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact shabitools',
  description:
    'Get in touch with shabitools by email for corrections, partnership and advertising enquiries, or product suggestions. We reply within a few business days.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact us"
        subtitle="We read every message — corrections, questions, and ideas are all welcome."
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-2xl font-bold text-stone-900">Email us</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          The fastest way to reach us is by email. shabitools is a small, static site, and we have
          deliberately kept it that way — there is no contact form that collects your details and no
          account system to sign up for. That means a quick note straight to our inbox is both the
          best and the most private way to get in touch. Write to us at{' '}
          <a
            href="mailto:contact@shabitools.com"
            className="text-amber-700 underline hover:text-amber-800"
          >
            contact@shabitools.com
          </a>{' '}
          and include enough detail for us to act on your message — a link to the specific page,
          tool, or model you are writing about is always helpful.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">What to write about</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-stone-700 leading-relaxed">
          <li>
            <strong>Corrections.</strong> Spotted an out-of-date spec, a wrong price, or a model
            that has been replaced? Tell us what you found and we will verify and fix it.
          </li>
          <li>
            <strong>Partnership and advertising.</strong> If you represent a brand, retailer, or
            network and want to discuss working together, send the details and we will get back to
            you.
          </li>
          <li>
            <strong>Product suggestions.</strong> Want us to cover a particular tool or category?
            Let us know what you are shopping for and why — reader requests genuinely shape what we
            review next.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-stone-900 mt-10">When to expect a reply</h2>
        <p className="mt-4 text-stone-700 leading-relaxed">
          We aim to respond to every legitimate message within a few business days. Corrections tend
          to get priority, because keeping our information accurate matters most to us, and we treat
          a good correction as one of the most valuable things a reader can send. We may not be able
          to reply to every promotional pitch, but we do read them. Thanks for taking the time to
          reach out — it genuinely helps make the site better for the next person shopping for a
          tool.
        </p>
      </div>
    </>
  );
}
