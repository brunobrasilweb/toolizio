"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";
import { Barcode, Download, Copy, Globe, Info, FileText, Zap } from "lucide-react";
import JsBarcode from "jsbarcode";
import { trackGeneration, trackCopy } from "@/utils/analytics";

const translations = {
  "en": {
    title: "Barcode Generator",
    description: "Generate barcodes (EAN13, CODE128, UPC) and download as SVG or PNG. Customize text and format.",
    barcodeType: "Barcode Type",
    barcodeTypePlaceholder: "Select format",
    valueLabel: "Value",
    valuePlaceholder: "Enter code/value",
    textLabel: "Display Text",
    textPlaceholder: "Optional text below barcode",
    generate: "Generate Barcode",
    downloadSvg: "Download SVG",
    downloadPng: "Download PNG",
    copySvg: "Copy SVG",
    sampleValues: "Sample values: 0123456789012 (EAN13), CODE128 supports arbitrary text",
    featuresTitle: "Features",
    howToTitle: "How to use",
    howToSteps: [
      "Choose a barcode format (EAN13, UPC-A, CODE128)",
      "Enter the value to encode (numeric for EAN/UPC)",
      "Optionally set a display text",
      "Click Generate and download or copy the result"
    ]
    ,
    languageLabel: "Language",
    noBarcode: "No barcode generated yet",
    features: [
      { title: 'Fast & Offline', desc: 'Generates barcodes locally in your browser. No uploads.' },
      { title: 'Export', desc: 'Download as SVG or PNG, or copy SVG markup to clipboard.' },
      { title: 'Multi-format', desc: 'Supports common formats: CODE128, EAN13 and UPC.' }
    ]
  },
  "pt-BR": {
    title: "Gerador de Código de Barras",
    description: "Gere códigos de barras (EAN13, CODE128, UPC) e baixe como SVG ou PNG. Personalize texto e formato.",
    barcodeType: "Tipo de Código",
    barcodeTypePlaceholder: "Selecione o formato",
    valueLabel: "Valor",
    valuePlaceholder: "Digite o código/valor",
    textLabel: "Texto de Exibição",
    textPlaceholder: "Texto opcional abaixo do código",
    generate: "Gerar Código",
    downloadSvg: "Baixar SVG",
    downloadPng: "Baixar PNG",
    copySvg: "Copiar SVG",
    sampleValues: "Exemplos: 0123456789012 (EAN13), CODE128 suporta texto livre",
    featuresTitle: "Recursos",
    howToTitle: "Como usar",
    howToSteps: [
      "Escolha o formato do código (EAN13, UPC-A, CODE128)",
      "Digite o valor a ser codificado (numérico para EAN/UPC)",
      "Opcionalmente defina um texto de exibição",
      "Clique em Gerar e baixe ou copie o resultado"
    ]
    ,
    languageLabel: "Idioma",
    noBarcode: "Nenhum código gerado ainda",
    features: [
      { title: 'Rápido e Offline', desc: 'Gera códigos localmente no seu navegador. Sem envio de arquivos.' },
      { title: 'Exportar', desc: 'Baixe como SVG ou PNG, ou copie o SVG para a área de transferência.' },
      { title: 'Multi-formato', desc: 'Suporta formatos comuns: CODE128, EAN13 e UPC.' }
    ]
  }
}

export default function BarcodeGenerator() {
  const [language, setLanguage] = useState<'en' | 'pt-BR'>('en');
  const t = translations[language];
  const [type, setType] = useState<string>('CODE128');
  const [value, setValue] = useState<string>('0123456789012');
  const [displayText, setDisplayText] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Generate initial barcode
    try {
      generateBarcode();
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateBarcode = () => {
    if (!value) return;

  // Create an SVG element to render the barcode
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    try {
      JsBarcode(svg, value, {
        format: type as any,
        displayValue: !!displayText,
        text: displayText || undefined,
        margin: 10,
        height: 60,
        width: 2,
      });

  // Update svg string (used to render and download)
      const serializer = new XMLSerializer();
      const str = serializer.serializeToString(svg);
      setSvgString(str);

  // Note: PNG rendering is done on-demand during download to ensure correct sizing

      trackGeneration('Barcode');
    } catch (err) {
      console.error('Barcode generation error', err);
    }
  };

  const downloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `barcode-${type}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    trackCopy('Barcode SVG');
  };

  const downloadPng = () => {
    if (!svgString) return;
    // Create image from SVG string and draw to canvas, then download
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Canvas not supported');
        URL.revokeObjectURL(url);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      try {
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `barcode-${type}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        trackCopy('Barcode PNG');
      } catch (e) {
        console.error('PNG download failed', e);
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = (e) => {
      console.error('Image load error', e);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const copySvg = async () => {
    if (!svgString) return;
    try {
      await navigator.clipboard.writeText(svgString);
      trackCopy('Barcode SVG');
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <ToolIcons.qrcode className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.title}</h1>
          <p className="text-base text-gray-600 dark:text-gray-300">{t.description}</p>
        </div>

        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 dark:text-gray-300">{t.languageLabel}:</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm">
              <option value="en">English</option>
              <option value="pt-BR">Português</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.barcodeType}</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white">
                  <option value="CODE128">CODE128</option>
                  <option value="EAN13">EAN13</option>
                  <option value="UPC">UPC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.valueLabel}</label>
                <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder={t.valuePlaceholder} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.sampleValues}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.textLabel}</label>
                <input type="text" value={displayText} onChange={(e) => setDisplayText(e.target.value)} placeholder={t.textPlaceholder} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white" />
              </div>

              <div className="flex gap-3">
                <button onClick={generateBarcode} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md flex items-center justify-center gap-2"><Barcode className="w-4 h-4" /> {t.generate}</button>
                <button onClick={downloadSvg} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-md flex items-center gap-2"><Download className="w-4 h-4" /> {t.downloadSvg}</button>
              </div>

              <div className="flex gap-3">
                <button onClick={downloadPng} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-md flex items-center gap-2"><Download className="w-4 h-4" /> {t.downloadPng}</button>
                <button onClick={copySvg} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-md flex items-center gap-2"><Copy className="w-4 h-4" /> {t.copySvg}</button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-center">
            <div className="mb-4">
              <div id="svg-container" className="bg-white p-3 rounded-md">
                {/* Render SVG from svgString to ensure visible and downloadable content */}
                {svgString ? (
                  <div className="mx-auto" dangerouslySetInnerHTML={{ __html: svgString }} />
                ) : (
                  <div className="text-gray-400">{t.noBarcode}</div>
                )}
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="w-full text-left mt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t.featuresTitle}</h3>
              <div className="grid grid-cols-1 gap-3">
                {t.features.map((f, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                      {i === 0 && <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                      {i === 1 && <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                      {i === 2 && <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{f.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t.howToTitle}</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            {t.howToSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>

      </main>

      <Footer />
    </div>
  );
}
