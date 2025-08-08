import { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "CSV to JSON Converter - Toolizio",
  description: "Convert CSV to JSON format with a preview and download option. Free online tool.",
  keywords: "csv to json, csv converter, json formatter, csv parser, csv to json converter, free csv tools, json download",
};

export default function CsvToJsonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
