"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ImageIcon, Upload, Download, Trash2, Settings, FileImage } from "lucide-react";
import { trackGeneration, trackCopy } from "@/utils/analytics";

type ModelType = any;

export default function BackgroundRemoval() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [model, setModel] = useState<ModelType | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // options
  const [segmentationThreshold, setSegmentationThreshold] = useState<number>(0.7);
  const [maskBlurAmount, setMaskBlurAmount] = useState<number>(3);
  const [backgroundMode, setBackgroundMode] = useState<'transparent' | 'color'>('transparent');
  const [bgColor, setBgColor] = useState<string>('#ffffff');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const tf = await import('@tensorflow/tfjs');
        if (tf?.setBackend) {
          try { await tf.setBackend('webgl'); } catch (e) { /* ignore */ }
        }
        await tf.ready();
        const bodyPix = await import('@tensorflow-models/body-pix');
        const loaded = await bodyPix.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          multiplier: 0.75,
          quantBytes: 2,
        });
        if (mounted) setModel(loaded);
      } catch (err) {
        console.error('Model load error', err);
        setError('Failed to load segmentation model. This tool requires WebGL and may not work on older browsers.');
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
    };
  }, [previewUrl, processedUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Unsupported file type. Please upload a JPG or PNG image.');
      return;
    }
    setFile(f);
    setError('');
    setProcessedUrl(null);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const clear = () => {
    setFile(null);
    setPreviewUrl(null);
    setProcessedUrl(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const runBackgroundRemoval = async () => {
    if (!file || !previewUrl) { setError('Please upload an image first.'); return; }
    if (!model) { setError('Segmentation model is not loaded yet. Please wait a moment.'); return; }

    setIsProcessing(true);
    setError('');

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = previewUrl;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

      const segmentation = await model.segmentPerson(img, {
        internalResolution: 'medium',
        segmentationThreshold: segmentationThreshold,
        maskBlurAmount: maskBlurAmount,
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const mask = segmentation.data;

      for (let i = 0; i < mask.length; i++) {
        const alphaIndex = i * 4 + 3;
        if (mask[i] === 0) {
          if (backgroundMode === 'transparent') {
            data[alphaIndex] = 0;
          } else {
            const hex = bgColor.replace('#', '');
            const r = parseInt(hex.substring(0,2),16);
            const g = parseInt(hex.substring(2,4),16);
            const b = parseInt(hex.substring(4,6),16);
            const idx = i * 4;
            data[idx] = r; data[idx+1] = g; data[idx+2] = b; data[alphaIndex] = 255;
          }
        } else {
          data[alphaIndex] = 255;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Failed to create result image');
      const url = URL.createObjectURL(blob);
      setProcessedUrl(url);

      trackGeneration('Background Removal');
    } catch (err) {
      console.error(err);
      setError('Failed to remove background. Try a different image or wait for the model to load.');
    } finally {
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!processedUrl || !file) return;
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = file.name.replace(/\.[^.]+$/, '') + '_no-bg.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    trackCopy('Background Removed Image');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full"><ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" /></div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Background Removal</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Remove the background from photos directly in your browser. No uploads to servers — segmentation runs locally using an on-device model. Export a PNG with transparent background or replace it with a solid color.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center mb-4"><Settings className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" /><h2 className="text-xl font-semibold text-gray-900 dark:text-white">Options</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Segmentation threshold ({segmentationThreshold})</label>
                <input type="range" min="0.1" max="0.95" step="0.05" value={segmentationThreshold} onChange={(e)=>setSegmentationThreshold(Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mask blur amount ({maskBlurAmount})</label>
                <input type="range" min="0" max="10" step="1" value={maskBlurAmount} onChange={(e)=>setMaskBlurAmount(Number(e.target.value))} className="w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background mode</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2"><input type="radio" name="bgmode" checked={backgroundMode==='transparent'} onChange={()=>setBackgroundMode('transparent')} /><span className="text-sm text-gray-600 dark:text-gray-300">Transparent (PNG)</span></label>
                  <label className="flex items-center gap-2"><input type="radio" name="bgmode" checked={backgroundMode==='color'} onChange={()=>setBackgroundMode('color')} /><span className="text-sm text-gray-600 dark:text-gray-300">Replace with color</span></label>
                  {backgroundMode === 'color' && (<input type="color" value={bgColor} onChange={(e)=>setBgColor(e.target.value)} className="w-10 h-10 p-0 border rounded" />)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Image</h2>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">Drop or choose a JPG/PNG image</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Processing is done locally in your browser. Model download is required on first use.</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <div className="flex justify-center gap-3"><button onClick={()=>fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Choose Image</button><button onClick={clear} className="px-4 py-2 border rounded">Clear</button></div>
            </div>

            {previewUrl && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded p-4">
                  <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Preview</h4>
                  <div className="border rounded overflow-hidden"><img ref={imgRef} src={previewUrl} alt="preview" className="w-full h-auto object-contain" /></div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded p-4">
                  <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Result</h4>
                  <div className="border rounded overflow-hidden min-h-[180px] flex items-center justify-center bg-gray-50 dark:bg-gray-800">{isProcessing?(<div className="text-gray-600">Processing...</div>):processedUrl?(<img src={processedUrl} alt="processed" className="w-full h-auto object-contain" />):(<div className="text-sm text-gray-500">No result yet</div>)}</div>
                  <div className="mt-3 flex gap-2"><button onClick={runBackgroundRemoval} disabled={isProcessing} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{isProcessing? 'Running...':'Remove Background'}</button><button onClick={download} disabled={!processedUrl} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Download</button><button onClick={clear} className="px-4 py-2 border rounded"><Trash2 className="w-4 h-4" /></button></div>
                  {error && <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 px-4 py-2 rounded">{error}</div>}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3"><div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div><div><h3 className="font-medium text-gray-900 dark:text-white">Local Processing</h3><p className="text-sm text-gray-600 dark:text-gray-300">All work is done in your browser — images are not uploaded to external servers.</p></div></div>
              <div className="flex items-start space-x-3"><div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><FileImage className="w-5 h-5 text-green-600 dark:text-green-400" /></div><div><h3 className="font-medium text-gray-900 dark:text-white">PNG Export</h3><p className="text-sm text-gray-600 dark:text-gray-300">Export images with transparent background (PNG) or replace with a solid color.</p></div></div>
              <div className="flex items-start space-x-3"><div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg"><Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" /></div><div><h3 className="font-medium text-gray-900 dark:text-white">Adjustable</h3><p className="text-sm text-gray-600 dark:text-gray-300">Tweak threshold and blur settings to improve cutout quality.</p></div></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How it works</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">This tool uses an on-device segmentation model to identify people/subjects in the image. The model runs inside your browser (TensorFlow.js + BodyPix). After segmentation the background pixels are either made transparent or replaced by a chosen color. No server-side processing is involved.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">FAQ</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div><h3 className="font-medium text-gray-900 dark:text-white">What images work best?</h3><p>Portraits and photos with clear foreground subjects work best. Complex backgrounds or small subjects may produce imperfect results.</p></div>
              <div><h3 className="font-medium text-gray-900 dark:text-white">Is my image uploaded?</h3><p>No — everything runs locally in your browser. The model is downloaded to your device on first use.</p></div>
              <div><h3 className="font-medium text-gray-900 dark:text-white">Why does the model need to download?</h3><p>The segmentation model (TensorFlow.js BodyPix) is downloaded once so the inference can run on the client. This enables private, fast processing without server costs.</p></div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
