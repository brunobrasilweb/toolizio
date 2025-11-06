import { Metadata } from 'next';

export interface ToolMetadataParams {
  title: string;
  description: string;
  keywords?: string[];
  slug: string;
  icon?: string;
}

/**
 * Generates metadata for tool pages
 * Ensures each tool has unique title, description, and canonical URL
 */
export function generateToolMetadata(params: ToolMetadataParams): Metadata {
  const { title, description, keywords = [], slug } = params;
  const canonicalUrl = `https://toolizio.com${slug}`;
  const fullTitle = `${title} - Free Online Tool | Toolizio`;
  
  return {
    title: fullTitle,
    description: description.length > 160 ? description.substring(0, 157) + '...' : description,
    keywords: [
      ...keywords,
      'free tool',
      'online tool',
      'toolizio',
      'free online',
    ],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonicalUrl,
      siteName: 'Toolizio',
      title: fullTitle,
      description,
      images: [
        {
          url: `/og-${slug.replace(/^\//, '').replace(/\//g, '-')}.png`,
          width: 1200,
          height: 630,
          alt: `${title} - Toolizio`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [`/twitter-${slug.replace(/^\//, '').replace(/\//g, '-')}.png`],
      creator: '@toolizio',
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

/**
 * Generates JSON-LD structured data for a software application (tool)
 */
export function generateToolStructuredData(params: {
  name: string;
  description: string;
  url: string;
  category?: string;
  image?: string;
  ratingValue?: number;
  ratingCount?: number;
}): string {
  const {
    name,
    description,
    url,
    category = 'UtilityApplication',
    image = '/logo.png',
    ratingValue = 4.8,
    ratingCount = 100,
  } = params;

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    applicationCategory: category,
    url,
    operatingSystem: 'Any',
    inLanguage: 'en-US',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toString(),
      ratingCount: ratingCount.toString(),
    },
    author: {
      '@type': 'Organization',
      name: 'Toolizio',
      url: 'https://toolizio.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://toolizio.com/logo.png',
      },
    },
    image: {
      '@type': 'ImageObject',
      url: image,
      width: '1200',
      height: '630',
    },
  });
}

/**
 * Generates JSON-LD breadcrumb list for tool pages
 */
export function generateBreadcrumbStructuredData(params: {
  toolName: string;
  toolSlug: string;
  categoryName?: string;
  categorySlug?: string;
}): string {
  const { toolName, toolSlug, categoryName, categorySlug } = params;

  const items: Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://toolizio.com',
    },
  ];

  if (categoryName && categorySlug) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: categoryName,
      item: `https://toolizio.com/category/${categorySlug}`,
    });
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: toolName,
      item: `https://toolizio.com${toolSlug}`,
    });
  } else {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: toolName,
      item: `https://toolizio.com${toolSlug}`,
    });
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  });
}
