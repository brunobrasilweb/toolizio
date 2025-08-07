"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { trackGeneration, trackCopy, trackEvent } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";

// URL validation function
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    // If URL constructor fails, try with http:// prefix
    try {
      new URL(`http://${url}`);
      return true;
    } catch {
      return false;
    }
  }
}

// Format URL to include protocol if missing
function formatUrl(url: string): string {
  try {
    new URL(url);
    return url;
  } catch {
    return `https://${url}`;
  }
}

export default function QRCodeGenerator() {
  const [inputUrl, setInputUrl] = useState<string>("");
  const [qrValue, setQrValue] = useState<string>("");
  const [qrSize, setQrSize] = useState<number>(200);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const qrRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!inputUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!isValidUrl(inputUrl.trim())) {
      setError("Please enter a valid URL");
      return;
    }

    const formattedUrl = formatUrl(inputUrl.trim());
    setQrValue(formattedUrl);
    setError("");
    setCopied(false);
    trackGeneration("QRCode-URL");
  };

  const handleCopy = async () => {
    if (qrValue) {
      try {
        await navigator.clipboard.writeText(qrValue);
        setCopied(true);
        trackCopy("QRCode-URL");
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Copy error:", error);
      }
    }
  };

  const handleDownload = async () => {
    if (!qrValue || !qrRef.current) return;

    try {
      const svg = qrRef.current.querySelector('svg');
      if (!svg) return;

      // Convert SVG to PNG
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      canvas.width = qrSize;
      canvas.height = qrSize;
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, qrSize, qrSize);
          ctx.drawImage(img, 0, 0, qrSize, qrSize);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `qrcode-${Date.now()}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }
          }, 'image/png');
        }
        URL.revokeObjectURL(svgUrl);
      };
      
      img.src = svgUrl;
      trackEvent("QRCode-Download", "Download", "PNG");
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleClear = () => {
    setInputUrl("");
    setQrValue("");
    setError("");
    setCopied(false);
  };

  const handleSizeChange = (newSize: number) => {
    setQrSize(newSize);
    // QR code will automatically update due to state change
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            ← Back to Tools
          </Link>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-6">
            <ToolIcons.qrcode className="h-8 w-8 text-slate-600 dark:text-slate-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            QR Code Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Generate QR codes for URLs and links instantly. Perfect for sharing links in print or presentations.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700">
          {/* Input Section */}
          <div className="mb-8">
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter URL or Link
            </label>
            <div className="flex gap-4 mb-4">
              <input
                id="url-input"
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://example.com or just example.com"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              />
              <button
                onClick={handleGenerate}
                disabled={!inputUrl.trim()}
                className="px-6 py-3 bg-slate-600 hover:bg-slate-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                Generate
              </button>
            </div>

            {/* Size Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                QR Code Size
              </label>
              <div className="flex gap-2">
                {[150, 200, 250, 300].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      qrSize === size
                        ? 'bg-slate-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          {qrValue && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Generated QR Code
              </h3>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* QR Code Display */}
                <div className="flex-1">
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 inline-block">
                    <div ref={qrRef}>
                      <QRCodeSVG 
                        value={qrValue}
                        size={qrSize}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="M"
                        includeMargin={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Info and Actions */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">URL:</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg break-all text-sm">
                      {qrValue}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Size:</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {qrSize} × {qrSize} pixels
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleCopy}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {copied ? "✓ Copied!" : "Copy URL"}
                    </button>
                    
                    <button
                      onClick={handleDownload}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Download PNG
                    </button>
                    
                    <button
                      onClick={handleClear}
                      className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              How to Use
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  📱 Supported Formats
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Full URLs: https://example.com</li>
                  <li>• Simple domains: example.com</li>
                  <li>• Subdomains: blog.example.com</li>
                  <li>• URLs with paths: example.com/page</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  ✨ Features
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Automatic protocol detection</li>
                  <li>• Multiple size options</li>
                  <li>• Download as PNG image</li>
                  <li>• High-quality output</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            About QR Codes
          </h3>
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            QR codes (Quick Response codes) are two-dimensional barcodes that can store various types of information. 
            They're widely used for sharing URLs, contact information, WiFi credentials, and more. 
            QR codes can be scanned by smartphones and dedicated QR code readers to quickly access the encoded information.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
