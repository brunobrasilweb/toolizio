import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Resizer - Resize images online | Toolizio',
  description: 'Resize JPG and PNG images directly in your browser. Change dimensions, keep aspect ratio and download the resized image. No uploads.',
  keywords: [
    'image resizer',
    'resize image',
    'change image size',
    'resize jpg',
    'resize png',
    'online image resizer'
  ],
  openGraph: {
    title: 'Image Resizer - Resize images online | Toolizio',
    description: 'Resize JPG and PNG images directly in your browser. Change dimensions, keep aspect ratio and download the resized image.',
    type: 'website',
    url: 'https://toolizio.com/image-resizer',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Image Resizer - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Resizer - Resize images online',
    description: 'Resize JPG and PNG images directly in your browser. Change dimensions, keep aspect ratio and download the resized image.'
  },
  alternates: {
    canonical: 'https://toolizio.com/image-resizer',
  },
}

export default function ImageResizerLayout({ children }: { children: React.ReactNode }) {
  return children
}
