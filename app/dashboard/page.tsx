'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
    Wand2, FolderPlus, FolderOpen, Star, Trash2, Upload,
    Monitor, Smartphone, Square, Film, Zap, Megaphone,
    Loader2, ArrowRight, Clock, Check, RefreshCw,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import DashboardHeader from './components/DashboardHeader'
import DashboardCard, { Project } from './components/DashboardCard'
import StatsCard from './components/StatsCard'

// Types

type AspectRatio = '9:16' | '16:9' | '1:1'
type Duration    = '15s'  | '30s'  | '60s'
type Style       = 'Cinematic' | 'Viral' | 'Minimal' | 'Bold'

interface Scene {
    id:          string
    title:       string
    description: string
    musicMood:   string
    duration:    number
    order:       number
    videoUrl?:   string | null
    pexelsId?:   string | null
}

interface GeneratedProject {
    id:     string
    name:   string
    scenes: Scene[]
}

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
    'A cinematic product reveal for a luxury watch brand…',
    'Fast-paced viral reel of a morning routine…',
    'Minimal brand story for a sustainable fashion label…',
    'Energetic promo for a fitness app launch…',
    'Dreamy travel montage through Tokyo at golden hour…',
]

const MOOD_COLORS: Record<string, string> = {
    Uplifting:   '#34d399',
    Dramatic:    '#f87171',
    Calm:        '#60a5fa',
    Energetic:   '#fbbf24',
    Melancholic: '#a78bfa',
    Mysterious:  '#818cf8',
    Cinematic:   '#00FFC8',
    Playful:     '#fb923c',
}

// Typewriter

function useTypewriter(texts: string[], speed = 40, pause = 2600) {
    const [textIdx,  setTextIdx]  = useState(0)
    const [charIdx,  setCharIdx]  = useState(0)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const current = texts[textIdx]
        let t: ReturnType<typeof setTimeout>
        if (!deleting && charIdx < current.length)        t = setTimeout(() => setCharIdx(i => i + 1), speed)
        else if (!deleting && charIdx === current.length) t = setTimeout(() => setDeleting(true), pause)
        else if (deleting && charIdx > 0)                 t = setTimeout(() => setCharIdx(i => i - 1), speed / 2.5)
        else                                              t = setTimeout(() => { setDeleting(false); setTextIdx(i => (i + 1) % texts.length) }, 300)
        return () => clearTimeout(t)
    }, [charIdx, deleting, textIdx, texts, speed, pause])

    return texts[textIdx].slice(0, charIdx)
}

// Pill

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{
                backgroundColor: active ? 'var(--turquoise-8)'            : 'var(--bg)',
                border:          active ? '1px solid var(--turquoise-42)' : '1px solid var(--border-subtle)',
                color:           active ? 'var(--turquoise)'              : 'var(--text-tertiary)',
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text)' } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-subtle)';  e.currentTarget.style.color = 'var(--text-tertiary)' } }}
        >
            {children}
        </button>
    )
}

// Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-5 h-px" style={{ backgroundColor: 'var(--turquoise)' }} />
            <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase" style={{ color: 'var(--turquoise)' }}>
                {children}
            </span>
        </div>
    )
}

// Skeletons ───

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

// Scene Card ──

