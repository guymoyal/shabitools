import Link from 'next/link';
import { hasStoreLandings } from '@/lib/stores';

function buildSections() {
  const explore = [
    { name: 'Brands', href: '/brands' },
    ...(hasStoreLandings() ? [{ name: 'Stores & deals', href: '/stores' }] : []),
    { name: 'About', href: '/about' },
    { name: 'Editorial policy', href: '/editorial-policy' },
    { name: 'Contact', href: '/contact' },
  ];
  return [
    {
      title: 'Content',
      links: [
        { name: 'Reviews', href: '/reviews' },
        { name: 'Comparisons', href: '/compare' },
        { name: 'Buying guides', href: '/guides' },
        { name: 'DIY projects', href: '/projects' },
        { name: 'Categories', href: '/categories' },
      ],
    },
    { title: 'Explore', links: explore },
    {
      title: 'Legal',
      links: [
        { name: 'Affiliate disclosure', href: '/affiliate-disclosure' },
        { name: 'Privacy policy', href: '/privacy' },
        { name: 'Terms of service', href: '/terms' },
      ],
    },
  ];
}

export default function Footer() {
  const SECTIONS = buildSections();
  return (
    <footer className="border-t border-stone-200 bg-stone-900 text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold text-white">
            shabi<span className="text-amber-500">tools</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Independent reviews and buying guides for home &amp; power tools.
          </p>
          <p className="mt-3 text-xs text-stone-400">
            As an Amazon Associate I earn from qualifying purchases. We may also earn from other
            affiliate links on this site — at no extra cost to you.
          </p>
        </div>
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <p className="text-sm font-semibold uppercase tracking-wide text-stone-400">
              {s.title}
            </p>
            <ul className="mt-3 space-y-2">
              {s.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-amber-400">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-stone-800 py-4 text-center text-xs text-stone-500">
        © 2026 shabitools.com — All rights reserved.
      </div>
    </footer>
  );
}
