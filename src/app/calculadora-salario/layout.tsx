import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Salário Líquido - Toolizio",
  description: "Calcule seu salário líquido da CLT com desconto do INSS e IRRF. Ferramenta gratuita e precisa para saber quanto você recebe após os descontos.",
  keywords: "calculadora salário líquido, salário CLT, desconto INSS, desconto IRRF, salário líquido 2025",
  authors: [{ name: "Toolizio" }],
  robots: "index, follow",
  openGraph: {
    title: "Calculadora de Salário Líquido - Toolizio",
    description: "Calcule seu salário líquido da CLT com desconto do INSS e IRRF",
    type: "website",
    url: "https://toolizio.com/calculadora-salario",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
