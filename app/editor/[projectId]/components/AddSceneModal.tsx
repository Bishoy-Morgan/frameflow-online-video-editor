'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
    X, Upload, Search, Film, Loader2,
    CloudUpload, CheckCircle2, AlertCircle,
    ChevronLeft, ChevronRight,
} from 'lucide-react'
import Button from '@/components/ui/Button'

interface Scene {
    id:          string
    title:       string
    description: string
    musicMood:   string
    duration:    number
    order:       number
    videoUrl:    string | null
    pexelsId:    string | null
}

interface PexelsVideo {
    id:       number
    duration: number
    image:    string
    videoUrl: string
    width:    number
    height:   number
    user:     string
}

interface AddSceneModalProps {
    projectId:  string
    sceneOrder: number
    onAdd:      (scene: Scene) => void
    onClose:    () => void
}

type Tab = 'upload' | 'pexels'

const MOOD_OPTIONS = [
    'Cinematic', 'Dramatic', 'Uplifting', 'Calm',
    'Energetic', 'Melancholic', 'Mysterious', 'Playful',
]

const MAX_SIZE_BYTES = 50 * 1024 * 1024
const ALLOWED_TYPES  = ['video/mp4', 'video/quicktime', 'video/webm']

// Upload Tab

function UploadTab({
    projectId,
    sceneOrder,
    onAdd,
}: {
    projectId:  string
    sceneOrder: number
    onAdd:      (scene: Scene) => void
}) {
    const [dragOver,  setDragOver]  = useState(false)
    const [file,      setFile]      = useState<File | null>(null)
    const [preview,   setPreview]   = useState<string | null>(null)
    const [duration,  setDuration]  = useState(5)
    const [title,     setTitle]     = useState('')
    const [mood,      setMood]      = useState('Cinematic')
    const [uploading, setUploading] = useState(false)
    const [error,     setError]     = useState('')
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
                id:          `temp-${Date.now()}`,
                title:       title.trim() || 'New Scene',
                description: '',
                musicMood:   mood,
                duration,
                order:       sceneOrder,
                videoUrl:    data.url,
                pexelsId:    null,
            }
            onAdd(scene)
        } catch {
            setError('Upload failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            {!file ? (
                <div
                    className="flex flex-col items-center justify-center gap-4 rounded-2xl cursor-pointer transition-all"
                    style={{
                        height:          '220px',
                        border:          `2px dashed ${dragOver ? 'var(--turquoise)' : 'var(--border-default)'}`,
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
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{
                            backgroundColor: dragOver ? 'var(--turquoise-16)' : 'var(--bg)',
                            border:          `1px solid ${dragOver ? 'var(--turquoise-42)' : 'var(--border-default)'}`,
                        }}>
                        <CloudUpload size={24}
                            style={{ color: dragOver ? 'var(--turquoise)' : 'var(--text-tertiary)' }}
                            strokeWidth={1.5} />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold"
                            style={{ color: dragOver ? 'var(--turquoise)' : 'var(--text)' }}>
                            {dragOver ? 'Drop to upload' : 'Drop your video here'}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                            or click to browse · MP4, MOV, WebM · max 50MB
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex gap-4">
                    <div className="relative rounded-xl overflow-hidden shrink-0"
                        style={{ width: '160px', height: '120px', backgroundColor: '#000' }}>
                        <video ref={videoRef} src={preview ?? ''} className="w-full h-full object-cover" muted />
                        <button
                            onClick={() => { setFile(null); setPreview(null); setError('') }}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', color: 'white' }}
                        >
                            <X size={10} />
                        </button>
                        <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold"
                            style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white' }}>
                            {duration}s
                        </div>
                    </div>
                    <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Scene title</label>
                            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Product close-up"
                                className="w-full text-xs rounded-lg px-2.5 py-2 outline-none"
                                style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text)' }}
                                onFocus={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
                                onBlur={e =>  e.currentTarget.style.borderColor = 'var(--border-default)'} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Duration (s)</label>
                            <input type="number" min={1} max={duration} step={0.5} value={duration}
                                onChange={e => setDuration(Math.max(1, parseFloat(e.target.value) || 1))}
                                className="w-full text-xs rounded-lg px-2.5 py-2 outline-none"
                                style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text)' }}
                                onFocus={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
                                onBlur={e =>  e.currentTarget.style.borderColor = 'var(--border-default)'} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Music mood</label>
                            <select value={mood} onChange={e => setMood(e.target.value)}
                                className="w-full text-xs rounded-lg px-2.5 py-2 outline-none"
                                style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text)', cursor: 'pointer' }}>
                                {MOOD_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <AlertCircle size={13} style={{ color: '#ef4444' }} />
                    <span className="text-xs" style={{ color: '#ef4444' }}>{error}</span>
                </div>
            )}

            {file && (
                <Button onClick={handleUpload} disabled={uploading}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-opacity mt-auto"
                    style={{ backgroundColor: 'var(--turquoise)', border: 'none', color: '#fff', cursor: uploading ? 'wait' : 'pointer', boxShadow: '0 2px 12px var(--turquoise-22)' }}
                    onMouseEnter={e => { if (!uploading) e.currentTarget.style.opacity = '0.88' }}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                    {uploading
                        ? <><Loader2 size={14} className="animate-spin" /> Uploading…</>
                        : <><CheckCircle2 size={14} /> Add to Timeline</>}
                </Button>
            )}
        </div>
    )
}

