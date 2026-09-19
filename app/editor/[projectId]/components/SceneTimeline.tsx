'use client'

import React, { useRef, useCallback, useState, useEffect } from 'react'
import { Plus, Music2, Clock, Film, Trash2, Play, Pause, Square, Mic } from 'lucide-react'
import { getMoodColor } from '@/lib/constants/moods'

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

interface SceneTimelineProps {
  scenes: Scene[]
  activeSceneId: string | null
  currentTime: number
  totalDuration: number
  playing: boolean
  onSceneClick: (scene: Scene, seekTime: number) => void
  onPlayheadDrag: (time: number) => void
  onAddScene: () => void
  onScenesChange?: (scenes: Scene[]) => void
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  musicUrl?: string | null
  onAddMusic?: () => void
  onRemoveMusic?: () => void
  voiceoverUrl?: string | null
  onAddVoiceover?: () => void
  onRemoveVoiceover?: () => void
}

const MIN_PX_PER_SEC = 60
const TRACK_PADDING = 16
const MIN_DURATION = 1
const CLIP_HEIGHT = 76
const AUDIO_ROW_HEIGHT = 44
const HANDLE_WIDTH = 8
const GUTTER_WIDTH = 84

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function TrackLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center shrink-0 h-full bg-(--accent-16) rounded-xl" style={{ width: GUTTER_WIDTH }}>
      <Icon size={18} className="text-(--text-tertiary)" />
      <span className="text-small font-semibold uppercase tracking-wide text-(--text-tertiary)">
        {label}
      </span>
    </div>
  )
}

