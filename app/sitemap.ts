import { MetadataRoute } from 'next';
import toolsData from '@/data/tools.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://shabitools.com';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Tool pages
  const toolPages = toolsData.map((tool) => ({
    url: `${baseUrl}${tool.link}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: tool.featured ? 0.8 : 0.6,
  }));

  return [...staticPages, ...toolPages];
}
