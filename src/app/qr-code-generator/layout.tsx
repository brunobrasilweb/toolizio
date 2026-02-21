import type { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: "QR Code Generator - Create Free QR Codes Online",
  description: "Generate QR codes for URLs, links, text, and more with our free and easy-to-use tool. Download in high-quality PNG, SVG, or JPEG formats. 100% free, no registration required.",
  keywords: [
    "QR code generator",
    "create QR code",
    "generate QR code",
    "free QR code",
    "QR code maker",
    "QR code URL",
    "QR code text",
    "online QR tool",
    "download QR code",
    "custom QR code"
  ],
  openGraph: {
    title: "QR Code Generator - Create Free QR Codes Online | Toolizio",
    description: "Generate QR codes for URLs, links, text, and more with our free and easy-to-use tool. Download in multiple formats.",
    type: "website",
    url: "https://toolizio.com/qr-code-generator",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "QR Code Generator - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator - Create Free QR Codes Online",
    description: "Generate QR codes for URLs, links, text, and more with our free and easy-to-use tool.",
  },
  alternates: {
    canonical: "https://toolizio.com/qr-code-generator",
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function QRCodeGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateToolStructuredData({
            name: 'QR Code Generator',
            description: 'Free tool to generate high-quality QR codes for URLs, texts and more. Instant download as SVG or PNG.',
            url: 'https://toolizio.com/qr-code-generator',
            category: 'MultimediaApplication',
            image: 'https://toolizio.com/logo.png',
            ratingValue: 4.8,
            ratingCount: 410,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'QR Code Generator',
            toolSlug: '/qr-code-generator',
            categoryName: 'Generators',
            categorySlug: 'generators',
          }),
        }}
      />
      {children}
    </>
  );
}
