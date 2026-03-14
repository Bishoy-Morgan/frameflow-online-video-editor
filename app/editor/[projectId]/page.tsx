'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Loader2, Monitor, Smartphone, Square } from 'lucide-react'
import Link from 'next/link'

import EditorTopBar                           from './components/EditorTopBar'
import PreviewCanvas, { PreviewCanvasHandle } from './components/PreviewCanvas'
import SceneTimeline                          from './components/SceneTimeline'
import LeftToolsPanel, { type ToolId }        from './components/LeftToolsPanel'
import AISidebar                              from './components/AISidebar'
import AddSceneModal                          from './components/AddSceneModal'

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

interface Project {
    id:          string
    name:        string
    starred:     boolean
    prompt:      string | null
    style:       string | null
    aspectRatio: string | null
    scenes:      Scene[]
    _count: { assets: number; timelines: number; renders: number }
}

type AspectRatio = '16:9' | '9:16' | '1:1'

const RATIO_OPTIONS: { label: AspectRatio; icon: React.ElementType; hint: string }[] = [
    { label: '16:9', icon: Monitor,    hint: 'YouTube / Web'  },
    { label: '9:16', icon: Smartphone, hint: 'Reels / TikTok' },
    { label: '1:1',  icon: Square,     hint: 'Feed / Square'  },
]

function buildStartTimes(scenes: Scene[]): Map<string, number> {
    const sorted = [...scenes].sort((a, b) => a.order - b.order)
    const map    = new Map<string, number>()
    let   offset = 0
    for (const s of sorted) {
        map.set(s.id, offset)
        offset += s.duration
    }
    return map
}

