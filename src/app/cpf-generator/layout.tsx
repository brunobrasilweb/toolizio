import type { Metadata } from "next";

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
        url: "/logo.png",
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
  },
  alternates: {
    canonical: "https://toolizio.com/cpf-generator",
  },
};

export default function CPFGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
