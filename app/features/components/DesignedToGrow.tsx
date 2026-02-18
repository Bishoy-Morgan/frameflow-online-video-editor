'use client'

import React, { useEffect, useRef, useState } from 'react'
import { User, Users, Building2 } from 'lucide-react'
import SectionGrid from '@/components/ui/SectionGrid'
import { SectionLabel, SectionSeparator } from './FeaturesHero'

// ── Tiers ─────────────────────────────────────────────────────────────────────
const tiers = [
    {
        icon: <User size={16} color="var(--turquoise)" strokeWidth={1.5} />,
        label: 'Individual',
        description: 'Solo creators and developers building at their own pace.',
        features: ['Structured project management', 'Flexible export options', 'Performance-focused foundation'],
        available: true,
    },
    {
        icon: <Users size={16} color="var(--turquoise)" strokeWidth={1.5} />,
        label: 'Team',
        description: 'Small product teams with shared workflows and review cycles.',
        features: ['Everything in Individual', 'Collaboration layer', 'Shared asset library'],
        available: false,
    },
    {
        icon: <Building2 size={16} color="var(--turquoise)" strokeWidth={1.5} />,
        label: 'Organization',
        description: 'Scaled deployment with cloud workflows and enterprise structure.',
        features: ['Everything in Team', 'Cloud workflow integration', 'Advanced access control'],
        available: false,
    },
]

// ── Roadmap items ─────────────────────────────────────────────────────────────
const roadmap = [
    { label: 'Core editor',             status: 'shipped',  quarter: 'Now'   },
    { label: 'Project persistence',     status: 'shipped',  quarter: 'Now'   },
    { label: 'Flexible export',         status: 'shipped',  quarter: 'Now'   },
    { label: 'Collaboration layer',     status: 'upcoming', quarter: 'Next'  },
    { label: 'Cloud workflows',         status: 'upcoming', quarter: 'Next'  },
    { label: 'Shared asset library',    status: 'planned',  quarter: 'Later' },
    { label: 'Organization controls',   status: 'planned',  quarter: 'Later' },
]

const statusStyles: Record<string, { dot: string; text: string; bg: string; border: string }> = {
    shipped:  { dot: 'var(--turquoise)',    text: 'var(--turquoise)',    bg: 'var(--turquoise-8)',  border: 'var(--turquoise-20)' },
    upcoming: { dot: 'var(--text-48)',      text: 'var(--text-55)',      bg: 'var(--text-5)',       border: 'var(--text-10)'      },
    planned:  { dot: 'var(--text-28)',      text: 'var(--text-35)',      bg: 'var(--text-5)',       border: 'var(--text-8)'       },
}

// ── Tier card ─────────────────────────────────────────────────────────────────
const TierCard = ({
    tier,
    index,
    isActive,
    onClick,
}: {
    tier: typeof tiers[0]
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
        }, 100 + index * 100)
        return () => clearTimeout(t)
    }, [index])

    return (
        <div
            ref={ref}
            onClick={onClick}
            className="flex flex-col gap-5 p-6 rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden"
            style={{
                border: `1px solid ${isActive ? 'var(--turquoise-42)' : 'var(--text-10)'}`,
                backgroundColor: isActive ? 'var(--turquoise-6)' : 'var(--text-5)',
                boxShadow: isActive ? '0 0 28px var(--turquoise-8)' : 'none',
            }}
        >
            {/* Coming soon overlay for unavailable tiers */}
            {!tier.available && (
                <div
                    className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[0.55rem] font-bold tracking-widest uppercase"
                    style={{ backgroundColor: 'var(--text-8)', border: '1px solid var(--text-10)', color: 'var(--text-35)' }}
                >
                    Coming soon
                </div>
            )}

            {/* Icon + label */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 icon-box">
                    {tier.icon}
                </div>
                <span
                    className="text-[0.8rem] font-bold tracking-[0.08em] uppercase transition-colors duration-200"
                    style={{ color: isActive ? 'var(--turquoise)' : 'var(--text-55)' }}
                >
                    {tier.label}
                </span>
            </div>

            {/* Description */}
            <p className="m-0 text-[0.8375rem] leading-relaxed text-muted-55">
                {tier.description}
            </p>

            {/* Features */}
            <ul className="m-0 p-0 flex flex-col gap-2 list-none">
                {tier.features.map((f, i) => (
                    <li
                        key={f}
                        className="flex items-center gap-2.5 text-[0.8rem] font-semibold"
                        style={{ color: tier.available || i === 0 ? 'var(--text-72)' : 'var(--text-35)' }}
                    >
                        <span
                            className="w-1 h-1 rounded-full shrink-0"
                            style={{
                                backgroundColor: tier.available || i === 0 ? 'var(--turquoise)' : 'var(--text-28)',
                                boxShadow: tier.available || i === 0 ? '0 0 4px var(--turquoise)' : 'none',
                            }}
                        />
                        {f}
                    </li>
                ))}
            </ul>
        </div>
    )
}

