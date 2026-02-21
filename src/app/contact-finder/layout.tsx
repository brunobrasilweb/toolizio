import type { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: "Contact Finder - Find Email Addresses and Phone Numbers Online",
  description: "Find and extract email addresses and phone numbers from websites and text. Free online tool for contact information discovery and lead generation.",
  keywords: [
    "contact finder",
    "email finder",
    "phone finder",
    "contact extractor",
    "email extractor",
    "phone extractor",
    "lead generation",
    "contact discovery",
    "email scraper",
    "phone scraper"
  ],
  openGraph: {
    title: "Contact Finder - Find Email Addresses and Phone Numbers Online | Toolizio",
    description: "Find and extract email addresses and phone numbers from websites and text. Free online tool for contact information discovery.",
    type: "website",
    url: "https://toolizio.com/contact-finder",
    images: [
      {
        url: "/og-contact-finder.png",
        width: 1200,
        height: 630,
        alt: "Contact Finder - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Finder - Find Email Addresses and Phone Numbers Online",
    description: "Find and extract email addresses and phone numbers from websites and text.",
    images: ["/twitter-contact-finder.png"],
  },
  alternates: {
    canonical: "https://toolizio.com/contact-finder",
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

export default function ContactFinderLayout({
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
            name: 'Contact Finder',
            description: 'Free online tool to find and extract email addresses and phone numbers from websites and text for lead generation and contact discovery.',
            url: 'https://toolizio.com/contact-finder',
            category: 'WebApplication',
            image: 'https://toolizio.com/og-contact-finder.png',
            ratingValue: 4.7,
            ratingCount: 180,
          }),
        }}
      />

      {/* JSON-LD Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'Contact Finder',
            toolSlug: '/contact-finder',
            categoryName: 'Productivity',
            categorySlug: 'productivity',
          }),
        }}
      />

      {children}
    </>
  );
}