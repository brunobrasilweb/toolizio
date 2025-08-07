import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Backlink Maker - Free Backlink Generator | Toolizio',
  description: 'Generate quality backlinks for your website automatically. Free tool to create backlinks and improve your website SEO.',
  keywords: 'backlinks, backlink generator, SEO, link building, optimization, digital marketing',
  openGraph: {
    title: 'Backlink Maker - Free Backlink Generator',
    description: 'Generate quality backlinks for your website automatically. Free tool to create backlinks and improve your website SEO.',
    type: 'website',
  },
};

export default function BacklinkMakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
