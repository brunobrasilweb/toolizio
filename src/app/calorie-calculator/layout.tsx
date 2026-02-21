import type { Metadata } from 'next'
import { generateToolStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: 'Calorie Calculator - Estimate daily calories and BMR',
  description: 'Calculate your daily caloric needs using the Mifflin-St Jeor equation with activity multipliers. Get maintenance, weight loss and weight gain suggestions.',
  keywords: [
    'calorie calculator',
    'bmr calculator',
    'daily calories',
    'mifflin st jeor',
    'calorie estimate'
  ],
  openGraph: {
    title: 'Calorie Calculator - Estimate daily calories and BMR | Toolizio',
    description: 'Calculate your daily caloric needs using the Mifflin-St Jeor equation with activity multipliers. Get maintenance, weight loss and weight gain suggestions.',
    type: 'website',
    url: 'https://toolizio.com/calorie-calculator',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Calorie Calculator - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calorie Calculator - Estimate daily calories and BMR',
    description: 'Calculate your daily caloric needs using the Mifflin-St Jeor equation.'
  },
  alternates: {
    canonical: 'https://toolizio.com/calorie-calculator',
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

export default function CalorieCalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateToolStructuredData({
            name: 'Calorie Calculator',
            description: 'Calculate your daily caloric needs using the Mifflin-St Jeor equation with activity multipliers. Get maintenance, weight loss and weight gain suggestions.',
            url: 'https://toolizio.com/calorie-calculator',
            category: 'WebApplication',
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'Calorie Calculator',
            toolSlug: '/calorie-calculator',
            categoryName: 'Calculators',
            categorySlug: 'calculators',
          })),
        }}
      />
      {children}
    </>
  )
}
