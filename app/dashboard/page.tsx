'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
    FolderPlus, Upload, FolderOpen,
    ArrowRight, Wand2, Film, Star, Trash2,
    Monitor, Smartphone, Square,
    Clapperboard, Zap, Megaphone, BookOpen,
    Loader2,
} from 'lucide-react'
import DashboardHeader from './components/DashboardHeader'
import DashboardCard, { Project } from './components/DashboardCard'
import StatsCard from './components/StatsCard'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Types

type AspectRatio = '9:16' | '16:9' | '1:1'
type Duration    = '15s'  | '30s'  | '60s'
type Style       = 'Cinematic' | 'Viral' | 'Minimal' | 'Bold'

interface Stats {
    total:   number
    starred: number
    trash:   number
}

// Constants

const STYLES: { label: Style; icon: React.ElementType }[] = [
    { label: 'Cinematic', icon: Film      },
    { label: 'Viral',     icon: Zap       },
    { label: 'Minimal',   icon: Square    },
    { label: 'Bold',      icon: Megaphone },
]

const RATIOS: { label: AspectRatio; icon: React.ElementType; hint: string }[] = [
    { label: '9:16', icon: Smartphone, hint: 'Reels / TikTok' },
    { label: '16:9', icon: Monitor,    hint: 'YouTube / Web'  },
    { label: '1:1',  icon: Square,     hint: 'Feed / Square'  },
]

const DURATIONS: Duration[] = ['15s', '30s', '60s']

const EXAMPLE_PROMPTS = [
    'A cinematic product reveal for a luxury watch brand with slow motion and dramatic lighting',
    'A fast-paced viral reel showing a morning routine with trending transitions',
    'A minimal brand story for a sustainable fashion label, quiet and emotional',
    'An energetic promo for a fitness app launch with bold text and beats',
    'A dreamy travel montage through Tokyo streets at golden hour',
]

// Map dashboard template labels to API-compatible data
const TEMPLATE_CONFIGS: Record<string, { style: string; aspectRatio: string; scenes: { title: string; description: string; musicMood: string; duration: number; order: number }[] }> = {
    'Product Reveal': {
        style: 'Minimal', aspectRatio: '16:9',
        scenes: [
            { title: 'Problem Statement', description: 'Open with the pain point your product solves.',      musicMood: 'Dramatic',  duration: 6,  order: 0 },
            { title: 'Product Reveal',    description: 'Slow reveal of the product with clean background.', musicMood: 'Cinematic', duration: 8,  order: 1 },
            { title: 'Key Features',      description: 'Three quick feature callouts with icons.',          musicMood: 'Uplifting', duration: 10, order: 2 },
            { title: 'Call to Action',    description: 'End with a clear CTA.',                             musicMood: 'Uplifting', duration: 6,  order: 3 },
        ],
    },
    'Viral Reel': {
        style: 'Bold', aspectRatio: '9:16',
        scenes: [
            { title: 'Hook (0-3s)',    description: 'Bold text or surprising visual to stop the scroll.', musicMood: 'Energetic', duration: 3, order: 0 },
            { title: 'Value Delivery', description: 'Quick, punchy content delivery.',                    musicMood: 'Energetic', duration: 8, order: 1 },
            { title: 'Engagement CTA', description: 'End with a question or prompt to drive comments.',   musicMood: 'Uplifting', duration: 4, order: 2 },
        ],
    },
    'Brand Story': {
        style: 'Elegant', aspectRatio: '16:9',
        scenes: [
            { title: 'Brand Manifesto',   description: "Opening statement of your company's mission.",     musicMood: 'Cinematic', duration: 8,  order: 0 },
            { title: 'Team & Culture',    description: 'Authentic team moments that humanize the brand.',  musicMood: 'Uplifting', duration: 10, order: 1 },
            { title: 'Vision Statement',  description: 'Forward-looking close — where you\'re going.',    musicMood: 'Cinematic', duration: 9,  order: 2 },
        ],
    },
    'Tutorial': {
        style: 'Bold', aspectRatio: '16:9',
        scenes: [
            { title: "What You'll Learn", description: 'State the outcome upfront.',                       musicMood: 'Calm',      duration: 4, order: 0 },
            { title: 'Your Intro',        description: 'Brief host introduction to build trust.',          musicMood: 'Uplifting', duration: 3, order: 1 },
            { title: 'Agenda',            description: 'Quick visual breakdown of the steps.',             musicMood: 'Calm',      duration: 3, order: 2 },
        ],
    },
}

