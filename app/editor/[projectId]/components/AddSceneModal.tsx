'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
    X, Upload, Search, Film, Loader2,
    CloudUpload, CheckCircle2, AlertCircle,
    ChevronLeft, ChevronRight,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Image from 'next/image'

interface Scene {
    id: string
    title: string
    description: string
    musicMood: string
    duration: number
    order: number
    videoUrl: string | null
    pexelsId: string | null
}

interface PexelsVideo {
    id: number
    duration: number
    image: string
    videoUrl: string
    width: number
    height: number
    user: string
}

interface AddSceneModalProps {
    projectId: string
    sceneOrder: number
    onAdd: (scene: Scene) => void
    onClose: () => void
}

type Tab = 'upload' | 'pexels'

const MOOD_OPTIONS = [
    'Cinematic', 'Dramatic', 'Uplifting', 'Calm',
    'Energetic', 'Melancholic', 'Mysterious', 'Playful',
]

const MAX_SIZE_BYTES = 50 * 1024 * 1024
const ALLOWED_TYPES  = ['video/mp4', 'video/quicktime', 'video/webm']

// Shared field styling — layout via Tailwind, color via theme vars
const fieldClass = "w-full text-sm rounded-xl px-3.5 py-3 outline-none transition-colors"
const fieldStyle = { backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text)' }
const fieldFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = 'var(--turquoise-42)' }
const fieldBlur  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = 'var(--border-default)' }

