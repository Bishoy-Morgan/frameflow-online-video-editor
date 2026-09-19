'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
    Wand2, FolderPlus, FolderOpen, Monitor, Smartphone, Square,
    Film, Zap, Megaphone, Loader2, ArrowRight, Clock, Check, RefreshCw,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import DashboardCard, { Project } from './components/DashboardCard'
import { getMoodColor } from '@/lib/constants/moods'
import Button from '@/components/ui/Button'

type AspectRatio = '16:9' | '9:16' | '1:1'
type Duration = '15s' | '30s' | '60s'
type Style = 'Cinematic' | 'Viral' | 'Minimal' | 'Bold'

interface Scene {
    id: string
    title: string
    description: string
    musicMood: string
    duration: number
    order: number
    videoUrl?: string | null
    pexelsId?: string | null
}

interface GeneratedProject {
    id: string
    name: string
    scenes: Scene[]
}

const STYLES: { label: Style; icon: React.ElementType }[] = [
    { label: 'Cinematic', icon: Film },
    { label: 'Viral', icon: Zap },
    { label: 'Minimal', icon: Square },
    { label: 'Bold', icon: Megaphone },
]

const RATIOS: { label: AspectRatio; icon: React.ElementType; hint: string }[] = [
    { label: '16:9', icon: Monitor, hint: 'YouTube / Web' },
    { label: '9:16', icon: Smartphone, hint: 'Reels / TikTok' },
    { label: '1:1', icon: Square, hint: 'Feed / Square' },
]

const DURATIONS: Duration[] = ['15s', '30s', '60s']

const EXAMPLE_PROMPTS = [
    'A cinematic product reveal for a luxury watch brand…',
    'Fast-paced viral reel of a morning routine…',
    'Minimal brand story for a sustainable fashion label…',
    'Energetic promo for a fitness app launch…',
    'Dreamy travel montage through Tokyo at golden hour…',
]

