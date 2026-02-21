import type { Metadata } from 'next'
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: 'Bcrypt Generator - Generate bcrypt hash from text',
  description: 'Generate bcrypt hashes from plain text quickly in your browser. Useful for testing and development. Secure password hashing for applications.',
  keywords: [
    'bcrypt generator',
    'bcrypt hash',
    'password hash',
    'bcrypt online',
    'generate bcrypt',
    'bcrypt tool',
    'password encryption',
    'hash generator',
    'cryptography'
  ],
  openGraph: {
    title: 'Bcrypt Generator - Toolizio',
    description: 'Generate bcrypt hashes from plain text quickly in your browser.',
    type: 'website',
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
  twitter: {
    card: 'summary_large_image',
    title: 'Bcrypt Generator - Toolizio',
    description: 'Generate bcrypt hashes from plain text quickly in your browser.',
  },
  alternates: {
    canonical: 'https://toolizio.com/bcrypt-generator',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}

export default function BcryptLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateToolStructuredData({
            name: 'Bcrypt Generator',
            description: 'Free tool to generate bcrypt hashes from plain text. Secure password hashing for testing and development.',
            url: 'https://toolizio.com/bcrypt-generator',
            category: 'SecurityApplication',
            image: 'https://toolizio.com/logo.png',
            ratingValue: 4.8,
            ratingCount: 140,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'Bcrypt Generator',
            toolSlug: '/bcrypt-generator',
            categoryName: 'Security',
            categorySlug: 'security',
          }),
        }}
      />
      {children}
    </>
  );
}
