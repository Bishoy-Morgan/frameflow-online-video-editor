'use client'

import React from 'react'
import { ASPECT_RATIOS, DURATIONS, STYLES, AspectRatio, Duration, Style } from './TemplatesData'

interface AdvancedFiltersProps {
    showFilters:          boolean
    selectedAspectRatio:  AspectRatio
    setSelectedAspectRatio: (v: AspectRatio) => void
    selectedDuration:     Duration
    setSelectedDuration:  (v: Duration) => void
    selectedStyle:        Style
    setSelectedStyle:     (v: Style) => void
    activeFiltersCount:   number
    clearAllFilters:      () => void
}

function FilterGroup<T extends string>({
    label,
    options,
    value,
    onChange,
}: {
    label:    string
    options:  readonly T[]
    value:    T
    onChange: (v: T) => void
}) {
    return (
        <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                {label}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
                {options.map(option => {
                    const active = value === option
                    return (
                        <button
                            key={option}
                            onClick={() => onChange(option)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150"
                            style={{
                                backgroundColor: active ? 'var(--turquoise-8)'   : 'var(--bg)',
                                border:          active ? '1px solid var(--turquoise-42)' : '1px solid var(--border-default)',
                                color:           active ? 'var(--turquoise)'     : 'var(--text-tertiary)',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text)' } }}
                            onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-tertiary)' } }}
                        >
                            {option}
                        </button>
                    )
                })}
            </div>
        </div>
    )
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
}: AdvancedFiltersProps) {
    if (!showFilters) return null

    return (
        <div
            className="flex flex-col gap-6 p-6 rounded-2xl mb-8"
            style={{
                backgroundColor: 'var(--surface-raised)',
                border:          '1px solid var(--border-default)',
            }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <FilterGroup
                    label="Aspect Ratio"
                    options={ASPECT_RATIOS}
                    value={selectedAspectRatio}
                    onChange={setSelectedAspectRatio}
                />
                <FilterGroup
                    label="Duration"
                    options={DURATIONS}
                    value={selectedDuration}
                    onChange={setSelectedDuration}
                />
                <FilterGroup
                    label="Style"
                    options={STYLES}
                    value={selectedStyle}
                    onChange={setSelectedStyle}
                />
            </div>

            {activeFiltersCount > 0 && (
                <div
                    className="flex justify-end pt-4"
                    style={{ borderTop: '1px solid var(--border-subtle)' }}
                >
                    <button
                        onClick={clearAllFilters}
                        className="text-xs font-semibold transition-colors"
                        style={{ color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ef4444' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    )
}