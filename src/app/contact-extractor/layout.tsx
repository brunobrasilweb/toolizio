import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Extractor - Extract Emails and Phones from a Website',
  description: 'Crawl a website (up to 50 internal links) and extract emails and phone numbers. Choose phone format by country and download results.',
  keywords: ['contact extractor','email extractor','phone extractor','crawl','website scraping','contacts','lead generation'],
  openGraph: {
    title: 'Contact Extractor - Toolizio',
    description: 'Crawl a website (up to 50 internal links) and extract emails and phone numbers. Choose phone format by country and download results.',
    url: 'https://toolizio.com/contact-extractor',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'Contact Extractor' }],
  },
  alternates: {
    canonical: 'https://toolizio.com/contact-extractor',
  },
};

export default function ContactExtractorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
