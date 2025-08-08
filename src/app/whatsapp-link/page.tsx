"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { trackGeneration, trackCopy, trackEvent } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessageSquare, Copy, Check, Share2, Download } from "lucide-react";

// Phone number validation function
function isValidPhoneNumber(phone: string): boolean {
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, "");
  // Check if we have a valid number of digits (minimum 8, maximum 15)
  return digits.length >= 8 && digits.length <= 15;
}

// Format phone number - remove any non-digit characters
function formatPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

export default function WhatsAppLink() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const linkRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!phoneNumber.trim()) {
      setError("Please enter a phone number");
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number");
      return;
    }

    setError("");
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Create WhatsApp link using our own /wa path
    let whatsappLink = `/wa/${formattedPhone}`;
    
    // Add message if provided
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message);
      whatsappLink += `?text=${encodedMessage}`;
    }
    
    setGeneratedLink(whatsappLink);
    
    // Track the generation event
    trackGeneration("WhatsApp Link");
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Track the copy event
      trackCopy("WhatsApp Link");
    }
  };

  const handleShare = async () => {
    if (generatedLink && typeof window !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: "WhatsApp Link",
          text: "Here's my WhatsApp contact link:",
          url: generatedLink
        });
        trackEvent("share", "User Action", "Shared WhatsApp Link");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  const handleRedirect = () => {
    if (generatedLink) {
      trackEvent("redirect", "User Action", "Redirected to WhatsApp");
      window.open(generatedLink, "_blank");
    }
  };

  // Create a shortcut URL for displaying to user
  const displayShortUrl = generatedLink 
    ? `toolizio.com/wa/${formatPhoneNumber(phoneNumber)}` 
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            WhatsApp Link Generator
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 sm:mt-4">
            Create custom WhatsApp chat links with pre-filled messages
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8 mb-10">
          <div className="grid gap-6">
            <div>
              <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number (with country code)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">+</span>
                </div>
                <input
                  type="text"
                  id="phone-number"
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white py-3"
                  placeholder="1234567890 (no spaces or special chars)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Example: 5511987654321 (country code + number)
              </p>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message (optional)
              </label>
              <textarea
                id="message"
                rows={4}
                className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white py-3"
                placeholder="Type your pre-filled message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This message will be pre-filled when the chat opens
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={handleGenerate}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                Generate WhatsApp Link
              </button>
            </div>
          </div>

          {generatedLink && (
            <div 
              ref={linkRef}
              className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Your WhatsApp Link:
              </h3>
              
              <div className="flex items-center mb-4">
                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 flex-grow mr-2 overflow-x-auto">
                  <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {displayShortUrl}
                  </p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Copy className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={handleRedirect}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Open in WhatsApp
                </button>
                
                {typeof window !== 'undefined' && 'share' in navigator && (
                  <button
                    onClick={handleShare}
                    className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Link
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How to Use WhatsApp Link Generator
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                1. Enter Phone Number
              </h3>
              <p>
                Add the country code followed by the phone number without any spaces, dashes, or special characters.
                For example, for a US number: 12025550123.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                2. Add Optional Message
              </h3>
              <p>
                Type the message you want to be pre-filled when the WhatsApp chat opens. This is great for business inquiries or standard greetings.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                3. Generate and Share
              </h3>
              <p>
                Click the Generate button, and you'll get a direct WhatsApp chat link. Copy it, share it on your website, email signature, or social media profiles.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Benefits of WhatsApp Links
          </h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300 list-disc pl-5">
            <li>Instant communication with customers or friends</li>
            <li>Higher engagement rates compared to email or phone calls</li>
            <li>Pre-filled messages save time and provide context</li>
            <li>Perfect for business cards, email signatures, and social media profiles</li>
            <li>Simplified customer support through direct messaging</li>
            <li>No need for customers to save your number first</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
