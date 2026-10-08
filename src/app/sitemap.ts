import { MetadataRoute } from 'next';
import { initialProducts } from '@/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zenpaaw.com';

  const lastModified = new Date('2026-10-07T00:00:00Z');

  const productUrls = initialProducts.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: p.isFlagship ? 1.0 : 0.8,
  }));

  const staticUrls = [
    { url: baseUrl, lastModified, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/shipping`, lastModified, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/returns`, lastModified, changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  return [...staticUrls, ...productUrls];
}
