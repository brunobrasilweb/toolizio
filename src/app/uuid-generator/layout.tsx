import type { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: "UUID Generator - Generate Unique Identifiers Online",
  description: "Generate UUID (Universally Unique Identifiers) versions 1, 4, and more. Free online tool to create unique identifiers for your applications and databases.",
  keywords: [
    "uuid generator",
    "uuid",
    "unique identifier",
    "guid generator",
    "uuid v4",
    "uuid v1",
    "random uuid",
    "unique id",
    "identifier generator",
    "database id",
    "application id"
  ],
  openGraph: {
    title: "UUID Generator - Generate Unique Identifiers Online | Toolizio",
    description: "Generate UUID (Universally Unique Identifiers) versions 1, 4, and more. Free online tool to create unique identifiers for your applications and databases.",
    type: "website",
    url: "https://toolizio.com/uuid-generator",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "UUID Generator - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UUID Generator - Generate Unique Identifiers Online",
    description: "Generate UUID (Universally Unique Identifiers) versions 1, 4, and more. Free online tool to create unique identifiers for your applications and databases.",
  },
  alternates: {
    canonical: "https://toolizio.com/uuid-generator",
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function UuidGeneratorLayout({
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
            name: 'UUID Generator',
            description: 'Free tool to generate UUID (Universally Unique Identifiers) versions 1, 4 and more for applications and databases.',
            url: 'https://toolizio.com/uuid-generator',
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
            toolName: 'UUID Generator',
            toolSlug: '/uuid-generator',
            categoryName: 'Generators',
            categorySlug: 'generators',
          }),
        }}
      />
      {children}
    </>
  );
}
