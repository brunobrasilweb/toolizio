import type { Metadata } from "next";

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
};

export default function PasswordGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
