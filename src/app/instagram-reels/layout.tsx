import type { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: "Instagram Reels Downloader - Download Instagram Reels Videos Online",
  description: "Download Instagram Reels videos in high quality for free. Save Instagram Reels to your device with our fast and secure downloader tool.",
  keywords: [
    "Instagram Reels downloader",
    "download Instagram Reels",
    "Instagram Reels video",
    "Reels downloader",
    "Instagram video download",
    "save Instagram Reels",
    "Instagram Reels saver",
    "Reels video download",
    "Instagram content downloader",
    "Reels extractor"
  ],
  openGraph: {
    title: "Instagram Reels Downloader - Download Instagram Reels Videos Online | Toolizio",
    description: "Download Instagram Reels videos in high quality for free. Save Instagram Reels to your device with our fast and secure downloader.",
    type: "website",
    url: "https://toolizio.com/instagram-reels",
    images: [
      {
        url: "/og-instagram-reels.png",
        width: 1200,
        height: 630,
        alt: "Instagram Reels Downloader - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Reels Downloader - Download Instagram Reels Videos Online",
    description: "Download Instagram Reels videos in high quality for free.",
    images: ["/twitter-instagram-reels.png"],
  },
  alternates: {
    canonical: "https://toolizio.com/instagram-reels",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function InstagramReelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD Structured Data for Software Application */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateToolStructuredData({
            name: 'Instagram Reels Downloader',
            description: 'Free online tool to download Instagram Reels videos in high quality. Save Instagram Reels to your device quickly and securely.',
            url: 'https://toolizio.com/instagram-reels',
            category: 'WebApplication',
            image: 'https://toolizio.com/og-instagram-reels.png',
            ratingValue: 4.6,
            ratingCount: 320,
          }),
        }}
      />

      {/* JSON-LD Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'Instagram Reels Downloader',
            toolSlug: '/instagram-reels',
            categoryName: 'Social Media',
            categorySlug: 'social',
          }),
        }}
      />

      {children}
    </>
  );
}