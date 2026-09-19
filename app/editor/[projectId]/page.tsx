'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Loader2, Monitor, Smartphone, Square, Sparkles, X, ArrowLeftFromLineIcon } from 'lucide-react'
import Link from 'next/link'

import EditorTopBar from './components/EditorTopBar'
import PreviewCanvas, { PreviewCanvasHandle } from './components/PreviewCanvas'
import SceneTimeline from './components/SceneTimeline'
import LeftToolsPanel, { type ToolId } from './components/LeftToolsPanel'
import AISidebar from './components/AISidebar'
import AddSceneModal from './components/AddSceneModal'
import SharePanel from './components/SharePanel'
import { useFileUpload } from '@/hooks/useFileUpload'

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

interface Project {
    id: string
    name: string
    starred: boolean
    prompt: string | null
    style: string | null
    aspectRatio: string | null
    musicUrl: string | null
    musicSource: string | null
    voiceoverUrl: string | null
    voiceoverSource: string | null
    scenes: Scene[]
    _count: { assets: number; timelines: number; renders: number }
}

type AspectRatio = '16:9' | '9:16' | '1:1'

const RATIO_OPTIONS: { label: AspectRatio; icon: React.ElementType; hint: string }[] = [
    { label: '16:9', icon: Monitor, hint: 'YouTube Web' },
    { label: '9:16', icon: Smartphone, hint: 'Reels TikTok' },
    { label: '1:1', icon: Square, hint: 'Feed Square' },
]

function buildStartTimes(scenes: Scene[]): Map<string, number> {
    const sorted = [...scenes].sort((a, b) => a.order - b.order)
    const map = new Map<string, number>()
    let offset = 0
    for (const s of sorted) {
        map.set(s.id, offset)
        offset += s.duration
    }
    return map
}

