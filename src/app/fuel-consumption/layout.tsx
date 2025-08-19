import type { Metadata } from 'next'

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
}

export default function FuelConsumptionLayout({ children }: { children: React.ReactNode }) {
  return children
}
