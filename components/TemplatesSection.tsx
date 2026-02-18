'use client'

import React, { useRef, useEffect } from 'react'
import { Play, ArrowRight } from 'lucide-react'
import Button from './ui/Button'
import SectionGrid from './ui/SectionGrid'

const templates = [
    { name: 'Vlog Intro',        category: 'YouTube'   },
    { name: 'Product Showcase',  category: 'Business'  },
    { name: 'Tutorial',          category: 'Education' },
    { name: 'Music Video',       category: 'Creative'  },
    { name: 'Social Ad',         category: 'Marketing' },
    { name: 'Testimonial',       category: 'Business'  },
]

// Turquoise-only gradient pairs — varied angle and stop position
const gradients = [
    'linear-gradient(145deg, var(--turquoise-45) 0%, var(--turquoise-10) 100%)',
    'linear-gradient(160deg, var(--turquoise-22) 0%, var(--turquoise-42) 100%)',
    'linear-gradient(130deg, var(--turquoise-35) 20%, var(--turquoise-8)  100%)',
    'linear-gradient(150deg, var(--turquoise-10) 0%, var(--turquoise-40) 100%)',
    'linear-gradient(140deg, var(--turquoise-42) 0%, var(--turquoise-16) 100%)',
    'linear-gradient(155deg, var(--turquoise-20) 0%, var(--turquoise-45) 100%)',
]

const TemplateCard = ({ template, index }: { template: typeof templates[0]; index: number }) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.style.opacity = '0'
        el.style.transform = 'translateY(16px)'
        const t = setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
        }, 80 + index * 60)
        return () => clearTimeout(t)
    }, [index])

    return (
        <div ref={ref} className="group flex flex-col gap-3 cursor-pointer">

            {/* Card */}
            <div
                className="relative rounded-xl overflow-hidden"
                style={{
                    aspectRatio: '9 / 16',
                    background: gradients[index],
                    border: '1px solid var(--turquoise-22)',
                }}
            >
                {/* Hover overlay */}
                <div
                    className="absolute inset-0 transition-colors duration-300"
                    style={{ backgroundColor: 'rgba(2,2,2,0.15)' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(2,2,2,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(2,2,2,0.15)'}
                />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(2,2,2,0.45)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                        <Play size={16} strokeWidth={0} fill="var(--bg)" />
                    </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 right-3">
                    <span
                        className="text-[0.58rem] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                        style={{
                            backgroundColor: 'rgba(2,2,2,0.35)',
                            backdropFilter: 'blur(6px)',
                            color: '#fefefe',
                            border: '1px solid rgba(255,255,255,0.12)',
                        }}
                    >
                        {template.category}
                    </span>
                </div>

                {/* Bottom turquoise accent line */}
                <div
                    className="absolute bottom-0 inset-x-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-turquoise"
                    style={{ boxShadow: '0 0 8px var(--turquoise)' }}
                />
            </div>

            {/* Name */}
            <span
                className="text-sm font-semibold transition-colors duration-200"
                style={{ color: 'var(--text-secondary)' }}
            >
                {template.name}
            </span>
        </div>
    )
}

const TemplatesSection = () => {
    const headerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = headerRef.current
        if (!el) return
        el.style.opacity = '0'
        el.style.transform = 'translateY(14px)'
        setTimeout(() => {
            el.style.transition = 'opacity 0.55s ease, transform 0.55s ease'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
        }, 60)
    }, [])

    return (
        <section className="relative w-full overflow-hidden py-28 surface">

            <SectionGrid />

            {/* Glow — bottom left */}
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-[15%] -left-[5%] w-[480px] h-[480px] rounded-full"
                style={{ background: 'radial-gradient(circle, var(--turquoise-8) 0%, transparent 70%)', filter: 'blur(72px)' }}
            />

            <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

            <div className="container relative z-10">

                {/* Header */}
                <div ref={headerRef} className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-px bg-turquoise" />
                            <span className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-turquoise">
                                Templates
                            </span>
                        </div>
                        <h2 className="font-normal m-0" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}>
                            Ready-to-use templates.
                        </h2>
                        <p className="m-0 text-sm text-tertiary">
                            Start creating in seconds — no blank canvas required.
                        </p>
                    </div>

                    <Button
                        variant="secondary"
                        icon={<ArrowRight size={14} strokeWidth={2} />}
                        iconPosition="right"
                    >
                        Browse All
                    </Button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {templates.map((template, i) => (
                        <TemplateCard key={template.name} template={template} index={i} />
                    ))}
                </div>

            </div>
        </section>
    )
}

export default TemplatesSection