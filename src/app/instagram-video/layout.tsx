import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Video Downloader - Download Instagram Reels & Posts | Toolizio",
  description: "Download Instagram videos and reels quickly and anonymously. Paste the post URL to preview and download MP4 files.",
  keywords: [
    "instagram video downloader",
    "download instagram video",
    "instagram reel downloader",
    "download instagram reels",
    "instagram downloader",
    "instagram video save",
    "download instagram mp4"
  ],
  openGraph: {
    title: "Instagram Video Downloader - Toolizio",
    description: "Download Instagram videos and reels quickly and anonymously.",
    type: "website",
    url: "https://toolizio.com/instagram-video",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Instagram Video Downloader - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Video Downloader - Toolizio",
    description: "Download Instagram videos and reels quickly and anonymously.",
  },
  alternates: {
    canonical: "https://toolizio.com/instagram-video",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
