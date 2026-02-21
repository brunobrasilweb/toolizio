import type { Metadata } from 'next'
import { generateToolStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: 'Background Removal - Remove Image Backgrounds Online',
  description: 'Remove image backgrounds in your browser. Export transparent PNG or replace background with a solid color. Private and fast — runs locally using TensorFlow.js BodyPix.',
  keywords: [
    'background removal',
    'remove background',
    'image background',
    'transparent png',
    'bodypix',
    'tensorflow'
  ],
  openGraph: {
    title: 'Background Removal - Remove Image Backgrounds Online | Toolizio',
    description: 'Remove image backgrounds in your browser. Export transparent PNG or replace background with a solid color. Private and fast — runs locally using TensorFlow.js BodyPix.',
    type: 'website',
    url: 'https://toolizio.com/background-removal',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Background Removal - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Background Removal - Remove Image Backgrounds Online',
    description: 'Remove image backgrounds in your browser. Export transparent PNG or replace background with a solid color.',
  },
  alternates: {
    canonical: 'https://toolizio.com/background-removal',
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

export default function BackgroundRemovalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateToolStructuredData({
            name: 'Background Removal',
            description: 'Remove image backgrounds in your browser. Export transparent PNG or replace background with a solid color. Private and fast — runs locally using TensorFlow.js BodyPix.',
            url: 'https://toolizio.com/background-removal',
            category: 'WebApplication',
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'Background Removal',
            toolSlug: '/background-removal',
            categoryName: 'Image Tools',
            categorySlug: 'image-tools',
          })),
        }}
      />
      {children}
    </>
  )
}