export default function EditorPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const projectId = params.projectId as string

    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9')
    const [ratioOpen, setRatioOpen] = useState(false)
    const [activeTool, setActiveTool] = useState<ToolId | null>(null)
    const [aiOpen, setAiOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [playing, setPlaying] = useState(false)
    const [addSceneOpen, setAddSceneOpen] = useState(false)
    const [shareOpen, setShareOpen] = useState(false)

    const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const canvasRef = useRef<PreviewCanvasHandle>(null)
    const initialScenesRef = useRef<string | null>(null)

    const [globalTime, setGlobalTime] = useState(0)
    const [activeSceneId, setActiveSceneId] = useState<string | null>(null)
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)

    const startTimesRef = useRef<Map<string, number>>(new Map())

    const getSortedScenes = useCallback((scenes: Scene[]) =>
        [...scenes].sort((a, b) => a.order - b.order)
    , [])

    const getTotalDuration = useCallback((scenes: Scene[]) =>
        scenes.reduce((s, c) => s + c.duration, 0)
    , [])

    const activeClipDuration = project?.scenes.find(s => s.id === activeSceneId)?.duration ?? 0

    const seekOffset = activeSceneId
        ? Math.max(0, globalTime - (startTimesRef.current.get(activeSceneId) ?? 0))
        : 0

    useEffect(() => {
        if (!projectId) return
        const scenesParam = searchParams.get('scenes')
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
                initialScenesRef.current = JSON.stringify(filtered)

                if (data.aspectRatio && ['16:9', '9:16', '1:1'].includes(data.aspectRatio))
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

    const handleTimeUpdate = useCallback((clipTime: number) => {
        if (!activeSceneId) return
        const sceneStart = startTimesRef.current.get(activeSceneId) ?? 0
        setGlobalTime(sceneStart + clipTime)
    }, [activeSceneId])

    const handleClipEnded = useCallback(() => {
        if (!project) return
        const sorted = getSortedScenes(project.scenes)
        const idx = sorted.findIndex(s => s.id === activeSceneId)
        const next = sorted[idx + 1]
        if (next) {
            setActiveSceneId(next.id)
            setCurrentVideoUrl(next.videoUrl ?? null)
            setGlobalTime(startTimesRef.current.get(next.id) ?? 0)
        } else {
            setPlaying(false)
            const last = sorted[sorted.length - 1]
            if (last) setGlobalTime(startTimesRef.current.get(last.id)! + last.duration)
        }
    }, [project, activeSceneId, getSortedScenes])

    const handleSceneClick = useCallback((scene: Scene, seekTime: number) => {
        if (playing) {
            canvasRef.current?.pause()
            setPlaying(false)
        }
        setActiveSceneId(scene.id)
        setGlobalTime(seekTime)
        if (scene.videoUrl !== currentVideoUrl) {
            setCurrentVideoUrl(scene.videoUrl ?? null)
        }
    }, [currentVideoUrl, playing])

    const handlePlayheadDrag = useCallback((time: number) => {
        if (!project) return
        if (playing) {
            canvasRef.current?.pause()
            setPlaying(false)
        }
        const sorted = getSortedScenes(project.scenes)
        const scene = sorted.find(s => {
            const start = startTimesRef.current.get(s.id) ?? 0
            return time >= start && time < start + s.duration
        }) ?? sorted[sorted.length - 1]

        if (!scene) return

        setGlobalTime(time)
        if (scene.id !== activeSceneId) {
            setActiveSceneId(scene.id)
            setCurrentVideoUrl(scene.videoUrl ?? null)
        }
    }, [project, activeSceneId, playing, getSortedScenes])

    const nextVideo = useMemo(() => {
        if (!project) return
        const sorted = getSortedScenes(project.scenes)
        const idx = sorted.findIndex(s => s.id === activeSceneId)
        const nextVideoUrl = sorted[idx + 1]?.videoUrl
        return nextVideoUrl
    }, [project, activeSceneId, getSortedScenes])

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
    }, [project, getSortedScenes])

    const handlePlayStateChange = useCallback((isPlaying: boolean) => {
        setPlaying(isPlaying)
    }, [])

    const persistScenes = useCallback((scenes: Scene[]) => {
        console.trace('persistScenes called', scenes)
        if (JSON.stringify(scenes) === initialScenesRef.current) return

        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
        autoSaveTimer.current = setTimeout(async () => {
            setSaving(true)
            try {
                await fetch(`/api/projects/${projectId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'save', scenes }),
                })
                initialScenesRef.current = JSON.stringify(scenes)
                setSaved(true)
                setTimeout(() => setSaved(false), 3000)
            } catch (err) {
                console.error('Auto-save failed:', err)
            } finally {
                setSaving(false)
            }
        }, 800)
    }, [projectId])

    const handleExport = useCallback(async () => {
        if (!project) return

        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
        try {
            await fetch(`/api/projects/${projectId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'save', scenes: project.scenes }),
            })
        } catch (err) {
            console.error('Pre-export save failed:', err)
            alert('Could not save your latest changes. Please try again before exporting.')
            return
        }

        try {
            const res = await fetch('/api/render', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, aspectRatio }),
            })

            if (!res.ok) {
                alert('Export isn\u2019t available yet. This feature is still being built.')
                return
            }

            alert("Export queued! You'll be notified when ready.")
        } catch (err) {
            console.error('Export request failed:', err)
            alert('Export isn\u2019t available yet. This feature is still being built.')
        }
    }, [project, projectId, aspectRatio])

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
            } else {
                setActiveSceneId(null)
                setCurrentVideoUrl(null)
            }
        }
    }, [getSortedScenes, persistScenes, activeSceneId])

    const patchProjectAudio = useCallback(async (
        field: 'musicUrl' | 'voiceoverUrl',
        url: string | null,
        sourceField: 'musicSource' | 'voiceoverSource',
        source: string | null,
    ) => {
        setProject(p => p ? { ...p, [field]: url, [sourceField]: source } : p)
        try {
            await fetch(`/api/projects/${projectId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update', [field]: url, [sourceField]: source }),
            })
        } catch (err) {
            console.error('Failed to save audio field:', err)
        }
    }, [projectId])

    const musicUpload = useFileUpload({
        accept: 'audio/*',
        onUploaded: url => patchProjectAudio('musicUrl', url, 'musicSource', 'UPLOAD'),
    })

    const voiceoverUpload = useFileUpload({
        accept: 'audio/*',
        onUploaded: url => patchProjectAudio('voiceoverUrl', url, 'voiceoverSource', 'UPLOAD'),
    })

    const handleAddMusic = useCallback(() => {
        musicUpload.trigger('/api/upload/music', projectId)
    }, [musicUpload, projectId])

    const handleRemoveMusic = useCallback(() => {
        patchProjectAudio('musicUrl', null, 'musicSource', null)
    }, [patchProjectAudio])

    const handleAddVoiceover = useCallback(() => {
        voiceoverUpload.trigger('/api/upload/voiceover', projectId)
    }, [voiceoverUpload, projectId])

    const handleRemoveVoiceover = useCallback(() => {
        patchProjectAudio('voiceoverUrl', null, 'voiceoverSource', null)
    }, [patchProjectAudio])

    const toolPanels: Partial<Record<ToolId, React.ReactNode>> = {
        text: (
            <div className="p-4 flex flex-col gap-3">
                <p className="text-caption font-semibold text-(--text)">Text Overlays</p>
                <p className="text-small leading-[1.7] text-tertiary">
                    Add titles, lower thirds, and captions.
                </p>
            </div>
        ),
        audio: (
            <div className="p-4 flex flex-col gap-3">
                <p className="text-caption font-semibold text-(--text)">Audio Tracks</p>
                <p className="text-small leading-[1.7] text-tertiary">
                    Background music and voiceover tracks are managed from the timeline below.
                </p>
            </div>
        ),
    }

    if (loading) return (
        <div className="flex items-center justify-center h-dvh surface">
            <div className="flex flex-col items-center gap-3">
                <Loader2 size={40} className="animate-spin text-(--accent)" />
                <p className="text-body font-semibold text-tertiary">Loading editor…</p>
            </div>
        </div>
    )

    if (error || !project) return (
        <div className="flex items-center justify-center h-dvh surface">
            <div className="flex flex-col items-center gap-3">
                <p className="text-body font-bold text-(--text)">Project not found</p>
                <Link href="/dashboard" className="flex items-center gap-3 text-caption text-(--accent)">
                    <ArrowLeftFromLineIcon size={30} strokeWidth={2} className='text-(--text)'/>
                    Back to Dashboard
                </Link>
            </div>
        </div>
    )

    const totalDuration = getTotalDuration(project.scenes)

    return (
        <div className="relative flex flex-col w-screen h-dvh overflow-hidden">

            <div className="shrink-0 w-full h-16 flex justify-center items-center">
                <EditorTopBar
                    projectId={projectId}
                    projectName={project.name}
                    saving={saving}
                    saved={saved}
                    onOpenShare={() => setShareOpen(v => !v)}
                />
            </div>

            <div className="relative flex flex-1 min-h-0 overflow-hidden w-full">
                <div className="relative z-50! shrink-0 p-2">
                    <LeftToolsPanel
                        activeTool={activeTool}
                        onToolClick={id => setActiveTool(prev => prev === id ? null : id)}
                    />
                    {activeTool && toolPanels[activeTool] && (
                        <div className="absolute top-2 left-[calc(100%+0.5rem)] w-50 h-fit shrink-0 overflow-y-scroll scrollbar-hide bg-(--accent-40) rounded-xl shadow-lg">
                            {toolPanels[activeTool]}
                        </div>
                    )}
                </div>

                <div className="relative flex-1 min-w-0 flex items-center justify-center overflow-hidden bg-transparent p-2">
                    <PreviewCanvas
                        ref={canvasRef}
                        videoUrl={currentVideoUrl}
                        aspectRatio={aspectRatio}
                        clipDuration={activeClipDuration}
                        seekOffset={seekOffset}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleClipEnded}
                        onPlayStateChange={handlePlayStateChange}
                        onAddScene={() => setAddSceneOpen(true)}
                    />

                    <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1 z-20">
                        <button
                            onClick={() => setRatioOpen(o => !o)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-caption font-semibold text-(--text) shadow transition-all duration-300 ease-out ${
                                ratioOpen
                                    ? 'bg-(--accent-40) border border-transparent'
                                    : 'bg-(--surface-overlay) border border-(--accent-40)'
                            }`}
                        >
                            {React.createElement(
                                RATIO_OPTIONS.find(r => r.label === aspectRatio)?.icon ?? Monitor,
                                { size: 20, strokeWidth: 2 }
                            )}
                            {aspectRatio}
                        </button>
                        {ratioOpen && (
                            <div className="absolute bottom-10 right-1/2 flex flex-col gap-2 p-2 rounded-xl bg-(--surface-overlay) shadow-accent-40 text-(--text)">
                                {RATIO_OPTIONS.map(({ label, icon: Icon, hint }) => (
                                    <button
                                        key={label}
                                        onClick={() => { setAspectRatio(label); setRatioOpen(false) }}
                                        className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-small font-semibold text-left transition-colors hover:bg-(--accent-8) ${
                                            aspectRatio === label ? 'bg-(--accent-16)' : ''
                                        }`}
                                    >
                                        <Icon size={28} strokeWidth={2} />
                                        <span className="text-caption">{label}</span>
                                        <span className="text-small">{hint}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="shrink-0 w-full h-64 shadow-accent-40 p-2 rounded-xl m-2 mt-0">
                <SceneTimeline
                    scenes={project.scenes}
                    activeSceneId={activeSceneId}
                    currentTime={globalTime}
                    totalDuration={totalDuration}
                    playing={playing}
                    onSceneClick={handleSceneClick}
                    onPlayheadDrag={handlePlayheadDrag}
                    onAddScene={() => setAddSceneOpen(true)}
                    onScenesChange={handleScenesUpdate}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onStop={handleStop}
                    musicUrl={project.musicUrl}
                    onAddMusic={handleAddMusic}
                    onRemoveMusic={handleRemoveMusic}
                    voiceoverUrl={project.voiceoverUrl}
                    onAddVoiceover={handleAddVoiceover}
                    onRemoveVoiceover={handleRemoveVoiceover}
                />
                {nextVideo && (
                    <video preload="auto" src={nextVideo} className="hidden" />
                )}
            </div>

            <button
                onClick={() => setAiOpen(v => !v)}
                title={aiOpen ? 'Hide AI assistant' : 'Show AI assistant'}
                className={`absolute top-22 right-6 flex items-center justify-center w-10 h-10 rounded-full cursor-pointer text-(--text) z-50 shadow-md shadow-[#00D9AA] border border-transparent hover:border-(--accent-65) transition-all duration-500 hover:scale-110 ${
                    aiOpen ? 'bg-(--accent-16) scale-110' : 'bg-(--overlay)'
                }`}
            >
                {aiOpen ? <X size={20} strokeWidth={2} className="text-(--text)" /> : <Sparkles size={16} strokeWidth={2} className="text-(--accent)" />}
            </button>

            {aiOpen && (
                <div className="absolute top-36 right-6 w-100 shadow-accent-40 rounded-xl overflow-hidden z-30">
                    <AISidebar
                        projectId={projectId}
                        projectName={project.name}
                        prompt={project.prompt}
                        scenes={project.scenes}
                        videoUrl={currentVideoUrl}
                        onScenesUpdate={handleScenesUpdate}
                    />
                </div>
            )}

            {shareOpen && (
                <SharePanel
                    projectId={projectId}
                    totalDuration={totalDuration}
                    onExport={handleExport}
                    onClose={() => setShareOpen(false)}
                />
            )}

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