function AudioTrackRow({
  url, trackWidth, color, icon: Icon, label, onAdd, onRemove,
}: {
  url?: string | null
  trackWidth: number
  color: string
  icon: React.ElementType
  label: string
  onAdd?: () => void
  onRemove?: () => void
}) {
  return (
    <div className="relative" style={{ height: AUDIO_ROW_HEIGHT, width: trackWidth }}>
      {url ? (
        <div
          className="absolute top-1 bottom-1 rounded-lg flex items-center gap-2 px-3 overflow-hidden group/audio bg-(--surface-raised) border border-(--border-default)"
          style={{ left: TRACK_PADDING, right: TRACK_PADDING }}
        >
          <div className="w-1 h-full absolute left-0 top-0 rounded-l-lg" style={{ backgroundColor: color }} />
          <Icon size={12} style={{ color }} className="shrink-0 ml-1" />
          <span className="text-[11px] font-semibold truncate text-(--text-secondary)">
            {label} track
          </span>
          {onRemove && (
            <button
              onClick={e => { e.stopPropagation(); onRemove?.() }}
              className="ml-auto w-6 h-6 rounded-md items-center justify-center opacity-0 group-hover/audio:opacity-100 transition-opacity flex shrink-0 bg-(--error-16) border border-(--error-35) text-(--error) cursor-pointer"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={e => { e.stopPropagation(); onAdd?.() }}
          className="absolute top-1 bottom-1 rounded-lg flex items-center justify-center gap-1.5 font-semibold text-caption border border-dashed transition-all duration-200 bg-(--surface-overlay) text-(--text) border-(--border-default) hover:border-(--accent) cursor-pointer min-w-40"
          style={{ left: TRACK_PADDING, right: TRACK_PADDING }}
        >
          <Plus size={16} strokeWidth={4} className="text-(--accent)" />
          Add {label.toLowerCase()}
        </button>
      )}
    </div>
  )
}

export default function SceneTimeline({
  scenes, activeSceneId, currentTime, totalDuration, playing,
  onSceneClick, onPlayheadDrag, onAddScene, onScenesChange,
  onPlay, onPause, onStop,
  musicUrl, onAddMusic, onRemoveMusic,
  voiceoverUrl, onAddVoiceover, onRemoveVoiceover,
}: SceneTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [containerWidth, setContainerWidth] = useState(800)
  const [dragScenes, setDragScenes] = useState<Scene[] | null>(null)

  const display = dragScenes ?? scenes
  const sorted = [...display].sort((a, b) => a.order - b.order)
  const total = sorted.reduce((s, c) => s + c.duration, 0) || 1

  const pxPerSec = MIN_PX_PER_SEC

  const trackWidth = total * pxPerSec
  const playheadLeft = TRACK_PADDING + Math.min(currentTime, total) * pxPerSec

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width
      if (width) setContainerWidth(width)
    })
    ro.observe(el)
    setContainerWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  const rawStep = 60 / pxPerSec
  const niceSteps = [1, 2, 5, 10, 15, 30, 60, 120]
  const step = niceSteps.find(s => s >= rawStep) ?? 120

  const markers: number[] = []
  for (let t = 0; t <= total + step; t += step) markers.push(t)

  type PositionedScene = Scene & { startTime: number; left: number; width: number }

  const scenesWithPos = sorted.reduce<PositionedScene[]>((acc, scene) => {
    const prev = acc[acc.length - 1]
    const startTime = prev ? prev.startTime + prev.duration : 0
    return [...acc, {
      ...scene,
      startTime,
      left: TRACK_PADDING + startTime * pxPerSec,
      width: Math.max(MIN_DURATION * pxPerSec, scene.duration * pxPerSec) - 4,
    }]
  }, [])

  const handleDelete = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const next = scenes.filter(s => s.id !== id)
    onScenesChange?.(next)
  }, [scenes, onScenesChange])

  const handleTrimMouseDown = useCallback((
    e: React.MouseEvent, scene: Scene, edge: 'left' | 'right',
  ) => {
    e.stopPropagation()
    e.preventDefault()
    const startX = e.clientX
    const startDur = scene.duration
    let current = scenes

    const onMove = (mv: MouseEvent) => {
      const dx = mv.clientX - startX
      const dSec = dx / pxPerSec
      let newDur = edge === 'right' ? startDur + dSec : startDur - dSec
      newDur = Math.max(MIN_DURATION, Math.round(newDur * 2) / 2)
      current = scenes.map(s => s.id === scene.id ? { ...s, duration: newDur } : s)
      setDragScenes(current)
    }

    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      setDragScenes(null)
      onScenesChange?.(current)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [scenes, pxPerSec, onScenesChange])

  const handleDragMouseDown = useCallback((e: React.MouseEvent, scene: Scene) => {
    e.stopPropagation()
    e.preventDefault()
    const startX = e.clientX
    let current = scenes

    const onMove = (mv: MouseEvent) => {
      const dx = mv.clientX - startX
      const slotPx = scene.duration * pxPerSec
      const dSlots = Math.round(dx / slotPx)
      if (dSlots === 0) return
      const s = [...scenes].sort((a, b) => a.order - b.order)
      const fromIdx = s.findIndex(x => x.id === scene.id)
      const toIdx = Math.max(0, Math.min(s.length - 1, fromIdx + dSlots))
      if (fromIdx === toIdx) return
      const moved = s.splice(fromIdx, 1)[0]
      s.splice(toIdx, 0, moved)
      current = s.map((x, i) => ({ ...x, order: i }))
      setDragScenes(current)
    }

    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      setDragScenes(null)
      onScenesChange?.(current)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [scenes, pxPerSec, onScenesChange])

  
  const xToTime = (clientX: number) => {
    const rect = scrollRef.current?.getBoundingClientRect()
    if (!rect) return 0
    const scrollLeft = scrollRef.current?.scrollLeft ?? 0
    const x = clientX - rect.left + scrollLeft - TRACK_PADDING
    return Math.max(0, Math.min(x / pxPerSec, total))
  }

  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    onPlayheadDrag(xToTime(e.clientX))
  }, [xToTime, onPlayheadDrag])

  const handlePlayheadMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    const onMove = (mv: MouseEvent) => {
      onPlayheadDrag(xToTime(mv.clientX))
    }

    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [xToTime, onPlayheadDrag])

  return (
    <div ref={containerRef} className="flex flex-col shrink-0">
      <div className="flex items-center shrink-0 px-4 py-1 rounded-xl bg-(--accent-8)">
        <div className="flex-1 flex items-center">
          <span className="text-tiny font-semibold tracking-widest uppercase">
            Timeline · {display.length} scene{display.length !== 1 ? 's' : ''} · {formatTime(total)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onStop}
            title="Stop"
            className="w-7 h-7 rounded-xl flex items-center justify-center transition-all bg-(--surface-overlay) hover:shadow-sm hover:shadow-black/50 cursor-pointer"
          >
            <Square size={11} fill="currentColor" className="text-(--text-tertiary)" />
          </button>

          <button
            onClick={playing ? onPause : onPlay}
            title={playing ? 'Pause' : 'Play'}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 bg-(--accent-65) cursor-pointer hover:scale-105 hover:shadow"
          >
            {playing
              ? <Pause size={14} fill="white" color="white" />
              : <Play size={14} fill="white" color="white" className="ml-0.5" />}
          </button>

          <span className="font-mono tabular-nums text-small w-24 text-center text-(--text)">
            {formatTime(currentTime)} | {formatTime(totalDuration)}
          </span>
        </div>

        <div className="flex-1 flex items-center justify-end">
          <button
            onClick={onAddScene}
            className="flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-xl text-caption border border-transparent transition-all duration-200 bg-(--surface-overlay) text-(--text) hover:border-(--accent) shadow-accent-40 cursor-pointer"
          >
            <Plus size={18} strokeWidth={4} className="text-(--accent)" /> Add scene
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative overflow-hidden flex">
        <div className="flex flex-col shrink-0 gap-1 border-r border-(--border-subtle) pr-1">
          <div className="h-7.5" />
          <TrackLabel icon={Film} label="Video" />
          <TrackLabel icon={Music2} label="Music" />
          <TrackLabel icon={Mic} label="Voiceover" />
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto overflow-y-hidden"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--accent-fg) transparent' }}
          onClick={handleTrackClick}
        >
          <div
            style={{
              width: Math.max(trackWidth + TRACK_PADDING * 2 + 80, containerWidth - GUTTER_WIDTH),
              position: 'relative',
            }}
          >
            <div className="relative border-b border-(--border-subtle) mb-2 h-5.5">
              {markers.map(t => (
                <div
                  key={t}
                  className="absolute flex flex-col items-center pointer-events-none"
                  style={{ left: TRACK_PADDING + t * pxPerSec, bottom: 0, transform: 'translateX(-50%)' }}
                >
                  <span className="font-mono text-(--text-tertiary) opacity-60 mb-0.75 text-tiny">
                    {t}s
                  </span>
                  <div className="w-px h-1 bg-(--border-default)" />
                </div>
              ))}
            </div>

            <div className="relative" style={{ height: CLIP_HEIGHT }}>
              {display.length === 0 ? (
                <div className="flex items-center justify-center w-full h-full pointer-events-none">
                  <span className="text-(--text-tertiary) opacity-40 text-caption">
                    No scenes yet — add your first scene above
                  </span>
                </div>
              ) : (
                scenesWithPos.map(scene => {
                  const isActive = scene.id === activeSceneId
                  const color = getMoodColor(scene.musicMood).text

                  return (
                    <div
                      key={scene.id}
                      className="absolute group/clip"
                      style={{ left: scene.left, width: scene.width, top: 0, height: CLIP_HEIGHT }}
                    >
                      <div
                        className={`absolute flex flex-col justify-between overflow-hidden rounded-xl transition-all duration-150 border ${
                          isActive
                            ? 'bg-(--accent-40) border-(--accent-40)'
                            : 'bg-(--accent-16) border-(--border-default)'
                        }`}
                        style={{ left: 0, right: HANDLE_WIDTH, top: 0, bottom: 0, cursor: 'grab' }}
                        onClick={e => { e.stopPropagation(); onSceneClick(scene, scene.startTime) }}
                        onMouseDown={e => handleDragMouseDown(e, scene)}
                      >
                        <div className="absolute top-0 left-0 right-0 rounded-t-xl z-10 h-0.75" style={{ backgroundColor: color }} />

                        {scene.videoUrl ? (
                          <video
                            src={scene.videoUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                            muted preload="metadata"
                            style={{ opacity: isActive ? 0.75 : 0.25 }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center opacity-[0.12]">
                            <Film size={16} className="text-(--text-tertiary)" />
                          </div>
                        )}

                        <div className="relative z-10 flex flex-col justify-between h-full p-2 pt-3">
                          <span
                            className={`font-semibold truncate select-none text-small ${isActive ? 'text-(--accent)' : 'text-(--text)'}`}
                          >
                            {scene.title}
                          </span>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 font-mono font-medium select-none text-(--text) text-small bg-(--surface-sunken) py-1 px-2 rounded-xl">
                              <Clock size={10} />{scene.duration}s
                            </span>
                          </div>
                        </div>

                        <button
                          className="absolute top-2 right-4 z-20 w-7 h-7 rounded-lg items-center justify-center group-hover/transition-all flex bg-(--error-42) cursor-pointer hover:bg-(--error)"
                          onClick={e => handleDelete(e, scene.id)}
                          onMouseDown={e => e.stopPropagation()}
                        >
                          <Trash2 size={16} strokeWidth={1.5} color="white" />
                        </button>
                      </div>

                      <div
                        className="absolute top-0 bottom-0 mr-2 flex items-center justify-center z-20 opacity-0 group-hover/clip:opacity-100 transition-opacity bg-(--accent) rounded-r-xl"
                        style={{ right: 0, width: HANDLE_WIDTH, cursor: 'ew-resize' }}
                        onMouseDown={e => handleTrimMouseDown(e, scene, 'right')}
                      >
                        <div className="bg-black/30 rounded-sm w-0.5 h-6" />
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <AudioTrackRow
              url={musicUrl}
              trackWidth={trackWidth + TRACK_PADDING * 2}
              color="var(--accent)"
              icon={Music2}
              label="Music"
              onAdd={onAddMusic}
              onRemove={onRemoveMusic}
            />

            <AudioTrackRow
              url={voiceoverUrl}
              trackWidth={trackWidth + TRACK_PADDING * 2}
              color="var(--amber)"
              icon={Mic}
              label="Voiceover"
              onAdd={onAddVoiceover}
              onRemove={onRemoveVoiceover}
            />

            {totalDuration > 0 && (
              <div
                className="absolute top-0 bottom-0 z-30 w-0.5 bg-(--accent) rounded cursor-ew-resize"
                style={{ left: playheadLeft }}
                onMouseDown={handlePlayheadMouseDown}
              >
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rotate-45 bg-(--accent) w-2.5 h-2.5 rounded-sm" />
                <div className="absolute inset-0 shadow-accent-40" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}