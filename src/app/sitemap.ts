import { MetadataRoute } from 'next';
import categories from '@/data/categories';

export default function sitemap(): MetadataRoute.Sitemap {
  // Prefer an explicit public site URL from env so the sitemap matches the deployed domain.
  // In development this will fallback to localhost for easier testing.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL
    ? (process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`)
    : 'https://toolizio.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const sitemapEntries: MetadataRoute.Sitemap = [];
  
  // Home page - highest priority
  sitemapEntries.push({
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 1.0,
  });
  
  // Static pages
  const staticPages = [
    { url: `${baseUrl}/about`, priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, priority: 0.5 },
    { url: `${baseUrl}/contact`, priority: 0.6 },
  ];
  
  staticPages.forEach((page) => {
    sitemapEntries.push({
      url: page.url,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: page.priority,
    });
  });
  
  // Generate tool entries from categories
  Object.entries(categories).forEach(([categoryKey, category]: [string, any]) => {
    if (category.tools && Array.isArray(category.tools)) {
      category.tools.forEach((tool: any) => {
        sitemapEntries.push({
          url: `${baseUrl}${tool.href}`,
          lastModified: currentDate,
          changeFrequency: 'monthly',
          priority: 0.8, // Tools have medium-high priority
        });
      });
    }
  });
  
  // Category pages
  Object.keys(categories).forEach((categoryKey) => {
    sitemapEntries.push({
      url: `${baseUrl}/category/${categoryKey}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });
  
  return sitemapEntries;
}
