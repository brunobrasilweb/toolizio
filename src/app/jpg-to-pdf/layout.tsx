import type { Metadata } from 'next'
import { generateToolStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: 'JPG to PDF Converter - Convert JPG Images to PDF Documents Online',
  description: 'Convert JPG, JPEG, and PNG images to PDF documents with high quality. Free online JPG to PDF converter tool with batch processing and multiple image support.',
  keywords: [
    'JPG to PDF',
    'JPEG to PDF',
    'PNG to PDF',
    'image to PDF',
    'JPG to PDF online',
    'convert JPG to PDF',
    'image to PDF converter',
    'online converter',
    'free image to PDF converter',
    'JPG to PDF converter'
  ],
  openGraph: {
    title: 'JPG to PDF Converter - Convert JPG Images to PDF Documents Online | Toolizio',
    description: 'Convert JPG, JPEG, and PNG images to PDF documents with high quality. Free online tool with batch processing.',
    type: 'website',
    url: 'https://toolizio.com/jpg-to-pdf',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'JPG to PDF Converter - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG to PDF Converter - Convert JPG Images to PDF Documents Online',
    description: 'Convert JPG, JPEG, and PNG images to PDF documents with high quality. Free online tool with batch processing.',
  },
  alternates: {
    canonical: 'https://toolizio.com/jpg-to-pdf',
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

export default function JpgToPdfLayout({
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
            name: 'JPG to PDF Converter',
            description: 'Convert JPG, JPEG, and PNG images to PDF documents with high quality. Free online JPG to PDF converter tool with batch processing and multiple image support.',
            url: 'https://toolizio.com/jpg-to-pdf',
            category: 'WebApplication',
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'JPG to PDF Converter',
            toolSlug: '/jpg-to-pdf',
            categoryName: 'Converters',
            categorySlug: 'converters',
          })),
        }}
      />
      {children}
    </>
  )
} 