'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
    Wand2, Sparkles, Music2, Clock, Film,
    Pencil, Download, ArrowLeft, AlertCircle,
    Clapperboard, CheckCircle2,
} from 'lucide-react'


type Scene = {
    id:          string
    title:       string
    description: string
    musicMood:   string
    duration:    number
    order:       number
}

type Project = {
    id:          string
    name:        string
    prompt:      string
    style:       string
    aspectRatio: string
    aiDuration:  string
    scenes:      Scene[]
}


const moodColors: Record<string, { bg: string; text: string; border: string }> = {
    Uplifting:  { bg: 'rgba(251,191,36,0.08)',  text: '#fbbf24', border: 'rgba(251,191,36,0.22)' },
    Dramatic:   { bg: 'rgba(239,68,68,0.08)',   text: '#ef4444', border: 'rgba(239,68,68,0.22)'  },
    Calm:       { bg: 'rgba(99,102,241,0.08)',  text: '#818cf8', border: 'rgba(99,102,241,0.22)' },
    Energetic:  { bg: 'rgba(249,115,22,0.08)',  text: '#fb923c', border: 'rgba(249,115,22,0.22)' },
    Melancholic:{ bg: 'rgba(148,163,184,0.08)', text: '#94a3b8', border: 'rgba(148,163,184,0.22)'},
    Mysterious: { bg: 'rgba(167,139,250,0.08)', text: '#a78bfa', border: 'rgba(167,139,250,0.22)'},
    Cinematic:  { bg: 'var(--turquoise-8)',      text: 'var(--turquoise)', border: 'var(--turquoise-22)' },
    Playful:    { bg: 'rgba(52,211,153,0.08)',  text: '#34d399', border: 'rgba(52,211,153,0.22)' },
}

const defaultMood = { bg: 'var(--surface-raised)', text: 'var(--text-tertiary)', border: 'var(--border-subtle)' }


const loadingSteps = [
    'Reading your prompt…',
    'Planning scenes…',
    'Crafting descriptions…',
    'Setting the mood…',
    'Finalising your project…',
]

