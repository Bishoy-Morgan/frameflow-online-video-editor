'use client'

import React, { useEffect, useRef } from 'react'
import { ArrowRight, Play } from 'lucide-react'
import Button from '@/components/ui/Button'
import SectionGrid from '@/components/ui/SectionGrid'

const PricingCTA = () => {
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const subRef      = useRef<HTMLParagraphElement>(null)
    const ctaRef      = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const seq = [
            { el: headlineRef.current, delay: 0   },
            { el: subRef.current,      delay: 110 },
            { el: ctaRef.current,      delay: 220 },
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
        <section className="relative w-full overflow-hidden py-40 surface">

            <div className="opacity-70"><SectionGrid /></div>
            {/* Bottom bleeds into footer */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 surface" />

            <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

            {/* Centered glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
                style={{ background: 'radial-gradient(circle, var(--turquoise-10) 0%, transparent 65%)', filter: 'blur(48px)' }}
            />

            <div className="container relative z-10 flex flex-col items-center text-center gap-8">

                <h2
                    ref={headlineRef}
                    className="font-normal m-0 max-w-[560px]"
                    style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
                >
                    Start editing{' '}
                    <span className="italic text-turquoise">today.</span>
                </h2>

                <p ref={subRef} className="m-0 text-base leading-relaxed text-tertiary">
                    No credit card required for the Free plan.
                </p>

                <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4">
                    <Button
                        variant="primary"
                        size="lg"
                        icon={<Play size={15} strokeWidth={2.5} />}
                        iconPosition="left"
                    >
                        Start Free
                    </Button>
                    <Button
                        variant="secondary"
                        size="lg"
                        icon={<ArrowRight size={15} strokeWidth={2} />}
                        iconPosition="right"
                    >
                        Contact Sales
                    </Button>
                </div>

            </div>
        </section>
    )
}

export default PricingCTA