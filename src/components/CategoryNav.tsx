"use client";

import Link from 'next/link';

interface CategoryNavProps {
  categories: Record<string, {
    title: string;
    color?: string;
  }>;
  inHeader?: boolean;
}

const colorMap = {
  blue: "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50",
  red: "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50",
  green: "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50",
  purple: "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/50",
  orange: "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/50",
  cyan: "text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/50"
};

export default function CategoryNav({ categories, inHeader = false }: CategoryNavProps) {
  // compact style when placed inside header
  if (inHeader) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        {Object.entries(categories).map(([categoryKey, category]) => {
          const colors = colorMap[category.color as keyof typeof colorMap] || colorMap.blue;
          return (
            <Link
              key={categoryKey}
              href={`/category/${categoryKey}`}
              className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-150 ${colors}`}
            >
              <span className="text-sm font-medium">{category.title}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <nav className="sticky top-20 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-4 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-3">
          {Object.entries(categories).map(([categoryKey, category]) => {
            const colors = colorMap[category.color as keyof typeof colorMap] || colorMap.blue;
            return (
              <Link
                key={categoryKey}
                href={`/category/${categoryKey}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${colors}`}
              >
                <span className="text-sm font-medium">{category.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
