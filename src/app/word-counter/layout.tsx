import type { Metadata } from 'next'
import { generateToolStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: 'Word Counter - Count Words, Characters and More',
  description: 'Online word and character counter with options for excluding spaces, counting sentences, lines and reading time. Free and fast.',
  keywords: [
    'word counter',
    'character counter',
    'count words',
    'count characters',
    'reading time',
    'online word counter'
  ],
  openGraph: {
    title: 'Word Counter - Count Words, Characters and More | Toolizio',
    description: 'Online word and character counter with options for excluding spaces, counting sentences, lines and reading time. Free and fast.',
    type: 'website',
    url: 'https://toolizio.com/word-counter',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Word Counter - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Word Counter - Count Words, Characters and More',
    description: 'Online word and character counter with options for excluding spaces, counting sentences, lines and reading time.',
  },
  alternates: {
    canonical: 'https://toolizio.com/word-counter',
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

export default function WordCounterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateToolStructuredData({
            name: 'Word Counter',
            description: 'Online word and character counter with options for excluding spaces, counting sentences, lines and reading time. Free and fast.',
            url: 'https://toolizio.com/word-counter',
            category: 'WebApplication',
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'Word Counter',
            toolSlug: '/word-counter',
            categoryName: 'Text Tools',
            categorySlug: 'text-tools',
          })),
        }}
      />
      {children}
    </>
  )
}