const DASHBOARD_TEMPLATES = [
    { label: 'Product Reveal', icon: Clapperboard, desc: 'Clean unboxing or launch',   accent: false },
    { label: 'Viral Reel',     icon: Zap,          desc: 'Hook in 3s, keep watching',  accent: true  },
    { label: 'Brand Story',    icon: BookOpen,     desc: 'Who you are, why you exist',  accent: false },
    { label: 'Tutorial',       icon: Film,         desc: 'Step-by-step demo',           accent: false },
]

// ─── Typewriter ───────────────────────────────────────────────────────────────

function useTypewriter(texts: string[], speed = 36, pause = 2400) {
    const [textIdx,  setTextIdx]  = useState(0)
    const [charIdx,  setCharIdx]  = useState(0)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const current = texts[textIdx]
        let t: ReturnType<typeof setTimeout>
        if (!deleting && charIdx < current.length)       t = setTimeout(() => setCharIdx(i => i + 1), speed)
        else if (!deleting && charIdx === current.length) t = setTimeout(() => setDeleting(true), pause)
        else if (deleting && charIdx > 0)                t = setTimeout(() => setCharIdx(i => i - 1), speed / 2.2)
        else                                             t = setTimeout(() => { setDeleting(false); setTextIdx(i => (i + 1) % texts.length) }, 300)
        return () => clearTimeout(t)
    }, [charIdx, deleting, textIdx, texts, speed, pause])

    return texts[textIdx].slice(0, charIdx)
}

// ─── Pill ─────────────────────────────────────────────────────────────────────

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{
                backgroundColor: active ? 'var(--turquoise-8)'          : 'var(--bg)',
                border:          active ? '1px solid var(--turquoise-42)': '1px solid var(--border-subtle)',
                color:           active ? 'var(--turquoise)'             : 'var(--text-tertiary)',
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text)' } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-subtle)';  e.currentTarget.style.color = 'var(--text-tertiary)' } }}
        >
            {children}
        </button>
    )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div className="rounded-xl overflow-hidden animate-pulse" style={{ border: '1px solid var(--border-default)' }}>
            <div className="aspect-video w-full" style={{ backgroundColor: 'var(--surface-raised)' }} />
            <div className="px-4 py-3 flex flex-col gap-2" style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border-subtle)' }}>
                <div className="h-3 w-3/4 rounded-md" style={{ backgroundColor: 'var(--surface-raised)' }} />
                <div className="h-2.5 w-1/2 rounded-md" style={{ backgroundColor: 'var(--surface-raised)' }} />
            </div>
        </div>
    )
}

function SkeletonStat() {
    return (
        <div className="p-5 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}>
            <div className="h-2.5 w-1/2 rounded-md mb-3" style={{ backgroundColor: 'var(--bg)' }} />
            <div className="h-8 w-1/3 rounded-md"         style={{ backgroundColor: 'var(--bg)' }} />
        </div>
    )
}

// AI Hero

