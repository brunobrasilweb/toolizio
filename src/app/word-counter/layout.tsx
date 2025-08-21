import type { Metadata } from 'next'

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
}

export default function WordCounterLayout({ children }: { children: React.ReactNode }) {
  return children
}
