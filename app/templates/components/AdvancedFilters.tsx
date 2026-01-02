'use client';

import React from 'react';
import FilterGroup from './FilterGroup';
import { ASPECT_RATIOS, DURATIONS, STYLES, AspectRatio, Duration, Style } from './TemplatesData';

interface AdvancedFiltersProps {
  showFilters: boolean;
  selectedAspectRatio: AspectRatio;
  setSelectedAspectRatio: (ratio: AspectRatio) => void;
  selectedDuration: Duration;
  setSelectedDuration: (duration: Duration) => void;
  selectedStyle: Style;
  setSelectedStyle: (style: Style) => void;
  activeFiltersCount: number;
  clearAllFilters: () => void;
  isDark: boolean;
}

export default function AdvancedFilters({ 
  showFilters, 
  selectedAspectRatio, 
  setSelectedAspectRatio,
  selectedDuration,
  setSelectedDuration,
  selectedStyle,
  setSelectedStyle,
  activeFiltersCount,
  clearAllFilters,
  isDark 
}: AdvancedFiltersProps) {
  if (!showFilters) return null;

  return (
    <div className={`mb-8 p-6 rounded-xl border-2 ${
      isDark ? 'bg-neutral-900 border-white/20' : 'bg-neutral-50 border-black/20'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Advanced Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-hotPink hover:underline text-body font-semibold"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Aspect Ratio Filter */}
        <FilterGroup 
          label="Aspect Ratio" 
          options={ASPECT_RATIOS}
          selected={selectedAspectRatio}
          onChange={(value) => setSelectedAspectRatio(value as AspectRatio)}
          name="aspectRatio"
        />

        {/* Duration Filter */}
        <FilterGroup 
          label="Duration" 
          options={DURATIONS}
          selected={selectedDuration}
          onChange={(value) => setSelectedDuration(value as Duration)}
          name="duration"
        />

        {/* Style Filter */}
        <FilterGroup 
          label="Style" 
          options={STYLES}
          selected={selectedStyle}
          onChange={(value) => setSelectedStyle(value as Style)}
          name="style"
        />
      </div>
    </div>
  );
}