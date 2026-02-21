import type { Metadata } from 'next'
import { generateToolStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: 'Contact Extractor - Extract Emails and Phones from a Website',
  description: 'Crawl a website (up to 50 internal links) and extract emails and phone numbers. Choose phone format by country and download results.',
  keywords: ['contact extractor','email extractor','phone extractor','crawl','website scraping','contacts','lead generation'],
  openGraph: {
    title: 'Contact Extractor - Toolizio',
    description: 'Crawl a website (up to 50 internal links) and extract emails and phone numbers. Choose phone format by country and download results.',
    url: 'https://toolizio.com/contact-extractor',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'Contact Extractor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Extractor - Extract Emails and Phones from a Website',
    description: 'Crawl a website (up to 50 internal links) and extract emails and phone numbers. Choose phone format by country and download results.',
  },
  alternates: {
    canonical: 'https://toolizio.com/contact-extractor',
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

export default function ContactExtractorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateToolStructuredData({
            name: 'Contact Extractor',
            description: 'Crawl a website (up to 50 internal links) and extract emails and phone numbers. Choose phone format by country and download results.',
            url: 'https://toolizio.com/contact-extractor',
            category: 'WebApplication',
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'Contact Extractor',
            toolSlug: '/contact-extractor',
            categoryName: 'Contact Tools',
            categorySlug: 'contact-tools',
          })),
        }}
      />
      {children}
    </>
  )
}
