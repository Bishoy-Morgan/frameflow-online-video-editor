'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Cpu, GitBranch, Box } from 'lucide-react'
import { SectionGrid, SectionLabel, SectionSeparator } from './FeaturesHero'

const pillars = [
    {
        tag: 'PERF — 01',
        label: 'In-Browser Processing',
        title: 'No round-trips. Just results.',
        description: 'The rendering pipeline runs entirely client-side. We skip the server for everything that can be computed locally — keeping latency near zero and the experience snappy.',
        items: ['Avoid unnecessary server round-trips', 'Efficient rendering pipeline', 'Optimized memory usage'],
        icon: <Cpu size={17} color="var(--turquoise)" strokeWidth={1.5} />,
        metric: { value: '~0ms', unit: 'server latency', desc: 'for local operations' },
    },
    {
        tag: 'PERF — 02',
        label: 'Predictable State Management',
        title: 'Deterministic by design.',
        description: 'A Redux-based timeline architecture means every edit produces a predictable, reproducible state. The UI re-renders only what changed — nothing more.',
        items: ['Redux-based timeline architecture', 'Deterministic editing model', 'Minimal re-renders'],
        icon: <GitBranch size={17} color="var(--turquoise)" strokeWidth={1.5} />,
        metric: { value: '1:1', unit: 'state mapping', desc: 'action → outcome, always' },
    },
    {
        tag: 'PERF — 03',
        label: 'Modular System Design',
        title: 'Editor core, UI-agnostic.',
        description: 'The editing engine is fully decoupled from the interface. Built on a clean relational model (Prisma + PostgreSQL), it scales to any frontend or backend configuration.',
        items: ['Editor core separated from UI', 'Scalable backend-ready structure', 'Clean relational data model (Prisma + PostgreSQL)'],
        icon: <Box size={17} color="var(--turquoise)" strokeWidth={1.5} />,
        metric: { value: '∞', unit: 'scalability', desc: 'backend-agnostic core' },
    },
]

// ── Pulsing bars ──────────────────────────────────────────────────────────────
const ActivityBars = () => (
    <div className="flex flex-col gap-1">
        {([['80%', '0s'], ['52%', '0.45s'], ['68%', '0.9s']] as const).map(([w, delay], i) => (
            <div
                key={i}
                className="h-0.5 rounded-full bg-turquoise"
                style={{ width: w, opacity: 0.22, animation: `pulse-bar 2.4s ease-in-out ${delay} infinite` }}
            />
        ))}
    </div>
)

// ── Selector card ─────────────────────────────────────────────────────────────
const PillarCard = ({ pillar, index, isActive, onClick }: {
    pillar: typeof pillars[0]
    index: number
    isActive: boolean
    onClick: () => void
}) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.style.opacity = '0'
        el.style.transform = 'translateX(-14px)'
        const t = setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
            el.style.opacity = '1'
            el.style.transform = 'translateX(0)'
        }, 130 + index * 100)
        return () => clearTimeout(t)
    }, [index])

    return (
        <div
            ref={ref}
            onClick={onClick}
            className={`flex flex-col gap-4 p-6 rounded-xl cursor-pointer transition-all duration-200 backdrop-blur-sm ${
                isActive
                    ? 'bg-turquoise-6 border border-turquoise-42 shadow-[0_0_28px_var(--turquoise-8)]'
                    : 'bg-muted-5  border border-muted-10'
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0 icon-box">
                        {pillar.icon}
                    </div>
                    <span className={`text-[0.62rem] font-bold tracking-[0.13em] uppercase transition-colors duration-200 ${isActive ? 'text-turquoise' : 'text-muted-35'}`}>
                        {pillar.tag}
                    </span>
                </div>
                <div className={`dot-turquoise transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
            </div>

            <h4 className="font-normal text-[1.1rem] leading-snug m-0">{pillar.label}</h4>

            <ActivityBars />
        </div>
    )
}

// ── Detail panel ──────────────────────────────────────────────────────────────
const DetailPanel = ({ pillar }: { pillar: typeof pillars[0] }) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.style.opacity = '0'
        el.style.transform = 'translateY(8px)'
        requestAnimationFrame(() => {
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
        })
    }, [pillar.tag])

    return (
        <div ref={ref} className="panel-active flex flex-col gap-7 p-9 rounded-xl h-full backdrop-blur-sm">

            {/* Metric */}
            <div className="metric-box inline-flex flex-col gap-1 self-start px-6 py-4 rounded-lg">
                <span className="font-normal leading-none text-turquoise" style={{ fontSize: '2.4rem' }}>
                    {pillar.metric.value}
                </span>
                <span className="text-[0.65rem] font-bold tracking-[0.11em] uppercase text-turquoise-65">
                    {pillar.metric.unit} — {pillar.metric.desc}
                </span>
            </div>

            {/* Title + description */}
            <div className="flex flex-col gap-2.5">
                <h3 className="font-normal leading-snug m-0" style={{ fontSize: '1.85rem' }}>{pillar.title}</h3>
                <p className="text-[0.9375rem] leading-relaxed m-0 text-muted-60">{pillar.description}</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-turquoise-20" />

            {/* Items */}
            <ul className="m-0 p-0 flex flex-col gap-3.5 list-none">
                {pillar.items.map((item, i) => (
                    <li
                        key={item}
                        className="flex items-start gap-3 text-[0.9rem] font-semibold text-muted-80"
                        style={{ opacity: 1 - i * 0.08 }}
                    >
                        <span className="mt-[3px] shrink-0">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                <rect x="0.5" y="0.5" width="14" height="14" rx="3.5" stroke="var(--turquoise)" strokeOpacity="0.35" />
                                <path d="M4 7.5L6.5 10L11 5" stroke="var(--turquoise)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}

const Performance = () => {
    const [active, setActive] = useState(0)
    const headerRef = useRef<HTMLDivElement>(null)

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

            {/* Glow — top right */}
            <div aria-hidden className="pointer-events-none absolute -top-[10%] -right-[5%] w-[520px] h-[520px] rounded-full bg-turquoise-10" style={{ filter: 'blur(80px)' }} />

            {/* Top separator */}
            <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

            <style>{`@keyframes pulse-bar { 0%, 100% { opacity: 0.18; } 50% { opacity: 0.5; } }`}</style>

            <div className="container relative z-10">

                {/* Header */}
                <div ref={headerRef} className="max-w-[600px] mb-14">
                    <SectionLabel>Performance Architecture</SectionLabel>
                    <h2 className="font-normal leading-tight mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                        This is your edge.
                    </h2>
                    <p className="text-[0.9375rem] leading-relaxed m-0 text-muted-55">
                        Most browser editors are wrappers. Frameflow is an engine — built on architectural
                        choices that compound at scale.
                    </p>
                </div>

                {/* Interactive layout */}
                <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(240px, 1fr) minmax(0, 1.65fr)' }}>
                    <div className="flex flex-col gap-3">
                        {pillars.map((p, i) => (
                            <PillarCard key={p.tag} pillar={p} index={i} isActive={active === i} onClick={() => setActive(i)} />
                        ))}
                    </div>
                    <DetailPanel pillar={pillars[active]} />
                </div>

                <SectionSeparator label="Architecture-first. UI second." />

            </div>
        </section>
    )
}

export default Performance