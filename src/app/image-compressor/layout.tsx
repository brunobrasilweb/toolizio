import type { Metadata } from 'next'
import { generateToolStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: 'Image Compressor - Compress JPG and PNG Images Online',
  description: 'Compress JPG and PNG images to reduce file size while maintaining quality. Free online image compression tool with multiple compression options.',
  keywords: [
    'image compressor',
    'JPG compressor',
    'PNG compressor',
    'compress images',
    'reduce image size',
    'image optimization',
    'online image compressor',
    'free image compression',
    'compress JPG',
    'compress PNG',
    'image file size reducer'
  ],
  openGraph: {
    title: 'Image Compressor - Compress JPG and PNG Images Online | Toolizio',
    description: 'Compress JPG and PNG images to reduce file size while maintaining quality. Free online tool with multiple compression options.',
    type: 'website',
    url: 'https://toolizio.com/image-compressor',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Image Compressor - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Compressor - Compress JPG and PNG Images Online',
    description: 'Compress JPG and PNG images to reduce file size while maintaining quality. Free online tool with multiple compression options.',
  },
  alternates: {
    canonical: 'https://toolizio.com/image-compressor',
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

export default function ImageCompressorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateToolStructuredData({
            name: 'Image Compressor',
            description: 'Compress JPG and PNG images to reduce file size while maintaining quality. Free online image compression tool with multiple compression options.',
            url: 'https://toolizio.com/image-compressor',
            category: 'WebApplication',
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'Image Compressor',
            toolSlug: '/image-compressor',
            categoryName: 'Image Tools',
            categorySlug: 'image-tools',
          })),
        }}
      />
      {children}
    </>
  )
}
