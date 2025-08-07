import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash Generator - MD5, SHA1, SHA256, SHA512 Online",
  description: "Generate MD5, SHA1, SHA256, SHA512, and other hash algorithms with our free and secure tool. Perfect for data integrity verification and security applications.",
  keywords: [
    "hash generator",
    "MD5 generator",
    "SHA1 generator",
    "SHA256 generator",
    "SHA512 generator",
    "hash calculator",
    "checksum",
    "hash online",
    "data integrity",
    "cryptography"
  ],
  openGraph: {
    title: "Hash Generator - MD5, SHA1, SHA256, SHA512 Online | Toolizio",
    description: "Generate MD5, SHA1, SHA256, SHA512 hashes with our free and secure tool. Perfect for data integrity verification.",
    type: "website",
    url: "https://toolizio.com/hash-generator",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Hash Generator - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hash Generator - MD5, SHA1, SHA256, SHA512 Online",
    description: "Generate MD5, SHA1, SHA256, SHA512 hashes with our free and secure tool.",
  },
  alternates: {
    canonical: "https://toolizio.com/hash-generator",
  },
};

export default function HashGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
