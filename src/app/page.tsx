"use client";

import CategoryHeader from "@/components/CategoryHeader";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import { useToolSearch } from "@/hooks/useToolSearch";
import {
  Search,
  Shield,
  Smartphone,
  Zap
} from "lucide-react";
import { Suspense, useCallback } from "react";

;

import categories from '@/data/categories';
import getIcon from '@/lib/iconMap';

// Page component with search functionality
function HomePage() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Toolizio",
            "description": "Free online tools for developers and users",
            "url": "https://toolizio.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://toolizio.com?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      
      <Header />

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
    {hasResults && Object.entries(filteredCategories).map(([categoryKey, category]) => (
          <section key={categoryKey} className="mb-16" id={categoryKey}>
            {/* Category Header */}
            <CategoryHeader category={{
              ...category,
      icon: (categories as any)[categoryKey].icon,
      color: (categories as any)[categoryKey].color
            }} />

            {/* Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.tools.map((tool) => (
                <ToolCard key={tool.href} tool={{
                  ...tool,
                  icon: getIcon(tool.icon || 'FileText')
                }} category={{
                  ...category,
                  color: (categories as any)[categoryKey].color
                }} />
              ))}
            </div>
          </section>
        ))}

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

      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}
