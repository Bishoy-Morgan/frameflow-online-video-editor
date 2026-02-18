'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MonitorPlay, Megaphone, Smartphone } from 'lucide-react'
import SectionGrid from '@/components/ui/SectionGrid'
import { SectionLabel, SectionSeparator } from './FeaturesHero'

// ── Use cases ─────────────────────────────────────────────────────────────────
const useCases = [
    {
        icon: <MonitorPlay size={18} color="var(--turquoise)" strokeWidth={1.5} />,
        type: 'Product Demos',
        headline: 'Show the product, not the process.',
        description:
            'Structure walkthroughs with precision. Trim dead air, sequence screens cleanly, layer in context — without fighting the tool.',
    },
    {
        icon: <Megaphone size={18} color="var(--turquoise)" strokeWidth={1.5} />,
        type: 'Marketing Content',
        headline: 'Move fast. Stay on-brand.',
        description:
            'Build promotional cuts with consistent pacing. Organized asset management keeps your clips, music, and overlays in order across projects.',
    },
    {
        icon: <Smartphone size={18} color="var(--turquoise)" strokeWidth={1.5} />,
        type: 'Social Videos',
        headline: 'Built for short-form. Scalable to more.',
        description:
            'Reels, shorts, stories — the timeline adapts. Multi-layer support lets you add text, audio, and effects without losing the thread.',
    },
]

// ── Capabilities ──────────────────────────────────────────────────────────────
const capabilities = [
    'Multi-layer timeline',
    'Precise trimming and sequencing',
    'Organized asset management',
    'Scalable project structure',
]

// ── Timeline mock ─────────────────────────────────────────────────────────────
const tracks = [
    { label: 'Video',   color: 'var(--turquoise)',    clips: [{ left: '0%',   width: '55%' }, { left: '58%', width: '38%' }] },
    { label: 'Audio',   color: 'var(--turquoise-45)', clips: [{ left: '0%',   width: '90%' }] },
    { label: 'Text',    color: 'var(--turquoise-22)', clips: [{ left: '10%',  width: '30%' }, { left: '60%', width: '20%' }] },
    { label: 'Overlay', color: 'var(--turquoise-16)', clips: [{ left: '45%',  width: '25%' }] },
]

