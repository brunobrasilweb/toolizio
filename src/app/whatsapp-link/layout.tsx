import type { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: "WhatsApp Link Generator - Create WhatsApp Chat Links Online",
  description: "Generate WhatsApp chat links with pre-filled messages. Share direct chat links with your customers or friends. No registration required, 100% free tool.",
  keywords: [
    "WhatsApp link generator",
    "WhatsApp chat link",
    "WhatsApp message link",
    "WhatsApp direct link",
    "create WhatsApp link",
    "WhatsApp URL generator",
    "WhatsApp message generator",
    "WhatsApp marketing tool",
    "WhatsApp business link",
    "WhatsApp contact link"
  ],
  openGraph: {
    title: "WhatsApp Link Generator - Create WhatsApp Chat Links Online | Toolizio",
    description: "Generate WhatsApp chat links with pre-filled messages. Share direct chat links with your customers or friends.",
    type: "website",
    url: "https://toolizio.com/whatsapp-link",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "WhatsApp Link Generator - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatsApp Link Generator - Create WhatsApp Chat Links Online",
    description: "Generate WhatsApp chat links with pre-filled messages. Share direct chat links with your customers or friends.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://toolizio.com/whatsapp-link",
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
};

export default function WhatsAppLinkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateToolStructuredData({
            name: 'WhatsApp Link Generator',
            description: 'Generate WhatsApp chat links with pre-filled messages. Share direct chat links with your customers or friends. No registration required, 100% free tool.',
            url: 'https://toolizio.com/whatsapp-link',
            category: 'WebApplication',
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'WhatsApp Link Generator',
            toolSlug: '/whatsapp-link',
            categoryName: 'Communication Tools',
            categorySlug: 'communication-tools',
          })),
        }}
      />
      {children}
    </>
  );
}
