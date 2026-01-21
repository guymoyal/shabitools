import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://izitools.com';
  
  // Temporarily disallow all pages from being indexed
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
    // Sitemap removed temporarily since we're blocking all indexing
    // sitemap: `${baseUrl}/sitemap.xml`,
  };
}
