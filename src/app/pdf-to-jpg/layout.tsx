import type { Metadata } from 'next'
import { generateToolStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: 'PDF to JPG Converter - Convert PDF Files to JPG Images Online',
  description: 'Convert PDF files to JPG images with high quality. Free online PDF to JPG converter tool with batch processing and multiple page support.',
  keywords: [
    'PDF to JPG',
    'PDF converter',
    'PDF to image',
    'PDF to JPG online',
    'convert PDF to JPG',
    'PDF image converter',
    'online converter',
    'free PDF converter',
    'PDF to JPG converter'
  ],
  openGraph: {
    title: 'PDF to JPG Converter - Convert PDF Files to JPG Images Online | Toolizio',
    description: 'Convert PDF files to JPG images with high quality. Free online tool with batch processing.',
    type: 'website',
    url: 'https://toolizio.com/pdf-to-jpg',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'PDF to JPG Converter - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to JPG Converter - Convert PDF Files to JPG Images Online',
    description: 'Convert PDF files to JPG images with high quality. Free online tool with batch processing.',
  },
  alternates: {
    canonical: 'https://toolizio.com/pdf-to-jpg',
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

export default function PdfToJpgLayout({
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
            name: 'PDF to JPG Converter',
            description: 'Convert PDF files to JPG images with high quality. Free online PDF to JPG converter tool with batch processing and multiple page support.',
            url: 'https://toolizio.com/pdf-to-jpg',
            category: 'WebApplication',
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'PDF to JPG Converter',
            toolSlug: '/pdf-to-jpg',
            categoryName: 'Converters',
            categorySlug: 'converters',
          })),
        }}
      />
      {children}
    </>
  )
} 