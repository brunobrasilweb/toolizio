import type { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: "Credit Card Generator - Generate Test Card Numbers (Luhn) | Toolizio",
  description: "Generate valid credit card numbers for testing, supporting Visa, MasterCard, Amex and more. Uses the Luhn (mod10) algorithm to ensure numbers are valid for testing and QA.",
  keywords: [
    "credit card generator",
    "card number generator",
    "luhn",
    "mod10",
    "test credit card",
    "visa generator",
    "mastercard generator",
    "amex generator",
    "payment testing",
    "card validation"
  ],
  openGraph: {
    title: "Credit Card Generator - Toolizio",
    description: "Generate valid credit card numbers for testing using the Luhn (mod10) algorithm.",
    type: "website",
    url: "https://toolizio.com/credit-card-generator",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Credit Card Generator - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Credit Card Generator - Generate Test Card Numbers",
    description: "Generate valid credit card numbers for testing using the Luhn (mod10) algorithm.",
  },
  alternates: {
    canonical: "https://toolizio.com/credit-card-generator",
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function CreditCardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateToolStructuredData({
            name: 'Credit Card Generator',
            description: 'Free tool to generate valid credit card numbers for testing using the Luhn algorithm. Supports Visa, MasterCard, Amex and more.',
            url: 'https://toolizio.com/credit-card-generator',
            category: 'UtilityApplication',
            image: 'https://toolizio.com/logo.png',
            ratingValue: 4.7,
            ratingCount: 130,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'Credit Card Generator',
            toolSlug: '/credit-card-generator',
            categoryName: 'Generators',
            categorySlug: 'generators',
          }),
        }}
      />
      {children}
    </>
  );
}
