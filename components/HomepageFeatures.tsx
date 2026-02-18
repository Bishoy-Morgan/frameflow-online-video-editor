'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Button from './ui/Button'
import SectionGrid from './ui/SectionGrid'
import { ArrowRight } from 'lucide-react'
import autoCaption  from '@/public/images/features/auto-caption.webp'
import textEdit     from '@/public/images/features/text-edit.webp'
import bgRemoval    from '@/public/images/features/bg-removal.jpg'
import cloud        from '@/public/images/features/cloud-projects.webp'

const FEATURES = [
    {
        id:          1,
        tag:         '01',
        title:       'Auto Captions',
        description: 'Generate accurate captions in seconds. Improve engagement, accessibility, and searchability across every platform — automatically.',
        image:       autoCaption,
    },
    {
        id:          2,
        tag:         '02',
        title:       'Text-Based Editing',
        description: 'Edit video like a document. Remove pauses, cut scenes, and rearrange clips by working directly with the transcript.',
        image:       textEdit,
    },
    {
        id:          3,
        tag:         '03',
        title:       'Background Removal',
        description: 'Remove or replace backgrounds with one click. Clean, professional results for creators, presentations, and social content.',
        image:       bgRemoval,
    },
    {
        id:          4,
        tag:         '04',
        title:       'Cloud Projects',
        description: 'Your work saves automatically. Pick up exactly where you left off — from any device, any time.',
        image:       cloud,
    },
]

const INTERVAL = 4800
const FADE_MS  = 280

