import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeContent from "./HomeContent";
import categories from '@/data/categories';

export const metadata: Metadata = {
  title: "Toolizio - 20+ Free Online Tools for Developers & Productivity",
  description: "Access a collection of free online tools: CPF/CNPJ generator, password generator, Base64 converter, QR Code, Salary Calculator, Pomodoro timer and more. Fast, secure and no registration required!",
  keywords: [
    "online tools", "cpf generator", "cnpj generator", "password generator", 
    "base64 converter", "qr code generator", "salary calculator", 
    "pomodoro timer", "jwt decoder", "hash generator", "free tools", 
    "developer tools", "online utilities", "toolizio"
  ],
  alternates: {
    canonical: "https://toolizio.com",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Toolizio",
            "description": "Free online tools and utilities for developers, designers, and professionals",
            "url": "https://toolizio.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://toolizio.com/?q={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Toolizio",
              "url": "https://toolizio.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://toolizio.com/logo.png"
              }
            },
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "Toolizio",
              "applicationCategory": "WebApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "operatingSystem": "Any",
              "permissions": "https://toolizio.com/privacy-policy"
            }
          })
        }}
      />
      
      <Header />
      <HomeContent categories={categories} />
      <Footer />
    </div>
  );
}
