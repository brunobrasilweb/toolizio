import type { Metadata } from "next";
import React from "react";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: "IP Address Lookup - Find My IP Online | Toolizio",
  description: "Find your public IP address instantly with our free online tool. Copy your IP easily for diagnostics, security, and more. 100% free and private.",
  keywords: [
    "ip address",
    "find my ip",
    "ip lookup",
    "what is my ip",
    "ip tool",
    "public ip",
    "copy ip",
    "ip online"
  ],
  openGraph: {
    title: "IP Address Lookup - Find My IP Online | Toolizio",
    description: "Find your public IP address instantly and copy it with one click. Free, private, and easy to use.",
    type: "website",
    url: "https://toolizio.com/ip-tool",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "IP Address Lookup - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IP Address Lookup - Find My IP Online | Toolizio",
    description: "Find your public IP address instantly and copy it with one click.",
  },
  alternates: {
    canonical: "https://toolizio.com/ip-tool",
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateToolStructuredData({
            name: 'IP Address Lookup',
            description: 'Find your public IP address instantly with our free online tool. Copy your IP easily for diagnostics, security, and more. 100% free and private.',
            url: 'https://toolizio.com/ip-tool',
            category: 'WebApplication',
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'IP Address Lookup',
            toolSlug: '/ip-tool',
            categoryName: 'Network Tools',
            categorySlug: 'network-tools',
          })),
        }}
      />
      {children}
    </>
  );
}
