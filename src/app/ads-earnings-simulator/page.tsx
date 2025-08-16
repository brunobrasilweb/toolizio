"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trackGeneration, trackToolUsage } from "@/utils/analytics";
import {
  BarChart2,
  DollarSign,
  ArrowRightLeft,
  Settings,
  Globe,
  Zap,
  Smartphone,
  PieChart,
} from "lucide-react";

interface NetworkConfig {
  id: string;
  name: string;
  rpm: number; // revenue per thousand impressions (USD)
  ctr: number; // click-through-rate (percent)
  cpc: number; // cost per click (USD)
}

export default function AdsEarningsSimulator() {
  const [pageviews, setPageviews] = useState<number>(100000);
  const [avgSessionPages, setAvgSessionPages] = useState<number>(1.2);
  const [networks, setNetworks] = useState<NetworkConfig[]>([
    { id: 'adsense', name: 'Google AdSense', rpm: 3.5, ctr: 1.2, cpc: 0.30 },
    { id: 'media', name: 'Media Network', rpm: 2.0, ctr: 0.8, cpc: 0.20 },
    { id: 'native', name: 'Native Ads', rpm: 4.2, ctr: 0.6, cpc: 0.50 },
  ]);
  const [results, setResults] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<string>('adsense');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    calculateAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateEarnings = (cfg: NetworkConfig) => {
    // Inputs: pageviews (monthly), avgSessionPages, cfg.rpm (USD per 1000 impressions), cfg.ctr (%), cfg.cpc (USD)
    const impressions = Math.max(0, Math.round(pageviews * avgSessionPages));
    const revenueFromRPM = (impressions / 1000) * cfg.rpm; // simple RPM model
    // Click-based revenue estimation: clicks = impressions * (ctr / 100)
    const estimatedClicks = impressions * (cfg.ctr / 100);
    const revenueFromClicks = estimatedClicks * cfg.cpc;
    // Weighted average using both approaches to be more realistic
    const revenue = (revenueFromRPM * 0.6) + (revenueFromClicks * 0.4);
    return revenue;
  };

  const calculateAll = () => {
    if (pageviews <= 0) {
      setError('Pageviews must be greater than zero');
      return;
    }
    setError('');
    const newResults: Record<string, number> = {};
    networks.forEach((n) => {
      newResults[n.id] = Number(calculateEarnings(n).toFixed(2));
    });
    setResults(newResults);
    trackGeneration('Ads Earnings Simulation');
  };

  const updateNetwork = (id: string, key: keyof NetworkConfig, value: string | number) => {
    setNetworks((prev) => prev.map(n => n.id === id ? { ...n, [key]: value as any } : n));
  };

  const addNetwork = () => {
    const id = `custom-${Date.now()}`;
    setNetworks((prev) => [...prev, { id, name: 'Custom Network', rpm: 2.5, ctr: 1.0, cpc: 0.25 }]);
  };

  const removeNetwork = (id: string) => {
    setNetworks((prev) => prev.filter(n => n.id !== id));
  };

  const formatCurrency = (v: number) => {
    return v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
  };

  const exportCSV = () => {
    const headers = ['network','monthly_estimated_revenue_usd'];
    const rows = networks.map(n => `${n.name},${(results[n.id] ?? 0).toFixed(2)}`);
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ads-earnings-simulator.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    trackToolUsage('Ads Earnings Simulator', 'export_csv');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <BarChart2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Ads Earnings Simulator</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Estimate monthly earnings from Google AdSense and other ad networks using pageviews, RPM, CTR and CPC. Compare networks side-by-side and find the best monetization strategy for your site.
            </p>
          </div>

          {/* Inputs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Simulator Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Pageviews</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg" value={pageviews} onChange={(e) => setPageviews(Number(e.target.value))} min={0} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Avg Pages per Session</label>
                <input type="number" step="0.1" className="w-full px-3 py-2 border rounded-lg" value={avgSessionPages} onChange={(e) => setAvgSessionPages(Number(e.target.value))} min={0.1} />
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button onClick={calculateAll} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Calculate</button>
              <button onClick={addNetwork} className="px-4 py-2 border rounded-lg">Add Network</button>
              <button onClick={exportCSV} className="px-4 py-2 border rounded-lg">Export CSV</button>
            </div>

            {error && <div className="mt-4 text-red-600">{error}</div>}
          </div>

          {/* Networks Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Networks</h2>
            <div className="space-y-4">
              {networks.map((n) => (
                <div key={n.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <PieChart className="w-5 h-5 text-blue-600" />
                      <input value={n.name} onChange={(e) => updateNetwork(n.id, 'name', e.target.value)} className="font-medium text-gray-900 dark:text-white bg-transparent" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeNetwork(n.id)} className="px-3 py-1 border rounded">Remove</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">RPM (USD per 1000 impressions)</label>
                      <input type="number" step="0.1" value={n.rpm} onChange={(e) => updateNetwork(n.id, 'rpm', Number(e.target.value))} className="w-full px-2 py-1 border rounded" />
                    </div>

                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">CTR (%)</label>
                      <input type="number" step="0.1" value={n.ctr} onChange={(e) => updateNetwork(n.id, 'ctr', Number(e.target.value))} className="w-full px-2 py-1 border rounded" />
                    </div>

                    <div>
                      <label className="text-gray-600 dark:text-gray-300 block">CPC (USD)</label>
                      <input type="number" step="0.01" value={n.cpc} onChange={(e) => updateNetwork(n.id, 'cpc', Number(e.target.value))} className="w-full px-2 py-1 border rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Estimated Monthly Revenue</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="space-y-3">
                  {networks.map((n) => (
                    <div key={n.id} className={`p-3 rounded-lg ${selected === n.id ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-gray-50 dark:bg-gray-700'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{n.name}</div>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">{formatCurrency(results[n.id] ?? 0)}</div>
                        </div>
                        <div className="text-sm text-gray-500">RPM {n.rpm}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Summary</div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-gray-700 dark:text-gray-300">Monthly Pageviews</div>
                      <div className="font-medium">{pageviews.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-gray-700 dark:text-gray-300">Avg Pages/Session</div>
                      <div className="font-medium">{avgSessionPages}</div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-gray-700 dark:text-gray-300">Total Impressions (est.)</div>
                      <div className="font-medium">{Math.round(pageviews * avgSessionPages).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button onClick={() => trackToolUsage('Ads Earnings Simulator', 'view_details')} className="px-4 py-2 border rounded">Track</button>
                    <button onClick={exportCSV} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">Export CSV</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Compare Networks</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Side-by-side comparison of RPM, CTR and CPC</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Real Estimates</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Uses RPM and click models to provide realistic monthly revenue estimates</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Global Networks</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Compare popular ad networks used worldwide</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Fast Simulation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Instant calculations without server calls</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Smartphone className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Mobile Friendly</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Works well on phones and tablets</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <ArrowRightLeft className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Export Results</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Export estimates to CSV for further analysis</p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Use */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How it Works</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Provide Traffic Data</h3>
                  <p className="text-gray-600 dark:text-gray-300">Enter your monthly pageviews and average pages per session to estimate impressions.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Configure Networks</h3>
                  <p className="text-gray-600 dark:text-gray-300">Adjust RPM, CTR and CPC values for common networks or add your own.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Compare Results</h3>
                  <p className="text-gray-600 dark:text-gray-300">Run the calculation and compare monthly estimates to choose the best option.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Is this accurate?</h3>
                <p className="text-gray-600 dark:text-gray-300">This simulator uses commonly accepted RPM and click-based formulas to estimate revenue. Results are estimates and depend on your real traffic quality and ad placements.</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Can I use real RPM values?</h3>
                <p className="text-gray-600 dark:text-gray-300">Yes — enter your actual RPM, CTR and CPC values to get tailored estimates.</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Is my data private?</h3>
                <p className="text-gray-600 dark:text-gray-300">All calculations happen in your browser. No data is sent to our servers.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
