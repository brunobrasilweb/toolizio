import type { Metadata } from 'next'
import { generateToolStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: 'Ads Earnings Simulator - Compare Ad Networks & Estimate Revenue',
  description: 'Estimate monthly earnings from AdSense and competitors. Compare RPM, CTR and CPC across networks and find the best monetization strategy for your site.',
  keywords: [
    'adsense earnings',
    'ads earnings simulator',
    'ad revenue estimator',
    'ad network comparison',
    'rpm',
    'cpc',
    'ctr',
  ],
  openGraph: {
    title: 'Ads Earnings Simulator | Toolizio',
    description: 'Estimate monthly earnings from AdSense and competitors. Compare RPM, CTR and CPC across networks and find the best monetization strategy for your site.',
    type: 'website',
    url: 'https://toolizio.com/ads-earnings-simulator',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Ads Earnings Simulator - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ads Earnings Simulator - Toolizio',
    description: 'Estimate monthly earnings from AdSense and competitors. Compare RPM, CTR and CPC across networks.',
  },
  alternates: {
    canonical: 'https://toolizio.com/ads-earnings-simulator',
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

export default function AdsEarningsSimulatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateToolStructuredData({
            name: 'Ads Earnings Simulator',
            description: 'Estimate monthly earnings from AdSense and competitors. Compare RPM, CTR and CPC across networks and find the best monetization strategy for your site.',
            url: 'https://toolizio.com/ads-earnings-simulator',
            category: 'WebApplication',
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'Ads Earnings Simulator',
            toolSlug: '/ads-earnings-simulator',
            categoryName: 'Business Tools',
            categorySlug: 'business-tools',
          })),
        }}
      />
      {children}
    </>
  )
}
