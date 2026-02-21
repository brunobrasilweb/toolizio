import type { Metadata } from 'next'
import { generateToolStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: 'Compound Interest Calculator - Calculate Future Value & Interest',
  description: 'Compound interest calculator with support for periodic contributions, selectable compounding frequency, and detailed results. Calculate final amount, total contributions and interest earned.',
  keywords: [
    'compound interest',
    'compound interest calculator',
    'investment calculator',
    'future value',
    'interest calculator',
    'periodic contributions'
  ],
  openGraph: {
    title: 'Compound Interest Calculator | Toolizio',
    description: 'Compute future investment value with compound interest and recurring contributions. Fast and private.',
    type: 'website',
    url: 'https://toolizio.com/compound-interest',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Compound Interest Calculator - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compound Interest Calculator - Toolizio',
    description: 'Compound interest calculator with support for periodic contributions and configurable compounding frequency.',
  },
  alternates: {
    canonical: 'https://toolizio.com/compound-interest',
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

export default function CompoundInterestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateToolStructuredData({
            name: 'Compound Interest Calculator',
            description: 'Compound interest calculator with support for periodic contributions, selectable compounding frequency, and detailed results. Calculate final amount, total contributions and interest earned.',
            url: 'https://toolizio.com/compound-interest',
            category: 'WebApplication',
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'Compound Interest Calculator',
            toolSlug: '/compound-interest',
            categoryName: 'Calculators',
            categorySlug: 'calculators',
          })),
        }}
      />
      {children}
    </>
  )
}
