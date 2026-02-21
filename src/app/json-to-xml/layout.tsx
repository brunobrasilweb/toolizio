import { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: "JSON to XML Converter - Convert JSON Data to XML Format Online",
  description: "Convert JSON data to XML format with clean and structured formatting. Free online tool to transform JSON objects into XML documents instantly.",
  keywords: [
    "json to xml",
    "json converter",
    "xml formatter",
    "json parser",
    "json to xml converter",
    "free json tools",
    "data conversion",
    "json object to xml",
    "xml generation"
  ],
  openGraph: {
    title: "JSON to XML Converter - Convert JSON Data to XML Format Online | Toolizio",
    description: "Convert JSON data to XML format with clean and structured formatting. Free online tool to transform JSON objects into XML documents.",
    type: "website",
    url: "https://toolizio.com/json-to-xml",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "JSON to XML Converter - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to XML Converter - Convert JSON Data to XML Format Online",
    description: "Convert JSON data to XML format with clean and structured formatting. Free online tool.",
  },
  alternates: {
    canonical: "https://toolizio.com/json-to-xml",
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function JsonToXmlLayout({
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
            name: 'JSON to XML Converter',
            description: 'Free tool to convert JSON data to XML format with clean and structured formatting. Transform JSON objects into XML documents.',
            url: 'https://toolizio.com/json-to-xml',
            category: 'UtilityApplication',
            image: 'https://toolizio.com/logo.png',
            ratingValue: 4.5,
            ratingCount: 110,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'JSON to XML Converter',
            toolSlug: '/json-to-xml',
            categoryName: 'Converters',
            categorySlug: 'converters',
          }),
        }}
      />
      {children}
    </>
  );
}
