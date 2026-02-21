"use client";

import CategoryHeader from "@/components/CategoryHeader";
import ToolCard from "@/components/ToolCard";
import SearchBar from "@/components/SearchBar";
import { useToolSearch } from "@/hooks/useToolSearch";
import { Search, Zap, Shield, Smartphone } from "lucide-react";
import { Suspense, useCallback } from "react";
import getIcon from "@/lib/iconMap";

interface HomeContentProps {
  categories: any;
}

export default function HomeContent({ categories }: HomeContentProps) {
  const { 
    searchQuery, 
    setSearchQuery, 
    filteredCategories, 
    totalResults, 
    hasResults, 
    isSearching 
  } = useToolSearch({ categories });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Search Bar */}
      <Suspense fallback={<div className="h-16 mb-8" />}>
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search for tools (e.g., CPF, password, converter)..."
        />
      </Suspense>

      {/* Search Results Summary */}
      {isSearching && (
        <div className="text-center mb-8">
          {hasResults ? (
            <p className="text-gray-600 dark:text-gray-400">
              Found <span className="font-medium text-blue-600 dark:text-blue-400">{totalResults}</span> tool{totalResults !== 1 ? 's' : ''} 
              {searchQuery && (
                <> for "<span className="font-medium">{searchQuery}</span>"</>
              )}
            </p>
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No tools found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No tools match your search for "<span className="font-medium">{searchQuery}</span>"
              </p>
              <button
                onClick={() => handleSearch("")}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Clear search and view all tools
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tool Categories */}
      {hasResults && Object.entries(filteredCategories).map(([categoryKey, category]: [string, any]) => (
        <section key={categoryKey} className="mb-16" id={categoryKey}>
          <CategoryHeader category={{
            ...category,
            icon: categories[categoryKey].icon,
            color: categories[categoryKey].color
          }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.tools.map((tool: any) => (
              <ToolCard key={tool.href} tool={{
                ...tool,
                icon: getIcon(tool.icon || 'FileText')
              }} category={{
                ...category,
                color: categories[categoryKey].color
              }} />
            ))}
          </div>
        </section>
      ))}

      {/* Introductory Section */}
      {!isSearching && (
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to Toolizio
          </h1>
          <div className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed space-y-4">
            <p>
              Toolizio is a comprehensive platform of free online tools designed to simplify daily and professional tasks. Offering more than 20 essential tools, Toolizio serves a wide range of users, from software developers to marketing professionals, financial managers, and individuals seeking greater productivity.
            </p>
            <p>
              For Developers: Tools like CPF, CNPJ, secure password, QR code, and UUID generators help in creating test data and validation. Format converters such as JSON to CSV, XML to JSON, and hash and bcrypt tools facilitate application development and debugging.
            </p>
            <p>
              For Marketing Professionals: QR code generators for campaigns, contact extraction tools, WhatsApp link creators, and YouTube thumbnail generators allow for creating engaging and trackable content. Image compression and resizing tools optimize media for web and social networks.
            </p>
            <p>
              For Productivity-Focused Users: Salary calculators, word counters, Pomodoro timers, and document conversion tools (HTML to PDF, Markdown to PDF) help manage time and tasks efficiently. Barcode and favicon generators support promotional material creation.
            </p>
            <p>
              For Financial Managers: Compound interest calculators, ad earnings simulators, and fuel consumption calculation tools enable precise analysis and financial planning.
            </p>
            <p>
              Benefits of Toolizio's Online Tools:
            </p>
            <ul className="list-disc list-inside text-left max-w-2xl mx-auto space-y-2">
              <li>Instant Access: All tools work directly in the browser, no downloads or installations required.</li>
              <li>Security and Privacy: Local data processing, no personal information storage. Security tools like JWT decoders and hash generators ensure protection.</li>
              <li>Completely Free: Zero costs, zero mandatory registrations.</li>
              <li>Mobile Compatibility: Responsive interface that works perfectly on mobile devices, tablets, and desktops.</li>
              <li>Speed and Efficiency: Optimized algorithms for fast results, saving valuable time.</li>
              <li>Constant Updates: New tools added regularly to meet emerging needs.</li>
            </ul>
            <p>
              Toolizio is committed to excellence, offering reliable and easy-to-use tools. Whether for generating test data, converting formats, creating visual codes, or calculating financial metrics, Toolizio is your digital partner for productivity and innovation.
            </p>
          </div>
        </section>
      )}

      {/* Show additional sections only when not searching */}
      {!isSearching && (
        <>
          {/* Statistics Section */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-white mb-16">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Trusted Tools
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold">20+</div>
                  <div className="text-blue-100">Tools</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold">100%</div>
                  <div className="text-blue-100">Free</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold">24/7</div>
                  <div className="text-blue-100">Available</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold">0</div>
                  <div className="text-blue-100">Registration</div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ/About Section */}
          <section className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Why choose Toolizio?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Fast and Simple
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  All tools work directly in your browser, no installations or downloads required.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Secure and Private
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your data is processed locally. We don't store any personal information.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Mobile Friendly
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  All tools work perfectly on phones, tablets and computers.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
