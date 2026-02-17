'use client'

import React, { useEffect, useRef } from 'react'
import { Film, RotateCcw, Layers } from 'lucide-react'
import { SectionGrid, SectionLabel, SectionSeparator } from './FeaturesHero'

const features = [
    {
        tag: '01',
        title: 'Timeline-Based Editing',
        description: 'A precision timeline built for speed. Every interaction is immediate — no buffering, no waiting.',
        items: ['Multi-layer timeline', 'Drag-and-drop clips', 'Trim, split, rearrange', 'Frame-accurate adjustments'],
        icon: <Film size={19} color="var(--turquoise)" strokeWidth={1.5} />,
    },
    {
        tag: '02',
        title: 'Non-Destructive Workflow',
        description: 'Your source files stay untouched. Every edit exists as a reversible state — experiment freely.',
        items: ['Every edit is reversible', 'State-based rendering model', 'No permanent file mutation'],
        icon: <RotateCcw size={19} color="var(--turquoise)" strokeWidth={1.5} />,
    },
    {
        tag: '03',
        title: 'Layer Management',
        description: 'Compose with full control. Stack, reorder, and blend any combination of media in one sequence.',
        items: ['Video layers', 'Audio tracks', 'Text overlays', 'Stacking system'],
        icon: <Layers size={19} color="var(--turquoise)" strokeWidth={1.5} />,
    },
]

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.style.opacity = '0'
        el.style.transform = 'translateY(20px)'
        const t = setTimeout(() => {
            el.style.transition = 'opacity 0.55s ease, transform 0.55s ease'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
        }, 160 + index * 110)
        return () => clearTimeout(t)
    }, [index])

    return (
        <div ref={ref} className="card flex flex-col gap-6 p-8 rounded-xl cursor-default">

            {/* Icon + number */}
            <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center icon-box">
                    {feature.icon}
                </div>
                <span className="font-normal select-none leading-none text-muted-7" style={{ fontSize: '3.25rem' }}>
                    {feature.tag}
                </span>
            </div>

            {/* Title + description */}
            <div className="flex flex-col gap-2">
                <h3 className="font-normal text-2xl leading-snug">{feature.title}</h3>
                <p className="text-sm leading-relaxed m-0 text-muted-55">{feature.description}</p>
            </div>

            {/* Divider */}
            <div className="h-px border-muted-8 bg-muted-8" />

            {/* Items */}
            <ul className="m-0 p-0 flex flex-col gap-2.5 list-none">
                {feature.items.map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-[0.84rem] font-semibold text-muted-72">
                        <span className="w-1 h-1 rounded-full shrink-0 bg-turquoise shadow-turquoise" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}

const CoresEditing = () => {
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

            {/* Glow — bottom left */}
            <div aria-hidden className="pointer-events-none absolute -bottom-[20%] -left-[5%] w-[480px] h-[480px] rounded-full bg-turquoise-8" style={{ filter: 'blur(72px)' }} />

            {/* Top separator */}
            <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

            <div className="container relative z-10">

                {/* Header */}
                <div ref={headerRef} className="max-w-[600px] mb-14">
                    <SectionLabel>Core Capabilities</SectionLabel>
                    <h2 className="font-normal leading-tight mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                        Where product maturity shows.
                    </h2>
                    <p className="text-[0.9375rem] leading-relaxed m-0 text-muted-55">
                        Every editing primitive you&apos;d expect — built from the ground up for the browser,
                        with no compromises on precision or speed.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                    {features.map((feature, i) => (
                        <FeatureCard key={feature.tag} feature={feature} index={i} />
                    ))}
                </div>

                <SectionSeparator label="No plugins. No installs. Just the browser." />

            </div>
        </section>
    )
}

export default CoresEditing