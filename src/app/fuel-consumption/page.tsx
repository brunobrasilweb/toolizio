"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calculator, DollarSign, Truck, Shield } from "lucide-react";
import { trackGeneration } from "@/utils/analytics";

export default function FuelConsumption() {
  const [kmPerDay, setKmPerDay] = useState<number>(20);
  const [kmPerLiter, setKmPerLiter] = useState<number>(10);
  const [pricePerLiter, setPricePerLiter] = useState<number>(5.49);
  const [currency, setCurrency] = useState<string>("BRL");
  const [result, setResult] = useState<null | Record<string, number>>(null);

  // Static (approximate) exchange rates expressed as USD per unit of currency.
  // These are editable in-code values to avoid external API calls.
  const usdPerUnit: Record<string, number> = {
    USD: 1.0,    // 1 USD = 1 USD
    BRL: 0.20,   // 1 BRL = 0.20 USD (approx)
    EUR: 1.08,   // 1 EUR = 1.08 USD
    GBP: 1.25,   // 1 GBP = 1.25 USD
    ARS: 0.0033, // 1 ARS = 0.0033 USD
    JPY: 0.007,  // 1 JPY = 0.007 USD
  };

  const currencies = [
    { code: 'BRL', symbol: 'R$', label: 'Brazilian Real' },
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
    { code: 'ARS', symbol: '$', label: 'Argentine Peso' },
    { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  ];

  const symbolFor = (code: string) => currencies.find(c => c.code === code)?.symbol || '';

  const calculate = () => {
    if (!kmPerDay || !kmPerLiter || !pricePerLiter) return;

    const litersPerDay = kmPerDay / kmPerLiter;
    const costPerDay = litersPerDay * pricePerLiter;

    const periods = {
      daily: 1,
      biweekly: 15,
      monthly: 30,
      semiannual: 182,
      annual: 365,
    } as const;

    const computed: Record<string, number> = {
      litersPerDay: Number(litersPerDay.toFixed(3)),
      costPerDay: Number(costPerDay.toFixed(2)),
      litersBiweekly: Number((litersPerDay * periods.biweekly).toFixed(3)),
      costBiweekly: Number((costPerDay * periods.biweekly).toFixed(2)),
      litersMonthly: Number((litersPerDay * periods.monthly).toFixed(3)),
      costMonthly: Number((costPerDay * periods.monthly).toFixed(2)),
      litersSemiannual: Number((litersPerDay * periods.semiannual).toFixed(3)),
      costSemiannual: Number((costPerDay * periods.semiannual).toFixed(2)),
      litersAnnual: Number((litersPerDay * periods.annual).toFixed(3)),
      costAnnual: Number((costPerDay * periods.annual).toFixed(2)),
    };

    setResult(computed);
    trackGeneration('Fuel Consumption');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header showBackButton={true} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Fuel Consumption Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Calculate real fuel consumption and cost based on your daily mileage. Get costs for biweekly, monthly, semiannual and annual periods.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Inputs</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kilometers per day</label>
                <input type="number" value={kmPerDay} onChange={(e) => setKmPerDay(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white" min={0} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fuel efficiency (km / liter)</label>
                <input type="number" value={kmPerLiter} onChange={(e) => setKmPerLiter(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white" min={0.1} step={0.1} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fuel price (per liter)</label>
                <div className="flex">
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-700 rounded-l-md focus:ring-2 focus:ring-blue-500">
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.code}</option>
                    ))}
                  </select>
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500">{symbolFor(currency)}</span>
                  <input type="number" value={pricePerLiter} onChange={(e) => setPricePerLiter(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white" min={0} step={0.01} />
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <button onClick={calculate} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                  <Calculator className="w-5 h-5" /> Calculate
                </button>
                <button onClick={() => { setKmPerDay(20); setKmPerLiter(10); setPricePerLiter(5.49); setResult(null); }} className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">Reset</button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Preview</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Enter your inputs and press <span className="font-medium">Calculate</span> to see consumption and cost breakdowns for different periods.</p>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300">Example:</div>
                <div className="mt-2 font-medium text-gray-900 dark:text-white">20 km/day · 10 km/L · R$ 5.49/L</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">→ {((20/10)*5.49).toFixed(2)} R$ per day</div>
              </div>
            </div>
          </div>
        </div>

  {result && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Results</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Consumption</h3>
                <p className="text-gray-600 dark:text-gray-300">Liters per day: <span className="font-medium text-gray-900 dark:text-white">{result.litersPerDay} L</span></p>
                <p className="text-gray-600 dark:text-gray-300">Liters (biweekly): <span className="font-medium text-gray-900 dark:text-white">{result.litersBiweekly} L</span></p>
                <p className="text-gray-600 dark:text-gray-300">Liters (monthly): <span className="font-medium text-gray-900 dark:text-white">{result.litersMonthly} L</span></p>
                <p className="text-gray-600 dark:text-gray-300">Liters (semiannual): <span className="font-medium text-gray-900 dark:text-white">{result.litersSemiannual} L</span></p>
                <p className="text-gray-600 dark:text-gray-300">Liters (annual): <span className="font-medium text-gray-900 dark:text-white">{result.litersAnnual} L</span></p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Costs</h3>
                <p className="text-gray-600 dark:text-gray-300">Cost per day: <span className="font-medium text-gray-900 dark:text-white">R$ {result.costPerDay}</span></p>
                <p className="text-gray-600 dark:text-gray-300">Cost (biweekly): <span className="font-medium text-gray-900 dark:text-white">R$ {result.costBiweekly}</span></p>
                <p className="text-gray-600 dark:text-gray-300">Cost (monthly): <span className="font-medium text-gray-900 dark:text-white">R$ {result.costMonthly}</span></p>
                <p className="text-gray-600 dark:text-gray-300">Cost (semiannual): <span className="font-medium text-gray-900 dark:text-white">R$ {result.costSemiannual}</span></p>
                <p className="text-gray-600 dark:text-gray-300">Cost (annual): <span className="font-medium text-gray-900 dark:text-white">R$ {result.costAnnual}</span></p>
              </div>
            </div>
            {/* Converted costs into other main currencies */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Costs in other currencies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.keys(usdPerUnit).map((target) => {
                  // convert costPerDay (which is in selected currency) to target currency
                  const usdPerSelected = usdPerUnit[currency] || 1;
                  const usdPerTarget = usdPerUnit[target] || 1;
                  const factor = (usdPerSelected) / (usdPerTarget);

                  const convertedDaily = Number((result.costPerDay * factor).toFixed(2));
                  const convertedBiweekly = Number((result.costBiweekly * factor).toFixed(2));
                  const convertedMonthly = Number((result.costMonthly * factor).toFixed(2));

                  return (
                    <div key={target} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900 dark:text-white">{target} ({symbolFor(target)})</div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Daily: <span className="font-medium text-gray-900 dark:text-white">{symbolFor(target)} {convertedDaily}</span></div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Biweekly: <span className="font-medium text-gray-900 dark:text-white">{symbolFor(target)} {convertedBiweekly}</span></div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Monthly: <span className="font-medium text-gray-900 dark:text-white">{symbolFor(target)} {convertedMonthly}</span></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Daily / Periodic Costs</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">See cost breakdown for biweekly, monthly, semiannual and annual periods.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><Shield className="w-5 h-5 text-green-600 dark:text-green-400" /></div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Real Calculations</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">All values are calculated locally using the inputs you provide.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg"><DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" /></div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Cost Estimates</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Quickly estimate fuel expenditures and plan your budget.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How it works</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">1</div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Enter your daily kilometers</h3>
                <p className="text-gray-600 dark:text-gray-300">Provide the average distance you drive each day.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">2</div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Enter your vehicle efficiency</h3>
                <p className="text-gray-600 dark:text-gray-300">Provide kilometers per liter for accurate consumption estimation.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">3</div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Enter fuel price</h3>
                <p className="text-gray-600 dark:text-gray-300">Fuel price per liter is used to calculate monetary costs for each period.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">4</div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Get results</h3>
                <p className="text-gray-600 dark:text-gray-300">Press Calculate to see consumption and cost breakdowns.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Are these values exact?</h3>
              <p className="text-gray-600 dark:text-gray-300">Results are estimated from the inputs and rounded for clarity. Real consumption depends on driving conditions.</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Can I use different periods?</h3>
              <p className="text-gray-600 dark:text-gray-300">You can change the inputs to represent different usages (e.g., weekends only) and recalculate.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
