"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";
import { trackGeneration, trackCopy } from "@/utils/analytics";

function countWords(text: string) {
  if (!text) return 0;
  const matches = text.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

function countCharacters(text: string, includeSpaces: boolean) {
  if (!text) return 0;
  return includeSpaces ? text.length : text.replace(/\s/g, '').length;
}

function countSentences(text: string) {
  if (!text) return 0;
  const matches = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return matches ? matches.length : 0;
}

function countLines(text: string) {
  if (!text) return 0;
  return text.split(/\r\n|\r|\n/).length;
}

function estimateReadingTime(words: number, wordsPerMinute = 200) {
  if (words === 0) return '0 min';
  const minutes = words / wordsPerMinute;
  if (minutes < 1) return '< 1 min';
  return `${Math.ceil(minutes)} min`;
}

export default function WordCounter() {
  const [text, setText] = useState<string>("");
  const [includeSpaces, setIncludeSpaces] = useState<boolean>(true);
  const [trimMultipleSpaces, setTrimMultipleSpaces] = useState<boolean>(false);
  const [wordsPerMinute, setWordsPerMinute] = useState<number>(200);
  const [copied, setCopied] = useState<boolean>(false);

  const processedText = useMemo(() => {
    let t = text;
    if (trimMultipleSpaces) {
      t = t.replace(/\s+/g, ' ');
    }
    return t;
  }, [text, trimMultipleSpaces]);

  const words = useMemo(() => countWords(processedText), [processedText]);
  const characters = useMemo(() => countCharacters(processedText, includeSpaces), [processedText, includeSpaces]);
  const sentences = useMemo(() => countSentences(processedText), [processedText]);
  const lines = useMemo(() => countLines(processedText), [processedText]);
  const readingTime = useMemo(() => estimateReadingTime(words, wordsPerMinute), [words, wordsPerMinute]);

  const handleClear = () => {
    setText("");
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(processedText);
      setCopied(true);
      trackCopy('Word Counter Output');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handleAnalyze = () => {
    trackGeneration('Word Counter');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header showBackButton={true} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <ToolIcons.calculator className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Word Counter</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Count words, characters, sentences, lines and estimate reading time. Fast, private and free.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enter your text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-64 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-green-500"
                placeholder="Paste or type your text here..."
                onBlur={handleAnalyze}
              />

              <div className="flex flex-wrap gap-3 mt-4">
                <button onClick={handleClear} className="px-4 py-2 border rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Clear</button>
                <button onClick={handleCopy} className={`px-4 py-2 rounded-lg text-sm text-white ${copied ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}>
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
                <button onClick={() => { navigator.clipboard.writeText(processedText); }} className="px-4 py-2 border rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Copy Raw</button>
              </div>
            </div>

            <aside className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Statistics</h3>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center justify-between">
                  <span>Words</span>
                  <span className="font-medium text-gray-900 dark:text-white">{words}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Characters {includeSpaces ? '(incl. spaces)' : '(excl. spaces)'}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{characters}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sentences</span>
                  <span className="font-medium text-gray-900 dark:text-white">{sentences}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Lines</span>
                  <span className="font-medium text-gray-900 dark:text-white">{lines}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reading time</span>
                  <span className="font-medium text-gray-900 dark:text-white">{readingTime}</span>
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={includeSpaces} onChange={(e) => setIncludeSpaces(e.target.checked)} className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Include spaces in character count</span>
                </label>

                <label className="flex items-center space-x-2 mt-2">
                  <input type="checkbox" checked={trimMultipleSpaces} onChange={(e) => setTrimMultipleSpaces(e.target.checked)} className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Trim multiple spaces</span>
                </label>

                <div className="mt-3">
                  <label className="text-sm text-gray-700 dark:text-gray-300">Words per minute</label>
                  <input type="number" value={wordsPerMinute} onChange={(e) => setWordsPerMinute(Number(e.target.value) || 1)} className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" min={50} max={1000} />
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <ToolIcons.copy className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Live statistics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Counts update as you type with no server requests</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ToolIcons.calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Multiple metrics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Words, characters, sentences, lines and reading time</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <ToolIcons.tip className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Private & Fast</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">All processing is done in your browser, no data leaves your device</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How it works</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
            <li>Paste or type your text into the editor.</li>
            <li>Adjust options like counting spaces or trimming extra spaces.</li>
            <li>Read live statistics or copy the processed text.</li>
          </ol>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-16">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-medium">Is my text sent to a server?</h3>
              <p className="text-sm">No. All computations happen locally in your browser.</p>
            </div>

            <div>
              <h3 className="font-medium">Can I use this for large texts?</h3>
              <p className="text-sm">Yes. The tool is optimized for reasonably large texts (tens of thousands of characters). Extremely large files may be slower depending on your device.</p>
            </div>

            <div>
              <h3 className="font-medium">How accurate is the word count?</h3>
              <p className="text-sm">This counter uses a simple, robust algorithm that matches non-whitespace sequences as words. For most use-cases (articles, essays, code snippets) it will be accurate.</p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
