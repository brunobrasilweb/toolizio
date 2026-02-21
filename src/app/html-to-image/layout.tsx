import type { Metadata } from 'next'
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: 'HTML to Image - Convert HTML or URL to PNG/JPG',
  description: 'Convert HTML content or a URL to a high-quality PNG or JPG image using your browser. Paste HTML or provide a URL and download the rendered image.',
  keywords: [
    'html to image',
    'html to png',
    'html to jpg',
    'screenshot',
    'convert html to image',
    'url to image',
    'html screenshot',
    'webpage to image',
    'browser screenshot'
  ],
  openGraph: {
    title: 'HTML to Image - Convert HTML or URL to PNG/JPG | Toolizio',
    description: 'Convert HTML content or a URL to a high-quality PNG or JPG image using your browser.',
    type: 'website',
    url: 'https://toolizio.com/html-to-image',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'HTML to Image - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HTML to Image - Convert HTML or URL to PNG/JPG',
    description: 'Convert HTML content or a URL to a high-quality PNG or JPG image using your browser.',
  },
  alternates: {
    canonical: 'https://toolizio.com/html-to-image',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}

export default function HtmlToImageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateToolStructuredData({
            name: 'HTML to Image Converter',
            description: 'Free tool to convert HTML content or URLs to high-quality PNG or JPG images using your browser.',
            url: 'https://toolizio.com/html-to-image',
            category: 'UtilityApplication',
            image: 'https://toolizio.com/logo.png',
            ratingValue: 4.7,
            ratingCount: 190,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'HTML to Image Converter',
            toolSlug: '/html-to-image',
            categoryName: 'Converters',
            categorySlug: 'converters',
          }),
        }}
      />
      {children}
    </>
  );
}
