'use client'

import React, { useEffect, useRef } from 'react'
import { ArrowRight, Play } from 'lucide-react'
import Button from '@/components/ui/Button'
import SectionGrid from '@/components/ui/SectionGrid'

const ReadyWhenYouAre = () => {
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const subRef      = useRef<HTMLParagraphElement>(null)
    const ctaRef      = useRef<HTMLDivElement>(null)
    const noteRef     = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        const seq = [
            { el: headlineRef.current, delay: 0   },
            { el: subRef.current,      delay: 120 },
            { el: ctaRef.current,      delay: 240 },
            { el: noteRef.current,     delay: 360 },
        ]
        seq.forEach(({ el, delay }) => {
            if (!el) return
            el.style.opacity = '0'
            el.style.transform = 'translateY(16px)'
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
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 surface" />

            {/* Large centered glow — full attention */}
            <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, var(--turquoise-16) 0%, transparent 65%)',
                    filter: 'blur(40px)',
                }}
            />

            {/* Top separator */}
            <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

            <div className="container relative z-10 flex flex-col items-center text-center gap-10">

                {/* Eyebrow */}
                <div
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-turquoise"
                >
                    <span className="w-[7px] h-[7px] rounded-full bg-turquoise shadow-turquoise" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
                    <span className="text-xs font-semibold tracking-widest uppercase text-turquoise">
                        No installation required
                    </span>
                </div>

                {/* Headline */}
                <h2
                    ref={headlineRef}
                    className="font-normal m-0 max-w-[700px]"
                    style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
                >
                    Ready{' '}
                    <span className="italic text-turquoise">when</span>{' '}
                    you are.
                </h2>

                {/* Sub */}
                <p
                    ref={subRef}
                    className="m-0 text-lg leading-relaxed max-w-[480px] text-muted-60"
                >
                    Start editing instantly — directly in your browser.
                    No downloads, no setup, no waiting.
                </p>

                {/* CTAs */}
                <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4">
                    <Button
                        variant="primary"
                        size="lg"
                        icon={<Play size={15} strokeWidth={2.5} />}
                        iconPosition="left"
                        onClick={() => window.open('/editor', '_blank')}
                    >
                        Launch Editor
                    </Button>
                    <Button
                        variant="secondary"
                        size="lg"
                        icon={<ArrowRight size={15} strokeWidth={2} />}
                        iconPosition="right"
                        onClick={() => window.open('/pricing', '_self')}
                    >
                        Explore Plans
                    </Button>
                </div>

                {/* Fine print */}
                <p ref={noteRef} className="m-0 text-small text-muted-35">
                    Free to start — no credit card required.
                </p>

            </div>

            <style>{`@keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
        </section>
    )
}

export default ReadyWhenYouAre