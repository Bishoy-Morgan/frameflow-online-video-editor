'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Button from './ui/Button'
import SectionGrid from './ui/SectionGrid'
import man  from '@/public/images/features/man.jpg'
import edit from '@/public/images/features/edit.jpg'

const INTERVAL = 5000
const FADE_MS = 280

const steps = [
    {
        id: 1,
        tag: '01',
        title: 'Upload your footage',
        description: 'Sign in and launch your workspace. Upload from your computer, cloud storage, or drag and drop directly into the timeline.',
        image: man,
    },
    {
        id: 2,
        tag: '02',
        title: 'Edit on the timeline',
        description: 'Trim, cut, and sequence clips. Add captions, audio, transitions, and effects. Every tool is one click away — no manual required.',
        image: edit,
    },
    {
        id: 3,
        tag: '03',
        title: 'Export and share',
        description: 'Choose your resolution and format. Hit export. Download your video or push it directly to your platform of choice.',
        image: man,
    },
]

const HowToUse = () => {
    const [current, setCurrent] = useState(0)
    const [visible, setVisible] = useState(true)
    const headerRef = useRef<HTMLDivElement>(null)
    const leftRef = useRef<HTMLDivElement>(null)
    const rightRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const els = [
            { el: headerRef.current, delay: 0 },
            { el: leftRef.current, delay: 100 },
            { el: rightRef.current, delay: 200 },
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
        <section className="relative w-full overflow-hidden py-28">

            <SectionGrid />

            <div className="container relative z-10">
                <div ref={headerRef} className="max-w-135 mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-7 h-px bg-(--accent)" />
                        <span className="text-caption font-bold tracking-[0.14em] uppercase text-(--accent-fg)">
                            How it works
                        </span>
                    </div>
                    <h2 className="font-normal leading-tight">
                        From upload to export<br />in three steps.
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div ref={leftRef} className="flex flex-col">
                        {steps.map((step, i) => {
                            const active = i === current
                            return (
                                <button
                                    key={step.id}
                                    onClick={() => go(i)}
                                    className="w-full text-left cursor-pointer focus:outline-none"
                                >
                                    <div
                                        className={`
                                            flex items-start gap-5 py-5 transition-all duration-200 border-transparent 
                                            ${active ? 'pl-6 border-l-(--accent) border-2 ' : 'pl-0'}
                                        `}
                                    >
                                        <span
                                            className={`
                                                text-hero shrink-0 pt-0.5 select-none transition-colors duration-200
                                                ${active ? 'text-(--accent)' : 'text-(--text-ghost)'}
                                            `}
                                        >
                                            {step.tag}
                                        </span>

                                        <div className="flex flex-col gap-2.5">
                                            <h4
                                                className={`
                                                    font-semibold m-0 transition-colors duration-200
                                                    ${active ? 'text-(--text)' : 'text-(--text-tertiary)'}    
                                                `}
                                            >
                                                {step.title}
                                            </h4>
                                            <div
                                                className={`
                                                    overflow-hidden transition-all duration-300
                                                    ${active ? 'opacity-100' : 'opacity-40'}
                                                `}
                                            >
                                                <p className="m-0 text-caption 3xl:text-body text-(--text) pr-8">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                        <div className="mt-10">
                            <Button
                                variant="primary"
                                onClick={() => window.open('/auth/signup', '_self')}
                            >
                                Sign up for free
                            </Button>
                        </div>
                    </div>

                    <div ref={rightRef} className="relative">
                        <div
                            className="relative rounded-2xl overflow-hidden aspect-4/3"
                            style={{
                                border: '1px solid var(--border-default)',
                                backgroundColor: 'var(--surface-raised)',
                            }}
                        >
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
                            <div
                                className="absolute bottom-0 inset-x-0 px-5 py-4 flex items-center justify-between"
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
                            <div
                                className="absolute top-0.5 right-0 w-16 h-0.5 bg-(--accent)"
                                style={{ boxShadow: '0 0 10px var(--accent)' }}
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            {steps.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => go(i)}
                                    aria-label={`Step ${i + 1}`}
                                    className={`h-1.5 cursor-pointer rounded-full border-none p-0 transition-all duration-300 focus:outline-none ${
                                        i === current
                                            ? 'w-8 bg-(--accent) shadow-[0_0_6px_var(--accent)]'
                                            : 'w-1.5 bg-(--border-strong)'
                                    }`}
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