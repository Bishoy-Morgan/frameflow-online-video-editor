'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Loader2, Monitor, Smartphone, Square } from 'lucide-react'
import Link from 'next/link'

import EditorTopBar                           from './components/EditorTopBar'
import PreviewCanvas, { PreviewCanvasHandle } from './components/PreviewCanvas'
import SceneTimeline                          from './components/SceneTimeline'
import LeftToolsPanel, { type ToolId }        from './components/LeftToolsPanel'
import GeminiSidebar                          from './components/GeminiSidebar'

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

export default function EditorPage() {
    const params       = useParams()
    const searchParams = useSearchParams()
    const projectId    = params.projectId as string

    // ── Data ─────────────────────────────────────────────────────────────────
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState('')

    // ── Video state ───────────────────────────────────────────────────────────
    const canvasRef                              = useRef<PreviewCanvasHandle>(null)
    const [videoUrl,      setVideoUrl]      = useState<string | null>(null)
    const [videoDuration, setVideoDuration] = useState(0)
    const [currentTime,   setCurrentTime]   = useState(0)

    // ── Aspect ratio ──────────────────────────────────────────────────────────
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9')
    const [ratioOpen,   setRatioOpen]   = useState(false)

    // ── Editor UI state ───────────────────────────────────────────────────────
    const [activeTool,  setActiveTool]  = useState<ToolId | null>(null)
    const [activeScene, setActiveScene] = useState<string | null>(null)
    const [aiOpen,      setAiOpen]      = useState(true)

    // ── Save state ────────────────────────────────────────────────────────────
    const [saving, setSaving] = useState(false)
    const [saved,  setSaved]  = useState(false)

    // ── Fetch project ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (!projectId) return

        // Read selected scene IDs from URL param (?scenes=id1,id2,id3)
        const scenesParam    = searchParams.get('scenes')
        const allowedSceneIds = scenesParam ? new Set(scenesParam.split(',')) : null

        fetch(`/api/projects/${projectId}`)
            .then(r => r.json())
            .then(data => {
                if (data.error) { setError(data.error); return }

                // Filter to only selected scenes if param is present
                const allScenes: Scene[] = data.scenes ?? []
                const filteredScenes = allowedSceneIds
                    ? allScenes.filter(s => allowedSceneIds.has(s.id))
                    : allScenes

                const filtered = { ...data, scenes: filteredScenes }
                setProject(filtered)

                // Set aspect ratio from project
                if (data.aspectRatio && ['16:9', '9:16', '1:1'].includes(data.aspectRatio)) {
                    setAspectRatio(data.aspectRatio as AspectRatio)
                }

                // Auto-load first scene's video
                const sorted = [...filteredScenes].sort((a, b) => a.order - b.order)
                if (sorted.length > 0) {
                    setActiveScene(sorted[0].id)
                    if (sorted[0].videoUrl) setVideoUrl(sorted[0].videoUrl)
                }
            })
            .catch(() => setError('Failed to load project'))
            .finally(() => setLoading(false))
    }, [projectId, searchParams])

    // ── Video loaded ──────────────────────────────────────────────────────────
    const handleVideoLoad = useCallback((url: string, duration: number) => {
        setVideoUrl(url)
        if (duration > 0) setVideoDuration(duration)
    }, [])

    // ── Live time update ──────────────────────────────────────────────────────
    const handleTimeUpdate = useCallback((t: number) => {
        setCurrentTime(t)
        if (!project?.scenes.length) return
        const sorted  = [...project.scenes].sort((a, b) => a.order - b.order)
        let elapsed   = 0
        for (const scene of sorted) {
            if (t >= elapsed && t < elapsed + scene.duration) {
                setActiveScene(prev => prev !== scene.id ? scene.id : prev)
                break
            }
            elapsed += scene.duration
        }
    }, [project?.scenes])

    // ── Scene click → swap video ──────────────────────────────────────────────
    const handleSceneClick = useCallback((scene: Scene, seekTime: number) => {
        setActiveScene(scene.id)
        if (scene.videoUrl && scene.videoUrl !== videoUrl) {
            setVideoUrl(scene.videoUrl)
            setVideoDuration(0)
            setTimeout(() => canvasRef.current?.seekTo(0), 100)
        } else {
            canvasRef.current?.seekTo(seekTime)
        }
    }, [videoUrl])

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

    // ── Export ────────────────────────────────────────────────────────────────
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

    // ── Add scene ─────────────────────────────────────────────────────────────
    const handleAddScene = useCallback(async () => {
        if (!project) return
        try {
            const res = await fetch(`/api/projects/${projectId}/scenes`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                    title: 'New Scene', description: '', musicMood: 'Cinematic',
                    duration: 5, order: project.scenes.length,
                }),
            })
            const scene: Scene = await res.json()
            setProject(p => p ? { ...p, scenes: [...p.scenes, scene] } : p)
            setActiveScene(scene.id)
        } catch (err) { console.error('Add scene failed:', err) }
    }, [project, projectId])

    // ── AI scenes update ──────────────────────────────────────────────────────
    const handleScenesUpdate = useCallback((scenes: Scene[]) => {
        setProject(p => p ? { ...p, scenes } : p)
        if (scenes.length > 0) {
            setActiveScene(scenes[0].id)
            if (scenes[0].videoUrl) setVideoUrl(scenes[0].videoUrl)
        }
    }, [])

    // ── Tool sub-panels ───────────────────────────────────────────────────────
    const toolPanels: Partial<Record<ToolId, React.ReactNode>> = {
        trim: (
            <div className="p-4 flex flex-col gap-3">
                <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>Trim & Cut</p>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
                    Click a scene in the timeline to select it, then use in/out handles to trim.
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

    // ── Loading / error ───────────────────────────────────────────────────────
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
                <Link href="/dashboard/projects" className="text-xs" style={{ color: 'var(--turquoise)' }}>
                    ← Back to Projects
                </Link>
            </div>
        </div>
    )

    const totalDuration = project.scenes.reduce((s, c) => s + c.duration, 0)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100dvh', overflow: 'hidden', backgroundColor: 'var(--bg)' }}>

            {/* Top bar */}
            <div style={{ flexShrink: 0 }}>
                <EditorTopBar
                    projectId={projectId}
                    projectName={project.name}
                    saving={saving}
                    saved={saved}
                    aiOpen={aiOpen}
                    onToggleAi={() => setAiOpen(v => !v)}
                    onSave={handleSave}
                    onExport={handleExport}
                />
            </div>

            {/* Middle row */}
            <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

                {/* Left tools */}
                <div style={{ flexShrink: 0 }}>
                    <LeftToolsPanel
                        activeTool={activeTool}
                        onToolClick={id => setActiveTool(prev => prev === id ? null : id)}
                    />
                </div>

                {/* Tool sub-panel */}
                {activeTool && toolPanels[activeTool] && (
                    <div style={{ width: '200px', flexShrink: 0, overflowY: 'auto', backgroundColor: 'var(--bg)', borderRight: '1px solid var(--border-default)' }}>
                        {toolPanels[activeTool]}
                    </div>
                )}

                {/* Preview canvas — relative so floating controls can anchor to it */}
                <div
                    className="relative"
                    style={{ flex: '1 1 0', minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'var(--surface-raised)' }}
                >
                    <PreviewCanvas
                        ref={canvasRef}
                        videoUrl={videoUrl}
                        aspectRatio={aspectRatio}
                        onVideoLoad={handleVideoLoad}
                        onTimeUpdate={handleTimeUpdate}
                    />

                    {/* ── Floating aspect ratio control ── */}
                    <div
                        className="absolute bottom-4 right-4 flex flex-col items-end gap-1"
                        style={{ zIndex: 20 }}
                    >
                        {/* Toggle button */}
                        <button
                            onClick={() => setRatioOpen(o => !o)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150"
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

                        {/* Options panel */}
                        {ratioOpen && (
                            <div
                                className="flex flex-col gap-1 p-1.5 rounded-xl"
                                style={{
                                    backgroundColor: 'rgba(0,0,0,0.75)',
                                    backdropFilter:  'blur(12px)',
                                    border:          '1px solid rgba(255,255,255,0.1)',
                                }}
                            >
                                {RATIO_OPTIONS.map(({ label, icon: Icon, hint }) => (
                                    <button
                                        key={label}
                                        onClick={() => { setAspectRatio(label); setRatioOpen(false) }}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 text-left"
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
                <div style={{ width: aiOpen ? '300px' : '0px', flexShrink: 0, overflow: 'hidden', transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)', borderLeft: aiOpen ? '1px solid var(--border-default)' : 'none' }}>
                    <div style={{ width: '300px', height: '100%', overflow: 'hidden' }}>
                        <GeminiSidebar
                            projectId={projectId}
                            projectName={project.name}
                            prompt={project.prompt}
                            scenes={project.scenes}
                            videoUrl={videoUrl}
                            onScenesUpdate={handleScenesUpdate}
                        />
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div style={{ flexShrink: 0 }}>
                <SceneTimeline
                    scenes={project.scenes}
                    activeSceneId={activeScene}
                    currentTime={currentTime}
                    totalDuration={totalDuration}
                    onSceneClick={handleSceneClick}
                    onAddScene={handleAddScene}
                />
            </div>
        </div>
    )
}