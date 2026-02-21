import type { Metadata } from 'next'
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: 'Barcode Generator - Create and Download Barcodes | Toolizio',
  description: 'Generate barcodes (EAN13, CODE128, UPC) quickly. Customize text, format and download as PNG or SVG. Free and privacy friendly.',
  keywords: [
    'barcode',
    'barcode generator',
    'ean13',
    'code128',
    'upc',
    'barcode png',
    'barcode svg',
    'generate barcode',
    'barcode creator',
    'download barcode'
  ],
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
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}

export default function BarcodeGeneratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateToolStructuredData({
            name: 'Barcode Generator',
            description: 'Free tool to generate barcodes (EAN13, CODE128, UPC) and download as PNG or SVG. Customize text and format.',
            url: 'https://toolizio.com/barcode-generator',
            category: 'UtilityApplication',
            image: 'https://toolizio.com/logo.png',
            ratingValue: 4.7,
            ratingCount: 160,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'Barcode Generator',
            toolSlug: '/barcode-generator',
            categoryName: 'Generators',
            categorySlug: 'generators',
          }),
        }}
      />
      {children}
    </>
  );
}
