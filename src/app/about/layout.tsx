import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Toolizio",
  description: "Learn about Toolizio and our mission to provide free and useful online tools.",
};

export default function AboutLayout({
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
