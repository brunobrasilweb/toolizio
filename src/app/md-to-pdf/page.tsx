"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { trackGeneration, trackCopy } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";
import { FileText, Download, Upload, Trash2 } from "lucide-react";

// Import markdown-it and html-pdf-node
import MarkdownIt from 'markdown-it';

export default function MarkdownToPdfConverter() {
  const [markdownText, setMarkdownText] = useState<string>("");
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/markdown' && !file.name.endsWith('.md')) {
        setError("Please select a valid Markdown (.md) file");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setMarkdownText(content);
        setError("");
      };
      reader.readAsText(file);
    }
  };

  const convertToPdf = async () => {
    if (!markdownText.trim()) {
      setError("Please enter some Markdown content or upload a file");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      // Convert Markdown to HTML
      const htmlContent = md.render(markdownText);
      
      // Create a complete HTML document with styling
      const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title></title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
              color: #333;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 24px;
              margin-bottom: 16px;
              font-weight: 600;
              line-height: 1.25;
            }
            h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 10px; }
            h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 8px; }
            h3 { font-size: 1.25em; }
            p { margin-bottom: 16px; }
            code {
              background-color: rgba(27,31,35,0.05);
              border-radius: 3px;
              font-size: 85%;
              margin: 0;
              padding: 0.2em 0.4em;
            }
            pre {
              background-color: #f6f8fa;
              border-radius: 6px;
              font-size: 85%;
              line-height: 1.45;
              overflow: auto;
              padding: 16px;
            }
            blockquote {
              border-left: 4px solid #dfe2e5;
              margin: 0;
              padding: 0 16px;
              color: #6a737d;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 16px;
            }
            table th, table td {
              border: 1px solid #dfe2e5;
              padding: 6px 13px;
            }
            table th {
              background-color: #f6f8fa;
              font-weight: 600;
            }
            ul, ol {
              margin-bottom: 16px;
              padding-left: 2em;
            }
            li {
              margin-bottom: 4px;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;

      // Use browser's print functionality to generate PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(fullHtml);
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for content to load before printing
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      } else {
        // Fallback: create downloadable HTML file
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'markdown-converted.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      trackGeneration("MD-to-PDF");
    } catch (err) {
      console.error("Conversion error:", err);
      setError("An error occurred during conversion. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleClear = () => {
    setMarkdownText("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopyHtml = async () => {
    if (!markdownText.trim()) return;
    
    try {
      const htmlContent = md.render(markdownText);
      await navigator.clipboard.writeText(htmlContent);
      trackCopy("MD-to-HTML");
    } catch (error) {
      console.error("Copy error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header showBackButton={true} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-violet-600 dark:text-violet-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Markdown to PDF
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Convert your Markdown files to PDF format with custom styling
          </p>
        </div>

        {/* Converter Tool */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
          {/* File Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Markdown File (Optional)
            </label>
            <div className="flex items-center space-x-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown,text/markdown"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-900 dark:file:text-violet-400"
              />
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                onClick={handleClear}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Markdown Input Area */}
          <div className="mb-6">
            <label htmlFor="markdown" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Markdown Content
            </label>
            <textarea
              id="markdown"
              rows={12}
              className="shadow-sm block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-violet-500 focus:border-violet-500 font-mono"
              placeholder={`# Your Markdown Content

## Example
This is a **bold** text and this is *italic*.

### Code Example
\`\`\`javascript
console.log("Hello, World!");
\`\`\`

- List item 1
- List item 2
- List item 3

> This is a blockquote

[Link to Google](https://google.com)`}
              value={markdownText}
              onChange={(e) => setMarkdownText(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex">
                <ToolIcons.warning className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              onClick={convertToPdf}
              disabled={isConverting || !markdownText.trim()}
            >
              {isConverting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Converting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Convert to PDF
                </>
              )}
            </button>
            
            <button
              type="button"
              className="inline-flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 w-full sm:w-auto"
              onClick={handleCopyHtml}
              disabled={!markdownText.trim()}
            >
              <ToolIcons.copy className="h-4 w-4 mr-2" />
              Copy as HTML
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 w-full sm:w-auto"
              onClick={handleClear}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </button>
          </div>

          {/* Preview Section */}
          {markdownText.trim() && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Preview
              </h3>
              <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-900 max-h-96 overflow-y-auto">
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: md.render(markdownText) }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Information Box */}
        <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ToolIcons.info className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-violet-800 dark:text-violet-200 mb-2">
                About Markdown to PDF Conversion
              </h3>
              <div className="text-violet-700 dark:text-violet-300 space-y-2">
                <p>
                  This tool converts Markdown text to PDF format while preserving formatting like headers, 
                  bold text, lists, code blocks, and links.
                </p>
                <p>
                  You can either type or paste Markdown content directly, or upload a .md file. 
                  The converter uses your browser's print functionality to generate the PDF.
                </p>
                <p>
                  <strong>Supported features:</strong> Headers, bold/italic text, lists, code blocks, 
                  blockquotes, tables, and links.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
