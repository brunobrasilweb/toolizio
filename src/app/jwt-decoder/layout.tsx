import type { Metadata } from "next";

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
};

export default function JWTDecoderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
