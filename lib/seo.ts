import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shabitools.com';

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string; // leading slash, no trailing slash
  ogType?: 'website' | 'article';
}): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: { title: opts.title, description: opts.description, url, type: opts.ogType ?? 'article' },
    twitter: { card: 'summary_large_image', title: opts.title, description: opts.description },
  };
}
