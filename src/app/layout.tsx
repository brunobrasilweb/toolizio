import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Toolizio - Free Online Tools | CPF, CNPJ, Password Generator & More",
    template: "%s | Toolizio - Free Online Tools"
  },
  description: "Access 20+ free online tools: CPF/CNPJ generator, secure passwords, Base64 converter, QR Code, salary calculator, Pomodoro timer and much more. Fast and secure!",
  keywords: [
    "online tools",
    "cpf generator",
    "cnpj generator", 
    "password generator",
    "base64 converter",
    "qr code generator",
    "salary calculator",
    "pomodoro timer",
    "jwt decoder",
    "hash generator",
    "free tools",
    "developer tools",
    "online utilities"
  ],
  authors: [{ name: "Toolizio Team" }],
  creator: "Toolizio",
  publisher: "Toolizio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://toolizio.com",
    siteName: "Toolizio",
    title: "Toolizio - Free Online Tools",
    description: "20+ useful tools for developers and users. CPF/CNPJ generator, passwords, converters and much more!",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Toolizio - Free Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toolizio - Free Online Tools",
    description: "20+ useful tools for developers and users. CPF/CNPJ generator, passwords, converters and much more!",
    images: ["/logo.png"],
    creator: "@toolizio",
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
  alternates: {
    canonical: "https://toolizio.com",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Recupera o tema preferido do localStorage
                const theme = localStorage.getItem('theme');
                // Verifica se o usuário prefere o tema escuro no sistema
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                
                // Aplica o tema dark se o usuário escolheu dark ou se prefere dark no sistema
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                console.error('Error applying theme:', e);
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <Suspense fallback={null}>
              <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
            </Suspense>
          )}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
