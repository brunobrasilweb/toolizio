"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";
import { Calculator, Info, Download, Copy, ChevronDown, ChevronUp } from "lucide-react";

// Translations
const translations = {
  "pt-BR": {
    title: "Calculadora de Salário Líquido",
    description: "Calcule seu salário líquido da CLT com desconto do INSS e IRRF de forma precisa",
    formTitle: "Dados para Cálculo",
    grossSalary: "Salário Bruto",
    grossSalaryPlaceholder: "Ex: 5000 ou 5000.00",
    dependents: "Número de Dependentes",
    dependentsPlaceholder: "0",
    dependentsInfo: "Dedução de R$ 189,59 por dependente no IRRF",
    otherDeductions: "Outros Descontos",
    otherDeductionsPlaceholder: "Ex: 200 ou 200.00",
    otherDeductionsInfo: "Ex: plano de saúde, vale transporte, etc.",
    calculate: "Calcular Salário Líquido",
    result: "Resultado",
    copy: "Copiar",
    deductions: "Descontos",
    netSalary: "Salário Líquido",
    totalDeductions: "Total de descontos",
    fillData: "Preencha os dados e clique em \"Calcular\" para ver o resultado",
    instructions: "Como funciona o cálculo do salário líquido?",
    inssTitle: "1. Desconto do INSS (2025):",
    irrfTitle: "2. Desconto do IRRF (2025):",
    irrfBase: "* Base de cálculo: (Salário Bruto - INSS - R$ 189,59 por dependente)",
    formulaTitle: "3. Fórmula:",
    formula: "Salário Líquido = Salário Bruto - INSS - IRRF - Outros Descontos",
    language: "Idioma",
    validSalaryAlert: "Por favor, insira um salário bruto válido.",
    copySuccessAlert: "Resultado copiado para a área de transferência!",
    copyResultTitle: "💰 CÁLCULO DE SALÁRIO LÍQUIDO",
    copyResultSalary: "📊 Salário Bruto",
    copyResultDeductions: "📉 DESCONTOS:",
    copyResultNet: "💵 SALÁRIO LÍQUIDO:",
    copyResultDate: "Calculado em:",
    copyResultTool: "Ferramenta: Toolizio.com"
  },
  "en": {
    title: "Net Salary Calculator",
    description: "Calculate your net CLT salary with INSS and IRRF discounts accurately",
    formTitle: "Calculation Data",
    grossSalary: "Gross Salary",
    grossSalaryPlaceholder: "Ex: 5000 or 5000.00",
    dependents: "Number of Dependents",
    dependentsPlaceholder: "0",
    dependentsInfo: "R$ 189.59 deduction per dependent on IRRF",
    otherDeductions: "Other Deductions",
    otherDeductionsPlaceholder: "Ex: 200 or 200.00",
    otherDeductionsInfo: "Ex: health plan, transportation voucher, etc.",
    calculate: "Calculate Net Salary",
    result: "Result",
    copy: "Copy",
    deductions: "Deductions",
    netSalary: "Net Salary",
    totalDeductions: "Total deductions",
    fillData: "Fill in the data and click \"Calculate\" to see the result",
    instructions: "How does the net salary calculation work?",
    inssTitle: "1. INSS Discount (2025):",
    irrfTitle: "2. IRRF Discount (2025):",
    irrfBase: "* Calculation base: (Gross Salary - INSS - R$ 189.59 per dependent)",
    formulaTitle: "3. Formula:",
    formula: "Net Salary = Gross Salary - INSS - IRRF - Other Deductions",
    language: "Language",
    validSalaryAlert: "Please enter a valid gross salary.",
    copySuccessAlert: "Result copied to clipboard!",
    copyResultTitle: "💰 NET SALARY CALCULATION",
    copyResultSalary: "📊 Gross Salary",
    copyResultDeductions: "📉 DEDUCTIONS:",
    copyResultNet: "💵 NET SALARY:",
    copyResultDate: "Calculated on:",
    copyResultTool: "Tool: Toolizio.com"
  }
};

interface SalaryResult {
  salarioBruto: number;
  descontoINSS: number;
  baseCalculoIR: number;
  descontoIR: number;
  outrosDescontos: number;
  salarioLiquido: number;
  aliquotaINSS: number;
  aliquotaIR: number;
}

// Tabela INSS 2025
const tabelaINSS = [
  { min: 0, max: 1518.00, aliquota: 7.5 },
  { min: 1518.01, max: 2793.88, aliquota: 9.0 },
  { min: 2793.89, max: 4190.83, aliquota: 12.0 },
  { min: 4190.84, max: 8157.41, aliquota: 14.0 }
];

// Tabela IRRF 2025
const tabelaIRRF = [
  { min: 0, max: 2259.20, aliquota: 0, deducao: 0 },
  { min: 2259.21, max: 2826.65, aliquota: 7.5, deducao: 169.44 },
  { min: 2826.66, max: 3751.05, aliquota: 15.0, deducao: 381.44 },
  { min: 3751.06, max: 4664.68, aliquota: 22.5, deducao: 662.77 },
  { min: 4664.69, max: Infinity, aliquota: 27.5, deducao: 896.00 }
];

