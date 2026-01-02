'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { TEMPLATES, CATEGORIES } from './TemplatesData';

interface TemplatesHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDark: boolean;
}

export default function TemplatesHero({ searchQuery, setSearchQuery, isDark }: TemplatesHeroProps) {
  return (
    <section className="relative py-32 lg:py-44 overflow-hidden ">
      <div className="container max-w-7xl text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-6">Professional Video Templates</h1>
          <p className="text-lead font-semibold opacity-80 mb-12">
            Kickstart your creativity with our curated collection of ready-to-use templates. 
            From social media clips to corporate presentations, find the perfect starting point for your next project.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-16 pr-16 py-5 rounded-xl text-body font-semibold border-2 transition-all shadow-lg ${
                isDark 
                  ? 'bg-neutral-900 border-white/20 focus:border-turquoise text-white' 
                  : 'bg-white border-black/20 focus:border-turquoise text-black'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 text-body font-semibold opacity-70">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-turquoise' : 'bg-hotPink'}`} />
              <span>{TEMPLATES.length}+ Templates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-turquoise' : 'bg-hotPink'}`} />
              <span>{CATEGORIES.length - 1} Categories</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-turquoise' : 'bg-hotPink'}`} />
              <span>Free & Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl ${
          isDark ? 'bg-turquoise' : 'bg-hotPink'
        }`} />
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl ${
          isDark ? 'bg-hotPink' : 'bg-turquoise'
        }`} />
      </div>
    </section>
  );
}