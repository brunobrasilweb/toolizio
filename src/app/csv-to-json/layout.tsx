import { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: "CSV to JSON Converter - Convert CSV Files to JSON Format Online",
  description: "Convert CSV files to JSON format with preview and download option. Free online tool to transform CSV data into JSON arrays and objects instantly.",
  keywords: [
    "csv to json",
    "csv converter",
    "json formatter",
    "csv parser",
    "csv to json converter",
    "free csv tools",
    "json download",
    "data conversion",
    "csv array to json",
    "export csv to json"
  ],
  openGraph: {
    title: "CSV to JSON Converter - Convert CSV Files to JSON Format Online | Toolizio",
    description: "Convert CSV files to JSON format with preview and download option. Free online tool to transform CSV data into JSON arrays and objects.",
    type: "website",
    url: "https://toolizio.com/csv-to-json",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "CSV to JSON Converter - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV to JSON Converter - Convert CSV Files to JSON Format Online",
    description: "Convert CSV files to JSON format with preview and download option. Free online tool.",
  },
  alternates: {
    canonical: "https://toolizio.com/csv-to-json",
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function CsvToJsonLayout({
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
            name: 'CSV to JSON Converter',
            description: 'Free tool to convert CSV files to JSON format with preview and download option. Transform CSV data into JSON arrays and objects.',
            url: 'https://toolizio.com/csv-to-json',
            category: 'UtilityApplication',
            image: 'https://toolizio.com/logo.png',
            ratingValue: 4.6,
            ratingCount: 140,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'CSV to JSON Converter',
            toolSlug: '/csv-to-json',
            categoryName: 'Converters',
            categorySlug: 'converters',
          }),
        }}
      />
      {children}
    </>
  );
}
