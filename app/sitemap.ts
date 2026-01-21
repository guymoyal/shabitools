import { MetadataRoute } from 'next';
import toolsData from '@/data/tools.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://izitools.com';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Tool pages
  const toolPages: MetadataRoute.Sitemap = toolsData.map((tool) => ({
    url: `${baseUrl}${tool.link}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: tool.featured ? 0.8 : 0.7,
  }));

  return [...staticPages, ...toolPages];
}
