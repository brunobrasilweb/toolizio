import type { Metadata } from "next";

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
};

export default function UuidGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
