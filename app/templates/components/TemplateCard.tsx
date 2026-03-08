'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
    Clock, Monitor, Smartphone, Square,
    Wand2, Loader2, Lock, X, Music2,
    Clapperboard, Film, ArrowRight, Play,
} from 'lucide-react'
import { Template } from './TemplatesData'

// Mood colors

const moodColors: Record<string, { bg: string; text: string; border: string }> = {
    Uplifting:   { bg: 'rgba(251,191,36,0.08)',  text: '#fbbf24', border: 'rgba(251,191,36,0.22)' },
    Dramatic:    { bg: 'rgba(239,68,68,0.08)',   text: '#ef4444', border: 'rgba(239,68,68,0.22)'  },
    Calm:        { bg: 'rgba(99,102,241,0.08)',  text: '#818cf8', border: 'rgba(99,102,241,0.22)' },
    Energetic:   { bg: 'rgba(249,115,22,0.08)',  text: '#fb923c', border: 'rgba(249,115,22,0.22)' },
    Melancholic: { bg: 'rgba(148,163,184,0.08)', text: '#94a3b8', border: 'rgba(148,163,184,0.22)'},
    Cinematic:   { bg: 'var(--turquoise-8)',      text: 'var(--turquoise)', border: 'var(--turquoise-22)' },
    Playful:     { bg: 'rgba(52,211,153,0.08)',  text: '#34d399', border: 'rgba(52,211,153,0.22)' },
}
const defaultMood = { bg: 'var(--surface-raised)', text: 'var(--text-tertiary)', border: 'var(--border-subtle)' }

// Preview Modal

