import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HTML to Image - Convert HTML or URL to PNG/JPG',
  description: 'Convert HTML content or a URL to a high-quality PNG or JPG image using your browser. Paste HTML or provide a URL and download the rendered image.',
  keywords: ['html to image','html to png','html to jpg','screenshot','convert html to image','url to image'],
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
}

export default function HtmlToImageLayout({ children }: { children: React.ReactNode }) {
  return children
}
