import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - How We Protect Your Data | Toolizio",
  description: "Read our comprehensive privacy policy to understand how Toolizio handles your data, protects your privacy, and ensures security when using our free online tools.",
  keywords: [
    "privacy policy",
    "data protection",
    "user privacy",
    "data security",
    "GDPR compliance",
    "privacy rights",
    "data handling",
    "security policy",
    "user data",
    "privacy terms"
  ],
  openGraph: {
    title: "Privacy Policy - How We Protect Your Data | Toolizio",
    description: "Read our comprehensive privacy policy to understand how Toolizio protects your privacy and ensures security.",
    type: "website",
    url: "https://toolizio.com/privacy-policy",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Privacy Policy - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - How We Protect Your Data",
    description: "Read our privacy policy to understand how we protect your data and privacy.",
  },
  alternates: {
    canonical: "https://toolizio.com/privacy-policy",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
