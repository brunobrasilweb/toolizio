import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favicon Generator - Create Favicons for Your Website Online",
  description: "Generate high-quality favicons from JPG or PNG images. Create ICO with multiple resolutions and PNG favicons for web, mobile, and desktop with HTML code included. Free and secure.",
  keywords: [
    "favicon generator",
    "create favicon",
    "favicon maker",
    "favicon online",
    "generate favicon",
    "favicon ICO",
    "favicon PNG",
    "website favicon",
    "mobile favicon",
    "web design"
  ],
  openGraph: {
    title: "Favicon Generator - Create Favicons for Your Website Online | Toolizio",
    description: "Generate high-quality favicons from JPG or PNG images. Create ICO with multiple resolutions for web and mobile.",
    type: "website",
    url: "https://toolizio.com/favicon-generator",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Favicon Generator - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Favicon Generator - Create Favicons for Your Website Online",
    description: "Generate high-quality favicons from JPG or PNG images. Free and easy to use.",
  },
  alternates: {
    canonical: "https://toolizio.com/favicon-generator",
  },
};

export default function FaviconGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
