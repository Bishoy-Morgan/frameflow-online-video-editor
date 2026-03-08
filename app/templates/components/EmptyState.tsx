'use client'

import React from 'react'
import { SearchX } from 'lucide-react'

interface EmptyStateProps {
    clearAllFilters: () => void
}

export default function EmptyState({ clearAllFilters }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
            >
                <SearchX size={26} style={{ color: 'var(--text-tertiary)', opacity: 0.5 }} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-1.5">
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>No templates found</p>
                <p className="text-xs max-w-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Try adjusting your search or filters to find what you&apos;re looking for.
                </p>
            </div>
            <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-opacity"
                style={{
                    backgroundColor: 'var(--turquoise)',
                    color:           '#fff',
                    boxShadow:       '0 4px 14px var(--turquoise-22)',
                    border:          'none',
                    cursor:          'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'    }}
            >
                Clear all filters
            </button>
        </div>
    )
}