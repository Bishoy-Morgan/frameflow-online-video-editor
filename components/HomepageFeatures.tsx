'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Button from './ui/Button'
import SectionGrid from './ui/SectionGrid'
import { ArrowRight } from 'lucide-react'
import autoCaption  from '@/public/images/features/auto-caption.webp'
import textEdit from '@/public/images/features/text-edit.webp'
import bgRemoval from '@/public/images/features/bg-removal.jpg'
import cloud from '@/public/images/features/cloud-projects.webp'

const FEATURES = [
    {
        id: 1,
        tag: '01',
        title: 'Auto Captions',
        description: 'Generate accurate captions in seconds. Improve engagement, accessibility, and searchability across every platform — automatically.',
        image: autoCaption,
    },
    {
        id: 2,
        tag: '02',
        title: 'Text-Based Editing',
        description: 'Edit video like a document. Remove pauses, cut scenes, and rearrange clips by working directly with the transcript.',
        image: textEdit,
    },
    {
        id: 3,
        tag: '03',
        title: 'Background Removal',
        description: 'Remove or replace backgrounds with one click. Clean, professional results for creators, presentations, and social content.',
        image: bgRemoval,
    },
    {
        id: 4,
        tag: '04',
        title: 'Cloud Projects',
        description: 'Your work saves automatically. Pick up exactly where you left off — from any device, any time.',
        image: cloud,
    },
]

const INTERVAL = 4800
const FADE_MS = 280

const HomepageFeatures = () => {
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
            el.classList.add('opacity-0', 'translate-y-4')
            setTimeout(() => {
                el.classList.remove('opacity-0', 'translate-y-4')
                el.classList.add('opacity-100', 'translate-y-0')
            }, delay)
        })
    }, [])

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
        <section className="relative w-full overflow-hidden py-28">
            <SectionGrid />
            <div className="container relative z-10">
                <div ref={headerRef} className="max-w-140 mb-14 opacity-0 translate-y-4 transition-all duration-550 ease-out">
                    <div className="flex items-center gap-3 mb-8 3xl:mb-12">
                        <div className="w-7 h-px bg-(--accent)" />
                        <span className="text-caption font-bold tracking-[0.14em] uppercase text-(--accent-fg)">
                            Features
                        </span>
                    </div>
                    <h2 className="font-normal leading-tight">
                        Smart tools for faster video.
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                    <div ref={leftRef} className="flex flex-col opacity-0 translate-y-4 transition-all duration-550 ease-out">
                        {FEATURES.map((f, i) => {
                            const active = i === current
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => go(i)}
                                    className="w-full text-left group cursor-pointer focus:outline-none "
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
                                            {f.tag}
                                        </span>

                                        <div className="flex flex-col gap-2 min-w-0">
                                            <h4
                                                className={`
                                                    font-semibold m-0 transition-colors duration-200
                                                    ${active ? 'text-(--text)' : 'text-(--text-tertiary)'}    
                                                `}
                                            >
                                                {f.title}
                                            </h4>

                                            <div
                                                className={`
                                                    overflow-hidden transition-all duration-300
                                                    ${active ? 'opacity-100' : 'opacity-40'}
                                                `}
                                            >
                                                <p className="m-0 text-caption 3xl:text-body text-(--text) pr-8">
                                                    {f.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}

                        <div className="mt-8 flex flex-col gap-6">
                            <div className="flex items-center gap-2">
                                {FEATURES.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => go(i)}
                                        aria-label={`Go to feature ${i + 1}`}
                                        className={`h-1.5 cursor-pointer rounded-full border-none p-0 transition-all duration-300 focus:outline-none ${
                                            i === current
                                                ? 'w-8 bg-(--accent) shadow-[0_0_6px_var(--accent)]'
                                                : 'w-1.5 bg-(--border-strong)'
                                        }`}
                                    />
                                ))}
                                <span className="ml-2 text-small text-tertiary font-medium">
                                    {current + 1} / {FEATURES.length}
                                </span>
                            </div>

                            <Button
                                variant="primary"
                                icon={<ArrowRight size={22} strokeWidth={2} />}
                                iconPosition="right"
                                onClick={() => window.open('/auth/signup', '_self')}
                                className='w-fit mt-6'
                            >
                                Sign up for free
                            </Button>
                        </div>
                    </div>

                    <div ref={rightRef} className="relative opacity-0 translate-y-4 transition-all duration-550 ease-out">
                        <div
                            className="relative aspect-4/3 overflow-hidden rounded-2xl border border-(--border-default) bg-(--surface-raised)"
                        >
                            <div
                                className={`absolute inset-0 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* <div
                                className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-black/70 to-transparent px-5 py-4"
                            >
                                <span
                                    className={`text-sm font-bold text-(--text) transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
                                >
                                    {feature.title}
                                </span>
                                <span
                                    className="font-(--font-dm-serif-display) text-body text-(--text) opacity-50"
                                >
                                    {feature.tag}
                                </span>
                            </div> */}

                            {/* <div
                                className="absolute right-0 top-0 h-0.5 w-16 bg-accent shadow-(--accent)"
                            /> */}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default HomepageFeatures