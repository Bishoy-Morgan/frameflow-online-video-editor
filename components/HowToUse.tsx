'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Button from './ui/Button'
import SectionGrid from './ui/SectionGrid'
import man  from '@/public/images/features/man.jpg'
import edit from '@/public/images/features/edit.jpg'

const INTERVAL = 5000
const FADE_MS  = 280

const steps = [
    {
        id:          1,
        tag:         '01',
        title:       'Upload your footage',
        description: 'Sign in and launch your workspace. Upload from your computer, cloud storage, or drag and drop directly into the timeline.',
        image:       man,
    },
    {
        id:          2,
        tag:         '02',
        title:       'Edit on the timeline',
        description: 'Trim, cut, and sequence clips. Add captions, audio, transitions, and effects. Every tool is one click away — no manual required.',
        image:       edit,
    },
    {
        id:          3,
        tag:         '03',
        title:       'Export and share',
        description: 'Choose your resolution and format. Hit export. Download your video or push it directly to your platform of choice.',
        image:       man,
    },
]

const HowToUse = () => {
    const [current, setCurrent] = useState(0)
    const [visible, setVisible] = useState(true)
    const headerRef = useRef<HTMLDivElement>(null)
    const leftRef   = useRef<HTMLDivElement>(null)
    const rightRef  = useRef<HTMLDivElement>(null)

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
                setCurrent(i => (i + 1) % steps.length)
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

    return (
        <section className="relative w-full overflow-hidden py-28 surface">

            <SectionGrid />

            {/* Glow — top left */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-[10%] -left-[5%] w-[480px] h-[480px] rounded-full"
                style={{ background: 'radial-gradient(circle, var(--accent-8) 0%, transparent 70%)', filter: 'blur(72px)' }}
            />

            <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-accent" />

            <div className="container relative z-10">

                {/* Header */}
                <div ref={headerRef} className="max-w-[540px] mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-7 h-px bg-accent" />
                        <span className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-accent">
                            How it works
                        </span>
                    </div>
                    <h2 className="font-normal leading-tight m-0" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                        From upload to export<br />in three steps.
                    </h2>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left — steps */}
                    <div ref={leftRef} className="flex flex-col">
                        {steps.map((step, i) => {
                            const active = i === current
                            return (
                                <button
                                    key={step.id}
                                    onClick={() => go(i)}
                                    className="w-full text-left cursor-pointer focus:outline-none"
                                    style={{ background: 'none', border: 'none', padding: 0 }}
                                >
                                    <div
                                        className="flex items-start gap-6 py-6 transition-all duration-250"
                                        style={{
                                            borderBottom: '1px solid var(--border-subtle)',
                                            paddingLeft: active ? '1rem' : '0',
                                            borderLeft: active
                                                ? '2px solid var(--accent)'
                                                : '2px solid transparent',
                                        }}
                                    >
                                        {/* Tag */}
                                        <span
                                            className="font-normal leading-none shrink-0 pt-0.5 select-none transition-colors duration-200"
                                            style={{
                                                fontFamily: 'var(--font-dm-serif-display), serif',
                                                fontSize: '1.75rem',
                                                color: active ? 'var(--accent)' : 'var(--text-ghost)',
                                            }}
                                        >
                                            {step.tag}
                                        </span>

                                        {/* Text */}
                                        <div className="flex flex-col gap-2.5">
                                            <h4
                                                className="m-0 font-semibold text-base leading-snug transition-colors duration-200"
                                                style={{ color: active ? 'var(--text)' : 'var(--text-tertiary)' }}
                                            >
                                                {step.title}
                                            </h4>
                                            <div
                                                className="overflow-hidden transition-all duration-300"
                                                style={{
                                                    maxHeight: active ? '100px' : '0',
                                                    opacity: active ? 1 : 0,
                                                }}
                                            >
                                                <p className="m-0 text-sm leading-relaxed text-tertiary pr-4">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}

                        {/* CTA */}
                        <div className="mt-10">
                            <Button
                                variant="primary"
                                onClick={() => window.open('/auth/signup', '_self')}
                            >
                                Sign up for free
                            </Button>
                        </div>
                    </div>

                    {/* Right — image */}
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
                                    src={steps[current].image}
                                    alt={steps[current].title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Step label overlay */}
                            <div
                                className="absolute bottom-0 inset-x-0 px-5 py-4 flex items-center justify-between"
                                style={{ background: 'linear-gradient(to top, rgba(2,2,2,0.65) 0%, transparent 100%)' }}
                            >
                                <span
                                    className="text-sm font-bold"
                                    style={{
                                        color: '#fefefe',
                                        opacity: visible ? 1 : 0,
                                        transition: `opacity ${FADE_MS}ms ease`,
                                    }}
                                >
                                    {steps[current].title}
                                </span>
                                <span
                                    className="font-normal opacity-40"
                                    style={{
                                        fontFamily: 'var(--font-dm-serif-display), serif',
                                        fontSize: '1.1rem',
                                        color: '#fefefe',
                                    }}
                                >
                                    {steps[current].tag}
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div
                                className="absolute top-0 inset-x-0 h-0.5"
                                style={{ backgroundColor: 'var(--accent-20)' }}
                            >
                                <div
                                    className="h-full bg-accent transition-none"
                                    style={{
                                        width: `${((current + 1) / steps.length) * 100}%`,
                                        transition: 'width 0.4s ease',
                                        boxShadow: '0 0 8px var(--accent)',
                                    }}
                                />
                            </div>

                            {/* accent corner accent */}
                            <div
                                className="absolute top-0.5 right-0 w-16 h-0.5 bg-accent"
                                style={{ boxShadow: '0 0 10px var(--accent)' }}
                            />
                        </div>

                        {/* Step counter below image */}
                        <div className="flex items-center gap-2 mt-4">
                            {steps.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => go(i)}
                                    aria-label={`Step ${i + 1}`}
                                    className="cursor-pointer focus:outline-none rounded-full transition-all duration-300"
                                    style={{
                                        width: i === current ? '2rem' : '0.375rem',
                                        height: '0.375rem',
                                        backgroundColor: i === current ? 'var(--accent)' : 'var(--border-strong)',
                                        boxShadow: i === current ? '0 0 6px var(--accent)' : 'none',
                                        border: 'none',
                                        padding: 0,
                                    }}
                                />
                            ))}
                            <span className="ml-1 text-xs text-tertiary font-medium">
                                Step {current + 1} of {steps.length}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default HowToUse