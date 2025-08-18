import type { Metadata } from 'next'

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
}

export default function BackgroundRemovalLayout({ children }: { children: React.ReactNode }) {
  return children
}