const TimelineMock = ({ activeIndex }: { activeIndex: number }) => {
    const playheadRef = useRef<HTMLDivElement>(null)

    const playheadPositions = ['12%', '45%', '72%']

    useEffect(() => {
        const el = playheadRef.current
        if (!el) return
        el.style.transition = 'left 0.6s cubic-bezier(0.33, 1, 0.68, 1)'
        el.style.left = playheadPositions[activeIndex]
    }, [activeIndex])

    return (
        <div
            className="p-7 rounded-xl flex flex-col gap-5"
            style={{ border: '1px solid var(--text-10)', backgroundColor: 'var(--text-5)', backdropFilter: 'blur(8px)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-muted-35">
                    Timeline
                </span>
                {/* Playback controls */}
                <div className="flex items-center gap-2">
                    {[4, 6, 4].map((w, i) => (
                        <div key={i} className="h-1 rounded-full bg-turquoise-22" style={{ width: `${w * 4}px` }} />
                    ))}
                    <div
                        className="w-5 h-5 rounded-full flex items-center justify-center ml-1"
                        style={{ backgroundColor: 'var(--turquoise-10)', border: '1px solid var(--turquoise-22)' }}
                    >
                        <div
                            className="w-0 h-0"
                            style={{ borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid var(--turquoise)', marginLeft: '1px' }}
                        />
                    </div>
                </div>
            </div>

            {/* Track area */}
            <div className="flex flex-col gap-2 relative">

                {/* Playhead */}
                <div
                    ref={playheadRef}
                    className="absolute top-0 bottom-0 w-px z-10 pointer-events-none"
                    style={{ left: '12%', backgroundColor: 'var(--turquoise)', boxShadow: '0 0 6px var(--turquoise-45)' }}
                >
                    <div
                        className="w-2 h-2 rounded-full -translate-x-[3px] -translate-y-1"
                        style={{ backgroundColor: 'var(--turquoise)' }}
                    />
                </div>

                {tracks.map((track) => (
                    <div key={track.label} className="flex items-center gap-3">
                        {/* Label */}
                        <span
                            className="text-[0.6rem] font-bold uppercase tracking-wider shrink-0 text-right"
                            style={{ width: '44px', color: 'var(--text-35)' }}
                        >
                            {track.label}
                        </span>

                        {/* Track lane */}
                        <div className="relative flex-1 h-6 rounded" style={{ backgroundColor: 'var(--text-8)' }}>
                            {track.clips.map((clip, i) => (
                                <div
                                    key={i}
                                    className="absolute top-1 bottom-1 rounded-sm"
                                    style={{
                                        left: clip.left,
                                        width: clip.width,
                                        backgroundColor: track.color,
                                        opacity: 0.75,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Timecode */}
            <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid var(--text-8)' }}>
                {['0:00', '0:05', '0:10', '0:15', '0:20'].map((t) => (
                    <span key={t} className="text-[0.58rem] font-mono text-muted-28">{t}</span>
                ))}
            </div>
        </div>
    )
}

// ── Use case tab ──────────────────────────────────────────────────────────────
const UseCaseTab = ({
    useCase,
    isActive,
    onClick,
}: {
    useCase: typeof useCases[0]
    isActive: boolean
    onClick: () => void
}) => (
    <button
        onClick={onClick}
        className="w-full text-left flex items-start gap-4 px-5 py-4 rounded-xl transition-all duration-200 cursor-pointer"
        style={{
            border: `1px solid ${isActive ? 'var(--turquoise-42)' : 'var(--text-10)'}`,
            backgroundColor: isActive ? 'var(--turquoise-6)' : 'transparent',
            outline: 'none',
        }}
    >
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 icon-box mt-0.5">
            {useCase.icon}
        </div>
        <div className="flex flex-col gap-1 min-w-0">
            <span
                className="text-[0.68rem] font-bold tracking-widest uppercase transition-colors duration-200"
                style={{ color: isActive ? 'var(--turquoise)' : 'var(--text-35)' }}
            >
                {useCase.type}
            </span>
            <span
                className="text-[0.9rem] font-semibold leading-snug transition-colors duration-200"
                style={{ color: isActive ? 'var(--text)' : 'var(--text-60)' }}
            >
                {useCase.headline}
            </span>
            <p
                className="m-0 text-sm leading-relaxed transition-all duration-300"
                style={{
                    color: 'var(--text-55)',
                    maxHeight: isActive ? '4rem' : '0',
                    overflow: 'hidden',
                    opacity: isActive ? 1 : 0,
                }}
            >
                {useCase.description}
            </p>
        </div>
    </button>
)

// ── Section ───────────────────────────────────────────────────────────────────
const BuiltForRealWorkflows = () => {
    const [active, setActive] = useState(0)
    const headerRef  = useRef<HTMLDivElement>(null)
    const leftRef    = useRef<HTMLDivElement>(null)
    const rightRef   = useRef<HTMLDivElement>(null)

    // Auto-cycle
    useEffect(() => {
        const id = setInterval(() => setActive(a => (a + 1) % useCases.length), 3000)
        return () => clearInterval(id)
    }, [])

    useEffect(() => {
        const els = [
            { el: headerRef.current, delay: 0   },
            { el: leftRef.current,   delay: 100 },
            { el: rightRef.current,  delay: 180 },
        ]
        els.forEach(({ el, delay }) => {
            if (!el) return
            el.style.opacity = '0'
            el.style.transform = 'translateY(14px)'
            setTimeout(() => {
                el.style.transition = 'opacity 0.55s ease, transform 0.55s ease'
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
            }, delay)
        })
    }, [])

    return (
        <section className="relative w-full overflow-hidden py-28 surface">

            <SectionGrid />

            {/* Glow — top right */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-[10%] -right-[5%] w-[500px] h-[500px] rounded-full bg-turquoise-8"
                style={{ filter: 'blur(80px)' }}
            />

            {/* Top separator */}
            <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

            <div className="container relative z-10">

                {/* Header */}
                <div ref={headerRef} className="max-w-[580px] mb-14">
                    <SectionLabel>Built for Real Workflows</SectionLabel>
                    <h2 className="font-normal leading-tight mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                        Adapts to how you actually work.
                    </h2>
                    <p className="text-[0.9375rem] leading-relaxed m-0 text-muted-55">
                        Whether you&apos;re refining product demos, marketing content, or social videos
                        Frameflow fits the workflow without getting in the way.
                    </p>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left — use case tabs + capabilities */}
                    <div ref={leftRef} className="flex flex-col gap-3">

                        {useCases.map((uc, i) => (
                            <UseCaseTab
                                key={uc.type}
                                useCase={uc}
                                isActive={active === i}
                                onClick={() => setActive(i)}
                            />
                        ))}

                        {/* Capability list */}
                        <div
                            className="mt-2 p-6 rounded-xl flex flex-col gap-3"
                            style={{ border: '1px solid var(--text-10)', backgroundColor: 'var(--text-5)' }}
                        >
                            <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-muted-35">
                                What makes it work
                            </span>
                            <ul className="m-0 p-0 grid grid-cols-2 gap-x-4 gap-y-2.5 list-none">
                                {capabilities.map(cap => (
                                    <li
                                        key={cap}
                                        className="flex items-center gap-2 text-[0.8rem] font-semibold text-muted-72"
                                    >
                                        <span className="w-1 h-1 rounded-full shrink-0 bg-turquoise shadow-turquoise" />
                                        {cap}
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>

                    {/* Right — timeline mock */}
                    <div ref={rightRef} className="flex flex-col gap-4">
                        <TimelineMock activeIndex={active} />

                        {/* Callout */}
                        <div
                            className="px-6 py-4 rounded-xl flex items-start gap-3"
                            style={{ border: '1px solid var(--turquoise-20)', backgroundColor: 'var(--turquoise-4)' }}
                        >
                            <div className="dot-turquoise mt-1 shrink-0" />
                            <p className="m-0 text-[0.875rem] leading-relaxed text-muted-65 font-medium">
                                Structured editing for people who know what they want to make — and need a tool that stays out of the way.
                            </p>
                        </div>
                    </div>

                </div>

                <SectionSeparator label="Edit with intention." />

            </div>
        </section>
    )
}

export default BuiltForRealWorkflows