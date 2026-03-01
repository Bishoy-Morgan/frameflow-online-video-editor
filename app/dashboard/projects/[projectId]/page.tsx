'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft, Wand2, Clock, Star, Trash2,
    Pencil, Download, Music2, Film,
    Clapperboard, Settings, Loader2,
    Play
} from 'lucide-react'
import DashboardHeader from '../../components/DashboardHeader'


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
    starred:     boolean
    deletedAt:   string | null
    prompt:      string | null
    style:       string | null
    aspectRatio: string | null
    aiDuration:  string | null
    thumbnail:   string | null
    createdAt:   string
    updatedAt:   string
    scenes:      Scene[]
    _count: {
        assets:    number
        timelines: number
        renders:   number
    }
}

// Music mood colors

const moodColors: Record<string, { bg: string; text: string; border: string }> = {
    Uplifting:   { bg: 'rgba(251,191,36,0.08)',  text: '#fbbf24', border: 'rgba(251,191,36,0.22)' },
    Dramatic:    { bg: 'rgba(239,68,68,0.08)',   text: '#ef4444', border: 'rgba(239,68,68,0.22)'  },
    Calm:        { bg: 'rgba(99,102,241,0.08)',  text: '#818cf8', border: 'rgba(99,102,241,0.22)' },
    Energetic:   { bg: 'rgba(249,115,22,0.08)',  text: '#fb923c', border: 'rgba(249,115,22,0.22)' },
    Melancholic: { bg: 'rgba(148,163,184,0.08)', text: '#94a3b8', border: 'rgba(148,163,184,0.22)'},
    Mysterious:  { bg: 'rgba(167,139,250,0.08)', text: '#a78bfa', border: 'rgba(167,139,250,0.22)'},
    Cinematic:   { bg: 'var(--turquoise-8)',      text: 'var(--turquoise)', border: 'var(--turquoise-22)' },
    Playful:     { bg: 'rgba(52,211,153,0.08)',  text: '#34d399', border: 'rgba(52,211,153,0.22)' },
}
const defaultMood = { bg: 'var(--surface-raised)', text: 'var(--text-tertiary)', border: 'var(--border-subtle)' }

function timeAgo(dateStr: string) {
    const diff  = Date.now() - new Date(dateStr).getTime()
    const days  = Math.floor(diff / 86400000)
    const hours = Math.floor(diff / 3600000)
    const mins  = Math.floor(diff / 60000)
    if (mins < 1)   return 'Just now'
    if (mins < 60)  return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7)   return `${days}d ago`
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Scene card

function SceneCard({ scene, index }: { scene: Scene; index: number }) {
    const mood = moodColors[scene.musicMood] ?? defaultMood
    return (
        <div
            className="flex flex-col gap-3 p-4 rounded-2xl transition-all duration-200"
            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--turquoise-22)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-default)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
            }}
        >
            <div className="flex items-center justify-between">
                <div
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold"
                    style={{ backgroundColor: 'var(--turquoise-8)', border: '1px solid var(--turquoise-22)', color: 'var(--turquoise)' }}
                >
                    <Clapperboard size={10} strokeWidth={2} />
                    Scene {index + 1}
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                    <Clock size={10} strokeWidth={2} />{scene.duration}s
                </span>
            </div>

            <div
                className="w-full rounded-xl flex items-center justify-center"
                style={{ aspectRatio: '16/9', backgroundColor: 'var(--bg)', border: '1px solid var(--border-subtle)' }}
            >
                <Film size={20} style={{ color: 'var(--text-tertiary)', opacity: 0.25 }} strokeWidth={1.25} />
            </div>

            <p className="text-xs font-bold leading-snug" style={{ color: 'var(--text)' }}>{scene.title}</p>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{scene.description}</p>

            <div
                className="flex items-center gap-1.5 w-fit px-2 py-1 rounded-lg text-[10px] font-semibold"
                style={{ backgroundColor: mood.bg, border: `1px solid ${mood.border}`, color: mood.text }}
            >
                <Music2 size={9} strokeWidth={2.5} />{scene.musicMood}
            </div>
        </div>
    )
}