function AIHero() {
    const [prompt,     setPrompt]     = useState('')
    const [style,      setStyle]      = useState<Style>('Cinematic')
    const [ratio,      setRatio]      = useState<AspectRatio>('9:16')
    const [duration,   setDuration]   = useState<Duration>('30s')
    const [generating, setGenerating] = useState(false)
    const [focused,    setFocused]    = useState(false)

    const placeholder = useTypewriter(EXAMPLE_PROMPTS)

    const handleGenerate = () => {
        if (!prompt.trim()) return
        const params = new URLSearchParams({ prompt, style, aspectRatio: ratio, duration })
        window.open(`/generate?${params.toString()}`, '_blank')
    }

    return (
        <div
            className="relative rounded-2xl overflow-hidden"
            style={{
                background: 'linear-gradient(160deg, var(--surface-raised) 0%, var(--bg) 100%)',
                border: `1px solid ${focused ? 'var(--turquoise-42)' : 'var(--border-default)'}`,
                boxShadow: focused ? '0 0 0 3px var(--turquoise-8), 0 16px 48px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.04)',
                transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
            }}
        >
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40"
                style={{ background: 'radial-gradient(ellipse 90% 100% at 50% 0%, var(--turquoise-10) 0%, transparent 100%)' }} />
            <div aria-hidden className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: 'radial-gradient(circle, var(--turquoise-22) 1px, transparent 1px)',
                    backgroundSize: '28px 28px', opacity: 0.35,
                    maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)',
                }} />

            <div className="relative flex flex-col gap-6 px-8 pt-8 pb-7">
                <div className="flex flex-col items-center text-center gap-3">
                    <h1 className="font-bold leading-tight"
                        style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: 'var(--text)', fontFamily: 'var(--font-dm-serif-display), serif', letterSpacing: '-0.01em' }}>
                        What video do you want{' '}
                        <span style={{ color: 'var(--turquoise)', textShadow: '0 0 32px var(--turquoise-42)' }}>to create?</span>
                    </h1>
                    <p className="text-sm max-w-md" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
                        Describe your idea in plain words — AI will generate a ready-to-edit video project in seconds.
                    </p>
                </div>

                <div className="max-w-2xl w-full mx-auto">
                    <div className="relative rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-default)' }}>
                        <textarea
                            value={prompt}
                            onChange={e => setPrompt(e.target.value.slice(0, 500))}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            rows={3}
                            className="w-full resize-none px-5 pt-4 pb-14 text-sm outline-none"
                            style={{ backgroundColor: 'transparent', color: 'var(--text)', lineHeight: '1.7' }}
                            placeholder={placeholder + (focused ? '' : '|')}
                        />
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2.5"
                            style={{ backgroundColor: 'var(--surface-raised)', borderTop: '1px solid var(--border-subtle)' }}>
                            <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                                {prompt.length > 0 ? `${prompt.length} / 500` : 'Be as descriptive as possible for best results'}
                            </span>
                            <button
                                onClick={handleGenerate}
                                disabled={!prompt.trim() || generating}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200"
                                style={{
                                    backgroundColor: prompt.trim() && !generating ? 'var(--turquoise)' : 'var(--surface-raised)',
                                    color:           prompt.trim() && !generating ? '#fff' : 'var(--text-tertiary)',
                                    border:         `1px solid ${prompt.trim() && !generating ? 'transparent' : 'var(--border-default)'}`,
                                    cursor:          prompt.trim() && !generating ? 'pointer' : 'not-allowed',
                                    boxShadow:       prompt.trim() && !generating ? '0 4px 12px var(--turquoise-22)' : 'none',
                                }}
                                onMouseEnter={e => { if (prompt.trim() && !generating) e.currentTarget.style.opacity = '0.88' }}
                                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                            >
                                {generating
                                    ? <><span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />Generating…</>
                                    : <><Wand2 size={12} strokeWidth={2.5} />Generate</>}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    <div className="flex flex-col gap-2 items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Style</span>
                        <div className="flex gap-1.5">
                            {STYLES.map(({ label, icon: Icon }) => (
                                <Pill key={label} active={style === label} onClick={() => setStyle(label)}>
                                    <Icon size={11} strokeWidth={2} />{label}
                                </Pill>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Format</span>
                        <div className="flex gap-1.5">
                            {RATIOS.map(({ label, icon: Icon, hint }) => (
                                <Pill key={label} active={ratio === label} onClick={() => setRatio(label)}>
                                    <Icon size={11} strokeWidth={2} /><span title={hint}>{label}</span>
                                </Pill>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Duration</span>
                        <div className="flex gap-1.5">
                            {DURATIONS.map(d => <Pill key={d} active={duration === d} onClick={() => setDuration(d)}>{d}</Pill>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
    const router = useRouter()

    const [projects,       setProjects]       = useState<Project[]>([])
    const [stats,          setStats]          = useState<Stats | null>(null)
    const [projectsLoading, setProjectsLoading] = useState(true)
    const [statsLoading,   setStatsLoading]   = useState(true)
    const [creatingTemplate, setCreatingTemplate] = useState<string | null>(null)

    // Fetch 4 most recent projects
    useEffect(() => {
        fetch('/api/projects')
            .then(r => r.json())
            .then((data: Array<{ id: string; name: string; updatedAt: string; thumbnail?: string }>) => {
                const recent = data.slice(0, 4).map(p => ({
                    id:         p.id,
                    name:       p.name,
                    lastEdited: formatRelative(p.updatedAt),
                    thumbnail:  p.thumbnail,
                }))
                setProjects(recent)
            })
            .catch(console.error)
            .finally(() => setProjectsLoading(false))
    }, [])

    // Fetch stats — total, starred, trash
    useEffect(() => {
        fetch('/api/projects/stats')
            .then(r => r.json())
            .then(setStats)
            .catch(console.error)
            .finally(() => setStatsLoading(false))
    }, [])

    const handleUseTemplate = useCallback(async (label: string) => {
        const config = TEMPLATE_CONFIGS[label]
        if (!config) return
        setCreatingTemplate(label)
        try {
            const res = await fetch('/api/projects', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ name: label, style: config.style, aspectRatio: config.aspectRatio, scenes: config.scenes }),
            })
            if (res.status === 401) { router.push('/auth/signin?callbackUrl=/dashboard'); return }
            if (!res.ok) throw new Error('Failed')
            const project = await res.json()
            router.push(`/dashboard/projects/${project.id}`)
        } catch (err) {
            console.error(err)
        } finally {
            setCreatingTemplate(null)
        }
    }, [router])

    const handleNewProject = useCallback(async () => {
        try {
            const res = await fetch('/api/projects', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ name: 'Untitled Project', style: 'Modern', aspectRatio: '16:9' }),
            })
            if (!res.ok) throw new Error('Failed')
            const project = await res.json()
            router.push(`/dashboard/projects/${project.id}`)
        } catch (err) {
            console.error(err)
        }
    }, [router])

    return (
        <div className="relative flex flex-col flex-1 min-h-0 overflow-auto">
            <DashboardHeader title="Overview" subtitle="Welcome back" />

            <main className="flex-1 p-8 flex flex-col gap-10">

                {/* 1 ── AI Hero */}
                <AIHero />

                {/* 2 ── Templates */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-px bg-turquoise" />
                            <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-turquoise">
                                Start from a Template
                            </span>
                        </div>
                        <Link
                            href="/templates"
                            className="text-xs font-bold transition-colors duration-150"
                            style={{ textDecoration: 'none', color: 'var(--text-tertiary)' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                        >
                            Browse all →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {DASHBOARD_TEMPLATES.map(({ label, icon: Icon, desc, accent }) => (
                            <button
                                key={label}
                                onClick={() => handleUseTemplate(label)}
                                disabled={creatingTemplate === label}
                                className="flex flex-col items-start gap-3 p-4 rounded-xl text-left transition-all duration-200 group"
                                style={{
                                    backgroundColor: accent ? 'var(--turquoise-8)' : 'var(--surface-raised)',
                                    border: `1px solid ${accent ? 'var(--turquoise-22)' : 'var(--border-default)'}`,
                                    cursor: creatingTemplate === label ? 'wait' : 'pointer',
                                    opacity: creatingTemplate !== null && creatingTemplate !== label ? 0.5 : 1,
                                }}
                                onMouseEnter={e => {
                                    if (!creatingTemplate) {
                                        e.currentTarget.style.borderColor = accent ? 'var(--turquoise-42)' : 'var(--border-strong)'
                                        e.currentTarget.style.transform   = 'translateY(-1px)'
                                        e.currentTarget.style.boxShadow   = accent ? '0 8px 24px var(--turquoise-10)' : '0 8px 24px rgba(0,0,0,0.06)'
                                    }
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = accent ? 'var(--turquoise-22)' : 'var(--border-default)'
                                    e.currentTarget.style.transform   = 'translateY(0)'
                                    e.currentTarget.style.boxShadow   = 'none'
                                }}
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{
                                        backgroundColor: accent ? 'var(--turquoise-16)' : 'var(--bg)',
                                        border: `1px solid ${accent ? 'var(--turquoise-32)' : 'var(--border-default)'}`,
                                        color: accent ? 'var(--turquoise)' : 'var(--text-tertiary)',
                                    }}>
                                    {creatingTemplate === label
                                        ? <Loader2 size={14} className="animate-spin" style={{ color: accent ? 'var(--turquoise)' : 'var(--text-tertiary)' }} />
                                        : <Icon size={15} strokeWidth={1.75} />}
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-bold" style={{ color: accent ? 'var(--turquoise)' : 'var(--text-secondary)' }}>{label}</span>
                                    <span className="text-[11px] font-medium leading-snug" style={{ color: 'var(--text-tertiary)' }}>{desc}</span>
                                </div>
                                <ArrowRight size={12} className="mt-auto self-end opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ color: accent ? 'var(--turquoise)' : 'var(--text-tertiary)' }} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3 ── Recent Projects */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-px bg-turquoise" />
                            <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-turquoise">
                                Recent Projects
                            </span>
                        </div>
                        <Link href="/dashboard/projects" className="text-xs font-bold transition-colors duration-150"
                            style={{ textDecoration: 'none', color: 'var(--text-tertiary)' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>
                            View all →
                        </Link>
                    </div>

                    {projectsLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-14 gap-4 rounded-2xl"
                            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}>
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                style={{ backgroundColor: 'var(--turquoise-8)', border: '1px solid var(--turquoise-22)' }}>
                                <FolderOpen size={22} style={{ color: 'var(--turquoise)' }} />
                            </div>
                            <div className="flex flex-col items-center gap-1 text-center">
                                <span className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>No projects yet</span>
                                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Use a template above or generate with AI to get started</span>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {projects.map(p => <DashboardCard key={p.id} project={p} />)}
                        </div>
                    )}
                </div>

                {/* 4 ── Quick Actions */}
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-5 h-px bg-turquoise" />
                        <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-turquoise">Quick Actions</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { label: 'New Project',    sub: 'Start from scratch', icon: FolderPlus, accent: true,  onClick: handleNewProject },
                            { label: 'All Projects',   sub: 'View your library',  icon: FolderOpen, accent: false, onClick: () => router.push('/dashboard/projects') },
                        ].map(({ label, sub, icon: Icon, accent, onClick }) => (
                            <button
                                key={label}
                                onClick={onClick}
                                className="flex items-center gap-4 px-5 py-4 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none"
                                style={{
                                    backgroundColor: accent ? 'var(--turquoise-8)' : 'var(--surface-raised)',
                                    border: `1px solid ${accent ? 'var(--turquoise-22)' : 'var(--border-default)'}`,
                                    minWidth: 200,
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = accent ? 'var(--turquoise-42)' : 'var(--border-strong)'
                                    e.currentTarget.style.transform   = 'translateY(-1px)'
                                    e.currentTarget.style.boxShadow   = accent ? '0 8px 24px var(--turquoise-10)' : '0 8px 24px rgba(0,0,0,0.06)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = accent ? 'var(--turquoise-22)' : 'var(--border-default)'
                                    e.currentTarget.style.transform   = 'translateY(0)'
                                    e.currentTarget.style.boxShadow   = 'none'
                                }}
                            >
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                    style={{
                                        backgroundColor: accent ? 'var(--turquoise-16)' : 'var(--bg)',
                                        border: `1px solid ${accent ? 'var(--turquoise-32)' : 'var(--border-default)'}`,
                                        color: accent ? 'var(--turquoise)' : 'var(--text-tertiary)',
                                    }}>
                                    <Icon size={16} strokeWidth={1.75} />
                                </div>
                                <div className="flex flex-col items-start gap-0.5">
                                    <span className="text-sm font-bold" style={{ color: accent ? 'var(--turquoise)' : 'var(--text-secondary)' }}>{label}</span>
                                    <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{sub}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 5 ── Stats */}
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-5 h-px bg-turquoise" />
                        <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-turquoise">Your Activity</span>
                    </div>
                    {statsLoading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatsCard label="Total Projects" value={stats?.total   ?? 0} sub="All time"           icon={FolderOpen} accent />
                            <StatsCard label="Starred"        value={stats?.starred ?? 0} sub="Pinned projects"    icon={Star}              />
                            <StatsCard label="In Trash"       value={stats?.trash   ?? 0} sub="Soft deleted"       icon={Trash2}            />
                            <StatsCard label="Storage Used"   value="—"                   sub="Coming soon"        icon={Upload}            />
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelative(dateStr: string): string {
    const diff  = Date.now() - new Date(dateStr).getTime()
    const mins  = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days  = Math.floor(diff / 86400000)
    if (mins  < 1)  return 'Just now'
    if (mins  < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days  === 1) return 'Yesterday'
    if (days  < 7)  return `${days} days ago`
    return new Date(dateStr).toLocaleDateString()
}