"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { trackGeneration, trackCopy } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";
import { FileText, Download, Upload, Trash2, Code } from "lucide-react";

export default function HtmlToPdfConverter() {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/html' && !file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
        setError("Please select a valid HTML (.html or .htm) file");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setHtmlContent(content);
        setError("");
      };
      reader.readAsText(file);
    }
  };

  const convertToPdf = async () => {
    if (!htmlContent.trim()) {
      setError("Please enter some HTML content or upload a file");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      // Sanitize and prepare HTML content
      let processedHtml = htmlContent.trim();
      
      // If the content doesn't start with DOCTYPE or html tag, wrap it in a complete HTML document
      if (!processedHtml.toLowerCase().includes('<!doctype') && !processedHtml.toLowerCase().includes('<html')) {
        processedHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Converted Document</title>
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
              img {
                max-width: 100%;
                height: auto;
              }
              @media print {
                body {
                  padding: 20px;
                }
              }
            </style>
          </head>
          <body>
            ${processedHtml}
          </body>
          </html>
        `;
      }

      // Use browser's print functionality to generate PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(processedHtml);
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for content to load before printing
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      } else {
        // Fallback: create downloadable HTML file
        const blob = new Blob([processedHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'html-converted.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      trackGeneration("HTML-to-PDF");
    } catch (err) {
      console.error("Conversion error:", err);
      setError("An error occurred during conversion. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleClear = () => {
    setHtmlContent("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopyContent = async () => {
    if (!htmlContent.trim()) return;
    
    try {
      await navigator.clipboard.writeText(htmlContent);
      trackCopy("HTML-content");
    } catch (error) {
      console.error("Copy error:", error);
    }
  };

  const formatHtml = () => {
    if (!htmlContent.trim()) return;

    try {
      // Simple HTML formatting - adding line breaks and indentation
      let formatted = htmlContent
        .replace(/></g, '>\n<')
        .replace(/^\s+|\s+$/g, '');
      
      // Add basic indentation
      const lines = formatted.split('\n');
      let indentLevel = 0;
      const indentSize = 2;
      
      const formattedLines = lines.map(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return '';
        
        // Decrease indent for closing tags
        if (trimmedLine.startsWith('</')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        const indentedLine = ' '.repeat(indentLevel * indentSize) + trimmedLine;
        
        // Increase indent for opening tags (but not self-closing tags)
        if (trimmedLine.startsWith('<') && !trimmedLine.startsWith('</') && !trimmedLine.endsWith('/>')) {
          indentLevel++;
        }
        
        return indentedLine;
      });
      
      setHtmlContent(formattedLines.join('\n'));
    } catch (error) {
      console.error("Formatting error:", error);
      setError("An error occurred while formatting the HTML.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header showBackButton={true} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            HTML to PDF
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Convert your HTML files to PDF format with preserved styling
          </p>
        </div>

        {/* Converter Tool */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
          {/* File Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload HTML File (Optional)
            </label>
            <div className="flex items-center space-x-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.htm,text/html"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-400"
              />
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleClear}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* HTML Input Area */}
          <div className="mb-6">
            <label htmlFor="html" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              HTML Content
            </label>
            <textarea
              id="html"
              rows={12}
              className="shadow-sm block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 font-mono"
              placeholder={`<!DOCTYPE html>
<html>
<head>
    <title>Your Document</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>This is a <strong>sample</strong> HTML document.</p>
    
    <h2>Features</h2>
    <ul>
        <li>Headers and paragraphs</li>
        <li>Bold and italic text</li>
        <li>Lists and tables</li>
        <li>Images and links</li>
    </ul>
    
    <table>
        <tr>
            <th>Name</th>
            <th>Value</th>
        </tr>
        <tr>
            <td>Example</td>
            <td>Data</td>
        </tr>
    </table>
</body>
</html>`}
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
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
              className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              onClick={convertToPdf}
              disabled={isConverting || !htmlContent.trim()}
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
              className="inline-flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
              onClick={formatHtml}
              disabled={!htmlContent.trim()}
            >
              <Code className="h-4 w-4 mr-2" />
              Format HTML
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
              onClick={handleCopyContent}
              disabled={!htmlContent.trim()}
            >
              <ToolIcons.copy className="h-4 w-4 mr-2" />
              Copy HTML
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
              onClick={handleClear}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </button>
          </div>

          {/* Preview Section */}
          {htmlContent.trim() && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Preview
              </h3>
              <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-900 max-h-96 overflow-y-auto">
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ToolIcons.info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                About HTML to PDF Conversion
              </h3>
              <div className="text-blue-700 dark:text-blue-300 space-y-2">
                <p>
                  This tool converts HTML content to PDF format while preserving styling, layout, 
                  and formatting including CSS styles, images, and complex structures.
                </p>
                <p>
                  You can either type or paste HTML content directly, or upload an .html file. 
                  The converter uses your browser's print functionality to generate the PDF.
                </p>
                <p>
                  <strong>Supported features:</strong> All HTML elements, CSS styles, images, 
                  tables, forms, and responsive layouts.
                </p>
                <p>
                  <strong>Note:</strong> External resources (images, fonts, CSS) should use absolute URLs 
                  or be embedded inline for best results.
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
