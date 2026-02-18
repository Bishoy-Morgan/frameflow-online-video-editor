'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Zap, MousePointer, Cpu, Download } from 'lucide-react'
import SectionGrid from '@/components/ui/SectionGrid'
import { SectionLabel, SectionSeparator } from './FeaturesHero'

const outcomes = [
    {
        icon: <Zap size={18} color="var(--turquoise)" strokeWidth={1.5} />,
        stat: '< 2s',
        label: 'Instant project loading',
        description: 'Projects open immediately. No splash screen, no spinner spiral.',
    },
    {
        icon: <MousePointer size={18} color="var(--turquoise)" strokeWidth={1.5} />,
        stat: '60fps',
        label: 'Smooth timeline interactions',
        description: 'Scrub, trim, drag — the timeline keeps up with you.',
    },
    {
        icon: <Cpu size={18} color="var(--turquoise)" strokeWidth={1.5} />,
        stat: '0ms',
        label: 'Optimized rendering pipeline',
        description: 'Client-side rendering with minimal overhead. No round-trips for previews.',
    },
    {
        icon: <Download size={18} color="var(--turquoise)" strokeWidth={1.5} />,
        stat: '0kb',
        label: 'No installation required',
        description: 'Open a tab. Start editing. Ship. Nothing to download or configure.',
    },
]

// ── Outcome card ──────────────────────────────────────────────────────────────
const OutcomeCard = ({
    outcome,
    index,
    isActive,
    onClick,
}: {
    outcome: typeof outcomes[0]
    index: number
    isActive: boolean
    onClick: () => void
}) => {
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
        }, 100 + index * 90)
        return () => clearTimeout(t)
    }, [index])

    return (
        <div
            ref={ref}
            onClick={onClick}
            className="group flex items-start gap-5 p-6 rounded-xl cursor-pointer transition-all duration-200"
            style={{
                border: `1px solid ${isActive ? 'var(--turquoise-42)' : 'var(--text-10)'}`,
                backgroundColor: isActive ? 'var(--turquoise-6)' : 'var(--text-5)',
                boxShadow: isActive ? '0 0 24px var(--turquoise-8)' : 'none',
            }}
        >
            {/* Icon */}
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 icon-box mt-0.5">
                {outcome.icon}
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-baseline gap-3">
                    <span
                        className="font-normal leading-none text-turquoise"
                        style={{ fontFamily: 'var(--font-dm-serif-display), serif', fontSize: '1.5rem' }}
                    >
                        {outcome.stat}
                    </span>
                    <span
                        className="text-[0.8rem] font-bold tracking-wide uppercase transition-colors duration-200"
                        style={{ color: isActive ? 'var(--text)' : 'var(--text-55)' }}
                    >
                        {outcome.label}
                    </span>
                </div>
                <p
                    className="m-0 text-sm leading-relaxed transition-all duration-200"
                    style={{
                        color: 'var(--text-55)',
                        maxHeight: isActive ? '3rem' : '0',
                        overflow: 'hidden',
                        opacity: isActive ? 1 : 0,
                    }}
                >
                    {outcome.description}
                </p>
            </div>

            {/* Active dot */}
            <div
                className="dot-turquoise shrink-0 ml-auto self-center transition-opacity duration-200"
                style={{ opacity: isActive ? 1 : 0 }}
            />
        </div>
    )
}

// ── Progress bar visualization ────────────────────────────────────────────────
const steps = ['Idea', 'Open', 'Edit', 'Export']

