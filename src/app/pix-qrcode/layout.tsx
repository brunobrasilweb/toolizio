import type { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: "Gerador de QR Code PIX | Toolizio",
  description: "Gere QR Codes para pagamentos via PIX facilmente e gratuitamente. Uma ferramenta simples para criar códigos PIX estáticos.",
  keywords: ["pix", "qr code", "pagamento", "qr code pix", "gerador pix", "pix copia e cola", "banco central"],
  openGraph: {
    title: "Gerador de QR Code PIX | Toolizio",
    description: "Gere QR Codes para pagamentos via PIX facilmente e gratuitamente",
    type: "website",
    url: "https://toolizio.com/pix-qrcode",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gerador de QR Code PIX",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gerador de QR Code PIX | Toolizio',
    description: 'Gere QR Codes para pagamentos via PIX facilmente e gratuitamente',
  },
  alternates: {
    canonical: 'https://toolizio.com/pix-qrcode',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateToolStructuredData({
            name: 'Gerador de QR Code PIX',
            description: 'Gere QR Codes para pagamentos via PIX facilmente e gratuitamente. Uma ferramenta simples para criar códigos PIX estáticos.',
            url: 'https://toolizio.com/pix-qrcode',
            category: 'WebApplication',
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'Gerador de QR Code PIX',
            toolSlug: '/pix-qrcode',
            categoryName: 'Payment Tools',
            categorySlug: 'payment-tools',
          })),
        }}
      />
      {children}
    </>
  );
}
