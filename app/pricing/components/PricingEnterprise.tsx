'use client'

import React, { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import SectionGrid from '@/components/ui/SectionGrid'

const signals = [
    'Tailored onboarding',
    'Volume-based pricing',
    'Dedicated support',
    'Custom integrations',
    'SLA agreements',
    'Private deployment options',
]

const PricingEnterprise = () => {
    const leftRef  = useRef<HTMLDivElement>(null)
    const rightRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const els = [
            { el: leftRef.current,  delay: 0   },
            { el: rightRef.current, delay: 140 },
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

            <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

            {/* Glow — center right */}
            <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 -translate-y-1/2 -right-[8%] w-[500px] h-[500px] rounded-full"
                style={{ background: 'radial-gradient(circle, var(--turquoise-8) 0%, transparent 70%)', filter: 'blur(72px)' }}
            />

            <div className="container relative z-10">
                <div
                    className="rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
                    style={{ border: '1px solid var(--border-default)', backgroundColor: 'var(--bg)' }}
                >

                    {/* Left — copy */}
                    <div
                        ref={leftRef}
                        className="flex flex-col justify-between gap-10 p-10 lg:p-14"
                        style={{ borderRight: '1px solid var(--border-subtle)' }}
                    >
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-px bg-turquoise" />
                                <span className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-turquoise">
                                    Enterprise
                                </span>
                            </div>

                            <h2
                                className="font-normal leading-tight m-0"
                                style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)' }}
                            >
                                Need something{' '}
                                <span className="italic text-turquoise">custom?</span>
                            </h2>

                            <p className="m-0 text-[0.9375rem] leading-relaxed text-tertiary" style={{ maxWidth: '380px' }}>
                                For larger organizations or high-volume workflows,
                                we offer tailored solutions built around your team&apos;s needs.
                            </p>
                        </div>

                        <Button
                            variant="primary"
                            icon={<ArrowRight size={15} strokeWidth={2} />}
                            iconPosition="right"
                        >
                            Contact Us
                        </Button>
                    </div>

                    {/* Right — signals grid */}
                    <div ref={rightRef} className="flex flex-col justify-center p-10 lg:p-14">
                        <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-tertiary mb-6 block">
                            What&apos;s included
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
                            {signals.map((signal) => (
                                <div
                                    key={signal}
                                    className="flex items-center gap-3 py-3.5"
                                    style={{
                                        borderBottom: '1px solid var(--border-subtle)',
                                    }}
                                >
                                    <span className="w-1 h-1 rounded-full shrink-0 bg-turquoise shadow-turquoise" />
                                    <span className="text-sm font-semibold text-secondary">
                                        {signal}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Footer note */}
                        <p className="m-0 mt-8 text-xs leading-relaxed text-tertiary">
                            Pricing and scope are scoped to your workflow. <br />
                            Reach out and we&apos;ll figure it out together.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default PricingEnterprise