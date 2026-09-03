'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Play, ArrowRight, Lock, MoveRight } from 'lucide-react'
import Button from './ui/Button'
import SectionGrid from './ui/SectionGrid'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const BASE = 'https://gvcbfsfglzhbxmsyuylg.supabase.co/storage/v1/object/public/template-previews'

function videoUrl(slug: string): string {
    const titled = slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join('-')
    return `${BASE}/${titled}-1.mp4`
}

const templates = [
    { name: 'Vlog Intro', category: 'YouTube', slug: 'vlog-intro', isPremium: false },
    { name: 'Product Showcase', category: 'Business', slug: 'product-showcase', isPremium: false },
    { name: 'Tutorial', category: 'Education', slug: 'tutorial-opener', isPremium: true },
    { name: 'Music Video', category: 'Creative', slug: 'music-video', isPremium: false },
    { name: 'Social Ad', category: 'Marketing', slug: 'social-ad', isPremium: false },
    { name: 'Testimonial', category: 'Business', slug: 'testimonial', isPremium: true },
]

const fallbackAccentClasses = [
    'from-(--accent-35)',
    'from-(--accent-22)',
    'from-(--accent-42)',
    'from-(--accent-16)',
    'from-(--accent-32)',
    'from-(--accent-20)',
]


const TemplateCard = ({
    template,
    index,
}: {
    template: typeof templates[0]
    index:    number
}) => {
    const router = useRouter()
    const ref = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [videoLoaded, setVideoLoaded] = useState(false)
    const [videoError, setVideoError] = useState(false)
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.classList.add('opacity-0', 'translate-y-5')
        const t = setTimeout(() => {
            el.classList.remove('opacity-0', 'translate-y-5')
            el.classList.add('opacity-100', 'translate-y-0')
        }, 80 + index * 70)
        return () => clearTimeout(t)
    }, [index])

    const handleMouseEnter = () => {
        videoRef.current?.play().catch(() => {})
    }
    const handleMouseLeave = () => {
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 }
    }

    const handleUseTemplate = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (template.isPremium) { router.push('/pricing'); return }
        setCreating(true)
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: template.name, style: 'Modern', aspectRatio: '16:9' }),
            })
            if (res.status === 401) { router.push('/auth/signin?callbackUrl=/templates'); return }
            if (!res.ok) throw new Error('Failed')
            const project = await res.json()
            router.push(`/dashboard/projects/${project.id}`)
        } catch {
            setCreating(false)
        }
    }, [template, router])

    return (
        <div
            ref={ref}
            className="group flex flex-col gap-3 cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="relative aspect-3/4 overflow-hidden rounded-xl border border-(--accent-22) transition-[border-color,box-shadow] duration-300 group-hover:border-(--accent-42) group-hover:glow-accent"
            >
                {(videoError || !videoLoaded) && (
                    <div
                        className={`absolute inset-0 bg-linear-to-br ${fallbackAccentClasses[index]} to-(--accent-8)`}
                    />
                )}

                {!videoLoaded && !videoError && (
                    <div className="absolute inset-0 z-2 flex items-center justify-center">
                        <div
                            className="h-7 w-7 animate-spin rounded-full border-2 border-(--accent-22) border-t-(--accent)"
                        />
                    </div>
                )}

                {!videoError && (
                    <video
                        ref={videoRef}
                        src={videoUrl(template.slug)}
                        muted
                        playsInline
                        loop
                        preload="auto"
                        onLoadedData={() => setVideoLoaded(true)}
                        onError={() => setVideoError(true)}
                        className={`absolute inset-0 z-1 h-full w-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                )}

                <div
                    className="absolute inset-0 z-3 bg-black/18 transition-colors duration-300 group-hover:bg-black/28"
                />

                <div
                    className="absolute inset-0 z-4 flex flex-col items-center justify-center gap-2.5 opacity-0 transition-opacity duration-250 group-hover:opacity-100"
                >
                    <button
                        onClick={handleUseTemplate}
                        disabled={creating}
                        className={`flex items-center gap-1.5 rounded-xl border border-strong px-4 py-2 text-small font-bold text-(--surface-overlay) backdrop-blur-[10px] transition-transform active:scale-95 ${
                            template.isPremium ? 'bg-(--accent-fg)' : 'bg-transparent'
                        } ${creating ? 'cursor-wait' : 'cursor-pointer'}`}
                    >
                        {template.isPremium ? <Lock size={18} /> : <Play size={18} strokeWidth={0} className="fill-white" />}
                        {creating ? 'Creating…' : template.isPremium ? 'Unlock PRO' : 'Use Template'}
                    </button>

                    <Link
                        href="/templates"
                        className="text-caption font-semibold text-(--surface-overlay) flex items-center gap-2 transition-opacity"
                        onClick={e => e.stopPropagation()}
                    >
                        See all templates
                        <MoveRight size={18}/>
                    </Link>
                </div>

                {template.isPremium && (
                    <div className="absolute right-3 top-3 z-5">
                        <span
                            className="flex items-center gap-1 rounded-full bg-(--accent-fg) px-2.5 py-1 text-small font-bold uppercase tracking-widest text-(--surface-overlay) backdrop-blur-[6px]"
                        >
                            <Lock size={8} /> PRO
                        </span>
                    </div>
                )}

                {!template.isPremium && (
                    <div className="absolute right-3 top-3 z-5">
                        <span
                            className="rounded-xl border border-white/12 bg-black/45 px-2.5 py-1 text-small text-(--surface-overlay) backdrop-blur-[6px]"
                        >
                            {template.category}
                        </span>
                    </div>
                )}

                <div
                    className="absolute inset-x-0 bottom-0 z-5 h-0.5 line-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
            </div>

            <span
                className="text-caption font-semibold text-secondary transition-colors duration-200 group-hover:text-(--text)"
            >
                {template.name}
            </span>
        </div>
    )
}

const TemplatesSection = () => {
    const headerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = headerRef.current
        if (!el) return
        el.classList.add('opacity-0', 'translate-y-4')
        setTimeout(() => {
            el.classList.remove('opacity-0', 'translate-y-4')
            el.classList.add('opacity-100', 'translate-y-0')
        }, 60)
    }, [])

    return (
        <section className="relative w-full overflow-hidden py-28 surface">

            <SectionGrid />

            <div className="container relative z-10">
                <div ref={headerRef} className="mb-12 flex translate-y-4 flex-col items-start gap-6 opacity-0 transition-all duration-550 ease-out md:flex-row md:items-end md:justify-between">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 mb-8 3xl:mb-12">
                            <div className="w-7 h-px bg-(--accent) " />
                            <span className="text-caption font-bold tracking-[0.14em] uppercase text-(--accent-fg)">
                                Templates
                            </span>
                        </div>
                        <h2 className="font-normal leading-tight">
                            Ready-to-use templates.
                        </h2>
                        <p className="m-0 text-lead text-tertiary">
                            Start creating in seconds — no blank canvas required.
                        </p>
                    </div>

                    <Link href="/templates">
                        <Button
                            variant="secondary"
                            icon={<ArrowRight size={22} strokeWidth={2} />}
                            iconPosition="right"
                        >
                            Browse All
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {templates.map((template, i) => (
                        <TemplateCard key={template.slug} template={template} index={i} />
                    ))}
                </div>

            </div>
        </section>
    )
}

export default TemplatesSection