import type { Metadata } from "next";
import { generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: "About Toolizio - Free Online Tools for Everyone",
  description: "Learn about Toolizio and our mission to provide free, secure, and useful online tools for developers, designers, and professionals. Discover our story and commitment to quality.",
  keywords: [
    "about toolizio",
    "free online tools",
    "developer tools company",
    "online utilities provider",
    "web tools platform",
    "productivity tools",
    "tool collection",
    "web development tools",
    "free software tools",
    "online tool maker"
  ],
  openGraph: {
    title: "About Toolizio - Free Online Tools for Everyone | Toolizio",
    description: "Learn about Toolizio and our mission to provide free, secure, and useful online tools for everyone.",
    type: "website",
    url: "https://toolizio.com/about",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "About Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Toolizio - Free Online Tools for Everyone",
    description: "Learn about Toolizio and our mission to provide free, secure, and useful online tools.",
  },
  alternates: {
    canonical: "https://toolizio.com/about",
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Toolizio',
            description: 'Free online tools platform providing secure and useful utilities for developers, designers, and professionals.',
            url: 'https://toolizio.com',
            logo: {
              '@type': 'ImageObject',
              url: 'https://toolizio.com/logo.png',
              width: '1200',
              height: '630',
            },
            sameAs: [
              'https://toolizio.com',
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'About',
            toolSlug: '/about',
          })),
        }}
      />
      {children}
    </>
  );
}