function LoadingScreen({ prompt }: { prompt: string }) {
    const [step, setStep] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(s => Math.min(s + 1, loadingSteps.length - 1))
        }, 900)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-6">

            {/* Animated orb */}
            <div className="relative flex items-center justify-center">
                <div
                    className="w-24 h-24 rounded-full"
                    style={{
                        background: 'radial-gradient(circle, var(--turquoise-22) 0%, var(--turquoise-8) 60%, transparent 100%)',
                        animation: 'pulse 1.8s ease-in-out infinite',
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Wand2 size={32} style={{ color: 'var(--turquoise)' }} strokeWidth={1.5} />
                </div>
            </div>

            {/* Step text */}
            <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                    {loadingSteps[step]}
                </p>
                <p
                    className="text-xs max-w-sm line-clamp-2"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    &quot;{prompt}&quot;
                </p>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2">
                {loadingSteps.map((_, i) => (
                    <div
                        key={i}
                        className="rounded-full transition-all duration-500"
                        style={{
                            width:  i <= step ? '20px' : '6px',
                            height: '6px',
                            backgroundColor: i <= step ? 'var(--turquoise)' : 'var(--border-default)',
                        }}
                    />
                ))}
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1);   opacity: 0.8; }
                    50%       { transform: scale(1.12); opacity: 1;   }
                }
            `}</style>
        </div>
    )
}

// ─── Error screen ─────────────────────────────────────────────────────────────

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6">
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.22)' }}
            >
                <AlertCircle size={28} style={{ color: '#f87171' }} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Generation failed</p>
                <p className="text-xs max-w-sm" style={{ color: 'var(--text-tertiary)' }}>{message}</p>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={() => window.close()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
                >
                    <ArrowLeft size={14} /> Close
                </button>
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity"
                    style={{ backgroundColor: 'var(--turquoise)', color: '#fff' }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                    <Wand2 size={14} /> Try again
                </button>
            </div>
        </div>
    )
}

// ─── Scene card ───────────────────────────────────────────────────────────────

function SceneCard({ scene, index }: { scene: Scene; index: number }) {
    const mood = moodColors[scene.musicMood] ?? defaultMood

    return (
        <div
            className="flex flex-col gap-4 p-5 rounded-2xl transition-all duration-200"
            style={{
                backgroundColor: 'var(--surface-raised)',
                border: '1px solid var(--border-default)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--turquoise-22)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-default)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
            }}
        >
            {/* Scene number + duration */}
            <div className="flex items-center justify-between">
                <div
                    className="flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] font-bold"
                    style={{
                        backgroundColor: 'var(--turquoise-8)',
                        border: '1px solid var(--turquoise-22)',
                        color: 'var(--turquoise)',
                    }}
                >
                    <Clapperboard size={11} strokeWidth={2} />
                    Scene {index + 1}
                </div>
                <div
                    className="flex items-center gap-1.5 text-[11px] font-semibold"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    <Clock size={11} strokeWidth={2} />
                    {scene.duration}s
                </div>
            </div>

            {/* Visual placeholder */}
            <div
                className="w-full rounded-xl flex items-center justify-center"
                style={{
                    aspectRatio: '16/9',
                    backgroundColor: 'var(--bg)',
                    border: '1px solid var(--border-subtle)',
                }}
            >
                <Film size={24} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} strokeWidth={1.25} />
            </div>

            {/* Title */}
            <p className="text-sm font-bold leading-snug" style={{ color: 'var(--text)' }}>
                {scene.title}
            </p>

            {/* Description */}
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                {scene.description}
            </p>

            {/* Music mood */}
            <div
                className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                style={{
                    backgroundColor: mood.bg,
                    border: `1px solid ${mood.border}`,
                    color: mood.text,
                }}
            >
                <Music2 size={10} strokeWidth={2.5} />
                {scene.musicMood}
            </div>
        </div>
    )
}

// ─── Review screen ────────────────────────────────────────────────────────────

function ReviewScreen({ project }: { project: Project }) {
    const router = useRouter()
    const totalDuration = project.scenes.reduce((sum, s) => sum + s.duration, 0)

    return (
        <div className="flex flex-col min-h-screen">

            {/* Top bar */}
            <div
                className="sticky top-0 z-10 flex items-center justify-between px-8 py-4"
                style={{
                    backgroundColor: 'var(--bg)',
                    borderBottom: '1px solid var(--border-subtle)',
                    backdropFilter: 'blur(12px)',
                }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: 'var(--turquoise-8)', border: '1px solid var(--turquoise-22)' }}
                    >
                        <Sparkles size={13} style={{ color: 'var(--turquoise)' }} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{project.name}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                            {project.scenes.length} scenes · {totalDuration}s · {project.aspectRatio} · {project.style}
                        </p>
                    </div>
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => window.close()}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                        style={{
                            backgroundColor: 'var(--surface-raised)',
                            border: '1px solid var(--border-default)',
                            color: 'var(--text-tertiary)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
                    >
                        <ArrowLeft size={13} />
                        Back
                    </button>

                    <button
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                        style={{
                            backgroundColor: 'var(--surface-raised)',
                            border: '1px solid var(--border-default)',
                            color: 'var(--text-tertiary)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
                    >
                        <Download size={13} />
                        Export
                    </button>

                    <button
                        onClick={() => router.push(`/dashboard/projects/${project.id}/editor`)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-opacity"
                        style={{
                            backgroundColor: 'var(--turquoise)',
                            color: '#fff',
                            boxShadow: '0 4px 14px var(--turquoise-22)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                    >
                        <Pencil size={13} />
                        Edit Video
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">

                {/* Success banner */}
                <div
                    className="flex items-center gap-3 px-5 py-4 rounded-2xl"
                    style={{
                        backgroundColor: 'var(--turquoise-8)',
                        border: '1px solid var(--turquoise-22)',
                    }}
                >
                    <CheckCircle2 size={18} style={{ color: 'var(--turquoise)' }} strokeWidth={2} />
                    <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--turquoise)' }}>
                            Your video project is ready!
                        </p>
                        <p className="text-xs" style={{ color: 'var(--turquoise)', opacity: 0.75 }}>
                            AI generated {project.scenes.length} scenes based on your prompt. Review them below then jump into the editor.
                        </p>
                    </div>
                </div>

                {/* Prompt recap */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-px" style={{ backgroundColor: 'var(--turquoise)' }} />
                        <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase" style={{ color: 'var(--turquoise)' }}>
                            Your Prompt
                        </span>
                    </div>
                    <p
                        className="text-sm leading-relaxed px-4 py-3 rounded-xl"
                        style={{
                            color: 'var(--text-secondary)',
                            backgroundColor: 'var(--surface-raised)',
                            border: '1px solid var(--border-subtle)',
                            fontStyle: 'italic',
                        }}
                    >
                        &quot;{project.prompt}&quot;
                    </p>
                </div>

                {/* Scene cards */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-px" style={{ backgroundColor: 'var(--turquoise)' }} />
                        <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase" style={{ color: 'var(--turquoise)' }}>
                            Scene Breakdown · {project.scenes.length} Scenes
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.scenes.map((scene, i) => (
                            <SceneCard key={scene.id} scene={scene} index={i} />
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="flex items-center justify-center gap-4 py-6">
                    <button
                        className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
                        style={{
                            backgroundColor: 'var(--surface-raised)',
                            border: '1px solid var(--border-default)',
                            color: 'var(--text-tertiary)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
                    >
                        <Download size={15} />
                        Download Script
                    </button>

                    <button
                        onClick={() => router.push(`/dashboard/projects/${project.id}/editor`)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-opacity"
                        style={{
                            backgroundColor: 'var(--turquoise)',
                            color: '#fff',
                            boxShadow: '0 4px 20px var(--turquoise-22)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                    >
                        <Pencil size={15} />
                        Start Editing Video
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Main page (reads search params, runs generation) ─────────────────────────

function GenerateContent() {
    const searchParams = useSearchParams()
    const [status,  setStatus]  = useState<'loading' | 'done' | 'error'>('loading')
    const [project, setProject] = useState<Project | null>(null)
    const [error,   setError]   = useState('')

    const prompt      = searchParams.get('prompt')      ?? ''
    const style       = searchParams.get('style')       ?? 'Cinematic'
    const aspectRatio = searchParams.get('aspectRatio') ?? '9:16'
    const duration    = searchParams.get('duration')    ?? '30s'

    const runGeneration = async () => {
        setStatus('loading')
        setError('')
        try {
            const res = await fetch('/api/ai/generate', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ prompt, style, aspectRatio, duration }),
            })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error ?? 'Generation failed')
            }
            const data = await res.json()
            setProject(data)
            setStatus('done')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
            setStatus('error')
        }
    }

    useEffect(() => {
        if (!prompt) {
            setError('No prompt provided. Please go back and enter a prompt.')
            setStatus('error')
            return
        }
        runGeneration()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (status === 'loading') return <LoadingScreen prompt={prompt} />
    if (status === 'error')   return <ErrorScreen message={error} onRetry={runGeneration} />
    if (project)              return <ReviewScreen project={project} />
    return null
}

export default function GeneratePage() {
    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
        >
            <Suspense fallback={<LoadingScreen prompt="Loading…" />}>
                <GenerateContent />
            </Suspense>
        </div>
    )
}