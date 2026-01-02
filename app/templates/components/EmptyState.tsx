'use client';

import React from 'react';
import { Search } from 'lucide-react';
import Button from '@/components/ui/Button';

interface EmptyStateProps {
  clearAllFilters: () => void;
  isDark: boolean;
}

export default function EmptyState({ clearAllFilters, isDark }: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
        isDark ? 'bg-neutral-800' : 'bg-neutral-200'
      }`}>
        <Search className="w-10 h-10 opacity-50" />
      </div>
      <h3 className="mb-2">No templates found</h3>
      <p className="text-body opacity-70 mb-6">
        Try adjusting your filters or search query
      </p>
      <Button variant="secondary" onClick={clearAllFilters}>
        Clear All Filters
      </Button>
    </div>
  );
}