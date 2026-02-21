import type { Metadata } from 'next'
import { generateToolStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: 'Fuel Consumption Calculator - Estimate Fuel Use & Costs',
  description: 'Calculate fuel consumption and costs based on daily mileage. Get biweekly, monthly, semiannual and annual cost estimates.',
  keywords: [
    'fuel consumption',
    'fuel calculator',
    'fuel cost',
    'liters',
    'gas cost',
    'fuel estimator',
    'fuel calculator online'
  ],
  openGraph: {
    title: 'Fuel Consumption Calculator | Toolizio',
    description: 'Calculate fuel consumption and costs based on daily mileage. Get biweekly, monthly, semiannual and annual cost estimates.',
    type: 'website',
    url: 'https://toolizio.com/fuel-consumption',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Fuel Consumption Calculator - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fuel Consumption Calculator - Toolizio',
    description: 'Calculate fuel consumption and costs based on daily mileage. Get biweekly, monthly, semiannual and annual cost estimates.',
  },
  alternates: {
    canonical: 'https://toolizio.com/fuel-consumption',
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

export default function FuelConsumptionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateToolStructuredData({
            name: 'Fuel Consumption Calculator',
            description: 'Calculate fuel consumption and costs based on daily mileage. Get biweekly, monthly, semiannual and annual cost estimates.',
            url: 'https://toolizio.com/fuel-consumption',
            category: 'WebApplication',
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'Fuel Consumption Calculator',
            toolSlug: '/fuel-consumption',
            categoryName: 'Calculators',
            categorySlug: 'calculators',
          })),
        }}
      />
      {children}
    </>
  )
}