export default function EditorPage() {
    const params       = useParams()
    const searchParams = useSearchParams()
    const projectId    = params.projectId as string

    const [project,        setProject]        = useState<Project | null>(null)
    const [loading,        setLoading]        = useState(true)
    const [error,          setError]          = useState('')
    const [aspectRatio,    setAspectRatio]    = useState<AspectRatio>('16:9')
    const [ratioOpen,      setRatioOpen]      = useState(false)
    const [activeTool,     setActiveTool]     = useState<ToolId | null>(null)
    const [aiOpen,         setAiOpen]         = useState(true)
    const [saving,         setSaving]         = useState(false)
    const [saved,          setSaved]          = useState(false)
    const [playing,        setPlaying]        = useState(false)
    const [addSceneOpen,   setAddSceneOpen]   = useState(false)

    const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const canvasRef     = useRef<PreviewCanvasHandle>(null)

    const [globalTime,      setGlobalTime]      = useState(0)
    const [activeSceneId,   setActiveSceneId]   = useState<string | null>(null)
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)

    const startTimesRef = useRef<Map<string, number>>(new Map())

    const getSortedScenes = useCallback((scenes: Scene[]) =>
        [...scenes].sort((a, b) => a.order - b.order)
    , [])

    const getTotalDuration = useCallback((scenes: Scene[]) =>
        scenes.reduce((s, c) => s + c.duration, 0)
    , [])

    const activeClipDuration = project?.scenes.find(s => s.id === activeSceneId)?.duration ?? 0

    // ── Fetch project ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (!projectId) return
        const scenesParam     = searchParams.get('scenes')
        const allowedSceneIds = scenesParam ? new Set(scenesParam.split(',')) : null

        fetch(`/api/projects/${projectId}`)
            .then(r => r.json())
            .then(data => {
                if (data.error) { setError(data.error); return }
                const allScenes: Scene[] = data.scenes ?? []
                const filtered = allowedSceneIds
                    ? allScenes.filter(s => allowedSceneIds.has(s.id))
                    : allScenes
                const proj = { ...data, scenes: filtered }
                setProject(proj)

                if (data.aspectRatio && ['16:9','9:16','1:1'].includes(data.aspectRatio))
                    setAspectRatio(data.aspectRatio as AspectRatio)

                startTimesRef.current = buildStartTimes(filtered)

                const sorted = getSortedScenes(filtered)
                if (sorted.length > 0) {
                    setActiveSceneId(sorted[0].id)
                    setCurrentVideoUrl(sorted[0].videoUrl ?? null)
                }
            })
            .catch(() => setError('Failed to load project'))
            .finally(() => setLoading(false))
    }, [projectId, searchParams, getSortedScenes])

    useEffect(() => {
        if (!project) return
        startTimesRef.current = buildStartTimes(project.scenes)
    }, [project])

    // ── Time update ───────────────────────────────────────────────────────────
    const handleTimeUpdate = useCallback((clipTime: number) => {
        if (!activeSceneId) return
        const sceneStart = startTimesRef.current.get(activeSceneId) ?? 0
        setGlobalTime(sceneStart + clipTime)
    }, [activeSceneId])

    // ── Clip ended ────────────────────────────────────────────────────────────
    const handleClipEnded = useCallback(() => {
        if (!project) return
        const sorted = getSortedScenes(project.scenes)
        const idx    = sorted.findIndex(s => s.id === activeSceneId)
        const next   = sorted[idx + 1]
        if (next) {
            setActiveSceneId(next.id)
            setCurrentVideoUrl(next.videoUrl ?? null)
        } else {
            setPlaying(false)
            const last = sorted[sorted.length - 1]
            if (last) setGlobalTime(startTimesRef.current.get(last.id)! + last.duration)
        }
    }, [project, activeSceneId, getSortedScenes])

    // ── Scene click ───────────────────────────────────────────────────────────
    const handleSceneClick = useCallback((scene: Scene, seekTime: number) => {
        const sceneStart  = startTimesRef.current.get(scene.id) ?? 0
        const localOffset = Math.max(0, seekTime - sceneStart)
        setActiveSceneId(scene.id)
        setGlobalTime(seekTime)
        if (scene.videoUrl !== currentVideoUrl) {
            setCurrentVideoUrl(scene.videoUrl ?? null)
        } else {
            canvasRef.current?.seekTo(localOffset)
        }
    }, [currentVideoUrl])

    // ── Transport ─────────────────────────────────────────────────────────────
    const handlePlay = useCallback(() => {
        canvasRef.current?.play()
        setPlaying(true)
    }, [])

    const handlePause = useCallback(() => {
        canvasRef.current?.pause()
        setPlaying(false)
    }, [])

    const handleStop = useCallback(() => {
        canvasRef.current?.pause()
        if (!project) return
        const sorted = getSortedScenes(project.scenes)
        if (sorted.length > 0) {
            setActiveSceneId(sorted[0].id)
            setCurrentVideoUrl(sorted[0].videoUrl ?? null)
        }
        setGlobalTime(0)
        setPlaying(false)
        setTimeout(() => canvasRef.current?.seekTo(0), 50)
    }, [project, getSortedScenes])

    const handlePlayStateChange = useCallback((isPlaying: boolean) => {
        setPlaying(isPlaying)
    }, [])

    // ── Save ──────────────────────────────────────────────────────────────────
    const handleSave = useCallback(async () => {
        if (!project) return
        setSaving(true)
        try {
            await fetch(`/api/projects/${projectId}`, {
                method:  'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ action: 'save', scenes: project.scenes }),
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } finally { setSaving(false) }
    }, [project, projectId])

    const persistScenes = useCallback((scenes: Scene[]) => {
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
        autoSaveTimer.current = setTimeout(async () => {
            try {
                await fetch(`/api/projects/${projectId}`, {
                    method:  'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ action: 'save', scenes }),
                })
            } catch (err) { console.error('Auto-save failed:', err) }
        }, 800)
    }, [projectId])

    const handleExport = useCallback(async () => {
        try {
            await fetch('/api/render', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ projectId, aspectRatio }),
            })
            alert("Export queued! You'll be notified when ready.")
        } catch { alert('Export failed. Please try again.') }
    }, [projectId, aspectRatio])

    // ── Add scene — modal confirms, then we append ────────────────────────────
    const handleSceneAdded = useCallback((scene: Scene) => {
        if (!project) return
        const updated = [...project.scenes, scene]
        setProject(p => p ? { ...p, scenes: updated } : p)
        setActiveSceneId(scene.id)
        setCurrentVideoUrl(scene.videoUrl ?? null)
        persistScenes(updated)
    }, [project, persistScenes])

    const handleScenesUpdate = useCallback((scenes: Scene[]) => {
        setProject(p => p ? { ...p, scenes } : p)
        persistScenes(scenes)
        const stillExists = scenes.some(s => s.id === activeSceneId)
        if (!stillExists) {
            const sorted = getSortedScenes(scenes)
            if (sorted.length > 0) {
                setActiveSceneId(sorted[0].id)
                setCurrentVideoUrl(sorted[0].videoUrl ?? null)
            }
        }
    }, [getSortedScenes, persistScenes, activeSceneId])

    const toolPanels: Partial<Record<ToolId, React.ReactNode>> = {
        trim: (
            <div className="p-4 flex flex-col gap-3">
                <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>Trim & Cut</p>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
                    Drag the left or right edge of any clip in the timeline to trim it.
                </p>
            </div>
        ),
        text: (
            <div className="p-4 flex flex-col gap-3">
                <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>Text Overlays</p>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
                    Add titles, lower thirds, and captions.
                </p>
            </div>
        ),
        audio: (
            <div className="p-4 flex flex-col gap-3">
                <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>Audio Tracks</p>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
                    Background music and voiceover tracks. Coming in v2.
                </p>
            </div>
        ),
    }

    if (loading) return (
        <div className="flex items-center justify-center" style={{ height: '100dvh', backgroundColor: 'var(--bg)' }}>
            <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="animate-spin" style={{ color: 'var(--turquoise)' }} />
                <p className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>Loading editor…</p>
            </div>
        </div>
    )

    if (error || !project) return (
        <div className="flex items-center justify-center" style={{ height: '100dvh', backgroundColor: 'var(--bg)' }}>
            <div className="flex flex-col items-center gap-3">
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Project not found</p>
                <Link href="/dashboard" className="text-xs" style={{ color: 'var(--turquoise)' }}>← Back to Dashboard</Link>
            </div>
        </div>
    )

    const totalDuration = getTotalDuration(project.scenes)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100dvh', overflow: 'hidden', backgroundColor: 'var(--bg)' }}>

            <div style={{ flexShrink: 0 }}>
                <EditorTopBar
                    projectId={projectId}
                    projectName={project.name}
                    saving={saving} saved={saved}
                    aiOpen={aiOpen}
                    onToggleAi={() => setAiOpen(v => !v)}
                    onSave={handleSave}
                    onExport={handleExport}
                />
            </div>

            <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <div style={{ flexShrink: 0 }}>
                    <LeftToolsPanel
                        activeTool={activeTool}
                        onToolClick={id => setActiveTool(prev => prev === id ? null : id)}
                    />
                </div>

                {activeTool && toolPanels[activeTool] && (
                    <div style={{ width: '200px', flexShrink: 0, overflowY: 'auto', backgroundColor: 'var(--bg)', borderRight: '1px solid var(--border-default)' }}>
                        {toolPanels[activeTool]}
                    </div>
                )}

                {/* Preview */}
                <div
                    className="relative"
                    style={{ flex: '1 1 0', minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'var(--surface-raised)' }}
                >
                    <PreviewCanvas
                        ref={canvasRef}
                        videoUrl={currentVideoUrl}
                        aspectRatio={aspectRatio}
                        clipDuration={activeClipDuration}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleClipEnded}
                        onPlayStateChange={handlePlayStateChange}
                    />

                    {/* Aspect ratio picker */}
                    <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1" style={{ zIndex: 20 }}>
                        <button
                            onClick={() => setRatioOpen(o => !o)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{
                                backgroundColor: ratioOpen ? 'var(--turquoise)' : 'rgba(0,0,0,0.6)',
                                backdropFilter:  'blur(8px)',
                                border:          `1px solid ${ratioOpen ? 'transparent' : 'rgba(255,255,255,0.12)'}`,
                                color:           ratioOpen ? '#020202' : 'white',
                            }}
                        >
                            {React.createElement(
                                RATIO_OPTIONS.find(r => r.label === aspectRatio)?.icon ?? Monitor,
                                { size: 12, strokeWidth: 2 }
                            )}
                            {aspectRatio}
                        </button>
                        {ratioOpen && (
                            <div className="flex flex-col gap-1 p-1.5 rounded-xl"
                                style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {RATIO_OPTIONS.map(({ label, icon: Icon, hint }) => (
                                    <button key={label}
                                        onClick={() => { setAspectRatio(label); setRatioOpen(false) }}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left"
                                        style={{
                                            backgroundColor: aspectRatio === label ? 'var(--turquoise-16)' : 'transparent',
                                            color:           aspectRatio === label ? 'var(--turquoise)'    : 'rgba(255,255,255,0.8)',
                                            border:          `1px solid ${aspectRatio === label ? 'var(--turquoise-42)' : 'transparent'}`,
                                            cursor:          'pointer',
                                        }}
                                        onMouseEnter={e => { if (aspectRatio !== label) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)' }}
                                        onMouseLeave={e => { if (aspectRatio !== label) e.currentTarget.style.backgroundColor = 'transparent' }}
                                    >
                                        <Icon size={13} strokeWidth={1.75} />
                                        <span>{label}</span>
                                        <span style={{ opacity: 0.5, fontSize: '10px' }}>{hint}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Sidebar */}
                <div style={{ width: aiOpen ? '300px' : '0px', flexShrink: 0, overflow: 'hidden', transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)', borderLeft: aiOpen ? '1px solid var(--border-default)' : 'none' }}>
                    <div style={{ width: '300px', height: '100%', overflow: 'hidden' }}>
                        <AISidebar
                            projectId={projectId}
                            projectName={project.name}
                            prompt={project.prompt}
                            scenes={project.scenes}
                            videoUrl={currentVideoUrl}
                            onScenesUpdate={handleScenesUpdate}
                        />
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div style={{ flexShrink: 0 }}>
                <SceneTimeline
                    scenes={project.scenes}
                    activeSceneId={activeSceneId}
                    currentTime={globalTime}
                    totalDuration={totalDuration}
                    playing={playing}
                    onSceneClick={handleSceneClick}
                    onAddScene={() => setAddSceneOpen(true)}
                    onScenesChange={handleScenesUpdate}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onStop={handleStop}
                />
            </div>

            {/* Add Scene Modal */}
            {addSceneOpen && (
                <AddSceneModal
                    projectId={projectId}
                    sceneOrder={project.scenes.length}
                    onAdd={handleSceneAdded}
                    onClose={() => setAddSceneOpen(false)}
                />
            )}
        </div>
    )
}