export default function CalculadoraSalario() {
  const [language, setLanguage] = useState<"pt-BR" | "en">("pt-BR");
  const [salarioBruto, setSalarioBruto] = useState("");
  const [dependentes, setDependentes] = useState("");
  const [outrosDescontos, setOutrosDescontos] = useState("");
  const [resultado, setResultado] = useState<SalaryResult | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const t = translations[language];

  const calcularINSS = (salarioBruto: number): { desconto: number; aliquota: number } => {
    let desconto = 0;
    let aliquotaAplicada = 0;

    for (const faixa of tabelaINSS) {
      if (salarioBruto > faixa.min - 0.01) {
        const baseCalculo = Math.min(salarioBruto, faixa.max);
        const valorFaixa = baseCalculo - (faixa.min - 0.01);
        desconto += valorFaixa * (faixa.aliquota / 100);
        aliquotaAplicada = faixa.aliquota;
      }
    }

    // Teto do INSS
    const tetoINSS = 8157.41 * 0.14;
    desconto = Math.min(desconto, tetoINSS);

    return { desconto, aliquota: aliquotaAplicada };
  };

  const calcularIRRF = (baseCalculo: number, numDependentes: number): { desconto: number; aliquota: number } => {
    // Dedução por dependente (R$ 189,59 por dependente em 2025)
    const deducaoDependentes = numDependentes * 189.59;
    const baseIR = Math.max(0, baseCalculo - deducaoDependentes);

    let aliquotaAplicada = 0;
    for (const faixa of tabelaIRRF) {
      if (baseIR >= faixa.min && baseIR <= faixa.max) {
        const desconto = Math.max(0, (baseIR * (faixa.aliquota / 100)) - faixa.deducao);
        aliquotaAplicada = faixa.aliquota;
        return { desconto, aliquota: aliquotaAplicada };
      }
    }

    return { desconto: 0, aliquota: 0 };
  };

  const calcularSalario = () => {
    const salarioVal = parseFloat(salarioBruto.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    const dependentesVal = parseInt(dependentes) || 0;
    const outrosDescontosVal = parseFloat(outrosDescontos.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;

    if (salarioVal <= 0) {
      alert(t.validSalaryAlert);
      return;
    }

    // Cálculo INSS
    const { desconto: descontoINSS, aliquota: aliquotaINSS } = calcularINSS(salarioVal);

    // Base de cálculo para IR (salário bruto - INSS)
    const baseCalculoIR = salarioVal - descontoINSS;

    // Cálculo IRRF
    const { desconto: descontoIR, aliquota: aliquotaIR } = calcularIRRF(baseCalculoIR, dependentesVal);

    // Salário líquido
    const salarioLiquido = salarioVal - descontoINSS - descontoIR - outrosDescontosVal;

    setResultado({
      salarioBruto: salarioVal,
      descontoINSS,
      baseCalculoIR,
      descontoIR,
      outrosDescontos: outrosDescontosVal,
      salarioLiquido,
      aliquotaINSS,
      aliquotaIR
    });
  };

  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat(language === 'pt-BR' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: language === 'pt-BR' ? 'BRL' : 'USD'
    }).format(valor);
  };

  const copiarResultado = () => {
    if (!resultado) return;

    const texto = `
${t.copyResultTitle}

${t.copyResultSalary}: ${formatarMoeda(resultado.salarioBruto)}

${t.copyResultDeductions}
• INSS (${resultado.aliquotaINSS}%): ${formatarMoeda(resultado.descontoINSS)}
• IRRF (${resultado.aliquotaIR}%): ${formatarMoeda(resultado.descontoIR)}
• ${t.otherDeductions}: ${formatarMoeda(resultado.outrosDescontos)}

${t.copyResultNet}: ${formatarMoeda(resultado.salarioLiquido)}

${t.copyResultDate} ${new Date().toLocaleDateString(language === 'pt-BR' ? 'pt-BR' : 'en-US')}
${t.copyResultTool}
    `.trim();

    navigator.clipboard.writeText(texto).then(() => {
      alert(t.copySuccessAlert);
    });
  };

  const handleSalarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    // Permite números, vírgulas e pontos
    const valorLimpo = valor.replace(/[^\d.,]/g, '');
    setSalarioBruto(valorLimpo);
  };

  const handleOutrosDescontosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    // Permite números, vírgulas e pontos
    const valorLimpo = valor.replace(/[^\d.,]/g, '');
    setOutrosDescontos(valorLimpo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <ToolIcons.calculator className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
            {t.description}
          </p>
        </div>

        <div className="flex justify-end mb-4">
          <div className="flex items-center">
            <span className="mr-2 text-gray-700 dark:text-gray-300">{t.language}:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "pt-BR" | "en")}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm"
            >
              <option value="pt-BR">Português</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Formulário */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
              {t.formTitle}
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {/* Salário Bruto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.grossSalary} *
                </label>
                <input
                  type="text"
                  value={salarioBruto}
                  onChange={handleSalarioChange}
                  placeholder={t.grossSalaryPlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Dependentes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.dependents}
                </label>
                <input
                  type="number"
                  value={dependentes}
                  onChange={(e) => setDependentes(e.target.value)}
                  placeholder={t.dependentsPlaceholder}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t.dependentsInfo}
                </p>
              </div>

              {/* Outros Descontos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.otherDeductions}
                </label>
                <input
                  type="text"
                  value={outrosDescontos}
                  onChange={handleOutrosDescontosChange}
                  placeholder={t.otherDeductionsPlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t.otherDeductionsInfo}
                </p>
              </div>

              {/* Botão Calcular */}
              <button
                onClick={calcularSalario}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Calculator className="h-5 w-5" />
                <span>{t.calculate}</span>
              </button>
            </div>
          </div>

          {/* Resultado */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                {t.result}
              </h2>
              {resultado && (
                <button
                  onClick={copiarResultado}
                  className="flex items-center space-x-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  <Copy className="h-4 w-4" />
                  <span className="text-sm">{t.copy}</span>
                </button>
              )}
            </div>

            {resultado ? (
              <div className="space-y-4">
                {/* Salário Bruto */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {t.grossSalary}
                    </span>
                    <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {formatarMoeda(resultado.salarioBruto)}
                    </span>
                  </div>
                </div>

                {/* Descontos */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    {t.deductions}
                  </h3>
                  
                  {/* INSS */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">INSS</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        ({resultado.aliquotaINSS}%)
                      </span>
                    </div>
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      -{formatarMoeda(resultado.descontoINSS)}
                    </span>
                  </div>

                  {/* IRRF */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">IRRF</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        ({resultado.aliquotaIR}%)
                      </span>
                    </div>
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      -{formatarMoeda(resultado.descontoIR)}
                    </span>
                  </div>

                  {/* Outros Descontos */}
                  {resultado.outrosDescontos > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{t.otherDeductions}</span>
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        -{formatarMoeda(resultado.outrosDescontos)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Salário Líquido */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      {t.netSalary}
                    </span>
                    <span className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {formatarMoeda(resultado.salarioLiquido)}
                    </span>
                  </div>
                </div>

                {/* Percentual de desconto */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.totalDeductions}: {formatarMoeda(resultado.descontoINSS + resultado.descontoIR + resultado.outrosDescontos)} 
                    ({((resultado.descontoINSS + resultado.descontoIR + resultado.outrosDescontos) / resultado.salarioBruto * 100).toFixed(1)}%)
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {t.fillData}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instruções */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Info className="h-5 w-5 mr-2" />
              {t.instructions}
            </h3>
            {showInstructions ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {showInstructions && (
            <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-600">
              <div className="pt-4 space-y-4 text-gray-600 dark:text-gray-300">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t.inssTitle}</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• {language === 'pt-BR' ? 'Até R$ 1.518,00: 7,5%' : 'Up to R$ 1,518.00: 7.5%'}</li>
                    <li>• {language === 'pt-BR' ? 'De R$ 1.518,01 até R$ 2.793,88: 9%' : 'From R$ 1,518.01 to R$ 2,793.88: 9%'}</li>
                    <li>• {language === 'pt-BR' ? 'De R$ 2.793,89 até R$ 4.190,83: 12%' : 'From R$ 2,793.89 to R$ 4,190.83: 12%'}</li>
                    <li>• {language === 'pt-BR' ? 'De R$ 4.190,84 até R$ 8.157,41: 14%' : 'From R$ 4,190.84 to R$ 8,157.41: 14%'}</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t.irrfTitle}</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• {language === 'pt-BR' ? 'Até R$ 2.259,20: Isento' : 'Up to R$ 2,259.20: Exempt'}</li>
                    <li>• {language === 'pt-BR' ? 'De R$ 2.259,21 até R$ 2.826,65: 7,5%' : 'From R$ 2,259.21 to R$ 2,826.65: 7.5%'}</li>
                    <li>• {language === 'pt-BR' ? 'De R$ 2.826,66 até R$ 3.751,05: 15%' : 'From R$ 2,826.66 to R$ 3,751.05: 15%'}</li>
                    <li>• {language === 'pt-BR' ? 'De R$ 3.751,06 até R$ 4.664,68: 22,5%' : 'From R$ 3,751.06 to R$ 4,664.68: 22.5%'}</li>
                    <li>• {language === 'pt-BR' ? 'Acima de R$ 4.664,68: 27,5%' : 'Above R$ 4,664.68: 27.5%'}</li>
                  </ul>
                  <p className="text-sm mt-2">
                    {t.irrfBase}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t.formulaTitle}</h4>
                  <p className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded">
                    {t.formula}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
