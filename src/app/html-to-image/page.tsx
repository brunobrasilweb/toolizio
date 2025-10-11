"use client";

import { useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";
import { Download, Link as LinkIcon, Code, ImageIcon } from "lucide-react";
import html2canvas from "html2canvas";
import { trackGeneration } from "@/utils/analytics";

export default function HtmlToImage() {
  const [html, setHtml] = useState("");
  const [url, setUrl] = useState("");
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState("");
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const previewRef = useRef<HTMLDivElement | null>(null);

  const renderFromHtml = async () => {
    if (!html.trim()) { setError('Please enter HTML or provide a URL'); return; }
    setError('');
    setIsRendering(true);

    try {
      // Inject HTML into preview container
      if (previewRef.current) {
        previewRef.current.innerHTML = html;
      }

      // Wait a tick for images/fonts to load
      await new Promise((r) => setTimeout(r, 300));

      if (!previewRef.current) throw new Error('Preview element not found');

      const canvas = await html2canvas(previewRef.current, { useCORS: true, scale: 2 });
      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mime, format === 'jpeg' ? 0.92 : undefined);

      downloadDataUrl(`html-rendered.${format}`, dataUrl);
      trackGeneration('html-to-image');
    } catch (err: any) {
      console.error(err);
      setError('Rendering failed. External resources may be blocked by CORS or the HTML is invalid.');
    } finally {
      setIsRendering(false);
    }
  };

  const renderFromUrl = async () => {
    if (!url.trim()) { setError('Please enter a URL'); return; }
    setError('');
    setIsRendering(true);

    try {
      // Use server-side screenshot API to avoid CORS issues
      const apiUrl = `/api/screenshot?url=${encodeURIComponent(url)}&format=${encodeURIComponent(format)}`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Screenshot API failed');

      const blob = await res.blob();
      const dataUrl = URL.createObjectURL(blob);
      downloadDataUrl(`url-screenshot.${format}`, dataUrl);
      // revoke after a delay
      setTimeout(() => URL.revokeObjectURL(dataUrl), 5000);
      trackGeneration('html-to-image');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch or render the URL. Server-side capture failed or URL is not reachable.');
    } finally {
      setIsRendering(false);
    }
  };

  const downloadDataUrl = (filename: string, dataUrl: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header showBackButton />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">HTML to Image</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Convert HTML content or a URL into a PNG or JPG image directly in your browser.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paste HTML</label>
              <textarea rows={10} value={html} onChange={(e) => setHtml(e.target.value)} className="shadow-sm block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" placeholder="Paste your HTML here or fetch from a URL" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Or provide a URL</label>
              <div className="flex space-x-3">
                <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" className="flex-1 shadow-sm block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                <button onClick={renderFromUrl} disabled={isRendering} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <LinkIcon className="h-4 w-4 mr-2" /> Fetch & Render
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Note: fetching external URLs requires CORS headers. If the site prevents cross-origin fetches, paste the HTML instead.</p>
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Output format</label>
              <div className="flex items-center space-x-2">
                <label className={`inline-flex items-center px-3 py-2 rounded-md border ${format==='png' ? 'bg-blue-50 border-blue-400' : 'border-gray-300'}`}>
                  <input type="radio" name="format" checked={format==='png'} onChange={() => setFormat('png')} className="mr-2" /> PNG
                </label>
                <label className={`inline-flex items-center px-3 py-2 rounded-md border ${format==='jpeg' ? 'bg-blue-50 border-blue-400' : 'border-gray-300'}`}>
                  <input type="radio" name="format" checked={format==='jpeg'} onChange={() => setFormat('jpeg')} className="mr-2" /> JPG
                </label>
              </div>
              <div className="flex-1" />
              <button onClick={renderFromHtml} disabled={isRendering || !html.trim()} className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                {isRendering ? 'Rendering...' : (<><Download className="h-4 w-4 mr-2" /> Download Image</>)}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <div className="flex items-start">
                  <ToolIcons.warning className="h-5 w-5 text-red-400" />
                  <div className="ml-3 text-sm text-red-700 dark:text-red-400">{error}</div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Preview (for rendering)</h3>
              <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-900 max-h-96 overflow-auto">
                <div ref={previewRef} className="prose max-w-none dark:prose-invert" />
              </div>
              <p className="text-sm text-gray-500 mt-2">The preview area is used to render the image. Images and fonts loaded from external domains may be blocked by CORS.</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ToolIcons.info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">How it works</h3>
              <div className="text-blue-700 dark:text-blue-300 space-y-2 text-sm">
                <p>Paste HTML or fetch a URL (if the server allows cross-origin requests). The tool renders the content inside a hidden preview area and captures it as an image using html2canvas.</p>
                <ol className="list-decimal list-inside">
                  <li>Paste HTML or enter a URL and click Fetch & Render.</li>
                  <li>Choose PNG or JPG output and click Download Image.</li>
                  <li>Download will start automatically.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
