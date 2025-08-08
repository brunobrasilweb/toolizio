"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Code, Copy, FileJson, FileIcon } from "lucide-react";
import { trackPageView, trackToolUsage, trackCopy } from "@/utils/analytics";

export default function XmlToJsonPage() {
  const [xml, setXml] = useState("");
  const [json, setJson] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Track page view
    trackPageView(window.location.href);
  }, []);

  const convertXmlToJson = () => {
    if (!xml.trim()) {
      setError("Please enter XML data");
      setJson("");
      return;
    }

    try {
      // Parse XML to JSON
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      
      // Check for parsing errors
      const parserError = xmlDoc.querySelector("parsererror");
      if (parserError) {
        throw new Error("Invalid XML format");
      }
      
      // Convert XML to JSON using a recursive function
      const xmlToJson = (node: any): any => {
        // Create an object to hold our result
        let obj: any = {};
        
        // Process attributes
        if (node.attributes && node.attributes.length > 0) {
          obj["@attributes"] = {};
          for (let i = 0; i < node.attributes.length; i++) {
            const attribute = node.attributes[i];
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
        }
        
        // Process child nodes
        if (node.hasChildNodes()) {
          for (let i = 0; i < node.childNodes.length; i++) {
            const childNode = node.childNodes[i];
            
            // Skip text nodes that contain only whitespace
            if (childNode.nodeType === 3 && !childNode.nodeValue.trim()) continue;
            
            if (childNode.nodeType === 3) { // Text node
              // If we have a text node and other nodes, store text under #text
              if (node.childNodes.length > 1) {
                obj["#text"] = childNode.nodeValue;
              } else {
                // If this is the only child, just return the value
                return childNode.nodeValue;
              }
            } else if (childNode.nodeType === 1) { // Element node
              const childObj = xmlToJson(childNode);
              
              // Check if this node name already exists in our object
              if (obj[childNode.nodeName]) {
                // If it's not already an array, make it one
                if (!Array.isArray(obj[childNode.nodeName])) {
                  obj[childNode.nodeName] = [obj[childNode.nodeName]];
                }
                obj[childNode.nodeName].push(childObj);
              } else {
                obj[childNode.nodeName] = childObj;
              }
            }
          }
        }
        
        return obj;
      };
      
      // Start conversion from the document element
      const result: any = {};
      result[xmlDoc.documentElement.nodeName] = xmlToJson(xmlDoc.documentElement);
      
      // Format the JSON with indentation
      setJson(JSON.stringify(result, null, 2));
      setError("");
      
      // Track successful conversion
      trackToolUsage("xml_to_json", "convert");
    } catch (err: any) {
      setError(err.message || "Failed to convert XML to JSON");
      setJson("");
      
      // Track error
      trackToolUsage("xml_to_json", "convert_error");
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

  const handleClear = () => {
    setXml("");
    setJson("");
    setError("");
    
    // Track clear action
    trackToolUsage("xml_to_json", "clear");
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
            XML to JSON Converter
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Convert XML data to JSON format with a clean and formatted preview
          </p>
        </div>

        {/* Converter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <FileIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                XML Input
              </h2>
            </div>
            <textarea
              className="w-full h-80 p-4 text-sm font-mono bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100"
              placeholder="Paste your XML here..."
              value={xml}
              onChange={(e) => setXml(e.target.value)}
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
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
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
            onClick={convertXmlToJson}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors duration-300"
          >
            <Code className="h-5 w-5" />
            Convert XML to JSON
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
            About XML to JSON Conversion
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              This tool converts XML data into JSON format, making it easier to work with in JavaScript 
              applications or API integrations. The converter preserves the structure of your XML data 
              while transforming it into the more compact and readable JSON format.
            </p>
            <h3>Features:</h3>
            <ul>
              <li>Preserves XML attributes with "@attributes" prefix</li>
              <li>Handles nested elements and arrays correctly</li>
              <li>Formats the JSON output with proper indentation</li>
              <li>Provides instant validation of XML input</li>
              <li>Easy copy functionality for the converted JSON</li>
            </ul>
            <h3>How to use:</h3>
            <ol>
              <li>Paste your XML data into the input field</li>
              <li>Click the "Convert XML to JSON" button</li>
              <li>View the formatted JSON output</li>
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
