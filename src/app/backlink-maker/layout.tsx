import type { Metadata } from 'next'
import { generateToolStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: 'Backlink Maker - Free Backlink Generator | Toolizio',
  description: 'Generate quality backlinks for your website automatically. Free tool to create backlinks and improve your website SEO.',
  keywords: 'backlinks, backlink generator, SEO, link building, optimization, digital marketing',
  openGraph: {
    title: 'Backlink Maker - Free Backlink Generator',
    description: 'Generate quality backlinks for your website automatically. Free tool to create backlinks and improve your website SEO.',
    type: 'website',
    url: 'https://toolizio.com/backlink-maker',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Backlink Maker - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Backlink Maker - Free Backlink Generator',
    description: 'Generate quality backlinks for your website automatically. Free tool to create backlinks and improve your website SEO.',
  },
  alternates: {
    canonical: 'https://toolizio.com/backlink-maker',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function BacklinkMakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateToolStructuredData({
            name: 'Backlink Maker',
            description: 'Generate quality backlinks for your website automatically. Free tool to create backlinks and improve your website SEO.',
            url: 'https://toolizio.com/backlink-maker',
            category: 'WebApplication',
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'Backlink Maker',
            toolSlug: '/backlink-maker',
            categoryName: 'SEO Tools',
            categorySlug: 'seo-tools',
          })),
        }}
      />
      {children}
    </>
  )
}
