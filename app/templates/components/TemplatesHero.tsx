'use client'

import React, { useEffect, useRef } from 'react'
import { Search, X, Wand2 } from 'lucide-react'
import SectionGrid from '@/components/ui/SectionGrid'
import { TEMPLATES, CATEGORIES } from './TemplatesData'

interface TemplatesHeroProps {
    searchQuery:    string
    setSearchQuery: (q: string) => void
}

export default function TemplatesHero({ searchQuery, setSearchQuery }: TemplatesHeroProps) {
    const pillRef     = useRef<HTMLDivElement>(null)
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const subRef      = useRef<HTMLParagraphElement>(null)
    const searchRef   = useRef<HTMLDivElement>(null)
    const statsRef    = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const seq = [
            { el: pillRef.current,     delay: 0   },
            { el: headlineRef.current, delay: 100 },
            { el: subRef.current,      delay: 220 },
            { el: searchRef.current,   delay: 320 },
            { el: statsRef.current,    delay: 420 },
        ]
        seq.forEach(({ el, delay }) => {
            if (!el) return
            el.style.opacity   = '0'
            el.style.transform = 'translateY(20px)'
            setTimeout(() => {
                el.style.transition = 'opacity 0.65s ease, transform 0.65s ease'
                el.style.opacity    = '1'
                el.style.transform  = 'translateY(0)'
            }, delay)
        })
    }, [])

    return (
        <section className="relative w-full flex items-center overflow-hidden surface pt-40 pb-20">

            <SectionGrid />

            {/* Glows */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-[15%] -right-[5%] w-162.5 h-162.5 rounded-full"
                style={{ background: 'radial-gradient(circle, var(--turquoise-10) 0%, transparent 70%)', filter: 'blur(72px)' }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute bottom-0 -left-[10%] w-100 h-100 rounded-full"
                style={{ background: 'radial-gradient(circle, var(--turquoise-6) 0%, transparent 70%)', filter: 'blur(60px)' }}
            />

            <div className="container relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">

                {/* Pill */}
                <div
                    ref={pillRef}
                    className="flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                    style={{
                        backgroundColor: 'var(--turquoise-8)',
                        border:          '1px solid var(--turquoise-22)',
                    }}
                >
                    <Wand2 size={13} style={{ color: 'var(--turquoise)' }} strokeWidth={2} />
                    <span className="text-xs font-bold" style={{ color: 'var(--turquoise)' }}>
                        {TEMPLATES.length}+ Ready-to-use templates
                    </span>
                </div>

                {/* Headline */}
                <h1
                    ref={headlineRef}
                    className="font-normal m-0 mb-6"
                    style={{
                        fontSize:      'clamp(2.4rem, 5vw, 4rem)',
                        lineHeight:    1.08,
                        letterSpacing: '-0.025em',
                        color:         'var(--text)',
                    }}
                >
                    Start from a
                    <br />
                    <span className="italic" style={{ color: 'var(--turquoise)' }}>professional template.</span>
                </h1>

                {/* Sub */}
                <p
                    ref={subRef}
                    className="m-0 mb-10 text-[1rem] leading-[1.75]"
                    style={{ color: 'var(--text-tertiary)', maxWidth: '520px' }}
                >
                    Pick a template, customize the scenes, and go straight to editing.
                    No blank canvas, no wasted time.
                </p>

                {/* Search */}
                <div ref={searchRef} className="w-full max-w-xl relative mb-10">
                    <Search
                        size={18}
                        strokeWidth={2}
                        className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: 'var(--text-tertiary)' }}
                    />
                    <input
                        type="text"
                        placeholder="Search templates…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full outline-none text-sm font-semibold"
                        style={{
                            paddingLeft:     '48px',
                            paddingRight:    searchQuery ? '48px' : '20px',
                            paddingTop:      '16px',
                            paddingBottom:   '16px',
                            borderRadius:    '0.875rem',
                            backgroundColor: 'var(--surface-raised)',
                            border:          '1px solid var(--border-default)',
                            color:           'var(--text)',
                            boxShadow:       '0 4px 24px rgba(0,0,0,0.06)',
                            transition:      'border-color 0.2s ease, box-shadow 0.2s ease',
                        }}
                        onFocus={e => {
                            e.currentTarget.style.borderColor = 'var(--turquoise-42)'
                            e.currentTarget.style.boxShadow  = '0 0 0 3px var(--turquoise-8), 0 4px 24px rgba(0,0,0,0.06)'
                        }}
                        onBlur={e => {
                            e.currentTarget.style.borderColor = 'var(--border-default)'
                            e.currentTarget.style.boxShadow  = '0 4px 24px rgba(0,0,0,0.06)'
                        }}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-5 top-1/2 -translate-y-1/2 transition-colors"
                            style={{ color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Stats */}
                <div ref={statsRef} className="flex items-center justify-center gap-8 flex-wrap">
                    {[
                        { value: `${TEMPLATES.length}+`,         label: 'Templates'  },
                        { value: `${CATEGORIES.length - 1}`,     label: 'Categories' },
                        { value: 'Free & Pro',                   label: 'Plans'      },
                    ].map(({ value, label }) => (
                        <div key={label} className="flex items-center gap-2.5">
                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: 'var(--turquoise)' }}
                            />
                            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                                {value}
                            </span>
                            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}