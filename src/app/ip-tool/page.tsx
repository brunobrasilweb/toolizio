"use client";

import { useEffect, useState } from "react";
import { trackCopy, trackToolUsage } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Copy, Globe } from "lucide-react";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export default function IpToolPage() {
  const [ip, setIp] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        setIp(data.ip);
        trackToolUsage("IP Tool", "view");
      });
  }, []);

  const handleCopy = () => {
    if (ip) {
      navigator.clipboard.writeText(ip);
      setCopied(true);
      trackCopy("IP Address");
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900">
              <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What is My IP Address?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Instantly find your public IP address. Useful for network diagnostics, security, and more.
          </p>
        </section>

        {/* IP Display Section */}
        <section className="flex flex-col items-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg px-8 py-8 flex flex-col items-center w-full max-w-md">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-blue-700 dark:text-blue-400 mb-4 select-all break-all">
              {ip || "Loading..."}
            </span>
            <button
              onClick={handleCopy}
              disabled={!ip}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
            >
              <Copy className="w-5 h-5" />
              {copied ? "Copied!" : "Copy IP"}
            </button>
          </div>
        </section>

        {/* Info Section */}
        <section className="text-center text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto">
          <p>Your IP address is public and visible to websites you visit. For privacy, consider using a VPN.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
