"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Code, Copy, FileJson, Download, Table, Settings, Upload } from "lucide-react";
import { trackPageView, trackToolUsage, trackCopy } from "@/utils/analytics";

export default function CsvToJsonPage() {
  const [csv, setCsv] = useState("");
  const [json, setJson] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [delimiter, setDelimiter] = useState(",");
  const [firstRowAsHeader, setFirstRowAsHeader] = useState(true);
  const [filename, setFilename] = useState("data.json");
  const [indentation, setIndentation] = useState(2);

  useEffect(() => {
    // Track page view
    trackPageView(window.location.href);
  }, []);

  const parseCSV = (text: string, delimiter: string): string[][] => {
    // Handle special case of tab delimiter
    const actualDelimiter = delimiter === "\\t" ? "\t" : delimiter;
    
    // Split the text into lines
    const lines = text.split(/\r?\n/);
    
    // Remove empty lines
    const nonEmptyLines = lines.filter((line: string) => line.trim() !== "");
    
    if (nonEmptyLines.length === 0) {
      throw new Error("CSV is empty");
    }
    
    // Parse each line using the provided delimiter
    const rows = nonEmptyLines.map((line: string) => {
      // Handle quoted values with delimiters inside them
      const result: string[] = [];
      let currentValue = "";
      let insideQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          if (insideQuotes && i + 1 < line.length && line[i + 1] === '"') {
            // Handle escaped quotes (two consecutive quotes inside quoted value)
            currentValue += '"';
            i++; // Skip the next quote
          } else {
            // Toggle quote state
            insideQuotes = !insideQuotes;
          }
        } else if (char === actualDelimiter && !insideQuotes) {
          // Found a delimiter outside quotes, add the value to result
          result.push(currentValue);
          currentValue = "";
        } else {
          // Add character to current value
          currentValue += char;
        }
      }
      
      // Add the last value
      result.push(currentValue);
      
      return result;
    });
    
    return rows;
  };

  const convertCsvToJson = () => {
    if (!csv.trim()) {
      setError("Please enter CSV data");
      setJson("");
      return;
    }

    try {
      // Parse CSV to arrays
      const rows = parseCSV(csv, delimiter);
      
      if (rows.length === 0) {
        setError("CSV contains no data");
        setJson("");
        return;
      }
      
      let headers;
      let startRow = 0;
      
      if (firstRowAsHeader) {
        // Use first row as headers
        headers = rows[0];
        startRow = 1;
      } else {
        // Generate numeric headers (1, 2, 3, ...)
        headers = rows[0].map((_: any, index: number) => `field${index + 1}`);
      }
      
      // Convert rows to objects
      const jsonArray: any[] = [];
      
      for (let i = startRow; i < rows.length; i++) {
        const row = rows[i];
        const obj: any = {};
        
        // Skip rows with wrong number of columns
        if (row.length !== headers.length) {
          continue;
        }
        
        for (let j = 0; j < headers.length; j++) {
          let value: any = row[j];
          
          // Try to convert to number or boolean if applicable
          if (value.toLowerCase() === "true") {
            value = true;
          } else if (value.toLowerCase() === "false") {
            value = false;
          } else if (value.toLowerCase() === "null") {
            value = null;
          } else if (!isNaN(Number(value)) && value.trim() !== "") {
            // Check if it's an integer or float
            if (value.includes(".")) {
              value = parseFloat(value);
            } else {
              value = parseInt(value, 10);
            }
          }
          
          obj[headers[j]] = value;
        }
        
        jsonArray.push(obj);
      }
      
      // Format JSON with specified indentation
      const jsonString = JSON.stringify(jsonArray, null, indentation);
      setJson(jsonString);
      setError("");
      
      // Track successful conversion
      trackToolUsage("csv_to_json", "convert");
    } catch (err: any) {
      setError(err.message || "Failed to convert CSV to JSON");
      setJson("");
      
      // Track error
      trackToolUsage("csv_to_json", "convert_error");
    }
  };

  const handleCopy = () => {
    if (!json) return;
    
    navigator.clipboard.writeText(json);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    
    // Track copy action
    trackCopy("JSON");
  };

  const handleDownload = () => {
    if (!json) return;
    
    // Create a Blob with the JSON content
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    
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
    trackToolUsage("csv_to_json", "download");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setCsv(result);
        // Track upload action
        trackToolUsage("csv_to_json", "upload");
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file");
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setCsv("");
    setJson("");
    setError("");
    
    // Track clear action
    trackToolUsage("csv_to_json", "clear");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            CSV to JSON Converter
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Convert CSV data to JSON format with a preview and download option
          </p>
        </div>

        {/* Options Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Conversion Options
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label htmlFor="delimiter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Delimiter
              </label>
              <select
                id="delimiter"
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="\\t">Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>
            <div>
              <label htmlFor="filename" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Output Filename
              </label>
              <input
                type="text"
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100"
                placeholder="data.json"
              />
            </div>
            <div>
              <label htmlFor="indentation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                JSON Indentation
              </label>
              <select
                id="indentation"
                value={indentation}
                onChange={(e) => setIndentation(Number(e.target.value))}
                className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100"
              >
                <option value="0">No indentation</option>
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
                <option value="8">8 spaces</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="firstRowAsHeader"
                checked={firstRowAsHeader}
                onChange={(e) => setFirstRowAsHeader(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="firstRowAsHeader" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Use first row as headers
              </label>
            </div>
          </div>
        </div>

        {/* Converter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Table className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  CSV Input
                </h2>
              </div>
              <div>
                <label htmlFor="csv-file-upload" className="cursor-pointer flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  <Upload className="h-4 w-4" />
                  Upload CSV
                </label>
                <input 
                  id="csv-file-upload" 
                  type="file" 
                  accept=".csv,text/csv" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </div>
            </div>
            <textarea
              className="w-full h-80 p-4 text-sm font-mono bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100"
              placeholder="Paste your CSV data here or upload a CSV file..."
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
            ></textarea>
          </div>

          {/* Output Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileJson className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  JSON Output
                </h2>
              </div>
              {json && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
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
              ) : json ? (
                json
              ) : (
                <span className="text-gray-400 dark:text-gray-500">
                  JSON will appear here...
                </span>
              )}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button
            onClick={convertCsvToJson}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors duration-300"
          >
            <Code className="h-5 w-5" />
            Convert CSV to JSON
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
            About CSV to JSON Conversion
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              This tool converts CSV (Comma-Separated Values) data into JSON (JavaScript Object Notation) format, 
              which is ideal for web applications and APIs. The converter transforms tabular data into a structured, 
              hierarchical format that's easy to process in JavaScript.
            </p>
            <h3>Features:</h3>
            <ul>
              <li>Converts CSV to JSON array of objects</li>
              <li>Supports various delimiters (comma, semicolon, tab, pipe)</li>
              <li>Option to use first row as headers or generate column names</li>
              <li>Automatic data type detection (string, number, boolean, null)</li>
              <li>Handles quoted values with delimiters inside</li>
              <li>Customizable JSON indentation</li>
              <li>Download functionality for saving the JSON file</li>
              <li>CSV file upload option</li>
            </ul>
            <h3>How to use:</h3>
            <ol>
              <li>Paste your CSV data into the input field or upload a CSV file</li>
              <li>Configure options (delimiter, headers, indentation)</li>
              <li>Click the "Convert CSV to JSON" button</li>
              <li>View the formatted JSON output</li>
              <li>Copy the result or download it as a JSON file</li>
            </ol>
            <h3>Example CSV input:</h3>
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto">
{`id,name,email
1,"Doe, John",john@example.com
2,"Smith, Jane",jane@example.com`}
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
