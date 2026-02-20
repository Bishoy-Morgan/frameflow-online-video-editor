'use client'

import React, { useEffect, useRef, useState } from 'react'
import SectionGrid from '@/components/ui/SectionGrid'
import { SectionLabel, SectionSeparator } from './FeaturesHero'

// Pillars
const pillars = [
    {
        tag: '01',
        title: 'Non-destructive editing',
        body: 'Every change is a layer on top. Your source is never touched — revert anything, at any point.',
        signal: 'Edits are states, not overwrites.',
    },
    {
        tag: '02',
        title: 'Secure project persistence',
        body: "Your work saves to a relational store on every meaningful change. Close the tab. It's still there.",
        signal: 'Nothing is lost between sessions.',
    },
    {
        tag: '03',
        title: 'Consistent export behavior',
        body: 'The export you get reflects exactly what you built. No surprises from timeline to file.',
        signal: 'What you see is what you export.',
    },
]

// Status log — implied robustness without explaining it
const logLines = [
    { type: 'ok',   text: 'project.load',           detail: '12ms'       },
    { type: 'ok',   text: 'timeline.deserialize',    detail: '4ms'        },
    { type: 'ok',   text: 'asset.hydrate',           detail: '8ms'        },
    { type: 'ok',   text: 'edit.apply → state[47]',  detail: 'non-destructive' },
    { type: 'ok',   text: 'db.persist',              detail: 'confirmed'  },
    { type: 'ok',   text: 'export.render',           detail: '1:1 output' },
    { type: 'idle', text: 'session.ready',           detail: '—'          },
]

const StatusLog = () => {
    const [visible, setVisible] = useState(0)

    useEffect(() => {
        if (visible >= logLines.length) return
        const t = setTimeout(() => setVisible(v => v + 1), 420)
        return () => clearTimeout(t)
    }, [visible])

    return (
        <div
            className="p-7 rounded-xl flex flex-col gap-4"
            style={{ border: '1px solid var(--text-10)', backgroundColor: 'var(--text-5)', backdropFilter: 'blur(8px)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-muted-35">
                    System Log
                </span>
                <div className="flex items-center gap-1.5">
                    <div className="dot-turquoise" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
                    <span className="text-[0.6rem] font-semibold tracking-wide uppercase text-turquoise">
                        Live
                    </span>
                </div>
            </div>

            {/* Log lines */}
            <div className="flex flex-col gap-1.5 font-mono">
                {logLines.map((line, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 transition-all duration-300"
                        style={{
                            opacity: i < visible ? 1 : 0,
                            transform: i < visible ? 'translateY(0)' : 'translateY(4px)',
                        }}
                    >
                        {/* Status mark */}
                        <span
                            className="text-[0.65rem] font-bold shrink-0"
                            style={{ color: line.type === 'ok' ? 'var(--turquoise)' : 'var(--text-28)' }}
                        >
                            {line.type === 'ok' ? '✓' : '·'}
                        </span>

                        {/* Command */}
                        <span className="text-[0.72rem] flex-1" style={{ color: 'var(--text-72)' }}>
                            {line.text}
                        </span>

                        {/* Detail */}
                        <span
                            className="text-[0.65rem] shrink-0"
                            style={{ color: line.type === 'ok' ? 'var(--turquoise-65)' : 'var(--text-28)' }}
                        >
                            {line.detail}
                        </span>
                    </div>
                ))}
            </div>

            {/* Cursor blink at end */}
            {visible >= logLines.length && (
                <div className="flex items-center gap-3">
                    <span className="text-[0.65rem] font-bold text-turquoise opacity-0">✓</span>
                    <span
                        className="inline-block w-1.5 h-3.5 bg-turquoise rounded-sm"
                        style={{ animation: 'blink 1.1s step-end infinite' }}
                    />
                </div>
            )}
        </div>
    )
}

// ── Pillar card ───────────────────────────────────────────────────────────────
const PillarCard = ({ pillar, index }: { pillar: typeof pillars[0]; index: number }) => {
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
        }, 120 + index * 100)
        return () => clearTimeout(t)
    }, [index])

    return (
        <div
            ref={ref}
            className="flex flex-col gap-4 p-7 rounded-xl transition-all duration-250 cursor-default"
            style={{ border: '1px solid var(--text-10)', backgroundColor: 'var(--text-5)', backdropFilter: 'blur(8px)' }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--turquoise-42)'
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 12px 36px var(--turquoise-8)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--text-10)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
            }}
        >
            {/* Tag + signal */}
            <div className="flex items-start justify-between gap-4">
                <span
                    className="font-normal leading-none text-muted-7 select-none"
                    style={{ fontFamily: 'var(--font-dm-serif-display), serif', fontSize: '2.75rem' }}
                >
                    {pillar.tag}
                </span>

                {/* Signal pill */}
                <span
                    className="text-[0.6rem] font-bold tracking-wide px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 mt-1"
                    style={{
                        backgroundColor: 'var(--turquoise-8)',
                        border: '1px solid var(--turquoise-20)',
                        color: 'var(--turquoise)',
                    }}
                >
                    {pillar.signal}
                </span>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ backgroundColor: 'var(--text-8)' }} />

            {/* Title + body */}
            <div className="flex flex-col gap-2">
                <h4 className="font-normal m-0 text-[1.1rem] leading-snug">{pillar.title}</h4>
                <p className="m-0 text-sm leading-relaxed text-muted-55">{pillar.body}</p>
            </div>
        </div>
    )
}

