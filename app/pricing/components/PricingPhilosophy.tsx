'use client'

import React, { useEffect, useRef } from 'react'
import SectionGrid from '@/components/ui/SectionGrid'

const pillars = [
    {
        headline: 'No hidden fees.',
        body: 'The price you see is the price you pay. No seat minimums, no surprise overages, no annual lock-in by default.',
    },
    {
        headline: 'No long-term contracts.',
        body: 'Start, pause, or cancel whenever your situation changes. We earn your subscription every month.',
    },
    {
        headline: 'Built for every stage.',
        body: 'Free gets you started. Pro grows with you. Team is ready when your workflow outgrows one person.',
    },
]

const PricingPhilosophy = () => {
    const headerRef = useRef<HTMLDivElement>(null)
    const pillarsRef = useRef<HTMLDivElement>(null)
    const quoteRef  = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const els = [
            { el: headerRef.current,  delay: 0   },
            { el: pillarsRef.current, delay: 140 },
            { el: quoteRef.current,   delay: 260 },
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
                className="pointer-events-none absolute -bottom-[15%] -left-[5%] w-[480px] h-[480px] rounded-full"
                style={{ background: 'radial-gradient(circle, var(--turquoise-8) 0%, transparent 70%)', filter: 'blur(72px)' }}
            />

            <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

            <div className="container relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left — headline */}
                    <div ref={headerRef} className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-px bg-turquoise" />
                            <span className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-turquoise">
                                Pricing Philosophy
                            </span>
                        </div>

                        <h2
                            className="font-normal leading-tight m-0"
                            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                        >
                            Built to scale{' '}
                            <span className="italic text-turquoise">with you.</span>
                        </h2>

                        <p className="m-0 text-[0.9375rem] leading-relaxed text-tertiary" style={{ maxWidth: '420px' }}>
                            Frameflow pricing is designed to support individuals and teams
                            at every stage from first draft to production workflows.
                        </p>

                        {/* Trust line */}
                        <div
                            className="inline-flex items-start gap-3 mt-2 px-5 py-4 rounded-xl"
                            style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-default)' }}
                        >
                            <div className="dot-turquoise mt-1 shrink-0" />
                            <p className="m-0 text-sm font-semibold leading-relaxed text-secondary">
                                No hidden fees. No long-term contracts.
                            </p>
                        </div>
                    </div>

                    {/* Right — pillars */}
                    <div ref={pillarsRef} className="flex flex-col gap-0">
                        {pillars.map((pillar, i) => (
                            <div
                                key={pillar.headline}
                                className="flex gap-5 py-6"
                                style={{
                                    borderBottom: i < pillars.length - 1
                                        ? '1px solid var(--border-subtle)'
                                        : 'none',
                                }}
                            >
                                {/* Number */}
                                <span
                                    className="font-normal leading-none shrink-0 mt-0.5 select-none"
                                    style={{
                                        fontFamily: 'var(--font-dm-serif-display), serif',
                                        fontSize: '1.5rem',
                                        color: 'var(--turquoise-fg)',
                                    }}
                                >
                                    0{i + 1}
                                </span>

                                {/* Text */}
                                <div className="flex flex-col gap-1.5">
                                    <h4 className="font-semibold m-0 text-base leading-snug text-secondary">
                                        {pillar.headline}
                                    </h4>
                                    <p className="m-0 text-sm leading-relaxed text-tertiary">
                                        {pillar.body}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Bottom quote */}
                <div
                    ref={quoteRef}
                    className="mt-16 px-8 py-6 rounded-xl flex items-start gap-4"
                    style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-default)' }}
                >
                    {/* Large quote mark */}
                    <span
                        className="font-normal leading-none shrink-0 select-none -mt-2"
                        style={{
                            fontFamily: 'var(--font-dm-serif-display), serif',
                            fontSize: '4rem',
                            color: 'var(--turquoise-fg)',
                            opacity: 0.4,
                        }}
                    >
                        &quot;
                    </span>
                    <p className="m-0 text-base leading-relaxed text-secondary font-medium italic">
                        Pricing should feel like a handshake, not a trap. You start free,
                        pay when it&apos;s worth it, and leave whenever you want. That&apos;s the deal.
                    </p>
                </div>

            </div>
        </section>
    )
}

export default PricingPhilosophy