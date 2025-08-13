import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "IP Address Lookup - Find My IP Online | Toolizio",
  description: "Find your public IP address instantly with our free online tool. Copy your IP easily for diagnostics, security, and more. 100% free and private.",
  keywords: [
    "ip address",
    "find my ip",
    "ip lookup",
    "what is my ip",
    "ip tool",
    "public ip",
    "copy ip",
    "ip online"
  ],
  openGraph: {
    title: "IP Address Lookup - Find My IP Online | Toolizio",
    description: "Find your public IP address instantly and copy it with one click. Free, private, and easy to use.",
    type: "website",
    url: "https://toolizio.com/ip-tool",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "IP Address Lookup - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IP Address Lookup - Find My IP Online | Toolizio",
    description: "Find your public IP address instantly and copy it with one click.",
  },
  alternates: {
    canonical: "https://toolizio.com/ip-tool",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
