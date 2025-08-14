"use client";

import { useState, useRef } from "react";
import { trackGeneration, trackCopy } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Image, Download, Upload, Trash2, Settings, Shield, Zap, Globe, Smartphone, FileImage } from "lucide-react";

interface CompressedImage {
  name: string;
  originalSize: number;
  compressedSize: number;
  url: string;
  type: string;
  quality: number;
}

export default function ImageCompressor() {
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [maxHeight, setMaxHeight] = useState<number>(1080);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      return file.type === 'image/jpeg' || 
             file.type === 'image/png' ||
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

  // Corrigido: resizeImage agora recebe a imagem e retorna um novo canvas redimensionado
  const resizeImage = (img: HTMLImageElement, maxWidth: number, maxHeight: number, maintainAspectRatio: boolean): HTMLCanvasElement => {
    let { width, height } = img;
    if (maintainAspectRatio) {
      const aspectRatio = width / height;
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
    } else {
      width = Math.min(width, maxWidth);
      height = Math.min(height, maxHeight);
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, width, height);
    return canvas;
  };

  const compressImage = async (file: File): Promise<CompressedImage> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        try {
          // Redimensiona se necessário
          let canvas: HTMLCanvasElement;
          if (img.width > maxWidth || img.height > maxHeight) {
            canvas = resizeImage(img, maxWidth, maxHeight, maintainAspectRatio);
          } else {
            canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0);
          }
          // Compressão
          let mimeType = file.type;
          let qualityValue = quality / 100;
          if (file.type === 'image/png' && quality < 50) {
            mimeType = 'image/jpeg';
            qualityValue = Math.max(0.1, quality / 100);
          }
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            const url = URL.createObjectURL(blob);
            const originalName = file.name;
            const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
            const extension = mimeType === 'image/jpeg' ? 'jpg' : 'png';
            const compressedName = `${nameWithoutExt}_compressed.${extension}`;
            resolve({
              name: compressedName,
              originalSize: file.size,
              compressedSize: blob.size,
              url: url,
              type: mimeType,
              quality: quality
            });
          }, mimeType, qualityValue);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const compressFiles = async () => {
    if (uploadedFiles.length === 0) {
      setError("Please upload some image files to compress");
      return;
    }

    setIsCompressing(true);
    setError("");
    setSuccess("");

    try {
      const compressed = [];

      for (const file of uploadedFiles) {
        const compressedImage = await compressImage(file);
        compressed.push(compressedImage);
      }

      setCompressedImages(compressed);
      setSuccess(`Successfully compressed ${uploadedFiles.length} image file(s)`);
      
      // Track compression
      trackGeneration('Image Compression');
      
    } catch (err) {
      console.error("Compression error:", err);
      setError("Compression failed. Please try again. Make sure your image files are valid.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleClear = () => {
    setUploadedFiles([]);
    setCompressedImages([]);
    setError("");
    setSuccess("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = (image: CompressedImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Track download
    trackCopy(`Downloaded compressed ${image.type}`);
  };

  const handleDownloadAll = () => {
    compressedImages.forEach(image => {
      handleDownload(image);
    });
  };

  const getCompressionRatio = (original: number, compressed: number) => {
    return ((original - compressed) / original * 100).toFixed(1);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                <Image className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Image Compressor
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Compress JPG and PNG images to reduce file size while maintaining quality. 
              Free online tool with multiple compression options.
            </p>
          </div>

          {/* Compression Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Compression Settings
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quality ({quality}%)
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Width (px)
                </label>
                <input
                  type="number"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="100"
                  max="4000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Height (px)
                </label>
                <input
                  type="number"
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="100"
                  max="4000"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Maintain aspect ratio
                </span>
              </label>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Upload Image Files
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
                        <FileImage className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{file.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Compress Button */}
          {uploadedFiles.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={compressFiles}
                  disabled={isCompressing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isCompressing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Compressing...</span>
                    </>
                  ) : (
                    <>
                      <Image className="w-5 h-5" />
                      <span>Compress Images</span>
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

          {/* Compressed Images */}
          {compressedImages.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Compressed Images ({compressedImages.length})
                </h2>
                <button
                  onClick={handleDownloadAll}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Download All
                </button>
              </div>
              
              <div className="space-y-4">
                {compressedImages.map((image, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <FileImage className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-900 dark:text-white font-medium">{image.name}</span>
                      </div>
                      <button
                        onClick={() => handleDownload(image)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Download
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Original:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{formatFileSize(image.originalSize)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Compressed:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{formatFileSize(image.compressedSize)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Reduction:</span>
                        <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                          {getCompressionRatio(image.originalSize, image.compressedSize)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className="text-gray-600 dark:text-gray-400">Quality:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{image.quality}%</span>
                    </div>
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
                  <Image className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Quality Control</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Adjustable quality settings from 10% to 100%</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Batch Processing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Compress multiple images at once</p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-300">Quick compression with no waiting time</p>
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
                  <h3 className="font-medium text-gray-900 dark:text-white">Adjust Settings</h3>
                  <p className="text-gray-600 dark:text-gray-300">Set quality, max dimensions, and other compression options</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Upload Images</h3>
                  <p className="text-gray-600 dark:text-gray-300">Drag and drop or click to select your JPG, JPEG, or PNG files</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Compress</h3>
                  <p className="text-gray-600 dark:text-gray-300">Click the compress button and wait for processing</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Download</h3>
                  <p className="text-gray-600 dark:text-gray-300">Download your compressed images individually or all at once</p>
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
                  Currently, JPG, JPEG, and PNG image files are supported for compression.
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
                  Can I compress multiple files at once?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, you can select multiple image files for batch compression.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  What quality setting should I use?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  For web use, 70-80% quality usually provides a good balance between file size and image quality. For print, use 90-100%.
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
