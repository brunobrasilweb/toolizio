import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HTML to PDF Converter - Convert HTML Files to PDF Online',
  description: 'Convert HTML files to PDF format with custom styling and formatting. Free online HTML to PDF conversion tool with high-quality output. Perfect for web developers and designers.',
  keywords: [
    'HTML to PDF',
    'HTML converter',
    'PDF generator',
    'HTML to PDF online',
    'convert HTML to PDF',
    'web to PDF',
    'HTML document converter',
    'PDF conversion tool',
    'online converter',
    'free HTML to PDF'
  ],
  openGraph: {
    title: 'HTML to PDF Converter - Convert HTML Files to PDF Online | Toolizio',
    description: 'Convert HTML files to PDF format with custom styling and formatting. Free online tool with high-quality output.',
    type: 'website',
    url: 'https://toolizio.com/html-to-pdf',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'HTML to PDF Converter - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HTML to PDF Converter - Convert HTML Files to PDF Online',
    description: 'Convert HTML files to PDF format with custom styling. Free online tool with high-quality output.',
  },
  alternates: {
    canonical: 'https://toolizio.com/html-to-pdf',
  },
}

export default function HtmlToPdfLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
