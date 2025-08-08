import { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "JSON to CSV Converter - Toolizio",
  description: "Convert JSON to CSV format with a preview and download option. Free online tool.",
  keywords: "json to csv, json converter, csv formatter, json parser, json to csv converter, free json tools, csv download",
};

export default function JsonToCsvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
