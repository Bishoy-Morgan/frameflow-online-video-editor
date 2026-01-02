'use client';

import React, { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import TemplatesHero from './TemplatesHero';
import CategoryPills from './CategoryPills';
import AdvancedFilters from './AdvancedFilters';
import TemplateCard from './TemplateCard';
import EmptyState from './EmptyState';
import { TEMPLATES, Category, AspectRatio, Duration, Style } from './TemplatesData';

export default function TemplatesGalleryPage() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>('All');
  const [selectedDuration, setSelectedDuration] = useState<Duration>('All');
  const [selectedStyle, setSelectedStyle] = useState<Style>('All');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Memoized filtering logic - demonstrates performance optimization
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      const matchesAspectRatio = selectedAspectRatio === 'All' || template.aspectRatio === selectedAspectRatio;
      const matchesStyle = selectedStyle === 'All' || template.style === selectedStyle;
      
      const matchesDuration = (() => {
        if (selectedDuration === 'All') return true;
        if (selectedDuration === 'Under 15s') return template.duration < 15;
        if (selectedDuration === '15-30s') return template.duration >= 15 && template.duration <= 30;
        if (selectedDuration === '30-60s') return template.duration > 30 && template.duration <= 60;
        if (selectedDuration === '60s+') return template.duration > 60;
        return true;
      })();

      return matchesSearch && matchesCategory && matchesAspectRatio && matchesDuration && matchesStyle;
    });
  }, [searchQuery, selectedCategory, selectedAspectRatio, selectedDuration, selectedStyle]);

  // Calculate active filters count
  const activeFiltersCount = [selectedCategory, selectedAspectRatio, selectedDuration, selectedStyle]
    .filter(filter => filter !== 'All').length;

  // Clear all filters function
  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedAspectRatio('All');
    setSelectedDuration('All');
    setSelectedStyle('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <TemplatesHero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDark={isDark}
      />

      {/* Templates Section */}
      <div className="py-20 lg:py-32">
        <div className="container max-w-7xl">
          
          {/* Category Pills */}
          <CategoryPills 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            isDark={isDark}
          />

          {/* Filter Toggle & Results Count */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                isDark
                  ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                  : 'bg-neutral-200 text-black hover:bg-neutral-300'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-hotPink text-white text-tiny">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <div className="text-body opacity-70">
              {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'}
            </div>
          </div>

          {/* Advanced Filters */}
          <AdvancedFilters 
            showFilters={showFilters}
            selectedAspectRatio={selectedAspectRatio}
            setSelectedAspectRatio={setSelectedAspectRatio}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
            activeFiltersCount={activeFiltersCount}
            clearAllFilters={clearAllFilters}
            isDark={isDark}
          />

          {/* Templates Grid or Empty State */}
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <EmptyState clearAllFilters={clearAllFilters} isDark={isDark} />
          )}
        </div>
      </div>
    </div>
  );
}