function SceneCard({ scene, index, selected, onToggle }: {
    scene:    Scene
    index:    number
    selected: boolean
    onToggle: () => void
}) {
    const moodColor  = MOOD_COLORS[scene.musicMood] ?? 'var(--turquoise)'
    const videoRef   = React.useRef<HTMLVideoElement>(null)
    const playingRef = React.useRef(false)

    const handleMouseEnter = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!selected) e.currentTarget.style.borderColor = 'var(--border-strong)'
        const video = videoRef.current
        if (!video) return
        try {
            playingRef.current = true
            await video.play()
        } catch {
            // Interrupted — ignore
        }
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!selected) e.currentTarget.style.borderColor = 'var(--border-default)'
        const video = videoRef.current
        if (!video) return
        playingRef.current = false
        video.pause()
        video.currentTime = 0
    }

    return (
        <button
            onClick={onToggle}
            className="relative flex flex-col rounded-xl overflow-hidden text-left w-full transition-all duration-200 group"
            style={{
                backgroundColor: selected ? 'var(--turquoise-8)'            : 'var(--surface-raised)',
                border:          selected ? '1px solid var(--turquoise-42)' : '1px solid var(--border-default)',
                boxShadow:       selected ? '0 0 0 3px var(--turquoise-8)'  : 'none',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Selection badge */}
            <div
                className="absolute top-2.5 right-2.5 z-10 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                    backgroundColor: selected ? 'var(--turquoise)' : 'rgba(0,0,0,0.5)',
                    border:          selected ? 'none'             : '1px solid rgba(255,255,255,0.3)',
                    backdropFilter:  'blur(4px)',
                }}
            >
                {selected && <Check size={11} strokeWidth={3} color="#020202" />}
            </div>

            {/* Video preview */}
            <div className="relative w-full aspect-video overflow-hidden" style={{ backgroundColor: 'var(--surface-sunken)' }}>
                {scene.videoUrl ? (
                    <>
                        <video
                            ref={videoRef}
                            src={scene.videoUrl}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay with scene info */}
                        <div
                            className="absolute inset-0 flex flex-col justify-end p-3"
                            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}
                        >
                            <div className="flex items-center justify-between">
                                <span
                                    className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md"
                                    style={{ backgroundColor: 'var(--turquoise-22)', color: 'var(--turquoise)' }}
                                >
                                    Scene {index + 1}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] font-medium text-white">
                                    <Clock size={10} />
                                    {scene.duration}s
                                </span>
                            </div>
                        </div>
                        {/* Play hint */}
                        <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                                <Film size={14} color="white" />
                            </div>
                        </div>
                    </>
                ) : (
                    // Fallback when no video found
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg, var(--turquoise-8) 0%, var(--surface-raised) 100%)' }}>
                        <Film size={20} style={{ color: 'var(--turquoise-65)' }} />
                        <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>No preview</span>
                    </div>
                )}
            </div>

            {/* Info footer */}
            <div className="flex flex-col gap-2 p-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <p className="text-xs font-bold leading-snug pr-2" style={{ color: 'var(--text-secondary)' }}>
                    {scene.title}
                </p>
                <div
                    className="flex items-center gap-1.5 w-fit px-2 py-1 rounded-md text-[10px] font-bold"
                    style={{ backgroundColor: `${moodColor}14`, color: moodColor }}
                >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: moodColor }} />
                    {scene.musicMood}
                </div>
            </div>
        </button>
    )
}

// AI Hero

