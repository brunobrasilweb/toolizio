import type { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: "JWT Decoder - Decode & Verify JSON Web Tokens Online",
  description: "Decode and verify JSON Web Tokens (JWT) with our free and secure tool. Analyze header, payload, and signature of JWT tokens. Perfect for developers and API testing.",
  keywords: [
    "JWT decoder",
    "JSON Web Token",
    "decode JWT",
    "verify JWT",
    "JWT analyzer",
    "JWT tool",
    "token decoder",
    "JWT online",
    "authentication",
    "API testing"
  ],
  openGraph: {
    title: "JWT Decoder - Decode & Verify JSON Web Tokens Online | Toolizio",
    description: "Decode and verify JSON Web Tokens (JWT) with our free and secure tool. Perfect for developers and API testing.",
    type: "website",
    url: "https://toolizio.com/jwt-decoder",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "JWT Decoder - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Decoder - Decode & Verify JSON Web Tokens Online",
    description: "Decode and verify JSON Web Tokens (JWT) with our free and secure tool.",
  },
  alternates: {
    canonical: "https://toolizio.com/jwt-decoder",
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function JWTDecoderLayout({
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
            name: 'JWT Decoder',
            description: 'Free tool to decode and verify JSON Web Tokens (JWT). Analyze header, payload, and signature for API testing.',
            url: 'https://toolizio.com/jwt-decoder',
            category: 'SecurityApplication',
            image: 'https://toolizio.com/logo.png',
            ratingValue: 4.8,
            ratingCount: 220,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'JWT Decoder',
            toolSlug: '/jwt-decoder',
            categoryName: 'Security',
            categorySlug: 'security',
          }),
        }}
      />
      {children}
    </>
  );
}
