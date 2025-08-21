"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trackGeneration, trackToolUsage } from "@/utils/analytics";
import { Search, Download, Globe, Mail, Phone } from "lucide-react";

type Result = {
  emails: string[];
  phones: string[];
};

export default function ContactExtractorPage() {
  const [url, setUrl] = useState<string>("");
  const [country, setCountry] = useState<string>("any");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ processed: number; queue: number; current?: string } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string>("");
  const controllerRef = useRef<AbortController | null>(null);

  const start = async () => {
    setError("");
    setResult(null);
    setProgress({ processed: 0, queue: 0 });
    setLoading(true);

    try {
      const res = await fetch('/api/contact-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, country }),
      });

      if (!res.ok || !res.body) {
        const txt = await res.text();
        throw new Error(txt || 'Server error');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() || '';
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const msg = JSON.parse(line);
            if (msg.type === 'progress') {
              setProgress({ processed: msg.processed || 0, queue: msg.queue || 0, current: msg.current });
            } else if (msg.type === 'result') {
              setResult({ emails: msg.emails || [], phones: msg.phones || [] });
            } else if (msg.type === 'error') {
              setError(msg.message || 'Error');
            }
          } catch (e) {
            // ignore parse errors
          }
        }
      }

      // track tool usage
      trackGeneration('Contact Extractor');
      trackToolUsage('Contact Extractor', 'extract');

    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = () => {
    if (!result) return;
    const rows = ['type,value'];
    for (const e of result.emails) rows.push(`email,${e}`);
    for (const p of result.phones) rows.push(`phone,${p}`);
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const urlObj = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlObj;
    a.download = 'contacts.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(urlObj);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact Extractor</h1>
            <p className="text-gray-600 dark:text-gray-300">Discover contact information quickly: this tool crawls a website and extracts email addresses and phone numbers from up to 100 internal pages. Select a country phone format to increase matching accuracy. Results are shown live with progress updates and can be downloaded as CSV.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website URL</label>
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone format</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                <option value="any">Any</option>
                <option value="us">United States (+1)</option>
                <option value="uk">United Kingdom (+44)</option>
                <option value="br">Brazil (+55)</option>
                <option value="de">Germany (+49)</option>
                <option value="fr">France (+33)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={start} disabled={loading || !url} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Search className="w-4 h-4" />
              {loading ? 'Scanning...' : 'Start Scan'}
            </button>
            {result && (
              <button onClick={downloadCsv} className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download CSV
              </button>
            )}
          </div>

          <div className="mt-6">
            {error && <div className="text-red-600">{error}</div>}

            {progress && (
              <div className="mt-4">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Processed: {progress.processed} • Queue: {progress.queue} {progress.current ? `• current: ${progress.current}` : ''}</div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div style={{ width: `${Math.min(100, (progress.processed / (progress.processed + progress.queue || 1)) * 100)}%` }} className="h-3 bg-purple-600" />
                </div>
              </div>
            )}

            {result && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-4">
                  <div className="flex items-center gap-2 mb-2"><Mail className="w-4 h-4 text-indigo-600" /><h3 className="font-semibold">Emails</h3></div>
                  {result.emails.length === 0 ? <div className="text-sm text-gray-500">No emails found</div> : <ul className="text-sm">
                    {result.emails.map((e) => <li key={e}><a className="text-indigo-600 hover:underline" href={`mailto:${e}`}>{e}</a></li>)}
                  </ul>}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded p-4">
                  <div className="flex items-center gap-2 mb-2"><Phone className="w-4 h-4 text-green-600" /><h3 className="font-semibold">Phone numbers</h3></div>
                  {result.phones.length === 0 ? <div className="text-sm text-gray-500">No phones found</div> : <ul className="text-sm">
                    {result.phones.map((p) => <li key={p}><a className="text-green-600 hover:underline" href={`tel:${p}`}>{p}</a></li>)}
                  </ul>}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