// ── Section ───────────────────────────────────────────────────────────────────
const ReliableAtEveryStep = () => {
    const headerRef = useRef<HTMLDivElement>(null)
    const rightRef  = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const els = [
            { el: headerRef.current, delay: 0   },
            { el: rightRef.current,  delay: 150 },
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

            {/* Glow — bottom left */}
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-[15%] -left-[5%] w-[500px] h-[500px] rounded-full bg-turquoise-8"
                style={{ filter: 'blur(80px)' }}
            />

            {/* Top separator */}
            <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

            <style>{`
                @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            `}</style>

            <div className="container relative z-10">

                {/* Header */}
                <div ref={headerRef} className="max-w-[540px] mb-14">
                    <SectionLabel>Reliable at Every Step</SectionLabel>
                    <h2 className="font-normal leading-tight mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                        Structured, predictable,<br />safely stored.
                    </h2>
                    <p className="text-[0.9375rem] leading-relaxed m-0 text-muted-55">
                        Your edits don&apos;t disappear. Your exports don&apos;t surprise you.
                        The system behaves the same way every time because it&apos;s built to.
                    </p>
                </div>

                {/* Body — pillars top, log + quote bottom */}
                <div className="flex flex-col gap-6">

                    {/* Pillar cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {pillars.map((p, i) => (
                            <PillarCard key={p.tag} pillar={p} index={i} />
                        ))}
                    </div>

                    {/* Bottom row: log + closing statement */}
                    <div ref={rightRef} className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                        <StatusLog />

                        {/* Closing statement */}
                        <div
                            className="flex flex-col justify-between p-7 rounded-xl gap-8"
                            style={{ border: '1px solid var(--turquoise-20)', backgroundColor: 'var(--turquoise-4)' }}
                        >
                            <div className="flex flex-col gap-5">
                                {[
                                    { label: 'Edit safety',    value: 'Non-destructive'  },
                                    { label: 'Storage',        value: 'Relational + typed' },
                                    { label: 'Export fidelity', value: '1:1 to timeline'  },
                                    { label: 'Session loss',    value: 'None'             },
                                ].map(({ label, value }) => (
                                    <div
                                        key={label}
                                        className="flex items-center justify-between"
                                        style={{ borderBottom: '1px solid var(--turquoise-10)', paddingBottom: '0.875rem' }}
                                    >
                                        <span className="text-[0.8rem] font-semibold text-muted-55">{label}</span>
                                        <span
                                            className="text-[0.8rem] font-bold"
                                            style={{ color: value === 'None' ? 'var(--turquoise)' : 'var(--text-80)' }}
                                        >
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <p className="m-0 text-[0.8rem] leading-relaxed font-medium text-muted-48 italic">
                                &quot;Reliable software doesn&apos;t announce itself. It just works — every time.&quot;
                            </p>
                        </div>

                    </div>
                </div>

                <SectionSeparator label="Consistent. Every time." />

            </div>
        </section>
    )
}

export default ReliableAtEveryStep