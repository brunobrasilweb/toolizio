"use client";

import { useState } from "react";
import Link from "next/link";
import { trackGeneration, trackCopy, trackEvent } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";

interface UuidOptions {
  version: "v1" | "v4";
  quantity: number;
  uppercase: boolean;
  removeDashes: boolean;
}

// Função para gerar UUID v4 (random)
function generateUuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Função para gerar UUID v1 (timestamp-based)
function generateUuidV1(): string {
  // Timestamp simplificado para v1
  const timestamp = Date.now();
  const timestampHex = timestamp.toString(16);
  const randomNode = Math.random().toString(16).substr(2, 12);
  const clockSeq = Math.random().toString(16).substr(2, 4);
  
  return `${timestampHex.substr(0, 8)}-${timestampHex.substr(8, 4)}-1${timestampHex.substr(12, 3)}-${clockSeq.substr(0, 4)}-${randomNode}`;
}

// Função principal para gerar UUID
function generateUuid(options: UuidOptions): string[] {
  const uuids: string[] = [];
  
  for (let i = 0; i < options.quantity; i++) {
    let uuid = options.version === "v4" ? generateUuidV4() : generateUuidV1();
    
    if (options.removeDashes) {
      uuid = uuid.replace(/-/g, "");
    }
    
    if (options.uppercase) {
      uuid = uuid.toUpperCase();
    }
    
    uuids.push(uuid);
  }
  
  return uuids;
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [options, setOptions] = useState<UuidOptions>({
    version: "v4",
    quantity: 1,
    uppercase: false,
    removeDashes: false
  });
  const [copied, setCopied] = useState<number | null>(null);

  const handleGenerate = () => {
    const newUuids = generateUuid(options);
    setUuids(newUuids);
    trackGeneration("uuid_generator");
  };

  const handleCopy = async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopied(index);
      trackCopy("uuid_generator");
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Falha ao copiar: ", err);
    }
  };

  const handleCopyAll = async () => {
    try {
      const allUuids = uuids.join("\n");
      await navigator.clipboard.writeText(allUuids);
      setCopied(-1);
      trackCopy("uuid_generator");
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Falha ao copiar: ", err);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                <ToolIcons.uuid className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Gerador de UUID
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Gere identificadores únicos universais (UUID) de forma rápida e segura. 
              Suporte para versões v1 e v4 com opções de personalização.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <div className="space-y-6">
              {/* Configurações */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Versão do UUID
                  </label>
                  <select
                    value={options.version}
                    onChange={(e) => setOptions({ ...options, version: e.target.value as "v1" | "v4" })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="v4">UUID v4 (Random)</option>
                    <option value="v1">UUID v1 (Timestamp)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={options.quantity}
                    onChange={(e) => setOptions({ ...options, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="uppercase"
                    checked={options.uppercase}
                    onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="uppercase" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maiúsculas
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="removeDashes"
                    checked={options.removeDashes}
                    onChange={(e) => setOptions({ ...options, removeDashes: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="removeDashes" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sem hífens
                  </label>
                </div>
              </div>

              {/* Botão Gerar */}
              <div className="text-center">
                <button
                  onClick={handleGenerate}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Gerar UUID{options.quantity > 1 ? "s" : ""}
                </button>
              </div>
            </div>
          </div>

          {/* Resultados */}
          {uuids.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  UUID{uuids.length > 1 ? "s" : ""} Gerado{uuids.length > 1 ? "s" : ""}
                </h2>
                {uuids.length > 1 && (
                  <button
                    onClick={handleCopyAll}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      copied === -1
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {copied === -1 ? "Copiado!" : "Copiar Todos"}
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {uuids.map((uuid, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <code className="text-sm font-mono text-gray-800 dark:text-gray-200 flex-1 break-all">
                      {uuid}
                    </code>
                    <button
                      onClick={() => handleCopy(uuid, index)}
                      className={`ml-4 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                        copied === index
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {copied === index ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informações sobre UUID */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sobre UUIDs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  UUID v4 (Random)
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Gerado aleatoriamente com 122 bits de entropia. É o tipo mais comum 
                  e recomendado para a maioria dos casos de uso.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  UUID v1 (Timestamp)
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Baseado no timestamp e endereço MAC. Pode garantir ordem temporal, 
                  mas pode revelar informações sobre quando e onde foi gerado.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Casos de Uso
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                <li>Identificadores únicos para bancos de dados</li>
                <li>IDs de sessão e tokens</li>
                <li>Nomes de arquivos únicos</li>
                <li>Chaves primárias distribuídas</li>
                <li>Identificadores de transações</li>
              </ul>
            </div>
          </div>

          {/* Navegação */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              ← Voltar para Ferramentas
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