function useTypewriter(texts: string[], speed = 40, pause = 2600) {
    const [textIdx, setTextIdx] = useState(0)
    const [charIdx, setCharIdx] = useState(0)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const current = texts[textIdx]
        let t: ReturnType<typeof setTimeout>
        if (!deleting && charIdx < current.length) t = setTimeout(() => setCharIdx(i => i + 1), speed)
        else if (!deleting && charIdx === current.length) t = setTimeout(() => setDeleting(true), pause)
        else if (deleting && charIdx > 0) t = setTimeout(() => setCharIdx(i => i - 1), speed / 2.5)
        else t = setTimeout(() => { setDeleting(false); setTextIdx(i => (i + 1) % texts.length) }, 300)
        return () => clearTimeout(t)
    }, [charIdx, deleting, textIdx, texts, speed, pause])

    return texts[textIdx].slice(0, charIdx)
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-caption font-semibold transition-all duration-150 border cursor-pointer ${
                active
                    ? 'bg-(--accent-8) border-(--accent-42) text-(--accent)'
                    : 'bg-(--surface-overlay) border-(--border-default) text-(--text-tertiary) hover:border-(--border-strong) hover:text-(--text)'
            }`}
        >
            {children}
        </button>
    )
}

function SkeletonCard() {
    return (
        <div className="rounded-xl overflow-hidden animate-pulse border border-(--border-default)">
            <div className="aspect-video w-full bg-(--surface-sunken)" />
            <div className="px-4 py-3 flex flex-col gap-2 bg-(--surface-overlay) border-t border-(--border-subtle)">
                <div className="h-3 w-3/4 rounded-xl bg-(--surface-sunken)" />
                <div className="h-2.5 w-1/2 rounded-xl bg-(--surface-sunken)" />
            </div>
        </div>
    )
}

function SceneCard({ scene, index, selected, onToggle }: {
    scene: Scene
    index: number
    selected: boolean
    onToggle: () => void
}) {
    const mood = getMoodColor(scene.musicMood)
    const videoRef = React.useRef<HTMLVideoElement>(null)

    const handleMouseEnter = () => {
        videoRef.current?.play().catch(() => {})
    }

    const handleMouseLeave = () => {
        const v = videoRef.current
        if (!v) return
        v.pause()
        v.currentTime = 0
    }

    return (
        <button
            onClick={onToggle}
            className={`group relative flex flex-col rounded-2xl overflow-hidden text-left w-full transition-all duration-300 ${
                selected ? 'ring-2 ring-(--accent) scale-[0.98]' : 'ring-1 ring-(--border-default) hover:ring-(--accent-42)'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative w-full aspect-video overflow-hidden bg-(--surface-sunken)">
                {scene.videoUrl ? (
                    <video
                        ref={videoRef}
                        src={scene.videoUrl}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-(--accent-8) to-(--surface-sunken)">
                        <Film size={22} className="text-(--accent-65)" />
                    </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />

                <div className={`absolute top-3 left-3 flex items-center justify-center w-7 h-7 rounded-full text-tiny font-black backdrop-blur-md transition-all duration-300 ${
                    selected ? 'bg-(--accent) text-[#020202]' : 'bg-white/15 text-white border border-white/25'
                }`}>
                    {selected ? <Check size={13} strokeWidth={3} /> : index + 1}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-tiny font-bold text-white bg-black/40 backdrop-blur-md">
                    <Clock size={9} />
                    {scene.duration}s
                </div>

                <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-1.5">
                    <p className="text-caption font-bold leading-snug text-white line-clamp-1">
                        {scene.title}
                    </p>
                    <div className="flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-full text-tiny font-bold backdrop-blur-md bg-white/15" style={{ color: mood.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: mood.text }} />
                        {scene.musicMood}
                    </div>
                </div>
            </div>
        </button>
    )
}

function AIHero({ onProjectCreated }: { onProjectCreated: () => void }) {
    const router = useRouter()

    const [prompt, setPrompt] = useState('')
    const [style, setStyle] = useState<Style>('Cinematic')
    const [ratio, setRatio] = useState<AspectRatio>('16:9')
    const [duration, setDuration] = useState<Duration>('30s')
    const [generating, setGenerating] = useState(false)
    const [focused, setFocused] = useState(false)
    const [error, setError] = useState('')
    const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null)
    const [selectedScenes, setSelectedScenes] = useState<Set<number>>(new Set())

    const scenesRef = useRef<HTMLDivElement>(null)
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
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text, style, aspectRatio: ratio, duration }),
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
        if (!generatedProject || selectedScenes.size === 0) return
        const selectedIds = generatedProject.scenes
            .filter((_, i) => selectedScenes.has(i))
            .map(s => s.id)
            .join(",")
        router.push(`/editor/${generatedProject.id}?scenes=${selectedIds}`)
        setPrompt("")
        setGeneratedProject(null)
        setSelectedScenes(new Set())
        setError("")
        onProjectCreated()
    }

    const toggleScene = (i: number) =>
        setSelectedScenes(prev => {
            const next = new Set(prev)
            if (next.has(i)) next.delete(i)
            else next.add(i)
            return next
        })

    const totalDuration = generatedProject
        ? generatedProject.scenes.filter((_, i) => selectedScenes.has(i)).reduce((sum, s) => sum + s.duration, 0)
        : 0

    return (
        <div className="relative">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40"
                style={{ background: 'radial-gradient(ellipse 90% 100% at 50% 0%, var(--accent-10) 0%, transparent 100%)' }} />
            <div aria-hidden className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: 'radial-gradient(circle, var(--accent-22) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    opacity: 0.35,
                    maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)',
                }} />

            <div className="relative flex flex-col gap-6 px-8 pt-28 pb-7">

                <div className="flex flex-col items-center text-center gap-2">
                    <h1 className="text-(--text)">
                        What video do you want<br />
                        <span className="text-(--accent)">
                            to create?
                        </span>
                    </h1>
                    <p className="text-lead leading-7 max-w-md text-(--text-tertiary)">
                        Describe your idea — AI generates a scene breakdown you can pick from and edit.
                    </p>
                </div>

                <div className="max-w-2xl w-full mx-auto">
                    <div className={`relative rounded-xl overflow-hidden bg-(--surface-overlay) border transition-all duration-200 ${
                        focused ? 'border-(--accent) shadow-accent-40' : 'shadow-accent-22 border-(--accent-10)'
                    }`}>
                        <textarea
                            value={prompt}
                            onChange={e => { setPrompt(e.target.value.slice(0, 500)); setError('') }}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate() }}
                            rows={3}
                            className="w-full resize-none px-5 pt-4 pb-14 text-caption outline-none bg-transparent text-(--text) placeholder:font-medium font-medium "
                            placeholder={placeholder + '|'}
                        />
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2.5 bg-(--surface-raised) border-t border-(--accent-20)">
                            <span className="text-small text-(--text-tertiary)">
                                {prompt.length > 0 ? `${prompt.length} / 500 · ⌘Enter to generate` : 'Be descriptive for best results'}
                            </span>
                            <Button
                                size='sm'
                                variant='secondary'
                                onClick={handleGenerate}
                                disabled={!prompt.trim() || generating}
                                className={`${prompt.trim() && !generating ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                            >
                                {generating
                                    ? <><Loader2 size={18} className="animate-spin inline-block mr-2" />Generating…</>
                                    : <><Wand2 size={18} strokeWidth={2.5} className='inline-block mr-2' />Generate</>}
                            </Button>
                        </div>
                    </div>
                    {error && <p className="text-caption mt-2 px-1 text-(--error-fg)">{error}</p>}
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    <div className="flex flex-col gap-2 items-center">
                        <span className="text-tiny font-bold uppercase tracking-widest text-(--text-tertiary)">Style</span>
                        <div className="flex gap-1.5">
                            {STYLES.map(({ label, icon: Icon }) => (
                                <Pill key={label} active={style === label} onClick={() => setStyle(label)}>
                                    <Icon size={11} strokeWidth={2} />{label}
                                </Pill>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <span className="text-tiny font-bold uppercase tracking-widest text-(--text-tertiary)">Format</span>
                        <div className="flex gap-1.5">
                            {RATIOS.map(({ label, icon: Icon, hint }) => (
                                <Pill key={label} active={ratio === label} onClick={() => setRatio(label)}>
                                    <Icon size={11} strokeWidth={2} /><span title={hint}>{label}</span>
                                </Pill>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <span className="text-tiny font-bold uppercase tracking-widest text-(--text-tertiary)">Duration</span>
                        <div className="flex gap-1.5">
                            {DURATIONS.map(d => <Pill key={d} active={duration === d} onClick={() => setDuration(d)}>{d}</Pill>)}
                        </div>
                    </div>
                </div>

                {generatedProject && (
                    <div ref={scenesRef} className="flex flex-col gap-4 pt-2">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-0.5">
                                <p className="text-caption font-bold text-(--text-secondary)">
                                    {generatedProject.name}
                                </p>
                                <p className="text-tiny text-(--text-tertiary)">
                                    {selectedScenes.size === 0
                                        ? 'Click clips to select them for your video'
                                        : `${selectedScenes.size} of ${generatedProject.scenes.length} clips selected · ${totalDuration}s total`}
                                </p>
                            </div>
                            <Button
                                variant='secondary'
                                size='sm'
                                onClick={handleGenerate}
                                disabled={generating}
                                className={`${generating ? 'cursor-wait' : 'cursor-pointer'}`}
                            >
                                <RefreshCw size={18} className='inline-block mr-2' />Regenerate
                            </Button>
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
                                disabled={selectedScenes.size === 0}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-caption font-bold transition-all duration-200 border ${
                                    selectedScenes.size > 0
                                        ? 'bg-(--accent) text-[#020202] border-transparent shadow-accent-40 cursor-pointer'
                                        : 'bg-(--surface-raised) text-(--text-tertiary) border-(--border-default) cursor-not-allowed'
                                }`}
                            >
                                Open Editor <ArrowRight size={13} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const router = useRouter()

    const [projects, setProjects] = useState<Project[]>([])
    const [projectsLoading, setProjectsLoading] = useState(true)
    const [creatingProject, setCreatingProject] = useState(false)

    const fetchProjects = useCallback(() => {
        setProjectsLoading(true)
        fetch('/api/projects')
            .then(r => r.json())
            .then((data: Array<{
                id: string
                name: string
                updatedAt: string
                thumbnail?: string
                starred?: boolean
                aspectRatio?: string | null
                style?: string | null
                scenes?: { videoUrl: string | null; duration: number }[]
            }>) => {
                setProjects(data.slice(0, 4).map(p => ({
                    id: p.id,
                    name: p.name,
                    lastEdited: formatRelative(p.updatedAt),
                    thumbnail: p.thumbnail,
                    starred: p.starred,
                    previewVideoUrl: p.scenes?.[0]?.videoUrl ?? null,
                    aspectRatio: p.aspectRatio,
                    style: p.style,
                    sceneCount: p.scenes?.length,
                    totalDuration: p.scenes?.reduce((sum, s) => sum + s.duration, 0),
                })))
            })
            .catch(console.error)
            .finally(() => setProjectsLoading(false))
    }, [])

    useEffect(() => { fetchProjects() }, [fetchProjects])

    const handleNewProject = useCallback(async () => {
        if (creatingProject) return
        setCreatingProject(true)
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Untitled Project', style: 'Cinematic', aspectRatio: '16:9' }),
            })
            if (res.status === 401) { router.push('/auth/signin?callbackUrl=/dashboard'); return }
            if (!res.ok) throw new Error('Failed')
            const project = await res.json()
            router.push(`/editor/${project.id}`)
            fetchProjects()
        } catch (err) {
            console.error(err)
        } finally {
            setCreatingProject(false)
        }
    }, [creatingProject, router, fetchProjects])

    return (
        <div className="relative flex flex-col flex-1 min-h-0 overflow-auto p-2">
            <div className="flex flex-col rounded-t-xl bg-(--surface-overlay) border border-(--accent-20) shadow-accent-40">

                <AIHero onProjectCreated={fetchProjects} />

                <main className="flex-1 px-20 pb-12 flex flex-col gap-6">
                    <div className='pt-8'>
                        <div className="flex items-end justify-between mb-6 pt-10 border-t border-(--accent-20)">
                            <div className="flex flex-col">
                                <h3 className="font-semibold text-(--text) leading-5">Recent Projects</h3>
                                <span className="text-caption text-(--text-tertiary)">Pick up where you left off</span>
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <Button
                                    size='sm'
                                    variant='ghost'
                                    onClick={() => router.push('/dashboard/projects')}
                                >
                                    Manage my projects
                                </Button>
                                <Button
                                    size='sm'
                                    variant='primary'
                                    onClick={handleNewProject}
                                    disabled={creatingProject}
                                    className='flex items-center'
                                >
                                    {creatingProject
                                        ? <><Loader2 size={18} className="animate-spin inline-block mr-2" />Creating…</>
                                        : <><FolderPlus size={18} strokeWidth={2.5} className='inline-block mr-2' />New Project</>}
                                </Button>
                            </div>
                        </div>

                        {projectsLoading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
                                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-14 gap-4 rounded-xl bg-(--surface-raised) border border-(--border-default)">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-(--accent-8) border border-(--accent-22)">
                                    <FolderOpen size={22} className="text-(--accent)" />
                                </div>
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <span className="text-lead font-bold text-(--text-secondary)">
                                        No projects yet
                                    </span>
                                    <span className="text-caption text-(--text-tertiary)">
                                        Generate with AI above or start a new blank project
                                    </span>
                                </div>
                                <Button
                                    onClick={handleNewProject}
                                    size='md'
                                    variant='primary'
                                >
                                    <FolderPlus size={13} strokeWidth={2.5} className='inline-block mr-2' />
                                    Start a project
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
                                {projects.map(p => <DashboardCard key={p.id} project={p} />)}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

function formatRelative(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return new Date(dateStr).toLocaleDateString()
}