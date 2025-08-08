import { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "XML to JSON Converter - Toolizio",
  description: "Convert XML to JSON format with a clean and formatted preview. Free online tool.",
  keywords: "xml to json, xml converter, json formatter, xml parser, xml to json converter, free xml tools",
};

export default function XmlToJsonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
