"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";
import { trackGeneration, trackCopy } from "@/utils/analytics";
import { CardNetwork, generateCards, formatCardNumber } from "@/utils/creditCard";

interface Options {
  network: CardNetwork;
  quantity: number;
  format: 'groups' | 'continuous';
  masked: boolean;
}

export default function CreditCardGenerator() {
  const [options, setOptions] = useState<Options>({ network: 'visa', quantity: 1, format: 'groups', masked: false });
  const [cards, setCards] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const handleGenerate = () => {
    const generated = generateCards({ network: options.network, quantity: options.quantity, format: options.format, masked: options.masked });
    setCards(generated);
    trackGeneration('credit_card_generator');
  };

  const handleCopy = async (value: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(idx);
      trackCopy('credit_card_generator');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(cards.join('\n'));
      setCopied(-1);
      trackCopy('credit_card_generator');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                <ToolIcons.hash className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Credit Card Number Generator</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Generate valid credit card numbers for testing and QA. Numbers are produced using common issuer prefixes and validated with the Luhn (mod10) algorithm.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Network</label>
                  <select
                    value={options.network}
                    onChange={(e) => setOptions({ ...options, network: e.target.value as CardNetwork })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="visa">Visa</option>
                    <option value="mastercard">MasterCard</option>
                    <option value="amex">American Express</option>
                    <option value="discover">Discover</option>
                    <option value="jcb">JCB</option>
                    <option value="diners">Diners Club</option>
                    <option value="maestro">Maestro</option>
                    <option value="unknown">Random</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={options.quantity}
                    onChange={(e) => setOptions({ ...options, quantity: Math.max(1, Math.min(100, parseInt(e.target.value || '1'))) })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="groups"
                    checked={options.format === 'groups'}
                    onChange={() => setOptions({ ...options, format: 'groups' })}
                    className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <label htmlFor="groups" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Grouped</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="continuous"
                    checked={options.format === 'continuous'}
                    onChange={() => setOptions({ ...options, format: 'continuous' })}
                    className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <label htmlFor="continuous" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Continuous</label>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleGenerate}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Generate {options.quantity > 1 ? 'Cards' : 'Card'}
                </button>
              </div>
            </div>
          </div>

          {cards.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Generated Card{cards.length > 1 ? 's' : ''}</h2>
                {cards.length > 1 && (
                  <button
                    onClick={handleCopyAll}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${copied === -1 ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    {copied === -1 ? 'Copied!' : 'Copy All'}
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {cards.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <code className="text-sm font-mono text-gray-800 dark:text-gray-200 flex-1 break-all">{c}</code>
                    <button
                      onClick={() => handleCopy(c, idx)}
                      className={`ml-4 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${copied === idx ? 'bg-green-500 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
                    >
                      {copied === idx ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About this Generator</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Luhn (Mod 10) Algorithm</h3>
                <p className="text-gray-600 dark:text-gray-300">The generated numbers include a valid check digit computed with the Luhn algorithm (mod10). This ensures numbers pass client-side or server-side Luhn validation commonly used in payment systems.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Use Cases</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Testing payment form validation</li>
                  <li>QA automated tests for e-commerce flows</li>
                  <li>Load-testing with realistic-looking numbers</li>
                  <li>Developers learning how card validation works</li>
                </ul>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Security & Ethics</h3>
              <p className="text-gray-600 dark:text-gray-300">Only use generated numbers for testing in non-production environments and never use them for real transactions. These numbers are for development and QA purposes only.</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="inline-flex items-center text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 font-medium">← Back to Tools</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
