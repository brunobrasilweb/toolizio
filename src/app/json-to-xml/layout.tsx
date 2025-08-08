import { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "JSON to XML Converter - Toolizio",
  description: "Convert JSON to XML format with a clean and formatted preview. Free online tool.",
  keywords: "json to xml, json converter, xml formatter, json parser, json to xml converter, free json tools",
};

export default function JsonToXmlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
