'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
    X, Upload, Search, Loader2,
    CloudUpload, CheckCircle2, AlertCircle,
    ChevronLeft, ChevronRight,
    CircleCheckBig,
    ListVideo,
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
const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']

const fieldClass = "w-full text-caption rounded-xl px-3 py-2 outline-none transition-colors bg-(--surface-overlay) text-(--text) border border-strong hover:border-(--accent) hover:shadow focus:shadow focus:shadow-[#00D9AA] transition-all duration-200"

function UploadTab({
    projectId,
    sceneOrder,
    onAdd,
}: {
    projectId: string
    sceneOrder: number
    onAdd: (scene: Scene) => void
}) {
    const [dragOver, setDragOver] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [duration, setDuration] = useState(5)
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
            form.append('file', file)
            form.append('projectId', projectId)

            const res = await fetch('/api/upload', { method: 'POST', body: form })
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
        <div className="flex flex-col justify-between gap-5 p-2 w-full h-full">
            {!file ? (
                <div
                    className={`w-full h-full flex flex-col items-center justify-center gap-5 rounded-xl cursor-pointer transition-all p-8 shadow-accent-22 border border-(--accent-16) ${dragOver ? 'shadow-accent-40 bg-(--accent-20)' : ''}`}
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
                    <div className="p-2 shadow border border-(--accent-20) rounded-xl flex items-center justify-center">
                        <CloudUpload
                            size={28}
                            className={dragOver ? 'text-(--accent)' : 'text-(--text-tertiary)'}
                            strokeWidth={1.5}
                        />
                    </div>
                    <div className="text-center">
                        <p className="text-caption font-bold text-(--text)">
                            {dragOver ? 'Drop to upload' : 'Drop your video here'}
                        </p>
                        <p className="text-small mt-1.5 text-(--text-tertiary)">
                            or click to browse · MP4, MOV, WebM · max 50MB
                        </p>
                    </div>
                </div>
            ) : (
                <div className="relative w-full h-full flex flex-col md:flex-row items-center gap-12">
                    <button
                        onClick={() => { setFile(null); setPreview(null); setError('') }}
                        className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:shadow border-(--accent-40) border"
                    >
                        <X size={18} />
                    </button>
                    <div className="relative rounded-xl overflow-hidden shrink-0 w-full md:w-2/5 md:h-full border border-(--accent-20)">
                        <video ref={videoRef} src={preview ?? ''} className="w-full h-full object-contain" muted />
                        <div className="absolute bottom-2 left-2 px-3 py-1.5 rounded-xl text-caption font-semibold text-(--text) shadow transition-all duration-300 ease-out">
                            {duration}s
                        </div>
                    </div>
                    <div className="w-full md:w-3/5 flex flex-col gap-5 flex-1 min-w-0">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-caption font-semibold uppercase text-(--text-tertiary)">Scene title</label>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g. Product close-up"
                                className={fieldClass}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-caption font-semibold uppercase text-(--text-tertiary)">Duration (s)</label>
                            <input
                                type="number" min={1} max={duration} step={0.5} value={duration}
                                onChange={e => setDuration(Math.max(1, parseFloat(e.target.value) || 1))}
                                className={fieldClass}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-caption font-semibold uppercase text-(--text-tertiary)">Music mood</label>
                            <select
                                value={mood}
                                onChange={e => setMood(e.target.value)}
                                className={`${fieldClass} cursor-pointer`}
                            >
                                {MOOD_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl">
                    <AlertCircle size={15} className="text-(--error)" />
                    <span className="text-small text-(--error)">{error}</span>
                </div>
            )}

            {file && (
                <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    size="lg"
                    className="w-fit mx-auto"
                >
                    {uploading
                        ? <><Loader2 size={30} className="animate-spin" /> Uploading…</>
                        : <div className="flex items-center gap-2.5">
                            <CheckCircle2 strokeWidth={2.5} size={24} />
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
    const [hovering, setHovering] = useState(false)
    const [playing, setPlaying] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const v = videoRef.current
        if (!v || !hovering) return
        v.currentTime = 0
        v.play().catch(() => {})
    }, [hovering])

    return (
        <div
            onClick={() => onSelect(video)}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => { setHovering(false); setPlaying(false) }}
            className="relative w-full h-64 rounded-xl overflow-hidden cursor-pointer shrink-0 bg-black"
        >
            <Image
                src={video.image}
                alt={`Pexels ${video.id}`}
                width={630}
                height={1200}
                className={`w-full h-full object-cover block transition-opacity duration-200 ${playing ? 'opacity-0' : 'opacity-100'}`}
            />

            {hovering && (
                <video
                    ref={videoRef}
                    src={video.videoUrl}
                    muted
                    loop
                    playsInline
                    onPlaying={() => setPlaying(true)}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}

            <div className="absolute bottom-2 left-2 px-3 py-1.5 rounded-xl text-caption font-semibold text-(--text) shadow transition-all duration-300 ease-out bg-(--surface-sunken) opacity-80">
                {video.duration}s
            </div>

            {selected && (
                <div className="absolute top-4 right-4 shadow-lg">
                    <CircleCheckBig size={30} className="bg-(--surface-overlay) rounded-full text-(--accent)" strokeWidth={2.25} />
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

    const abortRef = useRef<AbortController | null>(null)

    const search = useCallback(async (q: string, p: number) => {
        if (!q.trim()) return
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setLoading(true)
        setError('')
        setSelected(null)
        try {
            const res = await fetch(`/api/pexels/search?query=${encodeURIComponent(q)}&page=${p}`, { signal: abortRef.current.signal })
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

    const handleAdd = () => {
        if (!selected) return
        const scene: Scene = {
            id: `temp-${Date.now()}`,
            title: `Pexels clip ${selected.id}`,
            description: '',
            musicMood: 'Cinematic',
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

            <div className="flex gap-2 shrink-0">
                <div className="flex-1 flex items-center gap-2.5">
                    <Search size={28} className="shrink-0 text-(--text-tertiary)" />
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && search(query, 1)}
                        placeholder="Search stock footage…"
                        className="flex-1 text-caption font-medium px-3 py-2 bg-transparent border border-default text-(--text) rounded-xl focus:shadow-lg focus:border-(--accent) focus:border-2 outline-none"
                    />
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => search(query, 1)}
                    disabled={!query.trim() || loading}
                    className="min-w-40"
                >
                    {loading ? <Loader2 size={30} className="animate-spin" /> : 'Search'}
                </Button>
            </div>

            {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl shrink-0">
                    <AlertCircle size={15} className="text-(--error)" />
                    <span className="text-small text-(--error)">{error}</span>
                </div>
            )}

            {videos.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center gap-3 flex-1 opacity-40">
                    <ListVideo size={40} className="text-(--text-tertiary)" strokeWidth={1.5} />
                    <p className="text-caption text-(--text-tertiary)">
                        {query ? 'No results found' : 'Search for stock footage above'}
                    </p>
                </div>
            )}

            {loading && (
                <div className="flex items-center justify-center flex-1">
                    <Loader2 size={30} className="animate-spin text-(--accent)" />
                </div>
            )}

            {!loading && videos.length > 0 && (
                <div
                    className="grid grid-cols-4 gap-4 overflow-y-auto flex-1 min-h-0 pr-1 auto-rows-[256px]"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--accent-fg) transparent' }}
                >
                    {videos.map(v => (
                        <PexelsVideoCard
                            key={v.id}
                            video={v}
                            selected={selected?.id === v.id}
                            onSelect={setSelected}
                        />
                    ))}
                </div>
            )}

            <div className="flex items-center justify-center gap-4 shrink-0 relative">
                {totalPages > 1 && !loading && (
                    <>
                        <button
                            onClick={() => search(query, page - 1)}
                            disabled={page <= 1}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-(--text-tertiary) border border-default bg-(--surface-raised) ${
                                page <= 1 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer opacity-100 hover:shadow hover:border-(--accent-40)'
                            }`}
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <span className="text-caption font-mono text-(--text-tertiary)">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => search(query, page + 1)}
                            disabled={page >= totalPages}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-(--text-tertiary) border border-default bg-(--surface-raised) ${
                                page >= totalPages ? 'cursor-not-allowed opacity-40' : 'cursor-pointer opacity-100 hover:shadow hover:border-(--accent-40)'
                            }`}
                        >
                            <ChevronRight size={14} />
                        </button>
                    </>
                )}

                {selected && (
                    <Button
                        size='sm'
                        onClick={handleAdd}
                        icon={<CheckCircle2 size={18} strokeWidth={2} />}
                        className="absolute! right-0!"
                    >
                        Add to Timeline
                    </Button>
                )}
            </div>
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
            className="fixed inset-0 z-80 flex items-center justify-center backdrop-blur-xs"
            onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="flex flex-col w-[90vw] h-[90vh] md:w-4/5 md:h-4/5 rounded-xl overflow-hidden shadow-accent-40 bg-(--surface-overlay)">
                <div className="flex items-center justify-between px-7 h-16 shrink-0">
                    <span className="text-body font-semibold text-(--text)">
                        Add Scene
                    </span>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:shadow"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex justify-center gap-6">
                    {([
                        { id: 'upload' as Tab, icon: Upload, label: 'Upload Video' },
                        { id: 'pexels' as Tab, icon: Search, label: 'Stock Footage' },
                    ]).map(({ id, icon: Icon, label }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex items-center gap-2.5 px-6 py-2 text-caption cursor-pointer border border-(--accent-10) rounded-xl ${
                                tab === id ? 'shadow-accent-22 bg-(--accent-20) font-bold' : 'font-semibold hover:border-(--accent-40) hover:shadow'
                            }`}
                        >
                            <Icon size={18} strokeWidth={tab === id ? 2.25 : 1.75} />
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