const HomepageFeatures = () => {
    const [current, setCurrent]   = useState(0)
    const [visible, setVisible]   = useState(true)
    const headerRef               = useRef<HTMLDivElement>(null)
    const leftRef                 = useRef<HTMLDivElement>(null)
    const rightRef                = useRef<HTMLDivElement>(null)

    // Entrance animations
    useEffect(() => {
        const els = [
            { el: headerRef.current, delay: 0   },
            { el: leftRef.current,   delay: 100 },
            { el: rightRef.current,  delay: 200 },
        ]
        els.forEach(({ el, delay }) => {
            if (!el) return
            el.style.opacity = '0'
            el.style.transform = 'translateY(16px)'
            setTimeout(() => {
                el.style.transition = 'opacity 0.55s ease, transform 0.55s ease'
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
            }, delay)
        })
    }, [])

    // Auto-cycle
    useEffect(() => {
        const id = setInterval(() => {
            setVisible(false)
            setTimeout(() => {
                setCurrent(i => (i + 1) % FEATURES.length)
                setVisible(true)
            }, FADE_MS)
        }, INTERVAL)
        return () => clearInterval(id)
    }, [])

    const go = (index: number) => {
        if (index === current) return
        setVisible(false)
        setTimeout(() => {
            setCurrent(index)
            setVisible(true)
        }, FADE_MS)
    }

    const feature = FEATURES[current]

    return (
        <section className="relative w-full overflow-hidden py-28 surface">

            <SectionGrid />

            {/* Glow — top right */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-[10%] -right-[5%] w-[500px] h-[500px] rounded-full"
                style={{ background: 'radial-gradient(circle, var(--turquoise-8) 0%, transparent 70%)', filter: 'blur(72px)' }}
            />

            <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

            <div className="container relative z-10">

                {/* Header */}
                <div ref={headerRef} className="max-w-[560px] mb-14">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-7 h-px bg-turquoise" />
                        <span className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-turquoise">
                            Features
                        </span>
                    </div>
                    <h2 className="font-normal leading-tight m-0" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                        Smart tools for faster video.
                    </h2>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                    {/* Left — feature list */}
                    <div ref={leftRef} className="flex flex-col">
                        {FEATURES.map((f, i) => {
                            const active = i === current
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => go(i)}
                                    className="w-full text-left group cursor-pointer focus:outline-none"
                                    style={{ background: 'none', border: 'none' }}
                                >
                                    <div
                                        className="flex items-start gap-5 py-5 transition-all duration-200"
                                        style={{
                                            borderBottom: '1px solid var(--border-subtle)',
                                            paddingLeft: active ? '0.75rem' : '0',
                                            borderLeft: active ? '2px solid var(--turquoise)' : '2px solid transparent',
                                        }}
                                    >
                                        {/* Tag */}
                                        <span
                                            className="font-normal leading-none shrink-0 pt-0.5 select-none transition-colors duration-200"
                                            style={{
                                                fontFamily: 'var(--font-dm-serif-display), serif',
                                                fontSize: '1.1rem',
                                                color: active ? 'var(--turquoise)' : 'var(--text-ghost)',
                                            }}
                                        >
                                            {f.tag}
                                        </span>

                                        {/* Text */}
                                        <div className="flex flex-col gap-2 min-w-0">
                                            <h4
                                                className="font-semibold m-0 text-base leading-snug transition-colors duration-200"
                                                style={{ color: active ? 'var(--text)' : 'var(--text-tertiary)' }}
                                            >
                                                {f.title}
                                            </h4>

                                            {/* Description — only active */}
                                            <div
                                                className="overflow-hidden transition-all duration-300"
                                                style={{
                                                    maxHeight: active ? '80px' : '0',
                                                    opacity: active ? 1 : 0,
                                                }}
                                            >
                                                <p className="m-0 text-sm leading-relaxed text-tertiary pr-4">
                                                    {f.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}

                        {/* Progress + CTA */}
                        <div className="mt-8 flex flex-col gap-6">
                            {/* Progress dots */}
                            <div className="flex items-center gap-2">
                                {FEATURES.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => go(i)}
                                        aria-label={`Go to feature ${i + 1}`}
                                        className="cursor-pointer focus:outline-none transition-all duration-300 rounded-full"
                                        style={{
                                            width: i === current ? '2rem' : '0.375rem',
                                            height: '0.375rem',
                                            backgroundColor: i === current ? 'var(--turquoise)' : 'var(--border-strong)',
                                            boxShadow: i === current ? '0 0 6px var(--turquoise)' : 'none',
                                            border: 'none',
                                            padding: 0,
                                        }}
                                    />
                                ))}
                                <span className="ml-2 text-xs text-tertiary font-medium">
                                    {current + 1} / {FEATURES.length}
                                </span>
                            </div>

                            <Button
                                variant="secondary"
                                icon={<ArrowRight size={14} strokeWidth={2} />}
                                iconPosition="right"
                                onClick={() => window.open('/auth/signup', '_self')}
                            >
                                Sign up for free
                            </Button>
                        </div>
                    </div>

                    {/* Right — image panel */}
                    <div ref={rightRef} className="relative">
                        <div
                            className="relative rounded-2xl overflow-hidden aspect-4/3"
                            style={{
                                border: '1px solid var(--border-default)',
                                backgroundColor: 'var(--surface-raised)',
                            }}
                        >
                            {/* Image */}
                            <div
                                className="absolute inset-0 transition-opacity"
                                style={{
                                    opacity: visible ? 1 : 0,
                                    transitionDuration: `${FADE_MS}ms`,
                                }}
                            >
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Bottom label overlay */}
                            <div
                                className="absolute bottom-0 inset-x-0 px-5 py-4 flex items-center justify-between"
                                style={{
                                    background: 'linear-gradient(to top, rgba(2,2,2,0.7) 0%, transparent 100%)',
                                }}
                            >
                                <span
                                    className="text-sm font-bold"
                                    style={{
                                        color: '#fefefe',
                                        opacity: visible ? 1 : 0,
                                        transition: `opacity ${FADE_MS}ms ease`,
                                    }}
                                >
                                    {feature.title}
                                </span>
                                <span
                                    className="font-normal text-[#fefefe] opacity-50"
                                    style={{ fontFamily: 'var(--font-dm-serif-display), serif', fontSize: '1rem' }}
                                >
                                    {feature.tag}
                                </span>
                            </div>

                            {/* Turquoise corner accent */}
                            <div
                                className="absolute top-0 right-0 w-16 h-0.5 bg-turquoise"
                                style={{ boxShadow: '0 0 12px var(--turquoise)' }}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default HomepageFeatures