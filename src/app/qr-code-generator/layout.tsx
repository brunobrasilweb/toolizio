import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator - Create Free QR Codes Online",
  description: "Generate QR codes for URLs, links, text, and more with our free and easy-to-use tool. Download in high-quality PNG, SVG, or JPEG formats. 100% free, no registration required.",
  keywords: [
    "QR code generator",
    "create QR code",
    "generate QR code",
    "free QR code",
    "QR code maker",
    "QR code URL",
    "QR code text",
    "online QR tool",
    "download QR code",
    "custom QR code"
  ],
  openGraph: {
    title: "QR Code Generator - Create Free QR Codes Online | Toolizio",
    description: "Generate QR codes for URLs, links, text, and more with our free and easy-to-use tool. Download in multiple formats.",
    type: "website",
    url: "https://toolizio.com/qr-code-generator",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "QR Code Generator - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator - Create Free QR Codes Online",
    description: "Generate QR codes for URLs, links, text, and more with our free and easy-to-use tool.",
  },
  alternates: {
    canonical: "https://toolizio.com/qr-code-generator",
  },
};

export default function QRCodeGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
