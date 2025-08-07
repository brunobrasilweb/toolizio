import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Toolizio",
  description: "Get in touch with the Toolizio team. Send us your questions, feedback, or suggestions.",
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
