'use client'

import React, { useRef, useCallback } from 'react'
import { Plus, Music2, Clock } from 'lucide-react'

interface Scene {
  id: string; title: string; description: string
  musicMood: string; duration: number; order: number
}

interface SceneTimelineProps {
  scenes:        Scene[]
  activeSceneId: string | null
  currentTime:   number          // ← real video currentTime in seconds
  totalDuration: number          // ← real video duration in seconds
  onSceneClick:  (scene: Scene, seekTime: number) => void  // ← returns seek target
  onAddScene:    () => void
}

const moodColors: Record<string, string> = {
  Uplifting: '#fbbf24', Dramatic: '#ef4444', Calm: '#818cf8',
  Energetic: '#fb923c', Melancholic: '#94a3b8', Mysterious: '#a78bfa',
  Cinematic: 'var(--turquoise)', Playful: '#34d399',
}

export default function SceneTimeline({
  scenes, activeSceneId, currentTime, totalDuration, onSceneClick, onAddScene,
}: SceneTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  // Total timeline duration — prefer real video duration, fall back to sum of scenes
  const total = totalDuration > 0
    ? totalDuration
    : scenes.reduce((s, c) => s + c.duration, 0) || 60

  // Build cumulative start times for each scene
  const sorted = [...scenes].sort((a, b) => a.order - b.order)
  const scenesWithStart = sorted.reduce<(Scene & { startTime: number })[]>((acc, scene) => {
    const prev = acc[acc.length - 1]
    return [...acc, { ...scene, startTime: prev ? prev.startTime + prev.duration : 0 }]
  }, [])

  // Time ruler markers
  const markers: number[] = []
  const step = total <= 30 ? 5 : total <= 60 ? 10 : total <= 120 ? 15 : 30
  for (let t = 0; t <= total; t += step) markers.push(t)

  // Playhead position as percentage
  const playheadPct = total > 0 ? Math.min((currentTime / total) * 100, 100) : 0

  // Click on scrubber track to seek
  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const time = pct * total
    // Find which scene this timestamp belongs to and trigger seek
    const scene = scenesWithStart.find(
      s => time >= s.startTime && time < s.startTime + s.duration
    ) ?? scenesWithStart[0]
    if (scene) onSceneClick(scene, time)
  }, [total, scenesWithStart, onSceneClick])

  return (
    <div className="flex flex-col shrink-0"
      style={{ height: '160px', backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border-default)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 shrink-0"
        style={{ height: '32px', borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-tertiary)' }}>
          Timeline · {scenes.length} scene{scenes.length !== 1 ? 's' : ''} · {Math.round(total)}s
        </span>
        <button onClick={onAddScene}
          className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md transition-colors"
          style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--turquoise)'; e.currentTarget.style.borderColor = 'var(--turquoise-22)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}>
          <Plus size={10} strokeWidth={2.5} /> Add scene
        </button>
      </div>

      {/* Ruler — clickable */}
      <div className="relative px-4 shrink-0 cursor-pointer"
        style={{ height: '20px', borderBottom: '1px solid var(--border-subtle)' }}
        onClick={handleTrackClick}>
        {markers.map(t => (
          <div key={t} className="absolute flex flex-col items-center pointer-events-none"
            style={{ left: `calc(1rem + ${(t / total) * 100}% - ${(t / total) * 2}rem)`, bottom: 0 }}>
            <span className="text-[9px] font-mono" style={{ color: 'var(--text-tertiary)', opacity: 0.5, lineHeight: 1, marginBottom: 2 }}>
              {t}s
            </span>
            <div style={{ width: 1, height: 4, backgroundColor: 'var(--border-default)' }} />
          </div>
        ))}
        {/* Ruler playhead needle */}
        <div className="absolute top-0 bottom-0 pointer-events-none"
          style={{ left: `calc(1rem + ${playheadPct}%)`, width: 1, backgroundColor: 'var(--turquoise)', opacity: 0.6 }} />
      </div>

      {/* Scene track */}
      <div ref={trackRef}
        className="relative flex items-center flex-1 px-4 gap-1.5 overflow-x-auto min-h-0"
        style={{ cursor: 'pointer' }}
        onClick={handleTrackClick}>

        {scenes.length === 0 ? (
          <div className="flex items-center justify-center w-full pointer-events-none">
            <span className="text-xs" style={{ color: 'var(--text-tertiary)', opacity: 0.4 }}>
              No scenes yet — add your first scene above
            </span>
          </div>
        ) : (
          scenesWithStart.map(scene => {
            const widthPct = (scene.duration / total) * 100
            const isActive = scene.id === activeSceneId
            const color    = moodColors[scene.musicMood] ?? 'var(--turquoise)'

            return (
              <button key={scene.id}
                onClick={e => { e.stopPropagation(); onSceneClick(scene, scene.startTime) }}
                className="relative flex flex-col justify-between p-2 rounded-lg shrink-0 h-14 overflow-hidden transition-all duration-150 text-left"
                style={{
                  width:           `max(72px, ${widthPct}%)`,
                  backgroundColor: isActive ? 'var(--turquoise-8)' : 'var(--surface-raised)',
                  border:          `1px solid ${isActive ? 'var(--turquoise-42)' : 'var(--border-default)'}`,
                  cursor:          'pointer',
                  boxShadow:       isActive ? '0 0 0 2px var(--turquoise-22)' : 'none',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--border-strong)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--border-default)' }}>

                {/* Mood color bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg" style={{ backgroundColor: color }} />

                <span className="text-[11px] font-bold truncate leading-tight"
                  style={{ color: isActive ? 'var(--turquoise)' : 'var(--text-secondary)', marginTop: 4 }}>
                  {scene.title}
                </span>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-0.5 text-[9px] font-semibold" style={{ color: isActive ? color : 'var(--text-tertiary)' }}>
                    <Music2 size={7} />{scene.musicMood}
                  </span>
                  <span className="flex items-center gap-0.5 text-[9px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                    <Clock size={7} />{scene.duration}s
                  </span>
                </div>
              </button>
            )
          })
        )}

        {/* Playhead needle over scene blocks */}
        {totalDuration > 0 && (
          <div className="absolute top-0 bottom-0 pointer-events-none z-10"
            style={{ left: `calc(1rem + ${playheadPct}%)`, width: 2, backgroundColor: 'var(--turquoise)', boxShadow: '0 0 6px var(--turquoise)' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: 'var(--turquoise)', boxShadow: '0 0 4px var(--turquoise)' }} />
          </div>
        )}
      </div>
    </div>
  )
}