function PreviewModal({ template, onClose, onUse, loading }: {
    template: Template
    onClose:  () => void
    onUse:    () => void
    loading:  boolean
}) {
    const videoRef                      = useRef<HTMLVideoElement>(null)
    const [currentClip, setCurrentClip] = useState(0)
    const [progress,    setProgress]    = useState(0)

    // Close on Escape, lock scroll
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handler)
        document.body.style.overflow = 'hidden'
        return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
    }, [onClose])

    // Advance to next clip when current ends
    const handleVideoEnded = useCallback(() => {
        setCurrentClip(c => (c + 1) % template.previewVideos.length)
        setProgress(0)
    }, [template.previewVideos.length])

    // Track progress bar
    const handleTimeUpdate = useCallback(() => {
        const v = videoRef.current
        if (!v || !v.duration) return
        setProgress((v.currentTime / v.duration) * 100)
    }, [])

    const totalDuration = template.scenes.reduce((s, sc) => s + sc.duration, 0)

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
        >
            <div
                className="relative flex flex-col w-full max-w-2xl max-h-[92vh] rounded-2xl overflow-hidden"
                style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-default)', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}
                onClick={e => e.stopPropagation()}
            >
                {/* ── Video player ── */}
                <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
                    <video
                        ref={videoRef}
                        key={currentClip}
                        src={template.previewVideos[currentClip]}
                        autoPlay
                        muted
                        playsInline
                        onEnded={handleVideoEnded}
                        onTimeUpdate={handleTimeUpdate}
                        className="w-full h-full object-cover"
                    />

                    {/* Gradient overlay at bottom */}
                    <div
                        className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
                    />

                    {/* Clip dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                        {template.previewVideos.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setCurrentClip(i); setProgress(0) }}
                                className="transition-all duration-200"
                                style={{
                                    width:           i === currentClip ? '20px' : '6px',
                                    height:          '6px',
                                    borderRadius:    '3px',
                                    backgroundColor: i === currentClip ? 'var(--turquoise)' : 'rgba(255,255,255,0.4)',
                                    border:          'none',
                                    cursor:          'pointer',
                                    padding:         0,
                                }}
                            />
                        ))}
                    </div>

                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                        <div
                            className="h-full transition-all duration-100"
                            style={{ width: `${progress}%`, backgroundColor: 'var(--turquoise)' }}
                        />
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer' }}
                    >
                        <X size={14} strokeWidth={2} />
                    </button>

                    {/* Template name over video */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                        <div
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
                            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
                        >
                            {template.name}
                        </div>
                        {template.isPremium && (
                            <div
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
                                style={{ backgroundColor: 'rgba(236,72,153,0.8)', backdropFilter: 'blur(4px)', color: '#fff' }}
                            >
                                <Lock size={10} /> PRO
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Info + scenes ── */}
                <div className="flex flex-col gap-4 p-5 overflow-y-auto flex-1">

                    {/* Meta row */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3 flex-wrap">
                            {[
                                { icon: <Clapperboard size={11} />, label: `${template.scenes.length} scenes`  },
                                { icon: <Clock        size={11} />, label: `${totalDuration}s total`           },
                                { icon: <Film         size={11} />, label: template.aspectRatio                },
                                { icon: null,                       label: template.style                      },
                            ].map(({ icon, label }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                                    style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)' }}
                                >
                                    {icon} {label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs leading-relaxed m-0" style={{ color: 'var(--text-tertiary)' }}>
                        {template.description}
                    </p>

                    {/* Scene breakdown */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-4 h-px" style={{ backgroundColor: 'var(--turquoise)' }} />
                            <span className="text-[0.62rem] font-bold tracking-[0.12em] uppercase" style={{ color: 'var(--turquoise)' }}>
                                Scene Breakdown
                            </span>
                        </div>

                        {template.scenes.map((scene, i) => {
                            const mood = moodColors[scene.musicMood] ?? defaultMood
                            return (
                                <div
                                    key={i}
                                    className="flex gap-3 p-3 rounded-xl"
                                    style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
                                >
                                    <div
                                        className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold"
                                        style={{ backgroundColor: 'var(--turquoise-8)', border: '1px solid var(--turquoise-22)', color: 'var(--turquoise)' }}
                                    >
                                        {i + 1}
                                    </div>
                                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-bold m-0 truncate" style={{ color: 'var(--text)' }}>{scene.title}</p>
                                            <span className="shrink-0 text-[10px] font-semibold flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                                                <Clock size={9} />{scene.duration}s
                                            </span>
                                        </div>
                                        <p className="text-[11px] leading-relaxed m-0" style={{ color: 'var(--text-tertiary)' }}>{scene.description}</p>
                                        <div
                                            className="flex items-center gap-1 w-fit px-1.5 py-0.5 rounded-md text-[10px] font-semibold mt-0.5"
                                            style={{ backgroundColor: mood.bg, border: `1px solid ${mood.border}`, color: mood.text }}
                                        >
                                            <Music2 size={9} strokeWidth={2.5} />{scene.musicMood}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ── Footer CTA ── */}
                <div
                    className="flex items-center justify-between gap-4 px-5 py-4"
                    style={{ borderTop: '1px solid var(--border-subtle)' }}
                >
                    <p className="text-xs m-0" style={{ color: 'var(--text-tertiary)' }}>
                        {template.isPremium ? 'Upgrade to PRO to use this template.' : 'Creates a project with all scenes ready to edit.'}
                    </p>
                    <button
                        onClick={onUse}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-opacity shrink-0"
                        style={{
                            backgroundColor: template.isPremium ? 'rgb(236,72,153)' : 'var(--turquoise)',
                            color:           '#fff',
                            border:          'none',
                            cursor:          loading ? 'wait' : 'pointer',
                            boxShadow:       template.isPremium ? '0 4px 14px rgba(236,72,153,0.3)' : '0 4px 14px var(--turquoise-22)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1'    }}
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : template.isPremium ? <Lock size={14} /> : <ArrowRight size={14} strokeWidth={2.5} />}
                        {template.isPremium ? 'Upgrade to PRO' : loading ? 'Creating…' : 'Use This Template'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// Card

export default function TemplateCard({ template }: { template: Template }) {
    const router                         = useRouter()
    const videoRef                       = useRef<HTMLVideoElement>(null)
    const [loading,     setLoading]      = useState(false)
    const [error,       setError]        = useState('')
    const [showPreview, setShowPreview]  = useState(false)
    const [videoLoaded, setVideoLoaded]  = useState(false)
    const [videoError,  setVideoError]   = useState(false)
    const [isHovered,   setIsHovered]    = useState(false)

    const getAspectRatioIcon = (ratio: string) => {
        switch (ratio) {
            case '16:9': return <Monitor size={10} />
            case '9:16': return <Smartphone size={10} />
            default:     return <Square size={10} />
        }
    }

    const handleMouseEnter = () => {
        setIsHovered(true)
        if (videoRef.current) { videoRef.current.play().catch(() => {}) }
    }
    const handleMouseLeave = () => {
        setIsHovered(false)
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 }
    }

    const handleUseTemplate = useCallback(async () => {
        if (template.isPremium) { router.push('/pricing'); return }
        setLoading(true); setError('')
        try {
            const res = await fetch('/api/projects', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ name: template.name, style: template.style, aspectRatio: template.aspectRatio, scenes: template.scenes }),
            })
            if (res.status === 401) { router.push('/auth/signin?callbackUrl=/templates'); return }
            if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? 'Failed') }
            const project = await res.json()
            router.push(`/dashboard/projects/${project.id}`)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
            setLoading(false)
        }
    }, [template, router])

    return (
        <>
            {showPreview && (
                <PreviewModal
                    template={template}
                    onClose={() => setShowPreview(false)}
                    onUse={() => { setShowPreview(false); handleUseTemplate() }}
                    loading={loading}
                />
            )}

            <div
                className="group cursor-pointer flex flex-col gap-3"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Thumbnail */}
                <div
                    className="rounded-2xl relative overflow-hidden bg-black"
                    style={{ aspectRatio: '16/9' }}
                >
                    {/* Video — loads immediately, plays on hover */}
                    {!videoError && (
                        <video
                            ref={videoRef}
                            src={template.previewVideos[0]}
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

                    {/* Gradient fallback — shows if video errors or hasn't loaded */}
                    {(videoError || !videoLoaded) && (
                        <div className={`absolute inset-0 bg-linear-to-br ${template.thumbnail}`} />
                    )}

                    {/* Loading spinner — shows while video fetching */}
                    {!videoLoaded && !videoError && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
                            <div
                                className="w-8 h-8 rounded-full border-2 animate-spin"
                                style={{
                                    borderColor:      'rgba(255,255,255,0.15)',
                                    borderTopColor:   'rgba(255,255,255,0.8)',
                                }}
                            />
                        </div>
                    )}

                    {/* Dark overlay — above video */}
                    <div
                        className="absolute inset-0 transition-colors duration-300"
                        style={{
                            backgroundColor: isHovered ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.15)',
                            zIndex: 2,
                        }}
                    />

                    {/* Hover CTAs */}
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-200"
                        style={{ opacity: isHovered ? 1 : 0, zIndex: 3 }}
                    >
                        <button
                            onClick={e => { e.stopPropagation(); handleUseTemplate() }}
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white active:scale-95 focus:outline-none"
                            style={{ backgroundColor: template.isPremium ? 'rgba(236,72,153,0.9)' : 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}
                        >
                            {loading ? <Loader2 size={13} className="animate-spin" /> : template.isPremium ? <Lock size={13} /> : <Wand2 size={13} />}
                            {template.isPremium ? 'Unlock PRO' : loading ? 'Creating…' : 'Use Template'}
                        </button>
                        <button
                            onClick={e => { e.stopPropagation(); setShowPreview(true) }}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white/90 focus:outline-none"
                            style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}
                        >
                            <Play size={10} strokeWidth={0} className="fill-white/90" /> Preview scenes
                        </button>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3" style={{ zIndex: 4 }}>
                        <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-semibold">{template.category}</span>
                    </div>
                    {template.isPremium && (
                        <div className="absolute top-3 right-3" style={{ zIndex: 4 }}>
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500 text-white text-xs font-bold"><Lock size={9} /> PRO</span>
                        </div>
                    )}

                    {/* Bottom meta */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between" style={{ zIndex: 4 }}>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs">
                            <Clock size={10} /><span>{template.duration}s</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs">
                            {getAspectRatioIcon(template.aspectRatio)}<span>{template.aspectRatio}</span>
                        </div>
                    </div>
                    <div className="absolute bottom-10 right-3" style={{ zIndex: 4 }}>
                        <div className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold">{template.scenes.length} scenes</div>
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-0.5 px-0.5">
                    <div className="flex items-center justify-between gap-2">
                        <h5 className="font-bold text-sm truncate m-0" style={{ color: 'var(--text)' }}>{template.name}</h5>
                        {template.isPremium && <Lock size={11} className="shrink-0" style={{ color: 'rgb(236,72,153)' }} />}
                    </div>
                    <p className="text-xs leading-snug m-0" style={{ color: 'var(--text-tertiary)' }}>{template.description}</p>
                </div>

                {error && <p className="text-xs font-semibold px-0.5 m-0" style={{ color: '#ef4444' }}>{error}</p>}
            </div>
        </>
    )
}