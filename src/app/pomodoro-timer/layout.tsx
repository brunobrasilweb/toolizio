import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pomodoro Timer - Boost Productivity with Time Management",
  description: "Track your tasks and boost productivity with our customizable Pomodoro timer. Create, save, and analyze your progress with beautiful charts. Free online productivity tool for better focus.",
  keywords: [
    "pomodoro timer",
    "productivity timer",
    "time management",
    "focus timer",
    "pomodoro technique",
    "work timer",
    "productivity tool",
    "task tracker",
    "time tracking",
    "concentration timer"
  ],
  openGraph: {
    title: "Pomodoro Timer - Boost Productivity with Time Management | Toolizio",
    description: "Track your tasks and boost productivity with our customizable Pomodoro timer. Create, save, and analyze your progress.",
    type: "website",
    url: "https://toolizio.com/pomodoro-timer",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Pomodoro Timer - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomodoro Timer - Boost Productivity with Time Management",
    description: "Track your tasks and boost productivity with our customizable Pomodoro timer.",
  },
  alternates: {
    canonical: "https://toolizio.com/pomodoro-timer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
