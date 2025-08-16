"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";
import { trackGeneration, trackCopy } from "@/utils/analytics";

export default function Sorteio() {
  const [input, setInput] = useState<string>("");
  const [names, setNames] = useState<string[]>([]);
  const [isPicking, setIsPicking] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>("");
  const [error, setError] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const parseNames = (text: string) => {
    return text
      .split(/\r?\n|,|;/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  const handleStart = async () => {
    const parsed = parseNames(input);
    if (parsed.length === 0) {
      setError("Por favor insira pelo menos um nome para sortear.");
      return;
    }
    setError("");
    setNames(parsed);
    setWinner("");
    setIsPicking(true);

    // animação de sorteio: highlight change rápido depois desacelera
    const duration = 2500; // ms
    const start = Date.now();
    let currentIndex = -1;

    while (Date.now() - start < duration) {
      currentIndex = Math.floor(Math.random() * parsed.length);
      setWinner(parsed[currentIndex]);
      // animação: rapidez variável
      const elapsed = Date.now() - start;
      const t = elapsed / duration; // 0..1
      // ease out: (1 - (1-t)^3)
      const delay = Math.max(30, 300 * (1 - Math.pow(1 - t, 3)));
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, delay));
    }

    // resultado final (garante aleatoriedade)
    const finalIndex = Math.floor(Math.random() * parsed.length);
    setWinner(parsed[finalIndex]);
    setIsPicking(false);

    // analytics
    trackGeneration('Sorteio');
  };

  const handleClear = () => {
    setInput("");
    setNames([]);
    setWinner("");
    setError("");
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleCopyWinner = async () => {
    if (!winner) return;
    try {
      await navigator.clipboard.writeText(winner);
      trackCopy('Sorteio Winner');
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header showBackButton={true} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ToolIcons.timer className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Sorteio Online</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Cole uma lista de nomes (uma por linha ou separados por vírgula) e sorteie um vencedor. Visual atraente e compartilhável.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Como funciona</h2>
            <p className="text-gray-600 dark:text-gray-300">Cole ou digite os nomes no campo abaixo. Você pode separar por linha, vírgula ou ponto-e-vírgula. Clique em "Sortear" para iniciar a animação e revelar o vencedor.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Lista de Nomes</h3>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"Digite nomes, um por linha, ou separados por vírgula"}
              className="w-full min-h-[140px] p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-400"
            />

            {error && <div className="mt-3 text-red-700 dark:text-red-300">{error}</div>}

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStart}
                disabled={isPicking}
                className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {isPicking ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Sortear...</span>
                  </div>
                ) : (
                  <span>Sortear</span>
                )}
              </button>

              <button
                onClick={handleClear}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Limpar
              </button>

              <button
                onClick={() => {
                  if (!input) return;
                  const parsed = parseNames(input);
                  setNames(parsed);
                }}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Pré-visualizar ({names.length})
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Resultado</h3>

            <div className="min-h-[120px] flex items-center justify-center">
              {winner ? (
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Vencedor</div>
                  <div className="text-3xl md:text-5xl font-extrabold text-amber-600 dark:text-amber-300 break-words">{winner}</div>

                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button onClick={handleCopyWinner} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg">Copiar</button>
                    <button onClick={() => { navigator.clipboard.writeText(winner || ''); }} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">Compartilhar</button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-600 dark:text-gray-400">Nenhum vencedor selecionado ainda.</div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Dicas</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>Para resultados justos, evite duplicar nomes na lista (a menos que deseje maior probabilidade para um participante).</li>
              <li>Use a pré-visualização para verificar a lista antes de sortear.</li>
              <li>Compartilhe o resultado copiando o nome do vencedor.</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <ToolIcons.timer className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Animação Atrativa</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Animação de sorteio que desacelera até revelar o vencedor.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <ToolIcons.copy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Copiar Resultado</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Copie o nome do vencedor com um clique.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <ToolIcons.check className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Resultado Destacado</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">O vencedor aparece em destaque grande para fácil visualização e captura de tela.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
