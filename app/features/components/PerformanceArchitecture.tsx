'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Cpu, GitBranch, Box } from 'lucide-react'

interface Pillar {
    tag: string
    label: string
    title: string
    description: string
    items: string[]
    icon: React.ReactNode
    metric: { value: string; unit: string; desc: string }
}

const pillars: Pillar[] = [
    {
        tag: 'PERF — 01',
        label: 'In-Browser Processing',
        title: 'No round-trips. Just results.',
        description: 'The rendering pipeline runs entirely client-side. We skip the server for everything that can be computed locally — keeping latency near zero and the experience snappy.',
        items: ['Avoid unnecessary server round-trips', 'Efficient rendering pipeline', 'Optimized memory usage'],
        icon: <Cpu size={18} color="#00FFC8" strokeWidth={1.5} />,
        metric: { value: '~0ms', unit: 'server latency', desc: 'for local operations' },
    },
    {
        tag: 'PERF — 02',
        label: 'Predictable State Management',
        title: 'Deterministic by design.',
        description: 'A Redux-based timeline architecture means every edit produces a predictable, reproducible state. The UI re-renders only what changed — nothing more.',
        items: ['Redux-based timeline architecture', 'Deterministic editing model', 'Minimal re-renders'],
        icon: <GitBranch size={18} color="#00FFC8" strokeWidth={1.5} />,
        metric: { value: '1:1', unit: 'state mapping', desc: 'action → outcome, always' },
    },
    {
        tag: 'PERF — 03',
        label: 'Modular System Design',
        title: 'Editor core, UI-agnostic.',
        description: 'The editing engine is fully decoupled from the interface. Built on a clean relational model (Prisma + PostgreSQL), it scales to any frontend or backend configuration.',
        items: ['Editor core separated from UI', 'Scalable backend-ready structure', 'Clean relational data model (Prisma + PostgreSQL)'],
        icon: <Box size={18} color="#00FFC8" strokeWidth={1.5} />,
        metric: { value: '∞', unit: 'scalability', desc: 'backend-agnostic core' },
    },
]

const PulsingBar = ({ delay = 0, width }: { delay?: number; width: string }) => (
    <div style={{ height: '3px', borderRadius: '2px', width, backgroundColor: '#00FFC8', opacity: 0.25, animation: `pulse-bar 2.4s ease-in-out ${delay}s infinite` }} />
)

