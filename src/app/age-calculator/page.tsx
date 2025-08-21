"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Clock, Users, Zap, Globe, FileText } from "lucide-react";
import { trackGeneration } from "@/utils/analytics";

function formatNumber(n: number) {
  return n.toString();
}

function breakdownDuration(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  const years = Math.floor(days / 365.2425);
  const months = Math.floor((days - Math.floor(years * 365.2425)) / 30);
  const remainingDays = days - (years * 365 + months * 30);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return { years, months, days: remainingDays, hours, minutes, seconds: secs };
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>("");
  const [compareDate, setCompareDate] = useState<string>("");
  const [result, setResult] = useState<null | {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalDays: number;
    totalMonths: number;
  }>(null);
  const [error, setError] = useState<string>("");

  const calculateAge = (base: Date, target: Date) => {
    if (isNaN(base.getTime()) || isNaN(target.getTime())) {
      setError("Invalid date");
      return;
    }

    if (target < base) {
      setError("Compare date must be the same or after birthdate");
      return;
    }

    setError("");

    // Using precise math by years/months/days
    let years = target.getFullYear() - base.getFullYear();
    let months = target.getMonth() - base.getMonth();
    let days = target.getDate() - base.getDate();
    let hours = target.getHours() - base.getHours();
    let minutes = target.getMinutes() - base.getMinutes();
    let seconds = target.getSeconds() - base.getSeconds();

    if (seconds < 0) { seconds += 60; minutes -= 1; }
    if (minutes < 0) { minutes += 60; hours -= 1; }
    if (hours < 0) { hours += 24; days -= 1; }
    if (days < 0) {
      // borrow days from previous month
      const prev = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      days += prev;
      months -= 1;
    }
    if (months < 0) { months += 12; years -= 1; }

    // total days and months approximations
    const ms = target.getTime() - base.getTime();
    const totalDays = Math.floor(ms / (1000 * 60 * 60 * 24));
    const totalMonths = Math.floor(totalDays / 30);

    setResult({ years, months, days, hours, minutes, seconds, totalDays, totalMonths });
    trackGeneration('Age Calculation');
  };

  const onCalculate = () => {
    const b = new Date(birthDate);
    const t = compareDate ? new Date(compareDate) : new Date();
    calculateAge(b, t);
  };

  const onClear = () => {
    setBirthDate("");
    setCompareDate("");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Age Calculator</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Calculate age accurately from birthdate and compare between dates. Get years, months, days and full breakdown.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Calculate Age</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Birthdate</label>
                <input type="datetime-local" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Compare To (leave empty for now)</label>
                <input type="datetime-local" value={compareDate} onChange={(e) => setCompareDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </div>

            <div className="flex mt-4 gap-3">
              <button onClick={onCalculate} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">Calculate</button>
              <button onClick={onClear} className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Clear</button>
            </div>

            {error && <div className="mt-4 text-red-600 dark:text-red-300">{error}</div>}

            {result && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Result</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Years</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.years}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Months</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.months}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Days</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.days}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Hours</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.hours}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Minutes</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.minutes}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Seconds</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.seconds}</div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  <div>Total days: <span className="font-medium text-gray-900 dark:text-white">{result.totalDays}</span></div>
                  <div>Total months (approx): <span className="font-medium text-gray-900 dark:text-white">{result.totalMonths}</span></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Accurate Calculation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Precise years, months, days, hours, minutes and seconds computation.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Compare Dates</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Calculate age relative to any date, not only today.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Instant</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Calculations run locally with no network requests.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Privacy Friendly</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">All processing is done in your browser.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Common Formats</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Supports datetime-local input and ISO date parsing.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How it works</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>Provide a birthdate using the local date & time picker.</li>
              <li>Optionally provide a comparison date or leave empty to use current date/time.</li>
              <li>Click Calculate to get a detailed breakdown and totals.</li>
              <li>All calculations are performed locally in your browser for privacy and speed.</li>
            </ol>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">FAQ</h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Can I use this for age verification?</h3>
                <p>Yes, but this tool provides a calculation only; legal or official verification may require documents.</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">What input formats are supported?</h3>
                <p>Use the browser datetime picker or provide ISO date strings. Timezones are handled by the browser.</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Is there a limit?</h3>
                <p>There is no practical limit for reasonable date ranges; very distant dates may show large numbers.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
