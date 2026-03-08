'use client'

import React from 'react'
import { CATEGORIES, Category } from './TemplatesData'
import { Dispatch, SetStateAction } from 'react'

interface CategoryPillsProps {
    selectedCategory:    Category
    setSelectedCategory: Dispatch<SetStateAction<Category>>
}

export default function CategoryPills({ selectedCategory, setSelectedCategory }: CategoryPillsProps) {
    return (
        <div className="flex items-center gap-2 flex-wrap mb-8">
            {CATEGORIES.map(category => {
                const active = selectedCategory === category
                return (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
                        style={{
                            backgroundColor: active ? 'var(--turquoise)'   : 'var(--surface-raised)',
                            border:          active ? '1px solid var(--turquoise)' : '1px solid var(--border-default)',
                            color:           active ? '#fff'               : 'var(--text-tertiary)',
                            boxShadow:       active ? '0 4px 14px var(--turquoise-22)' : 'none',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text)' } }}
                        onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-tertiary)' } }}
                    >
                        {category}
                    </button>
                )
            })}
        </div>
    )
}