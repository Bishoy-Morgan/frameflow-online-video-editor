'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Button from './ui/Button'
import SectionGrid from './ui/SectionGrid'
import laptopMockup from '@/public/images/laptop-mockup.webp'
import { ArrowRight } from 'lucide-react'

const HeroSection = () => {
    const pillRef     = useRef<HTMLDivElement>(null)
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const subRef      = useRef<HTMLParagraphElement>(null)
    const ctaRef      = useRef<HTMLDivElement>(null)
    const imageRef    = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const seq = [
            { el: pillRef.current,     delay: 0   },
            { el: headlineRef.current, delay: 100 },
            { el: subRef.current,      delay: 220 },
            { el: ctaRef.current,      delay: 340 },
            { el: imageRef.current,    delay: 180 },
        ]
        seq.forEach(({ el, delay }) => {
            if (!el) return
            el.style.opacity = '0'
            el.style.transform = 'translateY(20px)'
            setTimeout(() => {
                el.style.transition = 'opacity 0.65s ease, transform 0.65s ease'
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
            }, delay)
        })
    }, [])

    return (
        <section className="relative w-full min-h-svh flex items-center overflow-hidden surface">

            <SectionGrid />

            {/* Glows */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-[15%] -right-[5%] w-162.5 h-162.5 rounded-full"
                style={{ background: 'radial-gradient(circle, var(--turquoise-10) 0%, transparent 70%)', filter: 'blur(72px)' }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute bottom-0 -left-[10%] w-100 h-100 rounded-full"
                style={{ background: 'radial-gradient(circle, var(--turquoise-6) 0%, transparent 70%)', filter: 'blur(60px)' }}
            />

            <div className="container relative z-10 pt-40 pb-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

                    {/* ── Left ── */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start">

                        {/* Headline */}
                        <h1
                            ref={headlineRef}
                            className="font-normal m-0 mb-6"
                            style={{
                                fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                                lineHeight: 1.08,
                                letterSpacing: '-0.025em',
                                color: 'var(--text)',
                            }}
                        >
                            Edit video.
                            <br />
                            <span className="italic text-turquoise">In your browser.</span>
                            <br />
                            Ship faster.
                        </h1>

                        {/* Sub */}
                        <p
                            ref={subRef}
                            className="m-0 mb-10 text-[1rem] leading-[1.75] text-tertiary"
                            style={{ maxWidth: '460px' }}
                        >
                            Frameflow gives you a fast, structured timeline editor for social media,
                            marketing content, and product demos — no downloads, no complexity.
                        </p>

                        {/* CTAs */}
                        <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => window.open('/auth/signup', '_self')}
                            >
                                Sign up for free
                            </Button>
                            <Button
                                variant="ghost"
                                size="lg"
                                icon={<ArrowRight size={15} strokeWidth={2} />}
                                iconPosition="right"
                                onClick={() => window.open('/features', '_self')}
                            >
                                See how it works
                            </Button>
                        </div>

                        {/* Trust note */}
                        <p className="m-0 mt-5 text-xs text-tertiary font-medium ml-1">
                            No credit card required · Free forever plan available
                        </p>
                    </div>

                    {/* ── Right — mockup ── */}
                    <div ref={imageRef} className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
                        <div className="relative w-full max-w-145">

                            {/* Glow behind image */}
                            <div
                                aria-hidden
                                className="absolute inset-0 -z-10"
                                style={{
                                    background: 'radial-gradient(ellipse 80% 60% at 50% 100%, var(--turquoise-10), transparent)',
                                    filter: 'blur(32px)',
                                    transform: 'translateY(10%)',
                                }}
                            />

                            {/* Image */}
                            <div
                                className="rounded-2xl overflow-hidden"
                                style={{
                                    border: '1px solid var(--border-default)',
                                    boxShadow: '0 32px 80px rgba(0,0,0,0.1), 0 0 0 1px var(--border-subtle)',
                                }}
                            >
                                <Image
                                    src={laptopMockup}
                                    alt="Frameflow Video Editor Interface"
                                    width={650}
                                    height={524}
                                    quality={90}
                                    priority
                                    className="w-full h-auto block"
                                />
                            </div>

                            {/* Floating badge — bottom left */}
                            <div
                                className="absolute -bottom-4 -left-4 flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                                style={{
                                    backgroundColor: 'var(--bg)',
                                    border: '1px solid var(--border-default)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-turquoise shadow-turquoise" />
                                <span className="text-xs font-bold text-secondary">No install required</span>
                            </div>

                            {/* Floating badge — top right */}
                            <div
                                className="absolute -top-4 -right-4 flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                                style={{
                                    backgroundColor: 'var(--bg)',
                                    border: '1px solid var(--border-default)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                }}
                            >
                                <span
                                    className="font-normal leading-none text-turquoise"
                                    style={{ fontFamily: 'var(--font-dm-serif-display), serif', fontSize: '1.1rem' }}
                                >
                                    60fps
                                </span>
                                <span className="text-xs text-tertiary font-medium">Timeline playback</span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default HeroSection