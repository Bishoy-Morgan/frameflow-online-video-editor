'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Play, ArrowRight, Lock } from 'lucide-react'
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
    { name: 'Vlog Intro',       category: 'YouTube',   slug: 'vlog-intro',       isPremium: false },
    { name: 'Product Showcase', category: 'Business',  slug: 'product-showcase', isPremium: false },
    { name: 'Tutorial',         category: 'Education', slug: 'tutorial-opener',  isPremium: true  },
    { name: 'Music Video',      category: 'Creative',  slug: 'music-video',      isPremium: false },
    { name: 'Social Ad',        category: 'Marketing', slug: 'social-ad',        isPremium: false },
    { name: 'Testimonial',      category: 'Business',  slug: 'testimonial',      isPremium: true  },
]

// ─── Individual card ──────────────────────────────────────────────────────────

const TemplateCard = ({
    template,
    index,
}: {
    template: typeof templates[0]
    index:    number
}) => {
    const router                        = useRouter()
    const ref                           = useRef<HTMLDivElement>(null)
    const videoRef                      = useRef<HTMLVideoElement>(null)
    const [isHovered,   setIsHovered]   = useState(false)
    const [videoLoaded, setVideoLoaded] = useState(false)
    const [videoError,  setVideoError]  = useState(false)
    const [creating,    setCreating]    = useState(false)

    // Staggered entrance
    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.style.opacity   = '0'
        el.style.transform = 'translateY(20px)'
        const t = setTimeout(() => {
            el.style.transition = 'opacity 0.55s ease, transform 0.55s ease'
            el.style.opacity    = '1'
            el.style.transform  = 'translateY(0)'
        }, 80 + index * 70)
        return () => clearTimeout(t)
    }, [index])

    const handleMouseEnter = () => {
        setIsHovered(true)
        videoRef.current?.play().catch(() => {})
    }
    const handleMouseLeave = () => {
        setIsHovered(false)
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 }
    }

    const handleUseTemplate = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (template.isPremium) { router.push('/pricing'); return }
        setCreating(true)
        try {
            const res = await fetch('/api/projects', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ name: template.name, style: 'Modern', aspectRatio: '16:9' }),
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
            {/* Card */}
            <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                    aspectRatio: '9 / 16',
                    backgroundColor: '#0a0a0a',
                    border: `1px solid ${isHovered ? 'var(--turquoise-42)' : 'var(--turquoise-22)'}`,
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    boxShadow: isHovered ? '0 0 24px var(--turquoise-16), 0 20px 40px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.25)',
                }}
            >
                {/* Gradient fallback */}
                {(videoError || !videoLoaded) && (
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(160deg, var(--turquoise-${[35, 22, 42, 16, 32, 20][index]}) 0%, var(--turquoise-8) 100%)`,
                        }}
                    />
                )}

                {/* Spinner while loading */}
                {!videoLoaded && !videoError && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
                        <div
                            className="w-7 h-7 rounded-full border-2 animate-spin"
                            style={{ borderColor: 'rgba(255,255,255,0.12)', borderTopColor: 'rgba(255,255,255,0.6)' }}
                        />
                    </div>
                )}

                {/* Video */}
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
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                        style={{ opacity: videoLoaded ? 1 : 0, zIndex: 1 }}
                    />
                )}

                {/* Dark overlay */}
                <div
                    className="absolute inset-0 transition-colors duration-300"
                    style={{
                        backgroundColor: isHovered ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.18)',
                        zIndex: 3,
                    }}
                />

                {/* Hover actions */}
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 transition-opacity duration-250"
                    style={{ opacity: isHovered ? 1 : 0, zIndex: 4 }}
                >
                    {/* Use template button */}
                    <button
                        onClick={handleUseTemplate}
                        disabled={creating}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-transform active:scale-95"
                        style={{
                            backgroundColor: template.isPremium ? 'rgba(236,72,153,0.85)' : 'rgba(255,255,255,0.18)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.25)',
                            cursor: creating ? 'wait' : 'pointer',
                        }}
                    >
                        {template.isPremium ? <Lock size={11} /> : <Play size={11} strokeWidth={0} className="fill-white" />}
                        {creating ? 'Creating…' : template.isPremium ? 'Unlock PRO' : 'Use Template'}
                    </button>

                    {/* Browse link */}
                    <Link
                        href="/templates"
                        className="text-[10px] font-semibold transition-opacity"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        See all templates →
                    </Link>
                </div>

                {/* PRO badge */}
                {template.isPremium && (
                    <div className="absolute top-3 right-3" style={{ zIndex: 5 }}>
                        <span
                            className="flex items-center gap-1 text-[0.58rem] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: 'rgba(236,72,153,0.85)', backdropFilter: 'blur(6px)', color: '#fff' }}
                        >
                            <Lock size={8} /> PRO
                        </span>
                    </div>
                )}

                {/* Category badge */}
                {!template.isPremium && (
                    <div className="absolute top-3 right-3" style={{ zIndex: 5 }}>
                        <span
                            className="text-[0.58rem] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                            style={{
                                backgroundColor: 'rgba(2,2,2,0.45)',
                                backdropFilter: 'blur(6px)',
                                color: '#fefefe',
                                border: '1px solid rgba(255,255,255,0.12)',
                            }}
                        >
                            {template.category}
                        </span>
                    </div>
                )}

                {/* Bottom turquoise accent line */}
                <div
                    className="absolute bottom-0 inset-x-0 h-0.5 transition-opacity duration-300"
                    style={{
                        opacity: isHovered ? 1 : 0,
                        backgroundColor: 'var(--turquoise)',
                        boxShadow: '0 0 8px var(--turquoise)',
                        zIndex: 5,
                    }}
                />
            </div>

            {/* Name */}
            <span
                className="text-sm font-semibold transition-colors duration-200"
                style={{ color: isHovered ? 'var(--text)' : 'var(--text-secondary)' }}
            >
                {template.name}
            </span>
        </div>
    )
}

// ─── Section ──────────────────────────────────────────────────────────────────

const TemplatesSection = () => {
    const headerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = headerRef.current
        if (!el) return
        el.style.opacity   = '0'
        el.style.transform = 'translateY(14px)'
        setTimeout(() => {
            el.style.transition = 'opacity 0.55s ease, transform 0.55s ease'
            el.style.opacity    = '1'
            el.style.transform  = 'translateY(0)'
        }, 60)
    }, [])

    return (
        <section className="relative w-full overflow-hidden py-28 surface">

            <SectionGrid />

            {/* Glow — bottom left */}
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-[15%] -left-[5%] w-120 h-120 rounded-full"
                style={{ background: 'radial-gradient(circle, var(--turquoise-8) 0%, transparent 70%)', filter: 'blur(72px)' }}
            />

            <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

            <div className="container relative z-10">

                {/* Header */}
                <div ref={headerRef} className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-px bg-turquoise" />
                            <span className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-turquoise">
                                Templates
                            </span>
                        </div>
                        <h2 className="font-normal m-0" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}>
                            Ready-to-use templates.
                        </h2>
                        <p className="m-0 text-sm text-tertiary">
                            Start creating in seconds — no blank canvas required.
                        </p>
                    </div>

                    <Link href="/templates">
                        <Button
                            variant="secondary"
                            icon={<ArrowRight size={14} strokeWidth={2} />}
                            iconPosition="right"
                        >
                            Browse All
                        </Button>
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {templates.map((template, i) => (
                        <TemplateCard key={template.slug} template={template} index={i} />
                    ))}
                </div>

            </div>
        </section>
    )
}

export default TemplatesSection