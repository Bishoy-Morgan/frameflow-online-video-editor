'use client'

import React, { useEffect, useRef } from 'react'
import { Play, ArrowRight } from 'lucide-react'
import Button from './ui/Button'
import SectionGrid from './ui/SectionGrid'

const CTASection = () => {
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const subRef = useRef<HTMLParagraphElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const seq = [
            { el: headlineRef.current, delay: 0 },
            { el: subRef.current, delay: 120 },
            { el: ctaRef.current, delay: 240 },
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
        <section className="relative w-full overflow-hidden py-28">
            <SectionGrid />

            <div className="container relative z-10 flex flex-col items-center text-center gap-8">
                <h2
                    ref={headlineRef}
                    className="text-main max-w-150"
                >
                    Start creating{' '}
                    <span className="italic text-(--accent-fg)">
                        something great.
                    </span>
                </h2>

                <p ref={subRef} className="text-lead text-tertiary max-w-105">
                    Join creators building faster, cleaner video workflows — directly in the browser.
                </p>

                <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4">
                    <Button
                        variant="primary"
                        size="lg"
                        icon={<ArrowRight size={22} strokeWidth={2} />}
                        iconPosition="right"
                        onClick={() => window.open('/auth/signup', '_self')}
                    >
                        Sign up for free
                    </Button>
                    <Button
                        variant="ghost"
                        size="lg"
                        icon={<Play size={22} strokeWidth={2} />}
                        iconPosition="left"
                    >
                        Watch Demo
                    </Button>
                </div>

                <p className="text-small text-tertiary font-medium">
                    No credit card required · Free forever plan available
                </p>

            </div>
        </section>
    )
}

export default CTASection