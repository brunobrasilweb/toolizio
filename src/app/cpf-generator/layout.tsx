import type { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: "CPF Generator - Generate Valid Brazilian CPF Numbers Online",
  description: "Generate valid Brazilian CPF numbers for testing and development with our free and secure tool. Perfect for developers, testers, and IT professionals. 100% free, no registration required.",
  keywords: [
    "CPF generator",
    "Brazilian CPF",
    "generate CPF",
    "CPF validator",
    "CPF for testing",
    "Brazil tax ID",
    "development tool",
    "testing tool",
    "free CPF generator",
    "online CPF tool"
  ],
  openGraph: {
    title: "CPF Generator - Generate Valid Brazilian CPF Numbers Online | Toolizio",
    description: "Generate valid Brazilian CPF numbers for testing and development with our free and secure tool. Perfect for developers and testers.",
    type: "website",
    url: "https://toolizio.com/cpf-generator",
    images: [
      {
        url: "/og-cpf-generator.png",
        width: 1200,
        height: 630,
        alt: "CPF Generator - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CPF Generator - Generate Valid Brazilian CPF Numbers Online",
    description: "Generate valid Brazilian CPF numbers for testing and development with our free and secure tool.",
    images: ["/twitter-cpf-generator.png"],
  },
  alternates: {
    canonical: "https://toolizio.com/cpf-generator",
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function CPFGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD Structured Data for Software Application */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateToolStructuredData({
            name: 'CPF Generator',
            description: 'Free tool to generate valid Brazilian CPF numbers for testing and development purposes. Follows official validation algorithm.',
            url: 'https://toolizio.com/cpf-generator',
            category: 'UtilityApplication',
            image: 'https://toolizio.com/og-cpf-generator.png',
            ratingValue: 4.8,
            ratingCount: 250,
          }),
        }}
      />
      
      {/* JSON-LD Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'CPF Generator',
            toolSlug: '/cpf-generator',
            categoryName: 'Generators',
            categorySlug: 'generators',
          }),
        }}
      />
      
      {children}
    </>
  );
}
