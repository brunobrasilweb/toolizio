"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";

export default function InstagramReels() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-full">
                <ToolIcons.instagram className="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Instagram Reels Downloader
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Download Instagram Reels videos in high quality for free
            </p>
          </div>

          {/* Coming Soon Message */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <ToolIcons.instagram className="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Tool Coming Soon
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We're developing the Instagram Reels Downloader tool. This tool will allow you to:
              </p>

              <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  Download Instagram Reels in HD quality
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  Save Reels to your device instantly
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  No watermarks or quality loss
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  Fast and secure downloads
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200"
                >
                  Back to Home
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200"
                >
                  Get Notified
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}