function UploadTab({
    projectId,
    sceneOrder,
    onAdd,
}: {
    projectId:  string
    sceneOrder: number
    onAdd:      (scene: Scene) => void
}) {
    const [dragOver, setDragOver] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [duration, setDuration]  = useState(5)
    const [title, setTitle] = useState('')
    const [mood, setMood] = useState('Cinematic')
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)

    const handleFile = useCallback((f: File) => {
        setError('')
        if (!ALLOWED_TYPES.includes(f.type)) {
            setError('Unsupported format. Please upload an MP4, MOV, or WebM file.')
            return
        }
        if (f.size > MAX_SIZE_BYTES) {
            setError('File exceeds 50MB. Please compress or trim your video first.')
            return
        }
        setFile(f)
        setTitle(f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '))
        setPreview(URL.createObjectURL(f))
    }, [])

    useEffect(() => {
        if (!preview || !videoRef.current) return
        const v = videoRef.current
        const onLoaded = () => {
            if (v.duration && isFinite(v.duration))
                setDuration(Math.round(v.duration * 10) / 10)
        }
        v.addEventListener('loadedmetadata', onLoaded)
        return () => v.removeEventListener('loadedmetadata', onLoaded)
    }, [preview])

    useEffect(() => {
        return () => { if (preview) URL.revokeObjectURL(preview) }
    }, [preview])

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const f = e.dataTransfer.files[0]
        if (f) handleFile(f)
    }

    const handleUpload = async () => {
        if (!file) return
        setUploading(true)
        setError('')
        try {
            const form = new FormData()
            form.append('file',      file)
            form.append('projectId', projectId)

            const res  = await fetch('/api/upload', { method: 'POST', body: form })
            const data = await res.json()

            if (!res.ok || data.error) {
                setError(data.error ?? 'Upload failed. Please try again.')
                return
            }

            const scene: Scene = {
                id: `temp-${Date.now()}`,
                title: title.trim() || 'New Scene',
                description: '',
                musicMood: mood,
                duration,
                order: sceneOrder,
                videoUrl: data.url,
                pexelsId: null,
            }
            onAdd(scene)
        } catch {
            setError('Upload failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="flex flex-col justify-between gap-5 h-full p-2 md:p-8">
            {!file ? (
                <div
                    className="flex flex-col items-center justify-center gap-5 rounded-2xl cursor-pointer transition-all h-72"
                    style={{
                        border: `2px dashed ${dragOver ? 'var(--turquoise)' : 'var(--border-default)'}`,
                        backgroundColor: dragOver ? 'var(--turquoise-8)' : 'var(--surface-raised)',
                    }}
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="video/mp4,video/quicktime,video/webm"
                        className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                    />
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{
                            backgroundColor: dragOver ? 'var(--turquoise-16)' : 'var(--bg)',
                            border: `1px solid ${dragOver ? 'var(--turquoise-42)' : 'var(--border-default)'}`,
                        }}
                    >
                        <CloudUpload size={28}
                            style={{ color: dragOver ? 'var(--turquoise)' : 'var(--text-tertiary)' }}
                            strokeWidth={1.5} />
                    </div>
                    <div className="text-center">
                        <p className="text-base font-bold"
                            style={{ color: dragOver ? 'var(--turquoise)' : 'var(--text)' }}>
                            {dragOver ? 'Drop to upload' : 'Drop your video here'}
                        </p>
                        <p className="text-sm mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                            or click to browse · MP4, MOV, WebM · max 50MB
                        </p>
                    </div>
                </div>
            ) : (
                <div className="w-full flex flex-col md:flex-row gap-12">
                    <div className="relative rounded-2xl overflow-hidden shrink-0 w-full md:w-2/5 md:h-full" style={{ backgroundColor: '#000' }}>
                        <video ref={videoRef} src={preview ?? ''} className="w-full h-full object-cover" muted />
                        <button
                            onClick={() => { setFile(null); setPreview(null); setError('') }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer text-white"
                            style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                            <X size={12} />
                        </button>
                        <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md text-xs font-mono font-bold text-white"
                            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                            {duration}s
                        </div>
                    </div>
                    <div className="w-full md:w-3/5 flex flex-col gap-3.5 flex-1 min-w-0">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Scene title</label>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g. Product close-up"
                                className={fieldClass}
                                style={fieldStyle}
                                onFocus={fieldFocus}
                                onBlur={fieldBlur}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Duration (s)</label>
                            <input
                                type="number" min={1} max={duration} step={0.5} value={duration}
                                onChange={e => setDuration(Math.max(1, parseFloat(e.target.value) || 1))}
                                className={fieldClass}
                                style={fieldStyle}
                                onFocus={fieldFocus}
                                onBlur={fieldBlur}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Music mood</label>
                            <select
                                value={mood}
                                onChange={e => setMood(e.target.value)}
                                className={`${fieldClass} cursor-pointer`}
                                style={fieldStyle}
                            >
                                {MOOD_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                    style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <AlertCircle size={15} style={{ color: '#ef4444' }} />
                    <span className="text-sm" style={{ color: '#ef4444' }}>{error}</span>
                </div>
            )}

            {file && (
                <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    style={{ backgroundColor: 'var(--turquoise)', border: 'none', cursor: uploading ? 'wait' : 'pointer', boxShadow: '0 2px 12px var(--turquoise-22)' }}
                    onMouseEnter={e => { if (!uploading) e.currentTarget.style.opacity = '0.88' }}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    {uploading
                        ? <><Loader2 size={16} className="animate-spin" /> Uploading…</>
                        : <div className="flex items-center gap-2.5">
                            <CheckCircle2 size={24} />
                            <span>Add to Timeline</span>
                        </div>}
                </Button>
            )}
        </div>
    )
}

function PexelsVideoCard({
    video,
    selected,
    onSelect,
}: {
    video: PexelsVideo
    selected: boolean
    onSelect: (v: PexelsVideo) => void
}) {
    const [hovered, setHovered] = useState(false)

    return (
        <div
            onClick={() => onSelect(video)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative w-full h-64 rounded-2xl overflow-hidden cursor-pointer shrink-0"
            style={{
                border: `2px solid ${selected ? 'var(--turquoise)' : 'transparent'}`,
                boxShadow: selected ? '0 0 0 2px var(--turquoise-22)' : 'none',
            }}
        >
            <Image
                src={video.image}
                alt={`Pexels ${video.id}`}
                width={630}
                height={1200}
                className="w-full h-full object-cover block"
            />

            {/* Hover overlay — driven by state, not Tailwind group */}
            <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-150"
                style={{ backgroundColor: 'rgba(0,0,0,0.4)', opacity: hovered ? 1 : 0 }}
            >
                <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}
                >
                    <Film size={15} color="white" />
                </div>
            </div>

            {/* Duration badge */}
            <div
                className="absolute bottom-2 left-2 px-2 py-1 rounded-md text-xs font-mono font-bold text-white"
                style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            >
                {video.duration}s
            </div>

            {selected && (
                <div className="absolute top-2 right-2">
                    <CheckCircle2 size={18} style={{ color: 'var(--turquoise)' }} fill="white" />
                </div>
            )}
        </div>
    )
}

function PexelsTab({
    sceneOrder,
    onAdd,
}: {
    sceneOrder: number
    onAdd: (scene: Scene) => void
}) {
    const [query, setQuery] = useState('')
    const [videos, setVideos] = useState<PexelsVideo[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [selected, setSelected] = useState<PexelsVideo | null>(null)
    const [title, setTitle] = useState('')
    const [mood, setMood] = useState('Cinematic')

    const abortRef = useRef<AbortController | null>(null)

    const search = useCallback(async (q: string, p: number) => {
        if (!q.trim()) return
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setLoading(true)
        setError('')
        setSelected(null)
        try {
            const res  = await fetch(`/api/pexels/search?query=${encodeURIComponent(q)}&page=${p}`, { signal: abortRef.current.signal })
            const data = await res.json()
            if (!res.ok || data.error) {
                setError(data.error ?? 'Search failed. Please try again.')
                return
            }
            setVideos(data.videos)
            setTotal(data.totalResults)
            setPage(p)
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') return
            setError('Search failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [])

    const handleSelect = (v: PexelsVideo) => {
        setSelected(v)
        setTitle(`Pexels clip ${v.id}`)
    }

    const handleAdd = () => {
        if (!selected) return
        const scene: Scene = {
            id: `temp-${Date.now()}`,
            title: title.trim() || `Pexels clip ${selected.id}`,
            description: '',
            musicMood: mood,
            duration: selected.duration,
            order: sceneOrder,
            videoUrl: selected.videoUrl,
            pexelsId: String(selected.id),
        }
        onAdd(scene)
    }

    const totalPages = Math.ceil(total / 12)

    return (
        <div className="flex flex-col gap-4 h-full min-h-0">

            <div className="flex gap-2.5 shrink-0">
                <div
                    className="flex-1 flex items-center gap-2.5 rounded-2xl px-4"
                    style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
                >
                    <Search size={15} style={{ color: 'var(--text-tertiary)' }} className="shrink-0" />
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && search(query, 1)}
                        placeholder="Search stock footage…"
                        className="flex-1 text-sm py-3.5 outline-none bg-transparent border-none"
                        style={{ color: 'var(--text)' }}
                    />
                </div>
                <button
                    onClick={() => search(query, 1)}
                    disabled={!query.trim() || loading}
                    className="px-6 rounded-2xl text-sm font-bold"
                    style={{
                        backgroundColor: query.trim() ? 'var(--turquoise)' : 'var(--surface-raised)',
                        border: `1px solid ${query.trim() ? 'transparent' : 'var(--border-default)'}`,
                        color: query.trim() ? '#fff' : 'var(--text-tertiary)',
                        cursor: query.trim() && !loading ? 'pointer' : 'not-allowed',
                    }}
                >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : 'Search'}
                </button>
            </div>

            {error && (
                <div
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl shrink-0"
                    style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
                >
                    <AlertCircle size={15} style={{ color: '#ef4444' }} />
                    <span className="text-sm" style={{ color: '#ef4444' }}>{error}</span>
                </div>
            )}

            {videos.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center gap-3 flex-1 opacity-40">
                    <Film size={32} style={{ color: 'var(--text-tertiary)' }} strokeWidth={1.5} />
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {query ? 'No results found' : 'Search for stock footage above'}
                    </p>
                </div>
            )}

            {loading && (
                <div className="flex items-center justify-center flex-1">
                    <Loader2 size={24} className="animate-spin" style={{ color: 'var(--turquoise)' }} />
                </div>
            )}

            {!loading && videos.length > 0 && (
                <div
                    className="grid grid-cols-3 gap-4 overflow-y-auto flex-1 min-h-0 pr-1"
                    style={{ gridAutoRows: '256px', scrollbarWidth: 'thin', scrollbarColor: 'var(--border-strong) transparent' }}
                >
                    {videos.map(v => (
                        <PexelsVideoCard
                            key={v.id}
                            video={v}
                            selected={selected?.id === v.id}
                            onSelect={handleSelect}
                        />
                    ))}
                </div>
            )}

            {totalPages > 1 && !loading && (
                <div className="flex items-center justify-center gap-4 shrink-0">
                    <button
                        onClick={() => search(query, page - 1)}
                        disabled={page <= 1}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                            backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)',
                            cursor: page <= 1 ? 'not-allowed' : 'pointer',
                            opacity: page <= 1 ? 0.4 : 1, color: 'var(--text-tertiary)',
                        }}
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <span className="text-sm font-mono" style={{ color: 'var(--text-tertiary)' }}>
                        {page} / {totalPages}
                    </span>
                    <button
                        onClick={() => search(query, page + 1)}
                        disabled={page >= totalPages}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                            backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)',
                            cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                            opacity: page >= totalPages ? 0.4 : 1, color: 'var(--text-tertiary)',
                        }}
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            )}

            {selected && (
                <div
                    className="flex gap-3 items-end shrink-0 pt-4"
                    style={{ borderTop: '1px solid var(--border-subtle)' }}
                >
                    <div className="flex flex-col gap-2 flex-1">
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Scene title"
                            className="w-full text-sm rounded-xl px-3.5 py-3 outline-none"
                            style={fieldStyle}
                            onFocus={fieldFocus}
                            onBlur={fieldBlur}
                        />
                        <select
                            value={mood}
                            onChange={e => setMood(e.target.value)}
                            className="w-full text-sm rounded-xl px-3.5 py-3 outline-none cursor-pointer"
                            style={fieldStyle}
                        >
                            {MOOD_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="flex flex-col items-center justify-center gap-1.5 px-6 h-20 rounded-2xl text-sm font-bold shrink-0 text-white"
                        style={{ backgroundColor: 'var(--turquoise)', border: 'none', boxShadow: '0 2px 8px var(--turquoise-22)', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        <CheckCircle2 size={15} />
                        <span>Add to<br />Timeline</span>
                    </button>
                </div>
            )}
        </div>
    )
}


export default function AddSceneModal({
    projectId, sceneOrder, onAdd, onClose,
}: AddSceneModalProps) {
    const [tab, setTab] = useState<Tab>('upload')

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [onClose])

    const handleAdd = (scene: Scene) => {
        onAdd(scene)
        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
            <div
                className="flex flex-col w-[90vw] h-[90vh] md:w-[72vw] md:h-[86vh] rounded-3xl overflow-hidden"
                style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-default)', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}
            >
                <div
                    className="flex items-center justify-between px-7 h-16 shrink-0"
                    style={{ borderBottom: '1px solid var(--border-default)' }}
                >
                    <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                        Add Scene
                    </span>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
                        style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
                    >
                        <X size={15} />
                    </button>
                </div>

                <div className="flex shrink-0" style={{ borderBottom: '1px solid var(--border-default)' }}>
                    {([
                        { id: 'upload' as Tab, icon: Upload, label: 'Upload Video'  },
                        { id: 'pexels' as Tab, icon: Search, label: 'Stock Footage' },
                    ]).map(({ id, icon: Icon, label }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className="flex items-center gap-2.5 px-7 py-4 text-sm font-bold bg-transparent border-none cursor-pointer -mb-px"
                            style={{
                                borderBottom: tab === id ? '2px solid var(--turquoise)' : '2px solid transparent',
                                color: tab === id ? 'var(--turquoise)' : 'var(--text-tertiary)',
                            }}
                        >
                            <Icon size={15} strokeWidth={tab === id ? 2 : 1.75} />
                            {label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 min-h-0 overflow-hidden p-7 flex flex-col">
                    {tab === 'upload' && (
                        <UploadTab
                            projectId={projectId}
                            sceneOrder={sceneOrder}
                            onAdd={handleAdd}
                        />
                    )}
                    {tab === 'pexels' && (
                        <PexelsTab
                            sceneOrder={sceneOrder}
                            onAdd={handleAdd}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}