const PillarCard = ({ pillar, index, isActive, onClick }: { pillar: Pillar; index: number; isActive: boolean; onClick: () => void }) => {
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = cardRef.current
        if (!el) return
        el.style.opacity = '0'
        el.style.transform = 'translateX(-16px)'
        const t = setTimeout(() => {
            el.style.transition = 'opacity 0.55s ease, transform 0.55s ease'
            el.style.opacity = '1'
            el.style.transform = 'translateX(0)'
        }, 150 + index * 110)
        return () => clearTimeout(t)
    }, [index])

    return (
        <div
            ref={cardRef}
            onClick={onClick}
            style={{
                padding: '1.75rem',
                borderRadius: '10px',
                border: `1px solid ${isActive ? 'color-mix(in srgb, #00FFC8 50%, transparent)' : 'color-mix(in srgb, var(--text) 10%, transparent)'}`,
                backgroundColor: isActive ? 'color-mix(in srgb, #00FFC8 6%, transparent)' : 'color-mix(in srgb, var(--text) 3%, transparent)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                boxShadow: isActive ? '0 0 32px color-mix(in srgb, #00FFC8 8%, transparent)' : 'none',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'color-mix(in srgb, #00FFC8 10%, transparent)', border: '1px solid color-mix(in srgb, #00FFC8 20%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {pillar.icon}
                    </div>
                    <span style={{ fontFamily: 'var(--font-quicksand), sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: isActive ? '#00FFC8' : 'color-mix(in srgb, var(--text) 40%, transparent)', transition: 'color 0.25s ease' }}>
                        {pillar.tag}
                    </span>
                </div>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00FFC8', opacity: isActive ? 1 : 0, boxShadow: '0 0 6px #00FFC8', transition: 'opacity 0.25s ease', flexShrink: 0 }} />
            </div>

            <h4 style={{ fontFamily: 'var(--font-dm-serif-display), serif', fontSize: '1.25rem', lineHeight: 1.3, color: 'var(--text)', fontWeight: 400, margin: 0 }}>
                {pillar.label}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <PulsingBar width="80%" delay={0} />
                <PulsingBar width="55%" delay={0.4} />
                <PulsingBar width="70%" delay={0.8} />
            </div>
        </div>
    )
}

const DetailPanel = ({ pillar }: { pillar: Pillar }) => {
    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = panelRef.current
        if (!el) return
        el.style.opacity = '0'
        el.style.transform = 'translateY(10px)'
        requestAnimationFrame(() => {
            el.style.transition = 'opacity 0.35s ease, transform 0.35s ease'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
        })
    }, [pillar.tag])

    return (
        <div
            ref={panelRef}
            style={{ padding: '2.5rem', borderRadius: '12px', border: '1px solid color-mix(in srgb, #00FFC8 20%, transparent)', backgroundColor: 'color-mix(in srgb, #00FFC8 4%, transparent)', display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}
        >
            {/* Metric callout */}
            <div style={{ display: 'inline-flex', flexDirection: 'column', padding: '1.25rem 1.5rem', borderRadius: '8px', backgroundColor: 'color-mix(in srgb, #00FFC8 8%, transparent)', border: '1px solid color-mix(in srgb, #00FFC8 20%, transparent)', alignSelf: 'flex-start', gap: '2px' }}>
                <span style={{ fontFamily: 'var(--font-dm-serif-display), serif', fontSize: '2.5rem', lineHeight: 1, color: '#00FFC8', fontWeight: 400 }}>
                    {pillar.metric.value}
                </span>
                <span style={{ fontFamily: 'var(--font-quicksand), sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'color-mix(in srgb, #00FFC8 70%, transparent)' }}>
                    {pillar.metric.unit} — {pillar.metric.desc}
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontFamily: 'var(--font-dm-serif-display), serif', fontSize: '1.875rem', lineHeight: 1.2, color: 'var(--text)', fontWeight: 400, margin: 0 }}>
                    {pillar.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-quicksand), sans-serif', fontSize: '0.9375rem', lineHeight: 1.75, color: 'color-mix(in srgb, var(--text) 65%, transparent)', margin: 0 }}>
                    {pillar.description}
                </p>
            </div>

            <div style={{ height: '1px', backgroundColor: 'color-mix(in srgb, #00FFC8 15%, transparent)' }} />

            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {pillar.items.map((item, i) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontFamily: 'var(--font-quicksand), sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'color-mix(in srgb, var(--text) 85%, transparent)', opacity: 1 - i * 0.08 }}>
                        <span style={{ marginTop: '3px', flexShrink: 0, color: '#00FFC8', display: 'flex', alignItems: 'center' }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <rect x="0.5" y="0.5" width="13" height="13" rx="3" stroke="#00FFC8" strokeOpacity="0.4" />
                                <path d="M3.5 7L6 9.5L10.5 5" stroke="#00FFC8" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}

const PerformanceArchitecture = () => {
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
        <section style={{ width: '100%', backgroundColor: 'var(--bg)', paddingTop: '7rem', paddingBottom: '7rem', position: 'relative', overflow: 'hidden' }}>
            {/* Scanlines */}
            <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, color-mix(in srgb, var(--text) 2.5%, transparent) 0px, color-mix(in srgb, var(--text) 2.5%, transparent) 1px, transparent 1px, transparent 28px)', pointerEvents: 'none', maskImage: 'radial-gradient(ellipse 70% 60% at 80% 50%, black 10%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 80% 50%, black 10%, transparent 100%)' }} />
            {/* Glow */}
            <div aria-hidden style={{ position: 'absolute', top: '30%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, color-mix(in srgb, #00FFC8 12%, transparent) 0%, transparent 70%)', pointerEvents: 'none' }} />
            {/* Top separator */}
            <div aria-hidden style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, color-mix(in srgb, #00FFC8 30%, transparent), transparent)' }} />

            <style>{`@keyframes pulse-bar { 0%, 100% { opacity: 0.18; } 50% { opacity: 0.55; } }`}</style>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div ref={headerRef} style={{ marginBottom: '4rem', maxWidth: '640px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                        <div style={{ width: '32px', height: '1px', backgroundColor: '#00FFC8' }} />
                        <span style={{ fontFamily: 'var(--font-quicksand), sans-serif', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, fontWeight: 700, color: '#00FFC8' }}>
                            Performance Architecture
                        </span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-dm-serif-display), serif', fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.15, color: 'var(--text)', fontWeight: 400, margin: '0 0 0.875rem 0' }}>
                        This is your edge.
                    </h2>
                    <p style={{ fontFamily: 'var(--font-quicksand), sans-serif', fontSize: '1rem', lineHeight: 1.7, color: 'color-mix(in srgb, var(--text) 60%, transparent)', margin: 0 }}>
                        Most browser editors are wrappers. Frameflow is an engine — built on architectural choices that compound at scale.
                    </p>
                </div>

                {/* Interactive layout */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) minmax(0, 1.6fr)', gap: '1.5rem', alignItems: 'stretch' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {pillars.map((pillar, i) => (
                            <PillarCard key={pillar.tag} pillar={pillar} index={i} isActive={active === i} onClick={() => setActive(i)} />
                        ))}
                    </div>
                    <DetailPanel pillar={pillars[active]} />
                </div>

                {/* Bottom tagline */}
                <div style={{ marginTop: '3.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, color-mix(in srgb, var(--text) 10%, transparent), transparent)' }} />
                    <span style={{ fontFamily: 'var(--font-quicksand), sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'color-mix(in srgb, var(--text) 30%, transparent)', whiteSpace: 'nowrap' }}>
                        Architecture-first. UI second.
                    </span>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--text) 10%, transparent))' }} />
                </div>
            </div>
        </section>
    )
}

export default PerformanceArchitecture