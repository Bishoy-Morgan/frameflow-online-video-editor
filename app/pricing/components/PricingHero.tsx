'use client'

import React, { useEffect, useRef } from 'react'
import SectionGrid from '@/components/ui/SectionGrid'

const PricingHero = () => {
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const subRef      = useRef<HTMLParagraphElement>(null)
    const pillRef     = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const seq = [
            { el: pillRef.current,     delay: 0   },
            { el: headlineRef.current, delay: 110 },
            { el: subRef.current,      delay: 220 },
        ]
        seq.forEach(({ el, delay }) => {
            if (!el) return
            el.style.opacity = '0'
            el.style.transform = 'translateY(14px)'
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
            }, delay)
        })
    }, [])

    return (
        <section className="relative w-full overflow-hidden pt-60 pb-32 surface">

            <SectionGrid />

            {/* Centered glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, var(--turquoise-10) 0%, transparent 65%)',
                    filter: 'blur(48px)',
                }}
            />

            <div className="container relative z-10 flex flex-col items-center text-center">

                {/* Headline */}
                <h1
                    ref={headlineRef}
                    className="font-normal m-0 max-w-[640px]"
                    style={{ fontSize: 'clamp(2.75rem, 6vw, 4.75rem)', lineHeight: 1.08, letterSpacing: '-0.025em' }}
                >
                    Simple,{' '}
                    <span className="italic text-turquoise">transparent</span>{' '}
                    pricing.
                </h1>

                {/* Sub */}
                <p
                    ref={subRef}
                    className="mt-6 mb-0 text-lg leading-relaxed max-w-[400px] text-tertiary"
                >
                    Start for free. Upgrade when your workflow grows.
                </p>

            </div>
        </section>
    )
}

export default PricingHero