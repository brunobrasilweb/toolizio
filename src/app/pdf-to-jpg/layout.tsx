import type { Metadata } from 'next'

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
}

export default function PdfToJpgLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 