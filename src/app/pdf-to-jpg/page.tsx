"use client";

import { useState, useRef, useEffect } from "react";
import { trackGeneration, trackCopy } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, Download, Upload, Trash2, FileImage, Shield, Zap, Globe, Smartphone } from "lucide-react";

export default function PdfToJpgConverter() {
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<{ name: string; url: string; type: string }[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isPdfJsLoaded, setIsPdfJsLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    // Initialize PDF.js when component mounts (client-side only)
    const initPdfJs = async () => {
      try {
        // Only set worker source, don't import the whole library yet
        if (typeof window !== 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
          script.onload = () => {
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
            setIsPdfJsLoaded(true);
            console.log('PDF.js loaded successfully');
          };
          script.onerror = () => {
            console.error('Failed to load PDF.js from CDN');
            setError('Failed to load PDF conversion library. Please check your internet connection and refresh the page.');
          };
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error('Failed to initialize PDF.js:', error);
        setError('Failed to initialize PDF conversion library.');
      }
    };
    initPdfJs();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    });

    if (validFiles.length !== files.length) {
      setError("Some files were invalid. Please select PDF files only.");
      return;
    }

    setUploadedFiles(validFiles);
    setError("");
    setSuccess("");
  };

  const convertFiles = async () => {
    if (uploadedFiles.length === 0) {
      setError("Please upload some PDF files to convert");
      return;
    }

    if (!isPdfJsLoaded) {
      setError("PDF.js library is still loading. Please wait a moment and try again.");
      return;
    }

    setIsConverting(true);
    setError("");
    setSuccess("");

    try {
      const converted = [];
      
      // Check if PDF.js is loaded
      if (typeof window === 'undefined' || !(window as any).pdfjsLib) {
        setError("PDF.js library is not loaded. Please refresh the page and try again.");
        setIsConverting(false);
        return;
      }

      const pdfjsLib = (window as any).pdfjsLib;

      for (const file of uploadedFiles) {
        try {
          console.log(`Processing file: ${file.name}`);
          
          // Read the PDF file
          const arrayBuffer = await file.arrayBuffer();
          console.log(`File size: ${arrayBuffer.byteLength} bytes`);
          
          // Load the PDF document using PDF.js
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          const numPages = pdf.numPages;
          
          console.log(`PDF loaded successfully, ${numPages} pages`);
          
          if (numPages === 0) {
            setError(`The PDF file "${file.name}" appears to be empty or corrupted.`);
            continue;
          }
          
          const originalName = file.name;
          const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;

          // Convert each page to JPG
          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            try {
              console.log(`Converting page ${pageNum}/${numPages}`);
              
              // Get the page
              const page = await pdf.getPage(pageNum);
              
              // Set the scale for rendering (higher scale = better quality)
              const scale = 1.5;
              const viewport = page.getViewport({ scale });
              
              // Create a canvas with the page dimensions
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              
              if (!context) {
                throw new Error('Could not get canvas context');
              }

              // Set canvas dimensions
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              
              console.log(`Canvas size: ${canvas.width}x${canvas.height}`);
              
              // Fill with white background
              context.fillStyle = 'white';
              context.fillRect(0, 0, canvas.width, canvas.height);
              
              // Render the page to canvas
              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };
              
              await page.render(renderContext).promise;
              console.log(`Page ${pageNum} rendered successfully`);
              
              // Convert canvas to blob
              const jpgBlob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob((blob) => {
                  if (blob) {
                    console.log(`Blob created for page ${pageNum}, size: ${blob.size} bytes`);
                    resolve(blob);
                  } else {
                    reject(new Error('Failed to create blob'));
                  }
                }, 'image/jpeg', 0.9);
              });
              
              const jpgUrl = URL.createObjectURL(jpgBlob);
              const jpgName = `${nameWithoutExt}_page_${pageNum}.jpg`;
              
              converted.push({ name: jpgName, url: jpgUrl, type: 'image/jpeg' });
              console.log(`Successfully converted page ${pageNum} to ${jpgName}`);
            } catch (pageError) {
              console.error(`Error converting page ${pageNum} of ${file.name}:`, pageError);
              const errorMessage = pageError instanceof Error ? pageError.message : 'Unknown error';
              setError(`Failed to convert page ${pageNum} of ${file.name}: ${errorMessage}`);
              // Continue with other pages even if one fails
            }
          }
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
          const errorMessage = fileError instanceof Error ? fileError.message : 'Unknown error';
          setError(`Failed to process ${file.name}. Error: ${errorMessage}`);
          continue;
        }
      }

      if (converted.length > 0) {
        setConvertedFiles(converted);
        setSuccess(`Successfully converted ${uploadedFiles.length} PDF file(s) to ${converted.length} JPG image(s)`);
        
        // Track conversion
        trackGeneration('PDF to JPG');
      } else {
        setError("No pages were successfully converted. Please check your PDF files and try again.");
      }
      
    } catch (err) {
      console.error("Conversion error:", err);
      setError(`Conversion failed: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsConverting(false);
    }
  };

  const handleClear = () => {
    setUploadedFiles([]);
    setConvertedFiles([]);
    setError("");
    setSuccess("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = (file: { name: string; url: string; type: string }) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Track download
    trackCopy(`Downloaded ${file.type}`);
  };

  const handleDownloadAll = () => {
    convertedFiles.forEach(file => {
      handleDownload(file);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              PDF to JPG Converter
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Convert PDF files to high-quality JPG images. 
              Free online tool with batch processing and multiple page support.
            </p>
          </div>

          {/* File Upload Section */}
          {isClient && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Upload PDF Files
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Drop your PDF files here
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  or click to browse files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Choose PDF Files
                </button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Uploaded Files ({uploadedFiles.length})
                  </h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{file.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Convert Button */}
          {isClient && uploadedFiles.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              {!isPdfJsLoaded && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 rounded-lg">
                  Loading PDF conversion library...
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={convertFiles}
                  disabled={isConverting || !isPdfJsLoaded}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isConverting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Converting...</span>
                    </>
                  ) : !isPdfJsLoaded ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <FileImage className="w-5 h-5" />
                      <span>Convert to JPG</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleClear}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {isClient && error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {isClient && success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {/* Converted Files */}
          {isClient && convertedFiles.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Converted Images ({convertedFiles.length})
                </h2>
                <button
                  onClick={handleDownloadAll}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Download All
                </button>
              </div>
              
              <div className="space-y-3">
                {convertedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileImage className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{file.name}</span>
                    </div>
                    <button
                      onClick={() => handleDownload(file)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">High Quality</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Maintain original quality during conversion</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Batch Processing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Convert multiple PDF files at once</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Secure</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Files are processed locally, no upload to servers</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Fast</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Quick conversion with no waiting time</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Globe className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Free</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">No registration or payment required</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Mobile Friendly</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Works perfectly on all devices</p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Use */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              How to Use
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Upload PDF Files</h3>
                  <p className="text-gray-600 dark:text-gray-300">Drag and drop or click to select your PDF files</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Convert</h3>
                  <p className="text-gray-600 dark:text-gray-300">Click the convert button and wait for processing</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Download</h3>
                  <p className="text-gray-600 dark:text-gray-300">Download your converted JPG images individually or all at once</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  What file formats are supported?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Currently, only PDF files are supported for conversion to JPG.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Is there a file size limit?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Currently, files up to 50MB are supported for optimal performance.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Are my files secure?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, all processing is done locally in your browser. Files are never uploaded to our servers.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Can I convert multiple files at once?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, you can select multiple PDF files for batch conversion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 