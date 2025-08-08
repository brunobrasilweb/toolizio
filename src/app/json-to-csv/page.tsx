"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Code, Copy, FileJson, Download, Table, Settings } from "lucide-react";
import { trackPageView, trackToolUsage, trackCopy } from "@/utils/analytics";

export default function JsonToCsvPage() {
  const [json, setJson] = useState("");
  const [csv, setCsv] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [delimiter, setDelimiter] = useState(",");
  const [includeHeader, setIncludeHeader] = useState(true);
  const [filename, setFilename] = useState("data.csv");

  useEffect(() => {
    // Track page view
    trackPageView(window.location.href);
  }, []);

  const convertJsonToCsv = () => {
    if (!json.trim()) {
      setError("Please enter JSON data");
      setCsv("");
      return;
    }

    try {
      // Parse JSON
      let jsonData = JSON.parse(json);
      
      // Validate JSON format - it should be an array of objects
      if (!Array.isArray(jsonData)) {
        if (typeof jsonData === 'object' && jsonData !== null) {
          // If it's a single object, wrap it in an array
          jsonData = [jsonData];
        } else {
          throw new Error("JSON data must be an array of objects or a single object");
        }
      }
      
      if (jsonData.length === 0) {
        setCsv("");
        setError("JSON array is empty");
        return;
      }

      // Get all unique keys from all objects
      const allKeys = new Set<string>();
      jsonData.forEach((item: any) => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach((key: string) => allKeys.add(key));
        }
      });
      
      // Convert Set to Array
      const headers = Array.from(allKeys);
      
      // Generate CSV
      let csvContent = "";
      
      // Add headers if option is selected
      if (includeHeader) {
        csvContent += headers.map((key: string) => {
          // Escape quotes in header names
          const escaped = String(key).replace(/"/g, '""');
          // Quote the value if it contains delimiter, quotes, or newlines
          return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
        }).join(delimiter) + "\\n";
      }
      
      // Add data rows
      jsonData.forEach((item: any) => {
        const row = headers.map((key: string) => {
          let value = (item && typeof item === 'object') ? item[key] : '';
          
          // Handle different types of values
          if (value === null || value === undefined) {
            value = '';
          } else if (typeof value === 'object') {
            value = JSON.stringify(value);
          } else {
            value = String(value);
          }
          
          // Escape quotes
          const escaped = value.replace(/"/g, '""');
          // Quote the value if it contains delimiter, quotes, or newlines
          return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
        }).join(delimiter);
        
        csvContent += row + "\\n";
      });
      
      setCsv(csvContent);
      setError("");
      
      // Track successful conversion
      trackToolUsage("json_to_csv", "convert");
    } catch (err: any) {
      setError(err.message || "Failed to convert JSON to CSV");
      setCsv("");
      
      // Track error
      trackToolUsage("json_to_csv", "convert_error");
    }
  };

  const handleCopy = () => {
    if (!csv) return;
    
    navigator.clipboard.writeText(csv);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    
    // Track copy action
    trackCopy("CSV");
  };

  const handleDownload = () => {
    if (!csv) return;
    
    // Create a Blob with the CSV content
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    
    // Append the anchor to the body
    document.body.appendChild(link);
    
    // Trigger a click on the anchor
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    // Track download action
    trackToolUsage("json_to_csv", "download");
  };

  const handleClear = () => {
    setJson("");
    setCsv("");
    setError("");
    
    // Track clear action
    trackToolUsage("json_to_csv", "clear");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            JSON to CSV Converter
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Convert JSON data to CSV format with a preview and download option
          </p>
        </div>

        {/* Options Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Conversion Options
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="delimiter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Delimiter
              </label>
              <select
                id="delimiter"
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 dark:text-gray-100"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="\t">Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>
            <div>
              <label htmlFor="filename" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filename
              </label>
              <input
                type="text"
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 dark:text-gray-100"
                placeholder="data.csv"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeHeader"
                checked={includeHeader}
                onChange={(e) => setIncludeHeader(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="includeHeader" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Include column headers
              </label>
            </div>
          </div>
        </div>

        {/* Converter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <FileJson className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                JSON Input
              </h2>
            </div>
            <textarea
              className="w-full h-80 p-4 text-sm font-mono bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 dark:text-gray-100"
              placeholder="Paste your JSON array here..."
              value={json}
              onChange={(e) => setJson(e.target.value)}
            ></textarea>
          </div>

          {/* Output Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Table className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  CSV Output
                </h2>
              </div>
              {csv && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              )}
            </div>
            <pre
              className="w-full h-80 p-4 text-sm font-mono bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg overflow-auto dark:text-gray-100"
            >
              {error ? (
                <span className="text-red-500">{error}</span>
              ) : csv ? (
                csv
              ) : (
                <span className="text-gray-400 dark:text-gray-500">
                  CSV will appear here...
                </span>
              )}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button
            onClick={convertJsonToCsv}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors duration-300"
          >
            <Code className="h-5 w-5" />
            Convert JSON to CSV
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-300"
          >
            Clear All
          </button>
        </div>

        {/* Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            About JSON to CSV Conversion
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              This tool converts JSON data into CSV (Comma-Separated Values) format, which is commonly used 
              for spreadsheet applications and data interchange. The converter extracts data from JSON arrays 
              and structures it into a tabular format.
            </p>
            <h3>Features:</h3>
            <ul>
              <li>Converts JSON arrays of objects to CSV format</li>
              <li>Handles nested objects and arrays</li>
              <li>Customizable delimiter options (comma, semicolon, tab, pipe)</li>
              <li>Option to include or exclude column headers</li>
              <li>Download functionality for saving the CSV file</li>
              <li>Custom filename option for downloads</li>
            </ul>
            <h3>How to use:</h3>
            <ol>
              <li>Paste your JSON data (array of objects) into the input field</li>
              <li>Configure your options (delimiter, headers, filename)</li>
              <li>Click the "Convert JSON to CSV" button</li>
              <li>View the formatted CSV output</li>
              <li>Copy the result or download it as a CSV file</li>
            </ol>
            <h3>Example JSON input:</h3>
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto">
{`[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
]`}
            </pre>
            <p>
              This conversion is done entirely in your browser, so your data never leaves your computer, 
              ensuring privacy and security.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
