'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams }   from 'next/navigation'
import { Loader2, Sparkles, X } from 'lucide-react'
import Link            from 'next/link'

import EditorTopBar                          from './components/EditorTopBar'
import PreviewCanvas, { PreviewCanvasHandle} from './components/PreviewCanvas'
import SceneTimeline                         from './components/SceneTimeline'
import LeftToolsPanel, { type ToolId }       from './components/LeftToolsPanel'
import GeminiSidebar                         from './components/GeminiSidebar'

interface Scene {
  id: string; title: string; description: string
  musicMood: string; duration: number; order: number
}

interface Project {
  id: string; name: string; starred: boolean
  prompt: string | null; style: string | null; aspectRatio: string | null
  scenes: Scene[]
  _count: { assets: number; timelines: number; renders: number }
}

export default function EditorPage() {
  const params    = useParams()
  const projectId = params.projectId as string

  // ── Data ──────────────────────────────────────────────────────────────────
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  // ── Video state ───────────────────────────────────────────────────────────
  const canvasRef                              = useRef<PreviewCanvasHandle>(null)
  const [videoUrl,      setVideoUrl]      = useState<string | null>(null)
  const [videoDuration, setVideoDuration] = useState(0)
  const [currentTime,   setCurrentTime]   = useState(0)

  // ── Editor UI state ───────────────────────────────────────────────────────
  const [activeTool,  setActiveTool]  = useState<ToolId | null>(null)
  const [activeScene, setActiveScene] = useState<string | null>(null)
  const [aiOpen,      setAiOpen]      = useState(true)   // ← AI sidebar toggle

  // ── Save state ────────────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  // ── Fetch project ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!projectId) return
    fetch(`/api/projects/${projectId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else {
          setProject(data)
          if (data.scenes?.length > 0) setActiveScene(data.scenes[0].id)
        }
      })
      .catch(() => setError('Failed to load project'))
      .finally(() => setLoading(false))
  }, [projectId])

  // ── Video loaded ──────────────────────────────────────────────────────────
  const handleVideoLoad = useCallback((url: string, duration: number) => {
    setVideoUrl(url)
    if (duration > 0) setVideoDuration(duration)
  }, [])

  // ── Live time update (60fps RAF) ──────────────────────────────────────────
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

  // ── Scene click → seek ────────────────────────────────────────────────────
  const handleSceneClick = useCallback((scene: Scene, seekTime: number) => {
    setActiveScene(scene.id)
    canvasRef.current?.seekTo(seekTime)
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

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = useCallback(async () => {
    try {
      await fetch('/api/render', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ projectId, aspectRatio: project?.aspectRatio }),
      })
      alert("Export queued! You'll be notified when ready.")
    } catch { alert('Export failed. Please try again.') }
  }, [projectId, project])

  // ── Add scene ─────────────────────────────────────────────────────────────
  const handleAddScene = useCallback(async () => {
    if (!project) return
    try {
      const res   = await fetch(`/api/projects/${projectId}/scenes`, {
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
    if (scenes.length > 0) setActiveScene(scenes[0].id)
  }, [])

  // ── Tool sub-panels ───────────────────────────────────────────────────────
  const toolPanels: Partial<Record<ToolId, React.ReactNode>> = {
    trim: (
      <div className="p-4 flex flex-col gap-3">
        <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>Trim & Cut</p>
        <p className="text-[11px]" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
          Click a scene in the timeline to select it, then use in/out handles to trim.
          Press <kbd className="px-1 py-0.5 rounded text-[10px]"
            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}>S</kbd> to split at playhead.
        </p>
      </div>
    ),
    text: (
      <div className="p-4 flex flex-col gap-3">
        <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>Text Overlays</p>
        <p className="text-[11px]" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
          Add titles, lower thirds, and captions. Use the AI Captions tab for auto-generated text.
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
    <div className="flex items-center justify-center"
      style={{ height: '100dvh', backgroundColor: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--turquoise)' }} />
        <p className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>Loading editor…</p>
      </div>
    </div>
  )

  if (error || !project) return (
    <div className="flex items-center justify-center"
      style={{ height: '100dvh', backgroundColor: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Project not found</p>
        <Link href="/dashboard/projects" className="text-xs" style={{ color: 'var(--turquoise)' }}>
          ← Back to Projects
        </Link>
      </div>
    </div>
  )

  const totalDuration = videoDuration || project.scenes.reduce((s, c) => s + c.duration, 0)

  return (
    // 100dvh accounts for mobile browser chrome, overflow:hidden prevents ANY scroll
    <div
      style={{
        display:         'flex',
        flexDirection:   'column',
        width:           '100vw',
        height:          '100dvh',
        overflow:        'hidden',
        backgroundColor: 'var(--bg)',
      }}
    >
      {/* ── Top bar (fixed height) ── */}
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

      {/* ── Middle row (fills remaining height minus timeline) ── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

        {/* Left tools strip — fixed narrow width, never shrinks */}
        <div style={{ flexShrink: 0 }}>
          <LeftToolsPanel
            activeTool={activeTool}
            onToolClick={id => setActiveTool(prev => prev === id ? null : id)}
          />
        </div>

        {/* Tool sub-panel — only shown when a tool is active */}
        {activeTool && toolPanels[activeTool] && (
          <div
            style={{
              width:           '200px',
              flexShrink:      0,
              overflowY:       'auto',
              backgroundColor: 'var(--bg)',
              borderRight:     '1px solid var(--border-default)',
            }}
          >
            {toolPanels[activeTool]}
          </div>
        )}

        {/* Center preview — takes ALL remaining horizontal space */}
        <div
          style={{
            flex:            '1 1 0',
            minWidth:        0,           // ← critical: prevents flex blowout
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            overflow:        'hidden',
            backgroundColor: 'var(--surface-raised)',
          }}
        >
          <PreviewCanvas
            ref={canvasRef}
            videoUrl={videoUrl}
            aspectRatio={project.aspectRatio ?? '16:9'}
            onVideoLoad={handleVideoLoad}
            onTimeUpdate={handleTimeUpdate}
          />
        </div>

        {/* ── AI Sidebar — slides in/out ── */}
        <div
          style={{
            width:           aiOpen ? '300px' : '0px',
            flexShrink:      0,
            overflow:        'hidden',
            transition:      'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            borderLeft:      aiOpen ? '1px solid var(--border-default)' : 'none',
          }}
        >
          {/* Keep mounted so state (chat history) is preserved when toggled */}
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

      {/* ── Timeline (fixed height at bottom) ── */}
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