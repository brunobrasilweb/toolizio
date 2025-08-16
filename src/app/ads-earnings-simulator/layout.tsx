import type { Metadata } from 'next'

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
}

export default function AdsEarningsSimulatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
