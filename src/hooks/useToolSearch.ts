"use client";

import { useState, useMemo } from "react";

interface Tool {
  href: string;
  title: string;
  description: string;
  keywords: string;
  icon?: string;
}

interface Category {
  title: string;
  description: string;
  icon?: string;
  color?: string;
  tools: Tool[];
}

interface UseToolSearchProps {
  categories: Record<string, Category>;
}

export function useToolSearch({ categories }: UseToolSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered: Record<string, Category> = {};

    Object.entries(categories).forEach(([categoryKey, category]) => {
      const filteredTools = category.tools.filter((tool) => {
        const searchableText = `${tool.title} ${tool.description} ${tool.keywords}`.toLowerCase();
        return searchableText.includes(query);
      });

      if (filteredTools.length > 0) {
        filtered[categoryKey] = {
          ...category,
          tools: filteredTools,
        };
      }
    });

    return filtered;
  }, [categories, searchQuery]);

  const totalResults = useMemo(() => {
    return Object.values(filteredCategories).reduce(
      (sum, category) => sum + category.tools.length,
      0
    );
  }, [filteredCategories]);

  const hasResults = totalResults > 0;
  const isSearching = searchQuery.trim().length > 0;

  return {
    searchQuery,
    setSearchQuery,
    filteredCategories,
    totalResults,
    hasResults,
    isSearching,
  };
}