function AIHero({ onProjectCreated }: { onProjectCreated: () => void }) {
    const router = useRouter()

    const [prompt,           setPrompt]           = useState('')
    const [style,            setStyle]            = useState<Style>('Cinematic')
    const [ratio,            setRatio]            = useState<AspectRatio>('9:16')
    const [duration,         setDuration]         = useState<Duration>('30s')
    const [generating,       setGenerating]       = useState(false)
    const [opening,          setOpening]          = useState(false)
    const [focused,          setFocused]          = useState(false)
    const [error,            setError]            = useState('')
    const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null)
    const [selectedScenes,   setSelectedScenes]   = useState<Set<number>>(new Set())

    const scenesRef   = useRef<HTMLDivElement>(null)
    const placeholder = useTypewriter(EXAMPLE_PROMPTS)

    const handleGenerate = async () => {
        const text = prompt.trim()
        if (!text || generating) return

        setGenerating(true)
        setError('')
        setGeneratedProject(null)
        setSelectedScenes(new Set())

        try {
            const res = await fetch('/api/ai/generate', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ prompt: text, style, aspectRatio: ratio, duration }),
            })

            if (res.status === 401) { router.push('/auth/signin?callbackUrl=/dashboard'); return }

            if (!res.ok) {
                const data = await res.json()
                setError(data.error ?? 'Generation failed. Please try again.')
                return
            }

            const project: GeneratedProject = await res.json()
            setGeneratedProject(project)
            setSelectedScenes(new Set())
            setTimeout(() => scenesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100)

        } catch {
            setError('Connection error. Please try again.')
        } finally {
            setGenerating(false)
        }
    }

    const handleOpenEditor = () => {
        if (!generatedProject || selectedScenes.size === 0 || opening) return
        const selectedIds = generatedProject.scenes
            .filter((_, i) => selectedScenes.has(i))
            .map(s => s.id)
            .join(",")
        window.open(`/editor/${generatedProject.id}?scenes=${selectedIds}`, "_blank")
        // Reset AI hero — generation flow is complete
        setPrompt("")
        setGeneratedProject(null)
        setSelectedScenes(new Set())
        setError("")
        onProjectCreated()
    }

    const toggleScene = (i: number) =>
        setSelectedScenes(prev => {
            const next = new Set(prev)
            next.has(i) ? next.delete(i) : next.add(i)
            return next
        })

    const totalDuration = generatedProject
        ? generatedProject.scenes.filter((_, i) => selectedScenes.has(i)).reduce((sum, s) => sum + s.duration, 0)
        : 0

    return (
        <div
            className="relative rounded-2xl overflow-hidden"
            style={{
                background: 'linear-gradient(160deg, var(--surface-raised) 0%, var(--bg) 100%)',
                border:     `1px solid ${focused ? 'var(--turquoise-42)' : 'var(--border-default)'}`,
                boxShadow:  focused ? '0 0 0 3px var(--turquoise-8), 0 16px 48px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.04)',
                transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
            }}
        >
            {/* Background effects */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40"
                style={{ background: 'radial-gradient(ellipse 90% 100% at 50% 0%, var(--turquoise-10) 0%, transparent 100%)' }} />
            <div aria-hidden className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: 'radial-gradient(circle, var(--turquoise-22) 1px, transparent 1px)',
                    backgroundSize:  '28px 28px',
                    opacity:         0.35,
                    maskImage:       'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)',
                }} />

            <div className="relative flex flex-col gap-6 px-8 pt-8 pb-7">

                {/* Heading */}
                <div className="flex flex-col items-center text-center gap-2">
                    <h1
                        className="font-bold leading-tight"
                        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: 'var(--text)', fontFamily: 'var(--font-dm-serif-display), serif', letterSpacing: '-0.01em' }}
                    >
                        What video do you want{' '}
                        <span style={{ color: 'var(--turquoise)', textShadow: '0 0 32px var(--turquoise-42)' }}>
                            to create?
                        </span>
                    </h1>
                    <p className="text-sm max-w-md" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
                        Describe your idea — AI generates a scene breakdown you can pick from and edit.
                    </p>
                </div>

                {/* Textarea */}
                <div className="max-w-2xl w-full mx-auto">
                    <div className="relative rounded-xl overflow-hidden"
                        style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-default)' }}>
                        <textarea
                            value={prompt}
                            onChange={e => { setPrompt(e.target.value.slice(0, 500)); setError('') }}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate() }}
                            rows={3}
                            className="w-full resize-none px-5 pt-4 pb-14 text-sm outline-none"
                            style={{ backgroundColor: 'transparent', color: 'var(--text)', lineHeight: '1.7' }}
                            placeholder={placeholder + '|'}
                        />
                        <div
                            className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2.5"
                            style={{ backgroundColor: 'var(--surface-raised)', borderTop: '1px solid var(--border-subtle)' }}
                        >
                            <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                                {prompt.length > 0 ? `${prompt.length} / 500 · ⌘Enter to generate` : 'Be descriptive for best results'}
                            </span>
                            <button
                                onClick={handleGenerate}
                                disabled={!prompt.trim() || generating}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200"
                                style={{
                                    backgroundColor: prompt.trim() && !generating ? 'var(--turquoise)' : 'var(--surface-raised)',
                                    color:           prompt.trim() && !generating ? '#020202'          : 'var(--text-tertiary)',
                                    border:          `1px solid ${prompt.trim() && !generating ? 'transparent' : 'var(--border-default)'}`,
                                    cursor:          prompt.trim() && !generating ? 'pointer'          : 'not-allowed',
                                    boxShadow:       prompt.trim() && !generating ? '0 4px 12px var(--turquoise-22)' : 'none',
                                }}
                            >
                                {generating
                                    ? <><Loader2 size={12} className="animate-spin" />Generating…</>
                                    : <><Wand2   size={12} strokeWidth={2.5}        />Generate</>}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-xs text-red-400 mt-2 px-1">{error}</p>}
                </div>

                {/* Options */}
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

                {/* Generated Scenes */}
                {generatedProject && (
                    <div ref={scenesRef} className="flex flex-col gap-4 pt-2">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-0.5">
                                <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
                                    {generatedProject.name}
                                </p>
                                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                    {selectedScenes.size === 0
                                    ? 'Click clips to select them for your video'
                                    : `${selectedScenes.size} of ${generatedProject.scenes.length} clips selected · ${totalDuration}s total`}
                                </p>
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={generating}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                                style={{
                                    backgroundColor: 'var(--surface-raised)',
                                    border:          '1px solid var(--border-default)',
                                    color:           'var(--text-tertiary)',
                                    cursor:          generating ? 'wait' : 'pointer',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text)' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
                            >
                                <RefreshCw size={11} />Regenerate
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {generatedProject.scenes.map((scene, i) => (
                                <SceneCard
                                    key={i}
                                    scene={scene}
                                    index={i}
                                    selected={selectedScenes.has(i)}
                                    onToggle={() => toggleScene(i)}
                                />
                            ))}
                        </div>

                        <div className="flex justify-end pt-1">
                            <button
                                onClick={handleOpenEditor}
                                disabled={selectedScenes.size === 0 || opening}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
                                style={{
                                    backgroundColor: selectedScenes.size > 0 ? 'var(--turquoise)' : 'var(--surface-raised)',
                                    color:           selectedScenes.size > 0 ? '#020202'          : 'var(--text-tertiary)',
                                    border:          `1px solid ${selectedScenes.size > 0 ? 'transparent' : 'var(--border-default)'}`,
                                    cursor:          selectedScenes.size > 0 ? 'pointer' : 'not-allowed',
                                    boxShadow:       selectedScenes.size > 0 ? '0 4px 16px var(--turquoise-32)' : 'none',
                                }}
                            >
                                {opening
                                    ? <><Loader2 size={14} className="animate-spin" />Opening…</>
                                    : <>Open in Editor<ArrowRight size={14} strokeWidth={2.5} /></>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Dashboard Page

export default function DashboardPage() {
    const router = useRouter()

    const [projects,        setProjects]        = useState<Project[]>([])
    const [stats,           setStats]           = useState<Stats | null>(null)
    const [projectsLoading, setProjectsLoading] = useState(true)
    const [statsLoading,    setStatsLoading]    = useState(true)
    const [creatingProject, setCreatingProject] = useState(false)

    const fetchProjects = useCallback(() => {
        setProjectsLoading(true)
        fetch('/api/projects')
            .then(r => r.json())
            .then((data: Array<{ id: string; name: string; updatedAt: string; thumbnail?: string }>) => {
                setProjects(data.slice(0, 4).map(p => ({
                    id:         p.id,
                    name:       p.name,
                    lastEdited: formatRelative(p.updatedAt),
                    thumbnail:  p.thumbnail,
                })))
            })
            .catch(console.error)
            .finally(() => setProjectsLoading(false))
    }, [])

    const fetchStats = useCallback(() => {
        fetch('/api/projects/stats')
            .then(r => r.json())
            .then(setStats)
            .catch(console.error)
            .finally(() => setStatsLoading(false))
    }, [])

    useEffect(() => { fetchProjects() }, [fetchProjects])
    useEffect(() => { fetchStats() },    [fetchStats])

    const handleProjectCreated = useCallback(() => {
        fetchProjects()
        fetchStats()
    }, [fetchProjects, fetchStats])

    const handleNewProject = useCallback(async () => {
        if (creatingProject) return
        setCreatingProject(true)
        try {
            const res = await fetch('/api/projects', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ name: 'Untitled Project', style: 'Modern', aspectRatio: '16:9' }),
            })
            if (res.status === 401) { router.push('/auth/signin?callbackUrl=/dashboard'); return }
            if (!res.ok) throw new Error('Failed')
            const project = await res.json()
            window.open(`/editor/${project.id}`, '_blank')
            handleProjectCreated()
        } catch (err) {
            console.error(err)
        } finally {
            setCreatingProject(false)
        }
    }, [creatingProject, router, handleProjectCreated])

    return (
        <div className="relative flex flex-col flex-1 min-h-0 overflow-auto">

            {/* Header — untouched, uses real user data from UserContext */}
            <DashboardHeader title="Overview" subtitle="Welcome back" />

            <main className="flex-1 px-8 py-8 flex flex-col gap-10">

                {/* 1 ── AI Hero */}
                <AIHero onProjectCreated={handleProjectCreated} />

                {/* 2 ── Recent Projects */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <SectionLabel>Recent Projects</SectionLabel>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router.push('/dashboard/projects')}
                                className="text-xs font-semibold transition-colors duration-150"
                                style={{ color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                            >
                                View all →
                            </button>
                            <button
                                onClick={handleNewProject}
                                disabled={creatingProject}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
                                style={{
                                    backgroundColor: 'var(--turquoise)',
                                    color:           '#020202',
                                    border:          'none',
                                    cursor:          creatingProject ? 'wait' : 'pointer',
                                    boxShadow:       '0 2px 8px var(--turquoise-22)',
                                    opacity:         creatingProject ? 0.7 : 1,
                                }}
                                onMouseEnter={e => { if (!creatingProject) e.currentTarget.style.opacity = '0.88' }}
                                onMouseLeave={e => { e.currentTarget.style.opacity = creatingProject ? '0.7' : '1' }}
                            >
                                {creatingProject
                                    ? <><Loader2 size={11} className="animate-spin" />Creating…</>
                                    : <><FolderPlus size={11} strokeWidth={2.5}     />New Project</>}
                            </button>
                        </div>
                    </div>

                    {projectsLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : projects.length === 0 ? (
                        <div
                            className="flex flex-col items-center justify-center py-14 gap-4 rounded-2xl"
                            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
                        >
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                style={{ backgroundColor: 'var(--turquoise-8)', border: '1px solid var(--turquoise-22)' }}>
                                <FolderOpen size={22} style={{ color: 'var(--turquoise)' }} />
                            </div>
                            <div className="flex flex-col items-center gap-1 text-center">
                                <span className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>No projects yet</span>
                                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Generate with AI above or start a new blank project</span>
                            </div>
                            <button
                                onClick={handleNewProject}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200"
                                style={{ backgroundColor: 'var(--turquoise)', color: '#020202', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px var(--turquoise-22)' }}
                            >
                                <FolderPlus size={13} strokeWidth={2.5} />Start a project
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {projects.map(p => <DashboardCard key={p.id} project={p} />)}
                        </div>
                    )}
                </div>

                {/* 3 ── Stats */}
                <div>
                    <div className="mb-5">
                        <SectionLabel>Your Activity</SectionLabel>
                    </div>
                    {statsLoading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatsCard label="Total Projects" value={stats?.total   ?? 0} sub="All time"        icon={FolderOpen} accent />
                            <StatsCard label="Starred"        value={stats?.starred ?? 0} sub="Pinned projects" icon={Star}              />
                            <StatsCard label="In Trash"       value={stats?.trash   ?? 0} sub="Soft deleted"    icon={Trash2}            />
                            <StatsCard label="Storage Used"   value="—"                   sub="Coming soon"     icon={Upload}            />
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}

// Helpers

function formatRelative(dateStr: string): string {
    const diff  = Date.now() - new Date(dateStr).getTime()
    const mins  = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days  = Math.floor(diff / 86400000)
    if (mins  < 1)   return 'Just now'
    if (mins  < 60)  return `${mins}m ago`
    if (hours < 24)  return `${hours}h ago`
    if (days  === 1) return 'Yesterday'
    if (days  < 7)   return `${days} days ago`
    return new Date(dateStr).toLocaleDateString()
}