//  Pexels Tab

function PexelsVideoCard({
    video,
    selected,
    onSelect,
}: {
    video:    PexelsVideo
    selected: boolean
    onSelect: (v: PexelsVideo) => void
}) {
    const [hovered, setHovered] = useState(false)

    return (
        <div
            onClick={() => onSelect(video)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position:     'relative',
                width:        '100%',
                height:       '200px',
                borderRadius: '12px',
                overflow:     'hidden',
                cursor:       'pointer',
                border:       `2px solid ${selected ? 'var(--turquoise)' : 'transparent'}`,
                boxShadow:    selected ? '0 0 0 2px var(--turquoise-22)' : 'none',
                flexShrink:   0,
            }}
        >
            <img
                src={video.image}
                alt={`Pexels ${video.id}`}
                width={630}
                height={1200}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />

            {/* Hover overlay — driven by state, not Tailwind group */}
            <div style={{
                position:        'absolute',
                inset:           0,
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                backgroundColor: 'rgba(0,0,0,0.4)',
                opacity:         hovered ? 1 : 0,
                transition:      'opacity 0.15s ease',
            }}>
                <div style={{
                    width:           '32px',
                    height:          '32px',
                    borderRadius:    '50%',
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    backdropFilter:  'blur(4px)',
                }}>
                    <Film size={14} color="white" />
                </div>
            </div>

            {/* Duration badge */}
            <div style={{
                position:        'absolute',
                bottom:          '6px',
                left:            '6px',
                padding:         '2px 6px',
                borderRadius:    '6px',
                fontSize:        '10px',
                fontFamily:      'monospace',
                fontWeight:      700,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color:           'white',
            }}>
                {video.duration}s
            </div>

            {/* Selected checkmark */}
            {selected && (
                <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--turquoise)' }} fill="white" />
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
    onAdd:      (scene: Scene) => void
}) {
    const [query,    setQuery]    = useState('')
    const [videos,   setVideos]   = useState<PexelsVideo[]>([])
    const [loading,  setLoading]  = useState(false)
    const [error,    setError]    = useState('')
    const [page,     setPage]     = useState(1)
    const [total,    setTotal]    = useState(0)
    const [selected, setSelected] = useState<PexelsVideo | null>(null)
    const [title,    setTitle]    = useState('')
    const [mood,     setMood]     = useState('Cinematic')

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
            id:          `temp-${Date.now()}`,
            title:       title.trim() || `Pexels clip ${selected.id}`,
            description: '',
            musicMood:   mood,
            duration:    selected.duration,
            order:       sceneOrder,
            videoUrl:    selected.videoUrl,
            pexelsId:    String(selected.id),
        }
        onAdd(scene)
    }

    const totalPages = Math.ceil(total / 12)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', minHeight: 0 }}>

            {/* Search bar */}
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
                    borderRadius: '12px', padding: '0 12px',
                    backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)',
                }}>
                    <Search size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && search(query, 1)}
                        placeholder="Search stock footage…"
                        style={{
                            flex: 1, fontSize: '12px', padding: '10px 0',
                            outline: 'none', backgroundColor: 'transparent', color: 'var(--text)',
                            border: 'none',
                        }}
                    />
                </div>
                <button
                    onClick={() => search(query, 1)}
                    disabled={!query.trim() || loading}
                    style={{
                        padding:         '0 16px',
                        borderRadius:    '12px',
                        fontSize:        '12px',
                        fontWeight:      700,
                        backgroundColor: query.trim() ? 'var(--turquoise)' : 'var(--surface-raised)',
                        border:          `1px solid ${query.trim() ? 'transparent' : 'var(--border-default)'}`,
                        color:           query.trim() ? '#fff' : 'var(--text-tertiary)',
                        cursor:          query.trim() && !loading ? 'pointer' : 'not-allowed',
                    }}
                >
                    {loading ? <Loader2 size={12} className="animate-spin" /> : 'Search'}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 12px', borderRadius: '8px', flexShrink: 0,
                    backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                }}>
                    <AlertCircle size={13} style={{ color: '#ef4444' }} />
                    <span style={{ fontSize: '12px', color: '#ef4444' }}>{error}</span>
                </div>
            )}

            {/* Empty state */}
            {videos.length === 0 && !loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1, opacity: 0.4 }}>
                    <Film size={28} style={{ color: 'var(--text-tertiary)' }} strokeWidth={1.5} />
                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        {query ? 'No results found' : 'Search for stock footage above'}
                    </p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Loader2 size={20} className="animate-spin" style={{ color: 'var(--turquoise)' }} />
                </div>
            )}

            {/* Results grid — this is the scrollable area */}
            {!loading && videos.length > 0 && (
                <div style={{
                    display:          'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridAutoRows:        '200px', 
                    gap:              '12px',
                    overflowY:        'auto',
                    flex:             1,
                    minHeight:        0,
                    paddingRight:     '4px',
                    scrollbarWidth:   'thin',
                    scrollbarColor:   'var(--border-strong) transparent',
                }}>
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

            {/* Pagination */}
            {totalPages > 1 && !loading && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexShrink: 0 }}>
                    <button
                        onClick={() => search(query, page - 1)}
                        disabled={page <= 1}
                        style={{
                            width: '28px', height: '28px', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)',
                            cursor: page <= 1 ? 'not-allowed' : 'pointer',
                            opacity: page <= 1 ? 0.4 : 1, color: 'var(--text-tertiary)',
                        }}
                    >
                        <ChevronLeft size={13} />
                    </button>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-tertiary)' }}>
                        {page} / {totalPages}
                    </span>
                    <button
                        onClick={() => search(query, page + 1)}
                        disabled={page >= totalPages}
                        style={{
                            width: '28px', height: '28px', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)',
                            cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                            opacity: page >= totalPages ? 0.4 : 1, color: 'var(--text-tertiary)',
                        }}
                    >
                        <ChevronRight size={13} />
                    </button>
                </div>
            )}

            {/* Selected — metadata + add button */}
            {selected && (
                <div style={{
                    display: 'flex', gap: '8px', alignItems: 'flex-end',
                    flexShrink: 0, paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Scene title"
                            style={{
                                width: '100%', fontSize: '12px', borderRadius: '8px',
                                padding: '8px 10px', outline: 'none',
                                backgroundColor: 'var(--surface-raised)',
                                border: '1px solid var(--border-default)',
                                color: 'var(--text)',
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
                            onBlur={e =>  e.currentTarget.style.borderColor = 'var(--border-default)'}
                        />
                        <select
                            value={mood}
                            onChange={e => setMood(e.target.value)}
                            style={{
                                width: '100%', fontSize: '12px', borderRadius: '8px',
                                padding: '8px 10px', outline: 'none', cursor: 'pointer',
                                backgroundColor: 'var(--surface-raised)',
                                border: '1px solid var(--border-default)',
                                color: 'var(--text)',
                            }}
                        >
                            {MOOD_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={handleAdd}
                        style={{
                            display:         'flex',
                            flexDirection:   'column',
                            alignItems:      'center',
                            justifyContent:  'center',
                            gap:             '4px',
                            padding:         '0 16px',
                            height:          '72px',
                            borderRadius:    '12px',
                            fontSize:        '12px',
                            fontWeight:      700,
                            flexShrink:      0,
                            backgroundColor: 'var(--turquoise)',
                            border:          'none',
                            color:           '#fff',
                            cursor:          'pointer',
                            boxShadow:       '0 2px 8px var(--turquoise-22)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        <CheckCircle2 size={13} />
                        <span>Add to<br />Timeline</span>
                    </button>
                </div>
            )}
        </div>
    )
}

// Main Modal

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
                style={{
                    display:         'flex',
                    flexDirection:   'column',
                    width:           '80vw',
                    height:          '80vh',      // fixed height, not maxHeight
                    borderRadius:    '16px',
                    overflow:        'hidden',
                    backgroundColor: 'var(--bg)',
                    border:          '1px solid var(--border-default)',
                    boxShadow:       '0 24px 60px rgba(0,0,0,0.4)',
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 20px', height: '52px', flexShrink: 0,
                    borderBottom: '1px solid var(--border-default)',
                }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                        Add Scene
                    </span>
                    <button
                        onClick={onClose}
                        style={{
                            width: '28px', height: '28px', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)',
                            cursor: 'pointer', color: 'var(--text-tertiary)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
                    >
                        <X size={13} />
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', flexShrink: 0, borderBottom: '1px solid var(--border-default)' }}>
                    {([
                        { id: 'upload' as Tab, icon: Upload, label: 'Upload Video'  },
                        { id: 'pexels' as Tab, icon: Search, label: 'Stock Footage' },
                    ]).map(({ id, icon: Icon, label }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            style={{
                                display:      'flex',
                                alignItems:   'center',
                                gap:          '8px',
                                padding:      '12px 20px',
                                fontSize:     '12px',
                                fontWeight:   700,
                                background:   'none',
                                border:       'none',
                                borderBottom: tab === id ? '2px solid var(--turquoise)' : '2px solid transparent',
                                color:        tab === id ? 'var(--turquoise)' : 'var(--text-tertiary)',
                                cursor:       'pointer',
                                marginBottom: '-1px',
                            }}
                        >
                            <Icon size={13} strokeWidth={tab === id ? 2 : 1.75} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Content — flex-1 + minHeight 0 allows children to scroll */}
                <div style={{
                    flex:       1,
                    minHeight:  0,
                    overflow:   'hidden',
                    padding:    '20px',
                    display:    'flex',
                    flexDirection: 'column',
                }}>
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