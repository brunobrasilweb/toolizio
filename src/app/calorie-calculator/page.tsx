"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calculator, Flame, Apple, Activity, Clock, Globe } from "lucide-react";
import { trackGeneration } from "@/utils/analytics";

function formatNumber(n: number) {
  return Math.round(n);
}

function calculateBMR(sex: string, weightKg: number, heightCm: number, age: number) {
  if (sex === 'female') return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
}

export default function CalorieCalculator() {
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('175');
  const [age, setAge] = useState<string>('30');
  const [activity, setActivity] = useState<string>('1.2');
  const [goal, setGoal] = useState<string>('maintain');
  const [result, setResult] = useState<null | { bmr:number; maintenance:number; target:number }>(null);
  const [error, setError] = useState<string>('');

  const onCalculate = () => {
    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);
    const act = Number(activity);

    if (!w || !h || !a || !act) {
      setError('Please provide valid numeric values for weight, height, age and activity.');
      return;
    }

    setError('');
    const bmr = calculateBMR(sex, w, h, a);
    const maintenance = bmr * act;
    let target = maintenance;
    if (goal === 'lose') target = maintenance - 500;
    if (goal === 'gain') target = maintenance + 300;

    setResult({ bmr, maintenance, target });
    trackGeneration('Calorie Calculation');
  };

  const onClear = () => {
    setSex('male');
    setWeight('70');
    setHeight('175');
    setAge('30');
    setActivity('1.2');
    setGoal('maintain');
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Apple className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Calorie Calculator</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Estimate your daily caloric needs using the Mifflin-St Jeor equation and common activity multipliers. Choose a goal to get suggested daily calories for maintenance, weight loss or gain.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Inputs</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sex</label>
                <select value={sex} onChange={(e) => setSex(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight (kg)</label>
                <input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" min="20" max="500" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Height (cm)</label>
                <input value={height} onChange={(e) => setHeight(e.target.value)} type="number" min="90" max="260" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age (years)</label>
                <input value={age} onChange={(e) => setAge(e.target.value)} type="number" min="10" max="120" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Activity Level</label>
                <select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="1.2">Sedentary (little or no exercise)</option>
                  <option value="1.375">Lightly active (1-3 days/week)</option>
                  <option value="1.55">Moderately active (3-5 days/week)</option>
                  <option value="1.725">Very active (6-7 days/week)</option>
                  <option value="1.9">Extra active (hard exercise & physical job)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Goal</label>
                <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="maintain">Maintain weight</option>
                  <option value="lose">Lose weight (moderate deficit)</option>
                  <option value="gain">Gain weight (moderate surplus)</option>
                </select>
              </div>
            </div>

            <div className="flex mt-4 gap-3">
              <button onClick={onCalculate} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"><Calculator className="w-4 h-4" /><span>Calculate</span></button>
              <button onClick={onClear} className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Clear</button>
            </div>

            {error && <div className="mt-4 text-red-600 dark:text-red-300">{error}</div>}

            {result && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">BMR (cal/day)</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(result.bmr)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Maintenance (cal/day)</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(result.maintenance)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Target ({goal})</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(result.target)}</div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  <p>The calculator uses the Mifflin-St Jeor formula (widely accepted) and common activity multipliers. Results are estimates and should be adapted to individual needs.</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Flame className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Accurate BMR</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Calculates Basal Metabolic Rate using Mifflin-St Jeor.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Activity Multipliers</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Choose from common activity levels for a realistic maintenance estimate.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Goal Suggestions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Gives suggested daily calories for weight loss, maintenance or gain.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Privacy Friendly</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">All calculations run locally in your browser. No data leaves your device.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How it works</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>Input your sex, weight in kg, height in cm and age.</li>
              <li>Select an activity level that best matches your daily routine.</li>
              <li>Choose a goal: maintain, lose (moderate deficit) or gain (moderate surplus).</li>
              <li>Click Calculate to get estimated daily calories. Use these values as a starting point and adjust as needed.</li>
            </ol>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
