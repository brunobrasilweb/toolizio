import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch with Toolizio Team",
  description: "Get in touch with the Toolizio team. Send us your questions, feedback, suggestions, or feature requests. We'd love to hear from you and help improve our free online tools.",
  keywords: [
    "contact toolizio",
    "toolizio support",
    "feedback",
    "feature request",
    "customer support",
    "contact form",
    "get in touch",
    "help center",
    "support team",
    "tool suggestions"
  ],
  openGraph: {
    title: "Contact Us - Get in Touch with Toolizio Team | Toolizio",
    description: "Get in touch with the Toolizio team. Send us your questions, feedback, or suggestions.",
    type: "website",
    url: "https://toolizio.com/contact",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Contact Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - Get in Touch with Toolizio Team",
    description: "Get in touch with the Toolizio team. Send us your questions, feedback, or suggestions.",
  },
  alternates: {
    canonical: "https://toolizio.com/contact",
  },
};

export default function ContactLayout({
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
