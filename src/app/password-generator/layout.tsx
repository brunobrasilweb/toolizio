import type { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: "Password Generator - Create Strong & Secure Passwords Online",
  description: "Generate strong, secure passwords with our free customizable tool. Choose length, special characters, numbers, and letters. Protect your accounts with strong passwords.",
  keywords: [
    "password generator",
    "secure password",
    "strong password",
    "random password",
    "password maker",
    "create password",
    "password tool",
    "online password generator",
    "digital security",
    "account protection"
  ],
  openGraph: {
    title: "Password Generator - Create Strong & Secure Passwords Online | Toolizio",
    description: "Generate strong, secure passwords with our free customizable tool. Protect your accounts with strong passwords.",
    type: "website",
    url: "https://toolizio.com/password-generator",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Password Generator - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Password Generator - Create Strong & Secure Passwords Online",
    description: "Generate strong, secure passwords with our free customizable tool. Protect your accounts with strong passwords.",
  },
  alternates: {
    canonical: "https://toolizio.com/password-generator",
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function PasswordGeneratorLayout({
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
            name: 'Password Generator',
            description: 'Free tool to generate strong and secure passwords online. Customizable length and character sets.',
            url: 'https://toolizio.com/password-generator',
            category: 'SecurityApplication',
            image: 'https://toolizio.com/logo.png',
            ratingValue: 4.9,
            ratingCount: 320,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'Password Generator',
            toolSlug: '/password-generator',
            categoryName: 'Generators',
            categorySlug: 'generators',
          }),
        }}
      />
      {children}
    </>
  );
}
