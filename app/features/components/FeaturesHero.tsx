'use client'

import React, { useEffect, useRef } from 'react'
import { Play, ArrowRight } from 'lucide-react'
import SectionGrid from '@/components/ui/SectionGrid'
import Button from '@/components/ui/Button'



export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-px bg-turquoise" />
        <span className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-turquoise">
            {children}
        </span>
    </div>
)

export const SectionSeparator = ({ label }: { label: string }) => (
    <div className="mt-12 flex items-center gap-4">
        <div className="flex-1 h-px line-fade-right" />
        <span className="text-[0.65rem] font-bold tracking-[0.12em] uppercase whitespace-nowrap text-muted-28">
            {label}
        </span>
        <div className="flex-1 h-px line-fade-left" />
    </div>
)


const FeaturesHero = () => {
    const h1Ref    = useRef<HTMLHeadingElement>(null)
    const subRef   = useRef<HTMLParagraphElement>(null)
    const ctaRef   = useRef<HTMLDivElement>(null)
    const statsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const seq = [
            { el: h1Ref.current,    delay: 0   },
            { el: subRef.current,   delay: 120  },
            { el: ctaRef.current,   delay: 250  },
            { el: statsRef.current, delay: 380  },
        ]
        seq.forEach(({ el, delay }) => {
            if (!el) return
            el.style.opacity = '0'
            el.style.transform = 'translateY(18px)'
            setTimeout(() => {
                el.style.transition = 'opacity 0.65s ease, transform 0.65s ease'
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
            }, delay)
        })
    }, [])

    return (
        <section className="relative w-full h-svh flex items-center overflow-hidden surface max-h-[1200px]">

            <SectionGrid />

            {/* Glows */}
            <div aria-hidden className="pointer-events-none absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-turquoise-16" style={{ filter: 'blur(80px)' }} />
            <div aria-hidden className="pointer-events-none absolute bottom-[5%] -left-[8%] w-[400px] h-[400px] rounded-full bg-turquoise-8" style={{ filter: 'blur(60px)' }} />

            <div className="container relative z-10 pt-52 pb-28">
                <div className="max-w-[820px]">

                    {/* Headline */}
                    <h1
                        ref={h1Ref}
                        className="font-normal mb-7"
                        style={{ fontSize: 'clamp(2.75rem, 6vw, 5rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
                    >
                        Built for real-time video{' '}
                        <span className="relative inline-block italic text-turquoise">
                            editing
                            <svg aria-hidden viewBox="0 0 220 12" fill="none" className="absolute left-0 w-full" style={{ bottom: '-6px', height: '10px' }}>
                                <path d="M2 8 C40 3, 80 10, 120 5 C160 1, 200 9, 218 6" stroke="var(--turquoise)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
                            </svg>
                        </span>{' '}
                        in the browser.
                    </h1>

                    {/* Sub */}
                    <p ref={subRef} className="text-lg leading-[1.75] max-w-[580px] mb-11 text-muted-62">
                        Frameflow combines modern web architecture with a timeline-based editing engine
                        to deliver fast, responsive, and scalable video workflows — entirely in the browser.
                    </p>

                    {/* CTAs */}
                    <div ref={ctaRef} className="flex flex-wrap items-center gap-4">

                        {/*
                            primary — solid turquoise fill, --bg text.
                            On hover: wipe reveals --bg underneath, text transitions to turquoise.
                            Play icon inherits the same color transition via the icon prop.
                            No fill needed on the icon — `currentColor` picks it up automatically.
                        */}
                        <Button
                            variant="primary"
                            icon={<Play size={14} strokeWidth={2.5} />}
                            iconPosition="left"
                        >
                            View Editor
                        </Button>

                        {/*
                            secondary — transparent bg, turquoise border + text.
                            On hover: wipe fills turquoise, text transitions to --bg.
                            ArrowRight icon transitions in sync via the icon prop.
                        */}
                        <Button
                            variant="secondary"
                            icon={<ArrowRight size={14} strokeWidth={2} />}
                            iconPosition="right"
                        >
                            See Pricing
                        </Button>

                    </div>

                    {/* Stats */}
                    <div ref={statsRef} className="flex flex-wrap items-center gap-8 mt-16 pt-8 border-t border-muted-10">
                        {[
                            { value: '< 2s',  label: 'Average load time' },
                            { value: '60fps', label: 'Timeline playback'  },
                            { value: '4K',    label: 'Export resolution'  },
                            { value: '100%',  label: 'Browser-native'     },
                        ].map(({ value, label }) => (
                            <div key={label} className="flex flex-col gap-0.5">
                                <span className="text-2xl font-normal leading-none text-turquoise">{value}</span>
                                <span className="text-[0.7rem] font-semibold tracking-[0.06em] uppercase text-muted-48">{label}</span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}

export default FeaturesHero