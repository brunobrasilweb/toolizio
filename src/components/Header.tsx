'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from 'react';
import ThemeToggle from "./ThemeToggle";
import CategoryNav from './CategoryNav';
import categories from '@/data/categories';

type HeaderProps = {
  showBackButton?: boolean;
};

export default function Header({ showBackButton = false }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            {/* Logo para tema claro */}
            <Image
              src="/logo.png"
              alt="Toolizio"
              width={120}
              height={40}
              className="block dark:hidden"
            />
            {/* Logo para tema escuro */}
            <Image
              src="/logo-dark.png"
              alt="Toolizio"
              width={120}
              height={40}
              className="hidden dark:block"
            />
          </Link>
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back
              </Link>
            )}
            {/* desktop category nav on the right of header (hidden on small screens) */}
            <div className="ml-4 hidden lg:block">
              <CategoryNav categories={categories} inHeader />
            </div>

            {/* mobile menu button (visible on small screens) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-expanded={mobileOpen}
              aria-label="Open categories menu"
            >
              {/* simple hamburger icon */}
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* theme toggle stays at the far right and is always visible */}
            <div className="ml-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
        {/* Mobile dropdown: show when mobileOpen is true */}
        {mobileOpen && (
          <div className="lg:hidden mt-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm py-2">
                {Object.entries(categories).map(([key, cat]) => (
                  <Link
                    key={key}
                    href={`/category/${key}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
