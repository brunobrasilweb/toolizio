import type { Metadata } from 'next'
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: 'Age Calculator - Calculate age and differences online',
  description: 'Calculate age from birthdate, difference between two dates, and common formats. Supports years, months, days, and exact age breakdown.',
  keywords: [
    'age calculator',
    'calculate age',
    'age from birthdate',
    'age difference',
    'age calculator online',
    'date calculator',
    'birthday calculator',
    'age in years months days'
  ],
  openGraph: {
    title: 'Age Calculator - Calculate age and differences online | Toolizio',
    description: 'Calculate age from birthdate, difference between two dates, and common formats. Accurate, fast and privacy friendly.',
    type: 'website',
    url: 'https://toolizio.com/age-calculator',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Age Calculator - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Age Calculator - Calculate age and differences online',
    description: 'Calculate age from birthdate, difference between two dates, and common formats.',
  },
  alternates: {
    canonical: 'https://toolizio.com/age-calculator',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}

export default function AgeCalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateToolStructuredData({
            name: 'Age Calculator',
            description: 'Free tool to calculate age from birthdate and difference between two dates. Supports years, months, days breakdown.',
            url: 'https://toolizio.com/age-calculator',
            category: 'UtilityApplication',
            image: 'https://toolizio.com/logo.png',
            ratingValue: 4.6,
            ratingCount: 180,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'Age Calculator',
            toolSlug: '/age-calculator',
            categoryName: 'Calculations',
            categorySlug: 'calculations',
          }),
        }}
      />
      {children}
    </>
  );
}
