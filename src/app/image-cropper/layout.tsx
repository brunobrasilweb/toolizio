import type { Metadata } from 'next'
import { generateToolStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: 'Image Cropper - Crop images online | Toolizio',
  description: 'Crop JPG and PNG images directly in your browser. Choose aspect ratio, position the crop and download the resulting image. Processing is local and private.',
  keywords: [
    'image cropper',
    'crop image',
    'crop jpg',
    'crop png',
    'online image cropper'
  ],
  openGraph: {
    title: 'Image Cropper - Crop images online | Toolizio',
    description: 'Crop JPG and PNG images directly in your browser. Choose aspect ratio, position the crop and download the result.',
    type: 'website',
    url: 'https://toolizio.com/image-cropper',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Image Cropper - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Cropper - Crop images online',
    description: 'Crop JPG and PNG images directly in your browser. Choose aspect ratio, position the crop and download the result.'
  },
  alternates: {
    canonical: 'https://toolizio.com/image-cropper',
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

export default function ImageCropperLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateToolStructuredData({
            name: 'Image Cropper',
            description: 'Crop JPG and PNG images directly in your browser. Choose aspect ratio, position the crop and download the resulting image. Processing is local and private.',
            url: 'https://toolizio.com/image-cropper',
            category: 'WebApplication',
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'Image Cropper',
            toolSlug: '/image-cropper',
            categoryName: 'Image Tools',
            categorySlug: 'image-tools',
          })),
        }}
      />
      {children}
    </>
  )
}
