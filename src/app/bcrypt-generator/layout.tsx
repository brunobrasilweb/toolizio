import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bcrypt Generator - Generate bcrypt hash from text',
  description: 'Generate bcrypt hashes from plain text quickly in your browser. Useful for testing and development.',
  openGraph: {
    title: 'Bcrypt Generator - Toolizio',
    description: 'Generate bcrypt hashes from plain text quickly in your browser.',
    url: 'https://toolizio.com/bcrypt-generator',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Bcrypt Generator - Toolizio',
      },
    ],
  },
  alternates: {
    canonical: 'https://toolizio.com/bcrypt-generator',
  },
}

export default function BcryptLayout({ children }: { children: React.ReactNode }) {
  return children
}
