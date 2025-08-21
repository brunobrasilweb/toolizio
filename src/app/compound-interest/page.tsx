"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calculator, Percent, Calendar, DollarSign, Shield, Zap } from "lucide-react";
import { trackGeneration } from "@/utils/analytics";

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState<number>(1000);
  const [annualRate, setAnnualRate] = useState<number>(5);
  const [years, setYears] = useState<number>(10);
  const [compoundsPerYear, setCompoundsPerYear] = useState<number>(12);
  const [contribution, setContribution] = useState<number>(0);
  const [contribPerYear, setContribPerYear] = useState<number>(12);
  const [result, setResult] = useState<null | {
    finalAmount: number;
    totalContributions: number;
    interestEarned: number;
  }>(null);
  const [evolutionData, setEvolutionData] = useState<{ label: string; value: number }[]>([]);
  const [granularity, setGranularity] = useState<'year' | 'compound' | 'contrib'>('year');

  const calculate = () => {
    const P = Number(principal) || 0;
    const r = (Number(annualRate) || 0) / 100;
    const t = Number(years) || 0;
    const n = Number(compoundsPerYear) || 1;
    const C = Number(contribution) || 0;
    const m = Number(contribPerYear) || n;

    const N = n * t;

    // Future value of principal
    let fvPrincipal = 0;
    if (r === 0) {
      fvPrincipal = P;
    } else {
      fvPrincipal = P * Math.pow(1 + r / n, N);
    }

    // Future value of contributions (ordinary annuity)
    let fvContrib = 0;
    if (C > 0) {
      const i = r / m;
      const Ncontrib = m * t;
      if (r === 0) {
        fvContrib = C * Ncontrib;
      } else {
        fvContrib = C * (Math.pow(1 + i, Ncontrib) - 1) / i;
      }
    }

    const finalAmount = Number((fvPrincipal + fvContrib).toFixed(2));
    const totalContributions = Number((P + C * m * t).toFixed(2));
    const interestEarned = Number((finalAmount - totalContributions).toFixed(2));

    setResult({ finalAmount, totalContributions, interestEarned });

    // Compute evolution series based on selected granularity
    const computeSeries = () => {
      // Helper: gcd/lcm
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b;

      // Use stepsPerYear = lcm(n, m) to align compounding and contributions
      const stepsPerYear = Math.max(1, lcm(n, m));
      const totalSteps = stepsPerYear * t;
      const compInterval = Math.max(1, Math.round(stepsPerYear / n));
      const contribInterval = Math.max(1, Math.round(stepsPerYear / m));

      const points: { label: string; value: number }[] = [];

      let value = P;
      let step = 0;
      for (let s = 1; s <= totalSteps; s++) {
        step = s;
        // Apply compounding when hitting a compounding step
        if (s % compInterval === 0) {
          // apply interest for one compounding period
          value = value * (1 + r / n);
        }

        // Apply contribution when hitting a contribution step (contributions at end of period)
        if (C > 0 && s % contribInterval === 0) {
          value = value + C;
        }

        // Record points based on granularity
        if (granularity === 'year' && s % stepsPerYear === 0) {
          const yearIdx = s / stepsPerYear;
          points.push({ label: `Year ${yearIdx}`, value: Number(value.toFixed(2)) });
        }

        if (granularity === 'compound' && s % compInterval === 0) {
          const idx = s / compInterval;
          points.push({ label: `${idx}`, value: Number(value.toFixed(2)) });
        }

        if (granularity === 'contrib' && s % contribInterval === 0) {
          const idx = s / contribInterval;
          points.push({ label: `${idx}`, value: Number(value.toFixed(2)) });
        }
      }

      return points;
    };

    try {
      const series = computeSeries();
      setEvolutionData(series);
    } catch (e) {
      setEvolutionData([]);
    }

    trackGeneration('Compound Interest');
  };

  const reset = () => {
    setPrincipal(1000);
    setAnnualRate(5);
    setYears(10);
    setCompoundsPerYear(12);
    setContribution(0);
    setContribPerYear(12);
    setResult(null);
  };

  const formatCurrency = (v: number) => {
    return v.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header showBackButton={true} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Compound Interest Calculator</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Calculate the future value of an investment with compound interest. Supports periodic contributions, selectable compounding frequency and clear breakdowns.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Inputs</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Initial Principal</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">$</span>
                  <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500" min={0} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Annual Interest Rate (%)</label>
                <div className="flex">
                  <input type="number" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min={0} step={0.01} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Years</label>
                <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min={0} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Compounds per year</label>
                <select value={compoundsPerYear} onChange={(e) => setCompoundsPerYear(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value={1}>Annually (1)</option>
                  <option value={2}>Semiannually (2)</option>
                  <option value={4}>Quarterly (4)</option>
                  <option value={12}>Monthly (12)</option>
                  <option value={365}>Daily (365)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Periodic contribution (optional)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">$</span>
                  <input type="number" value={contribution} onChange={(e) => setContribution(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500" min={0} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contribution frequency</label>
                <select value={contribPerYear} onChange={(e) => setContribPerYear(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value={1}>Yearly</option>
                  <option value={12}>Monthly</option>
                  <option value={52}>Weekly</option>
                  <option value={365}>Daily</option>
                </select>
              </div>

              <div className="mt-4 flex gap-4">
                <button onClick={calculate} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                  <Calculator className="w-5 h-5" /> Calculate
                </button>
                <button onClick={reset} className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">Reset</button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Preview</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Enter your inputs and press <span className="font-medium">Calculate</span> to see the final value, total contributions and interest earned.</p>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Percent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div className="text-sm text-gray-600 dark:text-gray-300">Rate: <span className="font-medium text-gray-900 dark:text-white">{annualRate}%</span></div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div className="text-sm text-gray-600 dark:text-gray-300">Period: <span className="font-medium text-gray-900 dark:text-white">{years} years</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Results</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Final Amount</h3>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(result.finalAmount)}</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Total Contributions</h3>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(result.totalContributions)}</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Interest Earned</h3>
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">{formatCurrency(result.interestEarned)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Evolution Chart */}
        {evolutionData && evolutionData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Evolution</h2>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 dark:text-gray-300">Granularity:</label>
                <select value={granularity} onChange={(e) => setGranularity(e.target.value as any)} className="px-2 py-1 border border-gray-300 rounded-lg bg-white dark:bg-gray-700">
                  <option value="year">Year</option>
                  <option value="compound">Per Compound</option>
                  <option value="contrib">Per Contribution</option>
                </select>
                <button onClick={() => { /* recompute with same params */ calculate(); }} className="px-3 py-1 bg-blue-600 text-white rounded-lg">Update</button>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              {/* Simple inline SVG chart */}
              <svg viewBox="0 0 600 240" width="100%" height="240" preserveAspectRatio="none" className="rounded">
                {(() => {
                  const padding = 40;
                  const w = 600 - padding * 2;
                  const h = 240 - padding * 2;
                  const values = evolutionData.map(p => p.value);
                  const max = Math.max(...values);
                  const min = Math.min(...values);
                  const range = Math.max(1, max - min);
                  const stepX = w / Math.max(1, values.length - 1);

                  // polyline points
                  const points = values.map((v, i) => {
                    const x = padding + i * stepX;
                    const y = padding + h - ((v - min) / range) * h;
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <>
                      {/* grid lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
                        const y = padding + h * t;
                        return <line key={idx} x1={padding} x2={padding + w} y1={y} y2={y} stroke="#e5e7eb" strokeWidth={1} />
                      })}

                      {/* area */}
                      <polyline points={points} fill="none" stroke="#2563eb" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

                      {/* points */}
                      {values.map((v, i) => {
                        const x = padding + i * stepX;
                        const y = padding + h - ((v - min) / range) * h;
                        return <circle key={i} cx={x} cy={y} r={3} fill="#2563eb" />
                      })}

                      {/* labels on x axis */}
                      {evolutionData.map((p, i) => {
                        const x = padding + i * stepX;
                        const y = padding + h + 18;
                        // show only a few labels to avoid crowding
                        if (evolutionData.length > 12 && i % Math.ceil(evolutionData.length / 12) !== 0) return null;
                        return <text key={i} x={x} y={y} fontSize={10} textAnchor="middle" fill="#6b7280">{p.label}</text>
                      })}
                    </>
                  )
                })()}
              </svg>
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Tip: switch granularity to see per-compound or per-contribution evolution. Values are computed locally.
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Accurate Calculations</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">All calculations are performed locally using standard financial formulas.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" /></div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Periodic Contributions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Support for recurring contributions with configurable frequency.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg"><Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" /></div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Private & Local</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">All computation is executed in your browser; no data leaves your device.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg"><Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" /></div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Fast</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Instant results without server requests.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How it works</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">1</div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Enter inputs</h3>
                <p className="text-gray-600 dark:text-gray-300">Provide the initial principal, rate, period and optional contributions.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">2</div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Choose frequencies</h3>
                <p className="text-gray-600 dark:text-gray-300">Select how often interest compounds and how often you contribute.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">3</div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Calculate</h3>
                <p className="text-gray-600 dark:text-gray-300">Click Calculate to run the formula and display the future value and interest earned.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
