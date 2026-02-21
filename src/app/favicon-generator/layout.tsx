import type { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

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
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function FaviconGeneratorLayout({
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
            name: 'Favicon Generator',
            description: 'Free tool to generate high-quality favicons from JPG or PNG images. Create ICO and PNG favicons for web, mobile, and desktop.',
            url: 'https://toolizio.com/favicon-generator',
            category: 'UtilityApplication',
            image: 'https://toolizio.com/logo.png',
            ratingValue: 4.8,
            ratingCount: 200,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'Favicon Generator',
            toolSlug: '/favicon-generator',
            categoryName: 'Generators',
            categorySlug: 'generators',
          }),
        }}
      />
      {children}
    </>
  );
}
