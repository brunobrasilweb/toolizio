import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Image Downloader - Download Instagram Photos Online",
  description: "Download Instagram images and photos easily with our free online tool. Save Instagram pictures in high quality without watermarks. Fast and secure Instagram photo downloader.",
  keywords: [
    "instagram image downloader",
    "download instagram photos",
    "instagram photo saver",
    "save instagram images",
    "instagram downloader",
    "instagram picture download",
    "free instagram downloader",
    "instagram media downloader",
    "download instagram content",
    "instagram tool"
  ],
  openGraph: {
    title: "Instagram Image Downloader - Download Instagram Photos Online | Toolizio",
    description: "Download Instagram images and photos easily with our free online tool. Save Instagram pictures in high quality.",
    type: "website",
    url: "https://toolizio.com/instagram-image",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Instagram Image Downloader - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Image Downloader - Download Instagram Photos Online",
    description: "Download Instagram images and photos easily with our free online tool.",
  },
  alternates: {
    canonical: "https://toolizio.com/instagram-image",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
