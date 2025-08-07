import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CNPJ Generator - Generate Valid Brazilian CNPJ Numbers Online",
  description: "Generate valid Brazilian CNPJ numbers for testing and development with our free and secure tool. Perfect for developers, testers, and IT professionals. 100% free, no registration required.",
  keywords: [
    "CNPJ generator",
    "Brazilian CNPJ",
    "generate CNPJ",
    "CNPJ validator",
    "CNPJ for testing",
    "Brazil company ID",
    "development tool",
    "testing tool",
    "free CNPJ generator",
    "online CNPJ tool"
  ],
  openGraph: {
    title: "CNPJ Generator - Generate Valid Brazilian CNPJ Numbers Online | Toolizio",
    description: "Generate valid Brazilian CNPJ numbers for testing and development with our free and secure tool. Perfect for developers and testers.",
    type: "website",
    url: "https://toolizio.com/cnpj-generator",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "CNPJ Generator - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CNPJ Generator - Generate Valid Brazilian CNPJ Numbers Online",
    description: "Generate valid Brazilian CNPJ numbers for testing and development with our free and secure tool.",
  },
  alternates: {
    canonical: "https://toolizio.com/cnpj-generator",
  },
};

export default function CNPJGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
