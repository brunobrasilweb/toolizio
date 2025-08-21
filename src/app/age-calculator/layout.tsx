import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Age Calculator - Calculate age and differences online',
  description: 'Calculate age from birthdate, difference between two dates, and common formats. Supports years, months, days, and exact age breakdown.',
  keywords: [
    'age calculator',
    'calculate age',
    'age from birthdate',
    'age difference',
    'age calculator online'
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
}

export default function AgeCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children
}
