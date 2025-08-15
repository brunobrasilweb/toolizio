"use client";

import { useRef, useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Image as ImageIcon, Download, Upload, Trash2, Crop, X } from "lucide-react";
import { trackGeneration, trackCopy } from "@/utils/analytics";

export default function ImageCropper() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageModalRef = useRef<HTMLImageElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Crop state in image coordinates
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragMode, setDragMode] = useState<'create' | 'move' | null>(null);
  const [grabOffset, setGrabOffset] = useState<{ x: number; y: number } | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null); // null = free

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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
    setCrop({ x: 0, y: 0, width: 100, height: 100 });

    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  // open modal for larger view after upload
  setIsModalOpen(true);
  };

  const clear = () => {
    setFile(null);
    setPreviewUrl(null);
    setError("");
    setSuccess("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onImageLoad = (e?: React.SyntheticEvent<HTMLImageElement>) => {
    const img = (e?.currentTarget as HTMLImageElement) ?? imageRef.current ?? imageModalRef.current;
    if (!img) return;
    // initialize crop to center of image
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const size = Math.min(w, h, 500);
    const x = Math.round((w - size) / 2);
    const y = Math.round((h - size) / 2);
    setCrop({ x, y, width: size, height: size });
  };

  // Helpers to convert between client coords and image natural coords
  const clientToImageCoords = (clientX: number, clientY: number) => {
  const img = isModalOpen ? imageModalRef.current : imageRef.current;
    if (!img) return null;
    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;
    const x = Math.round((clientX - rect.left) * scaleX);
    const y = Math.round((clientY - rect.top) * scaleY);
    return { x, y };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const coord = clientToImageCoords(e.clientX, e.clientY);
    const img = isModalOpen ? imageModalRef.current : imageRef.current;
    if (!coord || !img) return;

    // If clicked inside existing crop, start move
    if (
      coord.x >= crop.x &&
      coord.x <= crop.x + crop.width &&
      coord.y >= crop.y &&
      coord.y <= crop.y + crop.height
    ) {
      setDragMode('move');
      setGrabOffset({ x: coord.x - crop.x, y: coord.y - crop.y });
    } else {
      // Start creating new crop selection
      setDragMode('create');
      setDragStart({ x: coord.x, y: coord.y });
      setCrop({ x: coord.x, y: coord.y, width: 10, height: 10 });
    }

    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragMode) return;
    const curr = clientToImageCoords(e.clientX, e.clientY);
    const img = isModalOpen ? imageModalRef.current : imageRef.current;
    if (!curr || !img) return;

    if (dragMode === 'create') {
      const start = dragStart;
      if (!start) return;

      let x = Math.min(start.x, curr.x);
      let y = Math.min(start.y, curr.y);
      let w = Math.abs(curr.x - start.x);
      let h = Math.abs(curr.y - start.y);

      if (aspectRatio && w && h) {
        const desiredH = Math.round(w / aspectRatio);
        if (desiredH <= h) {
          h = desiredH;
        } else {
          const desiredW = Math.round(h * aspectRatio);
          w = desiredW;
        }
      }

      if (w < 10) w = 10;
      if (h < 10) h = 10;

      // clamp to image bounds
      x = Math.max(0, Math.min(x, img.naturalWidth - w));
      y = Math.max(0, Math.min(y, img.naturalHeight - h));

      setCrop({ x, y, width: w, height: h });
    }

    if (dragMode === 'move') {
      const offset = grabOffset;
      if (!offset) return;
      setCrop((prev) => {
        let newX = Math.round(curr.x - offset.x);
        let newY = Math.round(curr.y - offset.y);
        // clamp
        newX = Math.max(0, Math.min(newX, img.naturalWidth - prev.width));
        newY = Math.max(0, Math.min(newY, img.naturalHeight - prev.height));
        return { ...prev, x: newX, y: newY };
      });
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  setDragMode(null);
  setGrabOffset(null);
  };

  const doCrop = async () => {
    if (!file || !imageRef.current) {
      setError("Please upload an image first.");
      return;
    }

    setIsProcessing(true);
    setError("");
    setSuccess("");

    try {
      const img = imageRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(
        img,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, mime, 0.92));
      if (!blob) throw new Error("Failed to crop image");

      const url = URL.createObjectURL(blob);

      // Replace preview with cropped result
      setPreviewUrl(url);
      setFile(new File([blob], file.name.replace(/\.[^.]+$/, "") + "_cropped" + (mime === "image/png" ? ".png" : ".jpg"), { type: mime }));
      setSuccess("Image cropped successfully");

      // analytics
      trackGeneration("Image Crop");
    } catch (err) {
      console.error(err);
      setError("Failed to crop image. Try different area or file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!previewUrl || !file) return;
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    trackCopy("Cropped Image Download");
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
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">Image Cropper</h1>
            <p className="text-gray-600 dark:text-gray-300">Crop JPG and PNG images in your browser. Select area, choose aspect ratio and download the cropped image. Files are processed locally.</p>
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

            {previewUrl && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Crop Settings</h3>
                <div className="flex gap-3 flex-wrap">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="ratio" checked={aspectRatio === null} onChange={() => setAspectRatio(null)} />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Free</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="ratio" checked={aspectRatio === 1} onChange={() => setAspectRatio(1)} />
                    <span className="text-sm text-gray-600 dark:text-gray-300">1:1</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="ratio" checked={aspectRatio === 16/9} onChange={() => setAspectRatio(16/9)} />
                    <span className="text-sm text-gray-600 dark:text-gray-300">16:9</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="ratio" checked={aspectRatio === 4/3} onChange={() => setAspectRatio(4/3)} />
                    <span className="text-sm text-gray-600 dark:text-gray-300">4:3</span>
                  </label>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-900 rounded p-4">
                    <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Preview</h4>
                    <div className="relative border rounded overflow-hidden" style={{ paddingTop: '56.25%' }}>
                      <img
                        ref={imageRef}
                        src={previewUrl}
                        alt="preview"
                        onLoad={(e) => onImageLoad(e)}
                        className="absolute top-0 left-0 w-full h-full object-contain"
                        style={{ cursor: 'crosshair' }}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        draggable={false}
                      />

                      {/* Overlay box visualizing crop in client coords */}
                      <div ref={overlayRef} className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        {/* Position crop using inline styles computed from the preview image bounding rect */}
                        {imageRef.current && (() => {
                          try {
                            const rect = imageRef.current.getBoundingClientRect();
                            const scaleX = rect.width / imageRef.current.naturalWidth;
                            const scaleY = rect.height / imageRef.current.naturalHeight;
                            const left = Math.round(crop.x * scaleX);
                            const top = Math.round(crop.y * scaleY);
                            const width = Math.round(crop.width * scaleX);
                            const height = Math.round(crop.height * scaleY);
                            return (
                              <div style={{ left, top, width, height }} className="absolute border-2 border-blue-400 bg-blue-400/10 rounded" />
                            );
                          } catch (e) {
                            return null;
                          }
                        })()}
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">Drag on the image to select crop area. Use aspect ratio options to constrain the selection.</div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded p-4">
                    <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Actions</h4>
                    <div className="flex flex-col gap-3">
                      <button onClick={doCrop} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
                        {isProcessing ? <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin" /> : <Crop className="w-4 h-4" />}
                        <span>Crop</span>
                      </button>
                      <button onClick={clear} className="px-4 py-2 border rounded flex items-center gap-2"><Trash2 className="w-4 h-4" /> Clear</button>
                      <button onClick={download} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"><Download className="w-4 h-4" /> Download</button>
                    </div>

                    {error && <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 px-4 py-2 rounded">{error}</div>}
                    {success && <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 px-4 py-2 rounded">{success}</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Modal for larger crop view */}
            {isModalOpen && previewUrl && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                <div className="relative w-full max-w-6xl max-h-[90vh] overflow-auto bg-white dark:bg-gray-900 rounded">
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 z-10 p-2 rounded bg-white/80 dark:bg-gray-800/80">
                    <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  </button>
                  <div className="p-4">
                    <div className="relative" style={{ width: '100%', height: '80vh' }}>
                      <img
                        ref={imageModalRef}
                        src={previewUrl}
                        alt="modal preview"
                        onLoad={(e) => onImageLoad(e)}
                        className="absolute top-0 left-0 w-full h-full object-contain"
                        style={{ cursor: 'crosshair' }}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        draggable={false}
                      />

                      {/* overlay for modal image */}
                      {imageModalRef.current && (() => {
                        try {
                          const rect = imageModalRef.current.getBoundingClientRect();
                          const scaleX = rect.width / imageModalRef.current.naturalWidth;
                          const scaleY = rect.height / imageModalRef.current.naturalHeight;
                          const left = Math.round(crop.x * scaleX);
                          const top = Math.round(crop.y * scaleY);
                          const width = Math.round(crop.width * scaleX);
                          const height = Math.round(crop.height * scaleY);
                          return (
                            <div style={{ position: 'absolute', left, top, width, height }} className="border-2 border-blue-400 bg-blue-400/10 rounded" />
                          );
                        } catch (e) {
                          return null;
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mt-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">How it works</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">This tool uses the browser's HTML Canvas to crop images locally. No file is uploaded to a server. Choose an area by dragging on the image, pick a fixed aspect ratio or free crop, then crop and download.</p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
