"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Code, Copy, FileJson, FileIcon, FileCode } from "lucide-react";
import { trackPageView, trackToolUsage, trackCopy } from "@/utils/analytics";

export default function JsonToXmlPage() {
  const [json, setJson] = useState("");
  const [xml, setXml] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [indentation, setIndentation] = useState(2);
  const [rootElementName, setRootElementName] = useState("root");

  useEffect(() => {
    // Track page view
    trackPageView(window.location.href);
  }, []);

  const convertJsonToXml = () => {
    if (!json.trim()) {
      setError("Please enter JSON data");
      setXml("");
      return;
    }

    try {
      // Parse JSON
      const jsonObj = JSON.parse(json);
      
      // Convert JSON to XML
      const result = `<?xml version="1.0" encoding="UTF-8"?>\n${jsonToXml(jsonObj, rootElementName, 0)}`;
      setXml(result);
      setError("");
      
      // Track successful conversion
      trackToolUsage("json_to_xml", "convert");
    } catch (err: any) {
      setError(err.message || "Failed to convert JSON to XML");
      setXml("");
      
      // Track error
      trackToolUsage("json_to_xml", "convert_error");
    }
  };

  // Function to convert JSON to XML
  const jsonToXml = (obj: any, tagName: string, level: number): string => {
    // Create indentation based on level
    const indent = ' '.repeat(indentation * level);
    const nextIndent = ' '.repeat(indentation * (level + 1));
    
    // If null or undefined
    if (obj === null || obj === undefined) {
      return `${indent}<${tagName}></${tagName}>`;
    }
    
    // If it's a primitive type (string, number, boolean)
    if (typeof obj !== 'object') {
      // Escape special characters
      const value = String(obj)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      
      return `${indent}<${tagName}>${value}</${tagName}>`;
    }
    
    // If it's an array
    if (Array.isArray(obj)) {
      // For arrays, we create separate elements for each item using the same tag name
      return obj.map(item => jsonToXml(item, tagName, level)).join('\n');
    }
    
    // If it's an object
    const props = Object.keys(obj);
    if (props.length === 0) {
      return `${indent}<${tagName}></${tagName}>`;
    }
    
    let result = `${indent}<${tagName}>`;
    
    // Check if the object only has one property with a primitive value
    const hasSinglePrimitive = props.length === 1 && 
      (typeof obj[props[0]] !== 'object' || obj[props[0]] === null);
    
    if (!hasSinglePrimitive) {
      result += '\n';
    }
    
    // Process each property
    props.forEach(prop => {
      // Skip attributes for now (for simplicity)
      if (prop === '@attributes') {
        return;
      }
      
      // Handle different value types
      const value = obj[prop];
      
      if (value === null || value === undefined) {
        result += `${nextIndent}<${prop}></${prop}>` + (hasSinglePrimitive ? '' : '\n');
      } else if (typeof value !== 'object') {
        // Escape special characters
        const escapedValue = String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
        
        result += `${nextIndent}<${prop}>${escapedValue}</${prop}>` + (hasSinglePrimitive ? '' : '\n');
      } else {
        result += jsonToXml(value, prop, level + 1) + '\n';
      }
    });
    
    if (!hasSinglePrimitive) {
      result += indent;
    }
    
    result += `</${tagName}>`;
    return result;
  };

  const handleCopy = () => {
    if (!xml) return;
    
    navigator.clipboard.writeText(xml);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    
    // Track copy action
    trackCopy("XML");
  };

  const handleClear = () => {
    setJson("");
    setXml("");
    setError("");
    
    // Track clear action
    trackToolUsage("json_to_xml", "clear");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            JSON to XML Converter
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Convert JSON data to XML format with a clean and formatted preview
          </p>
        </div>

        {/* Options Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Conversion Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="rootElementName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Root Element Name
              </label>
              <input
                type="text"
                id="rootElementName"
                value={rootElementName}
                onChange={(e) => setRootElementName(e.target.value)}
                className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:text-gray-100"
                placeholder="root"
              />
            </div>
            <div>
              <label htmlFor="indentation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Indentation (spaces)
              </label>
              <select
                id="indentation"
                value={indentation}
                onChange={(e) => setIndentation(Number(e.target.value))}
                className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:text-gray-100"
              >
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
                <option value="8">8 spaces</option>
              </select>
            </div>
          </div>
        </div>

        {/* Converter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <FileJson className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                JSON Input
              </h2>
            </div>
            <textarea
              className="w-full h-80 p-4 text-sm font-mono bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:text-gray-100"
              placeholder="Paste your JSON here..."
              value={json}
              onChange={(e) => setJson(e.target.value)}
            ></textarea>
          </div>

          {/* Output Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  XML Output
                </h2>
              </div>
              {xml && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            <pre
              className="w-full h-80 p-4 text-sm font-mono bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg overflow-auto dark:text-gray-100"
            >
              {error ? (
                <span className="text-red-500">{error}</span>
              ) : xml ? (
                xml
              ) : (
                <span className="text-gray-400 dark:text-gray-500">
                  XML will appear here...
                </span>
              )}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button
            onClick={convertJsonToXml}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors duration-300"
          >
            <Code className="h-5 w-5" />
            Convert JSON to XML
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
            About JSON to XML Conversion
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              This tool converts JSON data into XML format, which is useful for integrating with XML-based 
              systems and services. The converter maintains the structure of your JSON data while transforming 
              it into a well-formed XML document.
            </p>
            <h3>Features:</h3>
            <ul>
              <li>Customizable root element name</li>
              <li>Adjustable indentation for better readability</li>
              <li>Handles nested objects and arrays correctly</li>
              <li>Escapes special XML characters</li>
              <li>Formats the XML output with proper structure</li>
              <li>Easy copy functionality for the converted XML</li>
            </ul>
            <h3>How to use:</h3>
            <ol>
              <li>Paste your JSON data into the input field</li>
              <li>Customize the root element name and indentation if needed</li>
              <li>Click the "Convert JSON to XML" button</li>
              <li>View the formatted XML output</li>
              <li>Copy the result to use in your applications</li>
            </ol>
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