// Delete confirmation modal

function DeleteConfirmModal({
    open,
    projectName,
    confirmText,
    onConfirmTextChange,
    onConfirm,
    onClose,
    deleting,
}: {
    open:              boolean
    projectName:       string
    confirmText:       string
    onConfirmTextChange: (text: string) => void
    onConfirm:         () => void
    onClose:           () => void
    deleting:          boolean
}) {
    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
                style={{
                    backgroundColor: 'var(--bg)',
                    border: '1px solid var(--border-default)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                        Delete project?
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        This action cannot be undone. This will permanently delete the project and all of its contents.
                    </p>
                </div>

                {/* Project name to type */}
                <div
                    className="px-3 py-2.5 rounded-lg text-sm font-mono"
                    style={{
                        backgroundColor: 'var(--surface-raised)',
                        border: '1px solid var(--border-default)',
                        color: 'var(--text-tertiary)',
                    }}
                >
                    {projectName}
                </div>

                {/* Input to confirm */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        Type the project name to confirm
                    </label>
                    <input
                        autoFocus
                        type="text"
                        value={confirmText}
                        onChange={e => onConfirmTextChange(e.target.value)}
                        placeholder={projectName}
                        className="px-3 py-2 rounded-lg text-sm outline-none transition-colors"
                        style={{
                            backgroundColor: 'var(--surface-raised)',
                            border: '1px solid var(--border-default)',
                            color: 'var(--text)',
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = 'var(--turquoise)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        disabled={deleting}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        style={{
                            backgroundColor: 'var(--surface-raised)',
                            border: '1px solid var(--border-default)',
                            color: 'var(--text-tertiary)',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = 'var(--bg)'
                            e.currentTarget.style.borderColor = 'var(--border-strong)'
                            e.currentTarget.style.color = 'var(--text)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'var(--surface-raised)'
                            e.currentTarget.style.borderColor = 'var(--border-default)'
                            e.currentTarget.style.color = 'var(--text-tertiary)'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={confirmText !== projectName || deleting}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
                        style={{
                            backgroundColor: confirmText === projectName ? '#ef4444' : 'rgba(239,68,68,0.2)',
                            border: '1px solid ' + (confirmText === projectName ? '#ef4444' : 'transparent'),
                            color: '#fff',
                            cursor: confirmText === projectName && !deleting ? 'pointer' : 'not-allowed',
                            opacity: confirmText === projectName ? 1 : 0.6,
                        }}
                    >
                        {deleting ? (
                            <>
                                <Loader2 size={14} className="animate-spin" /> Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 size={14} /> Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

// Project Details Page

export default function ProjectDetailPage() {
    const params   = useParams()
    const router   = useRouter()
    const id       = params.projectId as string

    const [project,  setProject]  = useState<Project | null>(null)
    const [loading,  setLoading]  = useState(true)
    const [starring, setStarring] = useState(false)
    const [error,    setError]    = useState('')
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState('')
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        if (!id) return
        fetch(`/api/projects/${id}`)
            .then(r => r.json())
            .then(data => {
                if (data.error) setError(data.error)
                else setProject(data)
            })
            .catch(() => setError('Failed to load project'))
            .finally(() => setLoading(false))
    }, [id])

    const handleStar = async () => {
        if (!project) return
        setStarring(true)
        await fetch(`/api/projects/${id}`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ action: project.starred ? 'unstar' : 'star' }),
        })
        setProject(p => p ? { ...p, starred: !p.starred } : p)
        setStarring(false)
    }

    const handleDelete = async () => {
        if (!project) return
        setDeleting(true)
        try {
            await fetch(`/api/projects/${id}`, { method: 'DELETE' })
            router.push('/dashboard/projects')
        } catch (err) {
            console.error('Delete failed:', err)
            setDeleting(false)
        }
    }

    const openDeleteConfirm = () => {
        setDeleteConfirmOpen(true)
        setDeleteConfirmText('')
    }

    const closeDeleteConfirm = () => {
        setDeleteConfirmOpen(false)
        setDeleteConfirmText('')
    }

    if (loading) return (
        <div className="flex flex-col flex-1 min-h-0">
            <DashboardHeader title="Project" />
            <div className="flex-1 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin" style={{ color: 'var(--text-tertiary)' }} />
            </div>
        </div>
    )

    if (error || !project) return (
        <div className="flex flex-col flex-1 min-h-0">
            <DashboardHeader title="Project" />
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Project not found</p>
                <Link href="/dashboard/projects" className="text-xs" style={{ color: 'var(--turquoise)' }}>
                    ← Back to Projects
                </Link>
            </div>
        </div>
    )

    const totalDuration = project.scenes.reduce((sum, s) => sum + s.duration, 0)
    const isAI          = !!project.prompt

    return (
        <div className="relative flex flex-col flex-1 min-h-0 overflow-auto">
            <DashboardHeader title={project.name} subtitle="Project overview" />
            
            <DeleteConfirmModal
                open={deleteConfirmOpen}
                projectName={project.name}
                confirmText={deleteConfirmText}
                onConfirmTextChange={setDeleteConfirmText}
                onConfirm={handleDelete}
                onClose={closeDeleteConfirm}
                deleting={deleting}
            />

            {/* ── Hero Banner ── */}
            <div
                className="relative w-full overflow-hidden"
                style={{
                    minHeight: '280px',
                    background: isAI
                        ? 'linear-gradient(160deg, var(--turquoise-8) 0%, var(--bg) 70%)'
                        : 'linear-gradient(160deg, var(--surface-raised) 0%, var(--bg) 80%)',
                    borderBottom: '1px solid var(--border-subtle)',
                }}
            >
                {/* Dot grid */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle, var(--turquoise-22) 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                        opacity: 0.2,
                        maskImage: 'radial-gradient(ellipse 80% 100% at 20% 50%, black 0%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 80% 100% at 20% 50%, black 0%, transparent 100%)',
                    }}
                />

                <div className="relative flex flex-col gap-6 px-8 py-8 max-w-6xl mx-auto w-full">

                    {/* Back + actions row */}
                    <div className="flex items-center justify-between">
                        <Link
                            href="/dashboard/projects"
                            className="flex items-center gap-2 text-xs font-semibold transition-colors"
                            style={{ textDecoration: 'none', color: 'var(--text-tertiary)' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                        >
                            <ArrowLeft size={13} strokeWidth={2} /> All Projects
                        </Link>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleStar}
                                disabled={starring}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                                style={{
                                    backgroundColor: project.starred ? 'rgba(251,191,36,0.1)' : 'var(--surface-raised)',
                                    border: project.starred ? '1px solid rgba(251,191,36,0.3)' : '1px solid var(--border-default)',
                                    color: project.starred ? '#fbbf24' : 'var(--text-tertiary)',
                                    cursor: 'pointer',
                                }}
                            >
                                {starring
                                    ? <Loader2 size={12} className="animate-spin" />
                                    : <Star size={12} strokeWidth={2} fill={project.starred ? '#fbbf24' : 'none'} />
                                }
                                {project.starred ? 'Starred' : 'Star'}
                            </button>

                            <Link
                                href={`/dashboard/projects/${id}/settings`}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                                style={{
                                    textDecoration: 'none',
                                    backgroundColor: 'var(--surface-raised)',
                                    border: '1px solid var(--border-default)',
                                    color: 'var(--text-tertiary)',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
                                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
                            >
                                <Settings size={12} strokeWidth={1.75} /> Settings
                            </Link>

                            <button
                                onClick={openDeleteConfirm}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                                style={{
                                    backgroundColor: 'transparent',
                                    border: '1px solid transparent',
                                    color: 'var(--text-tertiary)',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#ef4444' }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
                            >
                                <Trash2 size={12} strokeWidth={1.75} /> Trash
                            </button>

                            <button
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                                style={{
                                    backgroundColor: 'var(--surface-raised)',
                                    border: '1px solid var(--border-default)',
                                    color: 'var(--text-tertiary)',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)' }}
                                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
                            >
                                <Download size={12} strokeWidth={1.75} /> Export
                            </button>

                            <button
                                onClick={() => router.push(`/dashboard/projects/${id}/editor`)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-opacity"
                                style={{ backgroundColor: 'var(--turquoise)', color: '#fff', boxShadow: '0 4px 14px var(--turquoise-22)', border: 'none', cursor: 'pointer' }}
                                onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                            >
                                <Pencil size={12} strokeWidth={2} /> Edit Video
                            </button>
                        </div>
                    </div>

                    {/* Project title + meta */}
                    <div className="flex items-end justify-between gap-6">
                        <div className="flex flex-col gap-3">
                            {isAI && (
                                <div
                                    className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-lg text-[11px] font-bold"
                                    style={{ backgroundColor: 'var(--turquoise-8)', border: '1px solid var(--turquoise-22)', color: 'var(--turquoise)' }}
                                >
                                    <Wand2 size={10} strokeWidth={2.5} /> AI Generated
                                </div>
                            )}
                            <h1
                                className="font-bold leading-tight m-0"
                                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--text)', letterSpacing: '-0.02em' }}
                            >
                                {project.name}
                            </h1>
                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                                    <Clock size={12} strokeWidth={1.75} /> Updated {timeAgo(project.updatedAt)}
                                </span>
                                {project.aspectRatio && (
                                    <span
                                        className="text-[11px] font-bold px-2 py-0.5 rounded-lg"
                                        style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)' }}
                                    >
                                        {project.aspectRatio}
                                    </span>
                                )}
                                {project.style && (
                                    <span
                                        className="text-[11px] font-bold px-2 py-0.5 rounded-lg"
                                        style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)' }}
                                    >
                                        {project.style}
                                    </span>
                                )}
                                {totalDuration > 0 && (
                                    <span className="text-[11px] font-bold" style={{ color: 'var(--text-tertiary)' }}>
                                        {totalDuration}s total
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Stats pills */}
                        <div className="hidden sm:flex items-center gap-3">
                            {[
                                { label: 'Scenes',    value: project.scenes.length          },
                                { label: 'Assets',    value: project._count.assets           },
                                { label: 'Renders',   value: project._count.renders          },
                            ].map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="flex flex-col items-center gap-0.5 px-4 py-3 rounded-xl"
                                    style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', minWidth: '72px' }}
                                >
                                    <span className="text-lg font-bold" style={{ color: 'var(--text)', lineHeight: 1 }}>{value}</span>
                                    <span className="text-[10px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Content below hero ── */}
            <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto w-full">

                {/* AI prompt recap */}
                {project.prompt && (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-px" style={{ backgroundColor: 'var(--turquoise)' }} />
                            <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase" style={{ color: 'var(--turquoise)' }}>
                                Original Prompt
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
                )}

                {/* Scenes */}
                {project.scenes.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-px" style={{ backgroundColor: 'var(--turquoise)' }} />
                            <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase" style={{ color: 'var(--turquoise)' }}>
                                Scene Breakdown · {project.scenes.length} Scenes · {totalDuration}s
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {project.scenes.map((scene, i) => (
                                <SceneCard key={scene.id} scene={scene} index={i} />
                            ))}
                        </div>
                    </div>
                )}

                {/* No scenes — empty project */}
                {project.scenes.length === 0 && (
                    <div
                        className="flex flex-col items-center justify-center py-16 gap-4 rounded-2xl"
                        style={{ backgroundColor: 'var(--surface-raised)', border: '1px dashed var(--border-default)' }}
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-default)' }}
                        >
                            <Play size={20} style={{ color: 'var(--text-tertiary)', opacity: 0.4 }} strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col items-center gap-1 text-center">
                            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>No content yet</p>
                            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Start editing to add scenes and assets</p>
                        </div>
                        <button
                            onClick={() => router.push(`/dashboard/projects/${id}/editor`)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
                            style={{ backgroundColor: 'var(--turquoise)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px var(--turquoise-22)' }}
                            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                        >
                            <Pencil size={13} /> Open Editor
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}