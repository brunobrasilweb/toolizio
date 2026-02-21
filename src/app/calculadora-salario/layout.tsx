import { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from '@/utils/seo'

export const metadata: Metadata = {
  title: "Calculadora de Salário Líquido - Toolizio",
  description: "Calcule seu salário líquido da CLT com desconto do INSS e IRRF. Ferramenta gratuita e precisa para saber quanto você recebe após os descontos.",
  keywords: "calculadora salário líquido, salário CLT, desconto INSS, desconto IRRF, salário líquido 2025",
  authors: [{ name: "Toolizio" }],
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
  openGraph: {
    title: "Calculadora de Salário Líquido - Toolizio",
    description: "Calcule seu salário líquido da CLT com desconto do INSS e IRRF",
    type: "website",
    url: "https://toolizio.com/calculadora-salario",
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Calculadora de Salário Líquido - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de Salário Líquido - Toolizio',
    description: 'Calcule seu salário líquido da CLT com desconto do INSS e IRRF',
  },
  alternates: {
    canonical: 'https://toolizio.com/calculadora-salario',
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateToolStructuredData({
            name: 'Calculadora de Salário Líquido',
            description: 'Calcule seu salário líquido da CLT com desconto do INSS e IRRF. Ferramenta gratuita e precisa para saber quanto você recebe após os descontos.',
            url: 'https://toolizio.com/calculadora-salario',
            category: 'WebApplication',
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData({
            toolName: 'Calculadora de Salário Líquido',
            toolSlug: '/calculadora-salario',
            categoryName: 'Calculators',
            categorySlug: 'calculators',
          })),
        }}
      />
      {children}
    </>
  );
}
