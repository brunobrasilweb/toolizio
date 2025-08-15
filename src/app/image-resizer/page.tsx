"use client";

import { useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Image as ImageIcon, Download, Upload, Trash2, Settings, FileImage } from "lucide-react";
import { trackGeneration, trackCopy } from "@/utils/analytics";

export default function ImageResizer() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [width, setWidth] = useState<number | "">(800);
  const [height, setHeight] = useState<number | "">(600);
  const [maintainAspect, setMaintainAspect] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Unsupported file type. Please upload a JPG or PNG image.");
      return;
    }
    setFile(f);
    setError("");
    setSuccess("");
    setResizedUrl(null);

    const url = URL.createObjectURL(f);
    setPreviewUrl(url);

  // try to set default width/height from image
  const img = new window.Image();
    img.onload = () => {
      setWidth(img.width);
      setHeight(img.height);
      URL.revokeObjectURL(img.src);
    };
    img.src = url;
  };

  const clear = () => {
    setFile(null);
    setPreviewUrl(null);
    setResizedUrl(null);
    setError("");
    setSuccess("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resize = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }
    if (!width || !height) {
      setError("Width and height must be set.");
      return;
    }

    setIsProcessing(true);
    setError("");
    setSuccess("");

    try {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      let targetW = Number(width);
      let targetH = Number(height);

      if (maintainAspect) {
        const aspect = img.width / img.height;
        // prioritize width change
        if (targetW && !targetH) {
          targetH = Math.round(targetW / aspect);
        } else if (!targetW && targetH) {
          targetW = Math.round(targetH * aspect);
        } else {
          // both set: adjust to maintain aspect based on which is proportionally smaller
          const wByAspect = Math.round(targetW / aspect);
          if (wByAspect <= targetH) {
            targetH = wByAspect;
          } else {
            targetW = Math.round(targetH * aspect);
          }
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(img, 0, 0, targetW, targetH);

      const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve, mime, 0.92)
      );
      if (!blob) throw new Error("Failed to resize image");

      const url = URL.createObjectURL(blob);
      setResizedUrl(url);
      setSuccess("Image resized successfully");

      // analytics
      trackGeneration("Image Resizing");
    } catch (err) {
      console.error(err);
      setError("Failed to resize image. Please try a different file or dimensions.");
    } finally {
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!resizedUrl || !file) return;
    const link = document.createElement("a");
    const name = file.name.replace(/\.[^.]+$/, "") + "_resized" + (file.type === "image/png" ? ".png" : ".jpg");
    link.href = resizedUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    trackCopy("Resized Image Download");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">Image Resizer</h1>
            <p className="text-gray-600 dark:text-gray-300">Resize JPG and PNG images in your browser. Change dimensions, keep aspect ratio and download the result. Files are processed locally.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Image</h2>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="mb-4 text-gray-700 dark:text-gray-300">Select a JPG or PNG image</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <div className="flex justify-center gap-3">
                <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Choose Image</button>
                <button onClick={clear} className="px-4 py-2 border rounded">Clear</button>
              </div>
            </div>

            {file && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Width (px)</label>
                    <input type="number" value={width as any} onChange={(e) => setWidth(e.target.value === "" ? "" : Number(e.target.value))} className="w-full px-3 py-2 border rounded" min={1} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Height (px)</label>
                    <input type="number" value={height as any} onChange={(e) => setHeight(e.target.value === "" ? "" : Number(e.target.value))} className="w-full px-3 py-2 border rounded" min={1} />
                  </div>
                  <div className="flex items-center">
                    <input id="maintain" type="checkbox" checked={maintainAspect} onChange={(e) => setMaintainAspect(e.target.checked)} className="mr-2" />
                    <label htmlFor="maintain" className="text-sm text-gray-600 dark:text-gray-300">Maintain aspect ratio</label>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button onClick={resize} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
                    {isProcessing ? <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                    <span>Resize</span>
                  </button>
                  <button onClick={clear} className="px-4 py-2 border rounded flex items-center gap-2"><Trash2 className="w-4 h-4" /> Clear</button>
                  {resizedUrl && <button onClick={download} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"><Download className="w-4 h-4" /> Download</button>}
                </div>
              </div>
            )}

            {error && <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 px-4 py-2 rounded">{error}</div>}
            {success && <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 px-4 py-2 rounded">{success}</div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Preview</h3>
              {previewUrl ? <img src={previewUrl} alt="preview" className="max-w-full h-auto rounded" /> : <div className="text-gray-500">No image selected</div>}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Resized Result</h3>
              {resizedUrl ? <img src={resizedUrl} alt="resized" className="max-w-full h-auto rounded" /> : <div className="text-gray-500">No resized image yet</div>}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mt-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">How it works</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">This tool resizes the image entirely in your browser using an HTML canvas. Your image never leaves your device.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
