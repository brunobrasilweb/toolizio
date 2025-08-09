"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { trackGeneration, trackCopy } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Image, Download, Upload, Trash2, FileText, Shield, Zap, Globe, Smartphone } from "lucide-react";
import { PDFDocument } from 'pdf-lib';

export default function JpgToPdfConverter() {
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<{ name: string; url: string; type: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      return file.type.startsWith('image/') || 
             file.name.toLowerCase().endsWith('.jpg') || 
             file.name.toLowerCase().endsWith('.jpeg') ||
             file.name.toLowerCase().endsWith('.png');
    });

    if (validFiles.length !== files.length) {
      setError("Some files were invalid. Please select JPG, JPEG, or PNG files only.");
      return;
    }

    setUploadedFiles(validFiles);
    setError("");
    setSuccess("");
  };

  const convertFiles = async () => {
    if (uploadedFiles.length === 0) {
      setError("Please upload some image files to convert");
      return;
    }

    setIsConverting(true);
    setError("");
    setSuccess("");

    try {
      const converted = [];

      for (const file of uploadedFiles) {
        // Read the image file
        const arrayBuffer = await file.arrayBuffer();
        
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        
        // Convert image to PDF page
        let image;
        if (file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          throw new Error(`Unsupported image format: ${file.type}`);
        }

        // Get image dimensions
        const { width, height } = image.scale(1);
        
        // Create a page with the same dimensions as the image
        const page = pdfDoc.addPage([width, height]);
        
        // Draw the image on the page
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: width,
          height: height,
        });

        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        
        // Create blob and URL for download
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const originalName = file.name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
        const pdfName = `${nameWithoutExt}.pdf`;
        
        converted.push({ name: pdfName, url: url, type: 'application/pdf' });
      }

      setConvertedFiles(converted);
      setSuccess(`Successfully converted ${uploadedFiles.length} image file(s) to PDF`);
      
      // Track conversion
      trackGeneration('JPG to PDF');
      
    } catch (err) {
      console.error("Conversion error:", err);
      setError("Conversion failed. Please try again. Make sure your image files are valid.");
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Image className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              JPG to PDF Converter
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Convert JPG, JPEG, and PNG images to PDF documents. 
              Free online tool with batch processing and high-quality output.
            </p>
          </div>

          {/* File Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Upload Image Files
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-green-400 dark:hover:border-green-500 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Drop your JPG, JPEG, or PNG files here
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                or click to browse files
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Choose Image Files
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
                        <Image className="w-5 h-5 text-gray-500 dark:text-gray-400" />
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

          {/* Convert Button */}
          {uploadedFiles.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={convertFiles}
                  disabled={isConverting}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isConverting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Converting...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      <span>Convert to PDF</span>
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
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {/* Converted Files */}
          {convertedFiles.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Converted PDFs ({convertedFiles.length})
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
                      <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{file.name}</span>
                    </div>
                    <button
                      onClick={() => handleDownload(file)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
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
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Image className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">High Quality</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Maintain original quality during conversion</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Batch Processing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Convert multiple images at once</p>
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
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Upload Image Files</h3>
                  <p className="text-gray-600 dark:text-gray-300">Drag and drop or click to select your JPG, JPEG, or PNG files</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Convert</h3>
                  <p className="text-gray-600 dark:text-gray-300">Click the convert button and wait for processing</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Download</h3>
                  <p className="text-gray-600 dark:text-gray-300">Download your converted PDF files individually or all at once</p>
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
                  Currently, JPG, JPEG, and PNG image files are supported for conversion to PDF.
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
                  Yes, you can select multiple image files for batch conversion.
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