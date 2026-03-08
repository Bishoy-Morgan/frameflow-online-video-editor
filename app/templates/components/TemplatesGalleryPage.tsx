'use client'

import React, { useState, useMemo } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import TemplatesHero from './TemplatesHero'
import CategoryPills from './CategoryPills'
import AdvancedFilters from './AdvancedFilters'
import TemplateCard from './TemplateCard'
import EmptyState from './EmptyState'
import { TEMPLATES, Category, AspectRatio, Duration, Style } from './TemplatesData'

// Filter chip

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{
                backgroundColor: 'var(--turquoise-8)',
                border:          '1px solid var(--turquoise-22)',
                color:           'var(--turquoise)',
            }}
        >
            {label}
            <button
                onClick={onRemove}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'flex' }}
            >
                <X size={11} strokeWidth={2.5} />
            </button>
        </div>
    )
}

// Page

export default function TemplatesGalleryPage() {
    const [searchQuery,        setSearchQuery]        = useState<string>('')
    const [selectedCategory,   setSelectedCategory]   = useState<Category>('All')
    const [selectedAspectRatio,setSelectedAspectRatio]= useState<AspectRatio>('All')
    const [selectedDuration,   setSelectedDuration]   = useState<Duration>('All')
    const [selectedStyle,      setSelectedStyle]      = useState<Style>('All')
    const [showFilters,        setShowFilters]        = useState<boolean>(false)

    const filteredTemplates = useMemo(() => {
        return TEMPLATES.filter(template => {
            const matchesSearch      = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                       template.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory    = selectedCategory    === 'All' || template.category    === selectedCategory
            const matchesAspectRatio = selectedAspectRatio === 'All' || template.aspectRatio === selectedAspectRatio
            const matchesStyle       = selectedStyle       === 'All' || template.style       === selectedStyle
            const matchesDuration    = (() => {
                if (selectedDuration === 'All')      return true
                if (selectedDuration === 'Under 15s') return template.duration < 15
                if (selectedDuration === '15-30s')    return template.duration >= 15 && template.duration <= 30
                if (selectedDuration === '30-60s')    return template.duration > 30  && template.duration <= 60
                if (selectedDuration === '60s+')      return template.duration > 60
                return true
            })()
            return matchesSearch && matchesCategory && matchesAspectRatio && matchesDuration && matchesStyle
        })
    }, [searchQuery, selectedCategory, selectedAspectRatio, selectedDuration, selectedStyle])

    const activeFilters: { label: string; clear: () => void }[] = [
        ...(selectedCategory    !== 'All' ? [{ label: selectedCategory,    clear: () => setSelectedCategory('All')    }] : []),
        ...(selectedAspectRatio !== 'All' ? [{ label: selectedAspectRatio, clear: () => setSelectedAspectRatio('All') }] : []),
        ...(selectedDuration    !== 'All' ? [{ label: selectedDuration,    clear: () => setSelectedDuration('All')    }] : []),
        ...(selectedStyle       !== 'All' ? [{ label: selectedStyle,       clear: () => setSelectedStyle('All')       }] : []),
    ]

    const clearAllFilters = () => {
        setSelectedCategory('All')
        setSelectedAspectRatio('All')
        setSelectedDuration('All')
        setSelectedStyle('All')
        setSearchQuery('')
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>

            {/* Hero */}
            <TemplatesHero
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {/* Gallery section */}
            <div className="py-20 lg:py-28">
                <div className="container max-w-7xl mx-auto px-6">

                    {/* Category pills */}
                    <CategoryPills
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />

                    {/* Toolbar */}
                    <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">

                        {/* Left: filter toggle + active chips */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <button
                                onClick={() => setShowFilters(f => !f)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                                style={{
                                    backgroundColor: showFilters ? 'var(--turquoise-8)'      : 'var(--surface-raised)',
                                    border:          showFilters ? '1px solid var(--turquoise-22)' : '1px solid var(--border-default)',
                                    color:           showFilters ? 'var(--turquoise)'         : 'var(--text-tertiary)',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={e => { if (!showFilters) { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text)' } }}
                                onMouseLeave={e => { if (!showFilters) { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-tertiary)' } }}
                            >
                                <SlidersHorizontal size={15} strokeWidth={2} />
                                Filters
                                {activeFilters.length > 0 && (
                                    <span
                                        className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
                                        style={{ backgroundColor: 'var(--turquoise)', color: '#fff' }}
                                    >
                                        {activeFilters.length}
                                    </span>
                                )}
                            </button>

                            {/* Active filter chips */}
                            {activeFilters.map(f => (
                                <FilterChip key={f.label} label={f.label} onRemove={f.clear} />
                            ))}

                            {activeFilters.length > 1 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-xs font-semibold transition-colors"
                                    style={{ color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}
                                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)' }}
                                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Right: count */}
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                            {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'}
                        </span>
                    </div>

                    {/* Advanced filters panel */}
                    <AdvancedFilters
                        showFilters={showFilters}
                        selectedAspectRatio={selectedAspectRatio}
                        setSelectedAspectRatio={setSelectedAspectRatio}
                        selectedDuration={selectedDuration}
                        setSelectedDuration={setSelectedDuration}
                        selectedStyle={selectedStyle}
                        setSelectedStyle={setSelectedStyle}
                        activeFiltersCount={activeFilters.length}
                        clearAllFilters={clearAllFilters}
                    />

                    {/* Grid or empty */}
                    {filteredTemplates.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                            {filteredTemplates.map(template => (
                                <TemplateCard key={template.id} template={template} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState clearAllFilters={clearAllFilters} />
                    )}

                </div>
            </div>
        </div>
    )
}