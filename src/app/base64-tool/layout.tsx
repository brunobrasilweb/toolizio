import type { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder - Encode/Decode Base64 Online",
  description: "Encode and decode text to/from Base64 with our free and secure tool. Convert strings, URLs, images, and files to Base64 and vice versa. 100% free and easy to use.",
  keywords: [
    "base64 encoder",
    "base64 decoder",
    "encode base64",
    "decode base64",
    "base64 converter",
    "base64 online",
    "base64 tool",
    "text to base64",
    "base64 to text",
    "file encoding"
  ],
  openGraph: {
    title: "Base64 Encoder & Decoder - Encode/Decode Base64 Online | Toolizio",
    description: "Encode and decode text to/from Base64 with our free and secure tool. Perfect for developers and data processing.",
    type: "website",
    url: "https://toolizio.com/base64-tool",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Base64 Encoder/Decoder - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 Encoder & Decoder - Encode/Decode Base64 Online",
    description: "Encode and decode text to/from Base64 with our free and secure tool.",
  },
  alternates: {
    canonical: "https://toolizio.com/base64-tool",
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateToolStructuredData({
            name: 'Base64 Encoder & Decoder',
            description: 'Free tool to encode and decode text to/from Base64. Convert strings, URLs, and files instantly.',
            url: 'https://toolizio.com/base64-tool',
            category: 'UtilityApplication',
            image: 'https://toolizio.com/logo.png',
            ratingValue: 4.7,
            ratingCount: 290,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'Base64 Encoder & Decoder',
            toolSlug: '/base64-tool',
            categoryName: 'Converters',
            categorySlug: 'converters',
          }),
        }}
      />
      {children}
    </>
  );
}
