import { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: "XML to JSON Converter - Convert XML Data to JSON Format Online",
  description: "Convert XML data to JSON format with clean and formatted preview. Free online tool to transform XML structures into JSON objects instantly.",
  keywords: [
    "xml to json",
    "xml converter",
    "json formatter",
    "xml parser",
    "xml to json converter",
    "free xml tools",
    "data conversion",
    "xml structure to json",
    "xml parsing"
  ],
  openGraph: {
    title: "XML to JSON Converter - Convert XML Data to JSON Format Online | Toolizio",
    description: "Convert XML data to JSON format with clean and formatted preview. Free online tool to transform XML structures into JSON objects.",
    type: "website",
    url: "https://toolizio.com/xml-to-json",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "XML to JSON Converter - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XML to JSON Converter - Convert XML Data to JSON Format Online",
    description: "Convert XML data to JSON format with clean and formatted preview. Free online tool.",
  },
  alternates: {
    canonical: "https://toolizio.com/xml-to-json",
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function XmlToJsonLayout({
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
            name: 'XML to JSON Converter',
            description: 'Free tool to convert XML data to JSON format with clean and formatted preview. Transform XML structures into JSON objects.',
            url: 'https://toolizio.com/xml-to-json',
            category: 'UtilityApplication',
            image: 'https://toolizio.com/logo.png',
            ratingValue: 4.5,
            ratingCount: 120,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'XML to JSON Converter',
            toolSlug: '/xml-to-json',
            categoryName: 'Converters',
            categorySlug: 'converters',
          }),
        }}
      />
      {children}
    </>
  );
}