// ── Roadmap strip ─────────────────────────────────────────────────────────────
const RoadmapStrip = () => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.style.opacity = '0'
        el.style.transform = 'translateY(12px)'
        setTimeout(() => {
            el.style.transition = 'opacity 0.55s ease, transform 0.55s ease'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
        }, 400)
    }, [])

    return (
        <div
            ref={ref}
            className="p-7 rounded-xl flex flex-col gap-5"
            style={{ border: '1px solid var(--text-10)', backgroundColor: 'var(--text-5)', backdropFilter: 'blur(8px)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-muted-35">
                    Roadmap
                </span>
                <span className="text-[0.6rem] font-semibold tracking-wide uppercase text-muted-28">
                    Subject to change
                </span>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2">
                {roadmap.map((item, i) => {
                    const s = statusStyles[item.status]
                    return (
                        <div
                            key={item.label}
                            className="flex items-center gap-3 py-2.5 transition-all duration-200"
                            style={{
                                borderBottom: i < roadmap.length - 1 ? '1px solid var(--text-8)' : 'none',
                            }}
                        >
                            {/* Status dot */}
                            <div
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{
                                    backgroundColor: s.dot,
                                    boxShadow: item.status === 'shipped' ? '0 0 5px var(--turquoise-45)' : 'none',
                                }}
                            />

                            {/* Label */}
                            <span
                                className="flex-1 text-[0.82rem] font-semibold"
                                style={{ color: s.text }}
                            >
                                {item.label}
                            </span>

                            {/* Quarter badge */}
                            <span
                                className="text-[0.58rem] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: s.bg, border: `1px solid ${s.border}`, color: s.text }}
                            >
                                {item.quarter}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ── Section ───────────────────────────────────────────────────────────────────
const DesignedToGrow = () => {
    const [active, setActive] = useState(0)
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

            {/* Glow — top right */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-[10%] -right-[5%] w-[520px] h-[520px] rounded-full bg-turquoise-8"
                style={{ filter: 'blur(80px)' }}
            />

            {/* Top separator */}
            <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

            <div className="container relative z-10">

                {/* Header */}
                <div ref={headerRef} className="max-w-[560px] mb-14">
                    <SectionLabel>Designed to Grow With You</SectionLabel>
                    <h2 className="font-normal leading-tight mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                        From solo creator<br />to product team.
                    </h2>
                    <p className="text-[0.9375rem] leading-relaxed m-0 text-muted-55">
                        The foundation is built for scale. What you start with today
                        is the same system that grows with your team and workflow tomorrow.
                    </p>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left — tier cards */}
                    <div className="flex flex-col gap-3">
                        {tiers.map((tier, i) => (
                            <TierCard
                                key={tier.label}
                                tier={tier}
                                index={i}
                                isActive={active === i}
                                onClick={() => setActive(i)}
                            />
                        ))}
                    </div>

                    {/* Right — roadmap + callout */}
                    <div className="flex flex-col gap-4">
                        <RoadmapStrip />

                        {/* Callout */}
                        <div
                            className="px-6 py-4 rounded-xl flex items-start gap-3"
                            style={{ border: '1px solid var(--turquoise-20)', backgroundColor: 'var(--turquoise-4)' }}
                        >
                            <div className="dot-turquoise mt-1 shrink-0" />
                            <p className="m-0 text-[0.875rem] leading-relaxed text-muted-65 font-medium">
                                The architecture was designed with scale in mind from day one.
                                Collaboration and cloud workflows aren&apos;t add-ons they&apos;re planned extensions of the same foundation.
                            </p>
                        </div>
                    </div>

                </div>

                <SectionSeparator label="Built today. Ready for tomorrow." />

            </div>
        </section>
    )
}

export default DesignedToGrow