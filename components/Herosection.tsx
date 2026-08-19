'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Button from './ui/Button'
import SectionGrid from './ui/SectionGrid'
import laptopMockup from '@/public/images/laptop-mockup.webp'
import { ArrowRight } from 'lucide-react'

const HeroSection = () => {
    const pillRef = useRef<HTMLDivElement>(null)
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const subRef = useRef<HTMLParagraphElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const seq = [
            { el: pillRef.current, delay: 0 },
            { el: headlineRef.current, delay: 100 },
            { el: subRef.current, delay: 220 },
            { el: ctaRef.current, delay: 340 },
            { el: imageRef.current, delay: 180 },
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
        <section className="relative w-full h-svh max-h-250 flex items-center overflow-hidden">

            <SectionGrid />

            <div className="container relative z-10 pt-40 pb-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                    <div className="w-full lg:w-1/2 flex flex-col items-start">
                        <h1
                            ref={headlineRef}
                            className="font-normal m-0 mb-6 text-main "
                        >
                            Edit video.
                            <br />
                            <span className="italic text-accent">In your browser.</span>
                            <br />
                            Ship faster.
                        </h1>

                        <p
                            ref={subRef}
                            className="m-0 mb-10 text-lead 3xl:text-hero"
                        >
                            Frameflow gives you a fast, structured timeline editor for social media,
                            marketing content, and product demos — no downloads, no complexity.
                        </p>

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
                                size="md"
                                icon={<ArrowRight size={20} strokeWidth={2} />}
                                iconPosition="right"
                                onClick={() => window.open('/features', '_self')}
                            >
                                See how it works
                            </Button>
                        </div>

                        <p className="m-0 mt-5 text-small text-tertiary font-medium ml-1">
                            No credit card required · Free forever plan available
                        </p>
                    </div>

                    <div ref={imageRef} className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
                        <div className="relative w-full max-w-145">
                            <div
                                className="rounded-2xl overflow-hidden"
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

                            <div
                                className="absolute -bottom-4 -left-4 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-(--bg) border border-(--border-default) shadow-md"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-accent" />
                                <span className="text-small font-bold">
                                    No install required
                                </span>
                            </div>

                            <div
                                className="absolute -top-4 -right-4 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-(--bg) border border-(--border-default) shadow-md"
                            >
                                <span
                                    className="text-lead font-semibold font-mono leading-none text-accent"
                                >
                                    60fps
                                </span>
                                <span className="text-small text-tertiary font-medium">
                                    Timeline playback
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection