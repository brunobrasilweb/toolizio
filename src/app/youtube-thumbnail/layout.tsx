import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube Thumbnail Downloader - Download YouTube Thumbnails Online",
  description: "Download YouTube video thumbnails in high quality with our free online tool. Get YouTube thumbnail images in various resolutions including HD, Full HD, and 4K quality.",
  keywords: [
    "youtube thumbnail downloader",
    "download youtube thumbnails",
    "youtube thumbnail saver",
    "youtube image downloader",
    "youtube thumbnail extractor",
    "free youtube thumbnail",
    "youtube thumbnail tool",
    "download video thumbnails",
    "youtube media downloader",
    "youtube thumbnail HD"
  ],
  openGraph: {
    title: "YouTube Thumbnail Downloader - Download YouTube Thumbnails Online | Toolizio",
    description: "Download YouTube video thumbnails in high quality with our free online tool. Get thumbnails in various resolutions.",
    type: "website",
    url: "https://toolizio.com/youtube-thumbnail",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "YouTube Thumbnail Downloader - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Thumbnail Downloader - Download YouTube Thumbnails Online",
    description: "Download YouTube video thumbnails in high quality with our free online tool.",
  },
  alternates: {
    canonical: "https://toolizio.com/youtube-thumbnail",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
