import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HTML to PDF Converter - Toolizio',
  description: 'Convert HTML files to PDF format with custom styling. Free online HTML to PDF conversion tool.',
  keywords: ['HTML to PDF', 'HTML converter', 'PDF generator', 'HTML to PDF online', 'convert HTML to PDF'],
  openGraph: {
    title: 'HTML to PDF Converter - Toolizio',
    description: 'Convert HTML files to PDF format with custom styling. Free online HTML to PDF conversion tool.',
    type: 'website',
  },
}

export default function HtmlToPdfLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
