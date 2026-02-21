import { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: "JSON to CSV Converter - Convert JSON Data to CSV Format Online",
  description: "Convert JSON data to CSV format with preview and download option. Free online tool to transform JSON arrays and objects into CSV files instantly.",
  keywords: [
    "json to csv",
    "json converter",
    "csv formatter",
    "json parser",
    "json to csv converter",
    "free json tools",
    "csv download",
    "data conversion",
    "json array to csv",
    "export json to csv"
  ],
  openGraph: {
    title: "JSON to CSV Converter - Convert JSON Data to CSV Format Online | Toolizio",
    description: "Convert JSON data to CSV format with preview and download option. Free online tool to transform JSON arrays and objects into CSV files.",
    type: "website",
    url: "https://toolizio.com/json-to-csv",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "JSON to CSV Converter - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to CSV Converter - Convert JSON Data to CSV Format Online",
    description: "Convert JSON data to CSV format with preview and download option. Free online tool.",
  },
  alternates: {
    canonical: "https://toolizio.com/json-to-csv",
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function JsonToCsvLayout({
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
            name: 'JSON to CSV Converter',
            description: 'Free tool to convert JSON data to CSV format with preview and download option. Transform JSON arrays and objects into CSV files.',
            url: 'https://toolizio.com/json-to-csv',
            category: 'UtilityApplication',
            image: 'https://toolizio.com/logo.png',
            ratingValue: 4.6,
            ratingCount: 150,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'JSON to CSV Converter',
            toolSlug: '/json-to-csv',
            categoryName: 'Converters',
            categorySlug: 'converters',
          }),
        }}
      />
      {children}
    </>
  );
}
