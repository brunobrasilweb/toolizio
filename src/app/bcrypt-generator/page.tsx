"use client"

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trackGeneration, trackCopy } from "@/utils/analytics";
import { Key, Copy, Shield, Settings, Zap, Globe, Smartphone } from "lucide-react";

export default function BcryptGenerator() {
  const [input, setInput] = useState("");
  const [saltRounds, setSaltRounds] = useState(10);
  const [hash, setHash] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  async function generateHash() {
    if (!input) {
      setError('Please provide text to hash');
      return;
    }
    setError('');
    setIsGenerating(true);
    try {
      const bcrypt = await import('bcryptjs');
      const generated = await new Promise<string>((resolve) => {
        setTimeout(() => {
          try {
            const s = bcrypt.genSaltSync(saltRounds);
            const h = bcrypt.hashSync(input, s);
            resolve(h);
          } catch (err) {
            resolve('');
          }
        }, 0);
      });

      if (generated) {
        setHash(generated);
        trackGeneration('Bcrypt Hash');
      } else {
        setError('Failed to generate hash');
      }
    } catch (err) {
      console.error(err);
      setError('Unexpected error while generating hash');
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyHash() {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
      trackCopy('Bcrypt Hash');
    } catch (err) {
      console.error('Copy failed', err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Bcrypt Generator</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Generate bcrypt hashes from a text string for testing and development.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Text to hash</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter text to generate bcrypt hash"
            />

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salt rounds ({saltRounds})</label>
                <input type="range" min={4} max={15} value={saltRounds} onChange={(e) => setSaltRounds(Number(e.target.value))} className="w-full" />
              </div>
              <div className="flex items-end">
                <button onClick={generateHash} disabled={isGenerating} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  {isGenerating ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <Key className="w-5 h-5" />}
                  <span>{isGenerating ? 'Generating...' : 'Generate Bcrypt'}</span>
                </button>
              </div>
            </div>

            {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mt-4">{error}</div>}

            {hash && (
              <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <pre className="whitespace-pre-wrap break-all text-sm text-gray-900 dark:text-white">{hash}</pre>
                  <button onClick={copyHash} className="ml-4 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><Copy className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <section className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Client-side hashing</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">All hashing runs locally in your browser — your text is never sent to a server.</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <Settings className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Adjustable salt rounds</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Choose the cost (salt rounds) to test different hashing times and strengths.</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Fast for testing</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Use low salt rounds for quick generation during development.</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <Copy className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Copy to clipboard</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Quickly copy the generated bcrypt hash with one click.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use Section */}
          <section className="mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">How to use</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                <li>Type or paste the text you want to hash into the input area.</li>
                <li>Adjust the salt rounds slider to control hashing cost (higher = slower but stronger).</li>
                <li>Click <strong>Generate Bcrypt</strong> to compute the hash locally in your browser.</li>
                <li>Copy the resulting hash using the copy button and use it for testing or verification.</li>
              </ol>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