const FlowViz = ({ activeIndex }: { activeIndex: number }) => (
    <div
        className="p-8 rounded-xl flex flex-col gap-8"
        style={{ border: '1px solid var(--text-10)', backgroundColor: 'var(--text-5)', backdropFilter: 'blur(8px)' }}
    >
        <span className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-muted-35">
            Idea → Export
        </span>

        {/* Step flow */}
        <div className="flex items-center gap-0">
            {steps.map((step, i) => {
                const done   = i <= activeIndex
                const active = i === activeIndex
                return (
                    <React.Fragment key={step}>
                        {/* Node */}
                        <div className="flex flex-col items-center gap-2">
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                                style={{
                                    backgroundColor: done ? 'var(--turquoise)' : 'var(--text-8)',
                                    border: `2px solid ${active ? 'var(--turquoise)' : done ? 'var(--turquoise)' : 'var(--text-18)'}`,
                                    boxShadow: active ? '0 0 12px var(--turquoise-45)' : 'none',
                                    transform: active ? 'scale(1.15)' : 'scale(1)',
                                }}
                            >
                                {done && (
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="var(--bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                            <span
                                className="text-[0.65rem] font-bold tracking-wide uppercase transition-colors duration-300"
                                style={{ color: done ? 'var(--turquoise)' : 'var(--text-35)' }}
                            >
                                {step}
                            </span>
                        </div>

                        {/* Connector */}
                        {i < steps.length - 1 && (
                            <div
                                className="flex-1 h-px mx-1 transition-all duration-500"
                                style={{
                                    backgroundColor: i < activeIndex ? 'var(--turquoise)' : 'var(--text-18)',
                                    opacity: i < activeIndex ? 1 : 0.5,
                                }}
                            />
                        )}
                    </React.Fragment>
                )
            })}
        </div>

        {/* Metric rows */}
        <div className="flex flex-col gap-3">
            {[
                { label: 'Load time',        value: 84 },
                { label: 'Render overhead',  value: 12 },
                { label: 'Install friction',  value: 0  },
            ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[0.72rem] font-semibold text-muted-55">{label}</span>
                        <span className="text-[0.72rem] font-bold text-turquoise">
                            {value === 0 ? 'none' : `${value}%`}
                        </span>
                    </div>
                    <div className="h-1 rounded-full" style={{ backgroundColor: 'var(--text-8)' }}>
                        <div
                            className="h-full rounded-full bg-turquoise transition-all duration-700"
                            style={{ width: `${value}%`, opacity: value === 0 ? 0 : 0.8 }}
                        />
                    </div>
                </div>
            ))}
        </div>
    </div>
)

// ── Section ───────────────────────────────────────────────────────────────────
const FastByDesign = () => {
    const [active, setActive] = useState(0)
    const headerRef = useRef<HTMLDivElement>(null)

    // Auto-cycle through outcomes
    useEffect(() => {
        const id = setInterval(() => setActive(a => (a + 1) % outcomes.length), 2800)
        return () => clearInterval(id)
    }, [])

    useEffect(() => {
        const el = headerRef.current
        if (!el) return
        el.style.opacity = '0'
        el.style.transform = 'translateY(14px)'
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
        }, 60)
    }, [])

    return (
        <section className="relative w-full overflow-hidden py-28 surface">

            <SectionGrid />

            {/* Glow — center left */}
            <div
                aria-hidden
                className="pointer-events-none absolute top-[20%] -left-[8%] w-[480px] h-[480px] rounded-full bg-turquoise-8"
                style={{ filter: 'blur(80px)' }}
            />

            {/* Top separator */}
            <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

            <div className="container relative z-10">

                {/* Header */}
                <div ref={headerRef} className="max-w-[520px] mb-14">
                    <SectionLabel>Fast by Design</SectionLabel>
                    <h2 className="font-normal leading-tight mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                        Idea to export.<br />Without friction.
                    </h2>
                    <p className="text-[0.9375rem] leading-relaxed m-0 text-muted-55">
                        Speed isn&apos;t a feature it&apos;s the result of every decision made correctly.
                    </p>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                    {/* Left — outcome cards */}
                    <div className="flex flex-col gap-3">
                        {outcomes.map((o, i) => (
                            <OutcomeCard
                                key={o.label}
                                outcome={o}
                                index={i}
                                isActive={active === i}
                                onClick={() => setActive(i)}
                            />
                        ))}
                    </div>

                    {/* Right — flow visualization */}
                    <FlowViz activeIndex={active} />
                </div>

                <SectionSeparator label="Move fast. Ship clean." />

            </div>
        </section>
    )
}

export default FastByDesign