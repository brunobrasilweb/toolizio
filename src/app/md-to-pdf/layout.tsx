import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown to PDF Converter - Convert MD Files to PDF Online",
  description: "Convert Markdown files to PDF format with beautiful styling and formatting. Free online Markdown to PDF conversion tool with syntax highlighting and custom themes.",
  keywords: [
    "markdown to PDF",
    "MD to PDF",
    "markdown converter",
    "convert markdown",
    "markdown PDF generator",
    "MD converter",
    "online markdown tool",
    "markdown document",
    "PDF from markdown",
    "free markdown converter"
  ],
  openGraph: {
    title: "Markdown to PDF Converter - Convert MD Files to PDF Online | Toolizio",
    description: "Convert Markdown files to PDF format with beautiful styling and formatting. Free online tool with syntax highlighting.",
    type: "website",
    url: "https://toolizio.com/md-to-pdf",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Markdown to PDF Converter - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown to PDF Converter - Convert MD Files to PDF Online",
    description: "Convert Markdown files to PDF format with beautiful styling and formatting.",
  },
  alternates: {
    canonical: "https://toolizio.com/md-to-pdf",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
