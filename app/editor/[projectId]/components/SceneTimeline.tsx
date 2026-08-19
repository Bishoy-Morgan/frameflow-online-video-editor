'use client'

import React, { useRef, useCallback, useState, useEffect } from 'react'
import { Plus, Music2, Clock, Film, Trash2, Play, Pause, Square } from 'lucide-react'
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
  onAddScene: () => void
  onScenesChange?: (scenes: Scene[]) => void
  onPlay: () => void
  onPause: () => void
  onStop: () => void
}

const MIN_PX_PER_SEC = 60
const MAX_PX_PER_SEC = 200
const TRACK_PADDING = 16
const MIN_DURATION = 1
const CLIP_HEIGHT = 76
const HANDLE_WIDTH = 8

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function SceneTimeline({
  scenes, activeSceneId, currentTime, totalDuration, playing,
  onSceneClick, onAddScene, onScenesChange,
  onPlay, onPause, onStop,
}: SceneTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [containerWidth, setContainerWidth] = useState(800)
  const [dragScenes, setDragScenes] = useState<Scene[] | null>(null)

  const display = dragScenes ?? scenes
  const sorted = [...display].sort((a, b) => a.order - b.order)
  const total = sorted.reduce((s, c) => s + c.duration, 0) || 1

  // Dynamic pxPerSec
  const availableWidth = containerWidth - TRACK_PADDING * 2
  const fitPxPerSec = availableWidth / total
  const pxPerSec = Math.min(MAX_PX_PER_SEC, Math.max(MIN_PX_PER_SEC, fitPxPerSec))

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

  const scenesWithPos = sorted.reduce<
    (Scene & { startTime: number; left: number; width: number })[]
  >((acc, scene) => {
    const prev = acc[acc.length - 1]
    const startTime = prev ? prev.startTime + prev.duration : 0
    return [...acc, {
      ...scene,
      startTime,
      left:  TRACK_PADDING + startTime * pxPerSec,
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
    let   current = scenes

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

  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    const rect = scrollRef.current?.getBoundingClientRect()
    if (!rect) return
    const scrollLeft = scrollRef.current?.scrollLeft ?? 0
    const x = e.clientX - rect.left + scrollLeft - TRACK_PADDING
    const time = Math.max(0, Math.min(x / pxPerSec, total))
    const scene = scenesWithPos.find(
      s => time >= s.startTime && time < s.startTime + s.duration
    ) ?? scenesWithPos[0]
    if (scene) onSceneClick(scene, time)
  }, [total, scenesWithPos, pxPerSec, onSceneClick])

  return (
    <div
      ref={containerRef}
      className="flex flex-col shrink-0"
      style={{ height: '200px', backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border-default)' }}
    >
      <div
        className="flex items-center shrink-0 px-4"
        style={{ height: '44px', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex-1 flex items-center">
          <span className="font-bold tracking-widest uppercase"
            style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            Timeline · {display.length} scene{display.length !== 1 ? 's' : ''} · {formatTime(total)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onStop}
            title="Stop"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{
              backgroundColor: 'var(--surface-raised)',
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
          >
            <Square size={11} fill="currentColor" style={{ color: 'var(--text-tertiary)' }} />
          </button>

          <button
            onClick={playing ? onPause : onPlay}
            title={playing ? 'Pause' : 'Play'}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{
              backgroundColor: 'var(--accent)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px var(--accent-22)',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {playing
              ? <Pause size={14} fill="white" color="white" />
              : <Play  size={14} fill="white" color="white" style={{ marginLeft: 1 }} />}
          </button>

          <span className="font-mono tabular-nums text-[11px] w-24 text-center"
            style={{ color: 'var(--text-tertiary)' }}>
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </span>
        </div>

        <div className="flex-1 flex items-center justify-end">
          <button
            onClick={onAddScene}
            className="flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-lg"
            style={{
              fontSize: '11px',
              backgroundColor: 'var(--surface-raised)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent-22)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
          >
            <Plus size={13} strokeWidth={2.5} /> Add scene
          </button>
        </div>
      </div>

      <div style={{ flex: '1 1 0', minHeight: 0, position: 'relative', overflow: 'hidden' }}>
        <div
          ref={scrollRef}
          style={{
            position: 'absolute',
            inset: 0,
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--border-strong) transparent',
          }}
          onClick={handleTrackClick}
        >
          <div style={{
            width: Math.max(trackWidth + TRACK_PADDING * 2 + 80, containerWidth),
            height: '100%',
            position: 'relative',
          }}>

            <div style={{
              height: '22px',
              position: 'relative',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '8px',
            }}>
              {markers.map(t => (
                <div
                  key={t}
                  className="absolute flex flex-col items-center pointer-events-none"
                  style={{ left: TRACK_PADDING + t * pxPerSec, bottom: 0, transform: 'translateX(-50%)' }}
                >
                  <span className="font-mono"
                    style={{ fontSize: '10px', color: 'var(--text-tertiary)', opacity: 0.6, lineHeight: 1, marginBottom: 3 }}>
                    {t}s
                  </span>
                  <div style={{ width: 1, height: 4, backgroundColor: 'var(--border-default)' }} />
                </div>
              ))}
            </div>

            <div style={{ position: 'relative', height: CLIP_HEIGHT }}>
              {display.length === 0 ? (
                <div className="flex items-center justify-center w-full h-full pointer-events-none">
                  <span style={{ fontSize: '13px', color: 'var(--text-tertiary)', opacity: 0.4 }}>
                    No scenes yet — add your first scene above
                  </span>
                </div>
              ) : (
                scenesWithPos.map(scene => {
                  const isActive = scene.id === activeSceneId
                  const color    = getMoodColor(scene.musicMood).text

                  return (
                    <div
                      key={scene.id}
                      className="absolute group/clip"
                      style={{ left: scene.left, width: scene.width, top: 0, height: CLIP_HEIGHT }}
                    >

                      <div
                        className="absolute top-0 bottom-0 flex items-center justify-center z-20 opacity-0 group-hover/clip:opacity-100 transition-opacity"
                        style={{
                          left: 0,
                          width: HANDLE_WIDTH,
                          cursor: 'ew-resize',
                          backgroundColor: 'var(--accent)',
                          borderRadius: '6px 0 0 6px',
                        }}
                        onMouseDown={e => handleTrimMouseDown(e, scene, 'left')}
                      >
                        <div style={{ width: 2, height: 16, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 1 }} />
                      </div>

                      <div
                        className="absolute flex flex-col justify-between overflow-hidden rounded-xl transition-all duration-150"
                        style={{
                          left: HANDLE_WIDTH,
                          right: HANDLE_WIDTH,
                          top: 0,
                          bottom: 0,
                          backgroundColor: isActive ? 'var(--accent-8)'   : 'var(--surface-raised)',
                          border: `1px solid ${isActive ? 'var(--accent-42)' : 'var(--border-default)'}`,
                          boxShadow: isActive ? '0 0 0 2px var(--accent-22)' : 'none',
                          cursor: 'grab',
                        }}
                        onClick={e => { e.stopPropagation(); onSceneClick(scene, scene.startTime) }}
                        onMouseDown={e => handleDragMouseDown(e, scene)}
                      >
                        <div className="absolute top-0 left-0 right-0 rounded-t-xl z-10"
                          style={{ height: '3px', backgroundColor: color }} />

                        {scene.videoUrl ? (
                          <video
                            src={scene.videoUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                            muted preload="metadata"
                            style={{ opacity: isActive ? 0.45 : 0.25 }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0.12 }}>
                            <Film size={16} style={{ color: 'var(--text-tertiary)' }} />
                          </div>
                        )}

                        <div className="relative z-10 flex flex-col justify-between h-full p-2 pt-3">
                          <span className="font-bold truncate leading-tight select-none"
                            style={{ fontSize: '11px', color: isActive ? 'var(--accent)' : 'var(--text)' }}>
                            {scene.title}
                          </span>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 font-semibold select-none"
                              style={{ fontSize: '10px', color: isActive ? color : 'var(--text-tertiary)' }}>
                              <Music2 size={9} />{scene.musicMood}
                            </span>
                            <span className="flex items-center gap-1 font-mono select-none"
                              style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                              <Clock size={9} />{scene.duration}s
                            </span>
                          </div>
                        </div>

                        <button
                          className="absolute top-2 right-2 z-20 w-7 h-7 rounded-lg items-center justify-center opacity-0 group-hover/clip:opacity-100 transition-opacity flex"
                          style={{
                            backgroundColor: 'var(--error-16)',
                            border: '1px solid var(--error-35)',
                            cursor: 'pointer',
                            color: 'var(--error)',
                          }}
                          onClick={e => handleDelete(e, scene.id)}
                          onMouseDown={e => e.stopPropagation()}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--error-22)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--error-16)'}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div
                        className="absolute top-0 bottom-0 flex items-center justify-center z-20 opacity-0 group-hover/clip:opacity-100 transition-opacity"
                        style={{
                          right: 0,
                          width: HANDLE_WIDTH,
                          cursor: 'ew-resize',
                          backgroundColor: 'var(--accent)',
                          borderRadius: '0 6px 6px 0',
                        }}
                        onMouseDown={e => handleTrimMouseDown(e, scene, 'right')}
                      >
                        <div style={{ width: 2, height: 16, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 1 }} />
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {totalDuration > 0 && (
              <div
                className="absolute top-0 bottom-0 pointer-events-none z-30"
                style={{
                  left: playheadLeft,
                  width: 2,
                  backgroundColor: 'var(--accent)',
                  boxShadow: '0 0 6px var(--accent)',
                }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: 'var(--accent)',
                    boxShadow: '0 0 4px var(--accent)',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}