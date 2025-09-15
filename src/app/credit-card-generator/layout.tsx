import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credit Card Generator - Generate Test Card Numbers (Luhn) | Toolizio",
  description: "Generate valid credit card numbers for testing, supporting Visa, MasterCard, Amex and more. Uses the Luhn (mod10) algorithm to ensure numbers are valid for testing and QA.",
  keywords: [
    "credit card generator",
    "card number generator",
    "luhn",
    "mod10",
    "test credit card",
    "visa generator",
    "mastercard generator",
    "amex generator"
  ],
  openGraph: {
    title: "Credit Card Generator - Toolizio",
    description: "Generate valid credit card numbers for testing using the Luhn (mod10) algorithm.",
    type: "website",
    url: "https://toolizio.com/credit-card-generator",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Credit Card Generator - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Credit Card Generator - Generate Test Card Numbers",
    description: "Generate valid credit card numbers for testing using the Luhn (mod10) algorithm.",
  },
  alternates: {
    canonical: "https://toolizio.com/credit-card-generator",
  },
};

export default function CreditCardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
