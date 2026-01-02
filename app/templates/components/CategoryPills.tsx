'use client';

import React from 'react';
import { CATEGORIES, Category } from './TemplatesData';

interface CategoryPillsProps {
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  isDark: boolean;
}

export default function CategoryPills({ selectedCategory, setSelectedCategory, isDark }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8 justify-center">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-6 py-2 rounded-full text-body font-semibold transition-all ${
            selectedCategory === category
              ? 'bg-turquoise text-neutral-800'
              : isDark
                ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                : 'bg-neutral-200 text-black hover:bg-neutral-300'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}