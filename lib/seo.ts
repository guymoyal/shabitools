import type { Metadata } from 'next';
import type { SiteImageData } from './images';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shabitools.com';

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string; // leading slash, no trailing slash
  ogType?: 'website' | 'article';
  image?: { url: string; width: number; height: number; alt: string };
}): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  const images = opts.image
    ? [{ url: `${SITE_URL}${opts.image.url}`, width: opts.image.width, height: opts.image.height, alt: opts.image.alt }]
    : undefined;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: { title: opts.title, description: opts.description, url, type: opts.ogType ?? 'article', images },
    twitter: { card: 'summary_large_image', title: opts.title, description: opts.description, images: images?.map((i) => i.url) },
  };
}

/** Convert a SiteImageData (or null) into the pageMetadata image param shape. */
export function ogImage(image: SiteImageData | null): { url: string; width: number; height: number; alt: string } | undefined {
  if (!image) return undefined;
  return { url: image.src, width: image.width, height: image.height, alt: image.alt };
}
