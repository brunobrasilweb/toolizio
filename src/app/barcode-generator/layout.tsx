import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Barcode Generator - Create and Download Barcodes | Toolizio',
  description: 'Generate barcodes (EAN13, CODE128, UPC) quickly. Customize text, format and download as PNG or SVG. Free and privacy friendly.',
  keywords: ['barcode', 'barcode generator', 'ean13', 'code128', 'upc', 'barcode png', 'barcode svg'],
  openGraph: {
    title: 'Barcode Generator | Toolizio',
    description: 'Generate barcodes (EAN13, CODE128, UPC) quickly. Customize text, format and download as PNG or SVG.',
    type: 'website',
    url: 'https://toolizio.com/barcode-generator',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Barcode Generator - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barcode Generator - Toolizio',
    description: 'Generate barcodes fast and download as PNG or SVG.',
  },
  alternates: {
    canonical: 'https://toolizio.com/barcode-generator',
  },
}

export default function BarcodeGeneratorLayout({ children }: { children: React.ReactNode }) {
  return children
}
