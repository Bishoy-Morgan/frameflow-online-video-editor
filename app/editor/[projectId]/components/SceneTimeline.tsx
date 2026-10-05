'use client'

import React, { useRef, useCallback, useState, useEffect } from 'react'
import { Plus, Music2, AudioLines, Film, Play, Pause, Square, Mic, PackageX, Ellipsis, Volume2, VolumeX, Video } from 'lucide-react'
import type { OperationNoticeState } from '@/components/ui/OperationNotice'
import Button from '@/components/ui/Button'

interface Scene {
  id: string
  title: string
  description: string
  musicMood: string
  duration: number
  sourceDuration?: number | null
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
  musicVolume?: number
  onMusicVolumeChange?: (value: number) => void
  onAddMusic?: () => void
  onRemoveMusic?: () => void
  musicUploading?: boolean
  voiceoverUrl?: string | null
  voiceoverVolume?: number
  onVoiceoverVolumeChange?: (value: number) => void
  onAddVoiceover?: () => void
  onRemoveVoiceover?: () => void
  voiceoverUploading?: boolean
  pushNotice: (notice: OperationNoticeState) => void
}

const MIN_PX_PER_SEC = 60
const TRACK_PADDING = 16
const MIN_DURATION = 1
const CLIP_HEIGHT = 76
const AUDIO_ROW_HEIGHT = 44
const HANDLE_WIDTH = 8
const GUTTER_WIDTH = 84
const STRETCH_MIN_RATIO = 0.5
const STRETCH_MAX_RATIO = 4

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}


type SelectedTrack = 'video' | 'music' | 'voiceover' | null

function TrackCell({ selected, children }: { selected: boolean; children: React.ReactNode }) {
    return (
        <div
            className={`flex flex-col justify-around items-center h-full rounded-t-xl px-1 overflow-hidden ${
                selected ? 'bg-overlay glow-accent border-accent-16 border border-b-0 block' : 'hidden'
            }`}
            style={{ width: GUTTER_WIDTH }}
        >
            {children}
        </div>
    )
}

function hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i)
        hash |= 0
    }
    return Math.abs(hash)
}

function useAudioDuration(url?: string | null) {
    const [duration, setDuration] = useState<number | null>(null)
    const urlRef = useRef(url)

    useEffect(() => {
        urlRef.current = url
        if (!url) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDuration(null)
            return
        }
        const a = new Audio(url)
        const onLoaded = () => {
            if (urlRef.current === url) setDuration(a.duration)
        }
        a.addEventListener('loadedmetadata', onLoaded)
        return () => a.removeEventListener('loadedmetadata', onLoaded)
    }, [url])

    return duration
}

function FakeWaveform({ seed, color, width }: { seed: string; color: string; width: number }) {
    const barWidth = 8
    const gap = 1.5
    const bars = Math.max(1, Math.floor(width / (barWidth + gap)))
    const hash = hashString(seed)

    const raw: number[] = []
    for (let i = 0; i < bars; i++) {
        const pseudo = Math.abs(Math.sin(hash + i * 12.9898) * 43758.5453) % 1
        raw.push(pseudo)
    }

    const smoothed = raw.map((_, i) => {
        const window = [raw[i - 2], raw[i - 1], raw[i], raw[i + 1], raw[i + 2]].filter(
            (v): v is number => v !== undefined
        )
        return window.reduce((a, b) => a + b, 0) / window.length
    })

    return (
        <div className="flex items-center h-full flex-1 min-w-0" style={{ gap: `${gap}px` }}>
            {smoothed.map((v, i) => {
                const height = 10 + v * 80
                return (
                    <div
                        key={i}
                        className="rounded-full shrink-0 opacity-55"
                        style={{ height: `${height}%`, width: `${barWidth}px`, backgroundColor: color }}
                    />
                )
            })}
        </div>
    )
}

function AudioTrackRow({
    url, pxPerSec, color, icon: Icon, label, onAdd, onRemove, uploading, onSelect
}: {
    url?: string | null
    pxPerSec: number
    color: string
    icon: React.ElementType
    label: string
    onAdd?: () => void
    onRemove?: () => void
    uploading?: boolean
    onSelect?: () => void
}) {
    const duration = useAudioDuration(url)
    const clipWidth = duration != null ? Math.max(40, duration * pxPerSec) : 0

    return (
        <div className="relative" style={{ height: AUDIO_ROW_HEIGHT }}>
            {uploading ? (
                <div
                    className="absolute top-1 bottom-1 rounded-xl flex items-center gap-2 px-6 py-1 bg-overlay glow-accent min-w-40"
                    style={{ left: TRACK_PADDING }}
                >
                    <Ellipsis size={20} className="animate-ping text-accent shrink-0 mr-3" />
                    <span className="text-small font-medium text-tertiary">Uploading {label.toLowerCase()}…</span>
                </div>
            ) : url ? (
                duration != null ? (
                    <div
                        className="group/remove absolute top-1 rounded-xl flex items-center gap-2 px-3 overflow-hidden group/audio cursor-pointer "
                        style={{
                            left: TRACK_PADDING,
                            width: clipWidth,
                            bottom: 4,
                            backgroundColor: `color-mix(in srgb, ${color} 25%, var(--surface-raised))`,
                        }}
                        onClick={e => { e.stopPropagation(); onSelect?.() }}
                    >
                        <Icon size={18} style={{ color }} className="shrink-0 ml-1" />
                        <span className="text-small font-semibold truncate text-secondary shrink-0">
                            {label} · {formatTime(duration)}
                        </span>

                        <FakeWaveform seed={url} color={color} width={Math.max(20, clipWidth - 120)} />

                        {onRemove && (
                            <button
                                onClick={e => { e.stopPropagation(); onRemove?.() }}
                                className="group/removeBtn absolute left-3 top-1/2 -translate-y-1/2 h-7 rounded-lg flex items-center overflow-hidden transition-all duration-300 bg-(--error-fg) cursor-pointer opacity-0 w-0 px-0 group-hover/remove:opacity-100 group-hover/remove:w-24 group-hover/remove:px-3"
                            >
                                <span className="flex items-center gap-1.5 shrink-0">
                                    <PackageX
                                        size={16}
                                        strokeWidth={2.5}
                                        className="text-white shrink-0 transition-all duration-300 opacity-0 -translate-x-2 w-0 group-hover/removeBtn:opacity-100 group-hover/removeBtn:translate-x-0 group-hover/removeBtn:w-4"
                                    />
                                    <span className="text-small font-bold text-white whitespace-nowrap transition-transform duration-300 group-hover/removeBtn:translate-x-0.5">
                                        Remove
                                    </span>
                                </span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div
                        className="absolute top-1 bottom-1 rounded-lg flex items-center px-3 bg-overlay border border-default animate-pulse"
                        style={{ left: TRACK_PADDING, width: 160 }}
                    >
                        <span className="text-[11px] font-medium text-tertiary">Loading {label.toLowerCase()}…</span>
                    </div>
                )
            ) : (
                <button
                    onClick={e => { e.stopPropagation(); onAdd?.() }}
                    className="group/addMedia absolute top-1 bottom-1 rounded-lg flex items-center justify-center gap-1.5 font-semibold text-caption border transition-all duration-300 bg-overlay hover:bg-(--accent) text-(--text) hover:text-white border-accent-22 hover:shadow-md cursor-pointer min-w-40"
                    style={{ left: TRACK_PADDING, right: TRACK_PADDING }}
                >
                    <Plus size={16} strokeWidth={4} className="text-accent group-hover/addMedia:text-white transition-all duration-300" />
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
  musicUrl, musicVolume, onMusicVolumeChange, onAddMusic, onRemoveMusic, musicUploading,
  voiceoverUrl, voiceoverVolume, onVoiceoverVolumeChange, onAddVoiceover, onRemoveVoiceover, voiceoverUploading, pushNotice
}: SceneTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [containerWidth, setContainerWidth] = useState(800)
  const [dragScenes, setDragScenes] = useState<Scene[] | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<SelectedTrack>(null)
  const activeScene = scenes.find(s => s.id === activeSceneId)

  const display = dragScenes ?? scenes
  const sorted = [...display].sort((a, b) => a.order - b.order)
  const total = sorted.reduce((s, c) => s + c.duration, 0) || 1

  const pxPerSec = MIN_PX_PER_SEC

  const trackWidth = total * pxPerSec
  const playheadLeft = TRACK_PADDING + Math.min(currentTime, total) * pxPerSec - 2

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

  const clampNoticeShownRef = useRef(false)

  const handleTrimMouseDown = useCallback((
      e: React.MouseEvent, scene: Scene, edge: 'left' | 'right',
  ) => {
      e.stopPropagation()
      e.preventDefault()
      const startX = e.clientX
      const startDur = scene.duration
      let current = scenes
      clampNoticeShownRef.current = false

      const onMove = (mv: MouseEvent) => {
          const dx = mv.clientX - startX
          const dSec = dx / pxPerSec
          let newDur = edge === 'right' ? startDur + dSec : startDur - dSec
          newDur = Math.max(MIN_DURATION, Math.round(newDur * 2) / 2)

          if (scene.sourceDuration != null) {
              const minDur = scene.sourceDuration * STRETCH_MIN_RATIO
              const maxDur = scene.sourceDuration * STRETCH_MAX_RATIO
              const clamped = Math.max(minDur, Math.min(newDur, maxDur))

              if (clamped !== newDur && !clampNoticeShownRef.current) {
                clampNoticeShownRef.current = true
                pushNotice({
                    type: 'error',
                    autoDismiss: true,
                    message: newDur > maxDur
                        ? `Can't stretch past ${maxDur.toFixed(1)}s (slowest allowed speed).`
                        : `Can't shorten past ${minDur.toFixed(1)}s (fastest allowed speed).`,
                })
            }

              newDur = clamped
          } else {
              if (newDur > scene.duration && !clampNoticeShownRef.current) {
                  clampNoticeShownRef.current = true
                  pushNotice({ type: 'error', message: 'This clip\'s original length is unknown, so it can only be shortened.' })
              }
              newDur = Math.min(newDur, scene.duration)
          }

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
  }, [scenes, pxPerSec, onScenesChange, pushNotice])

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
      <div className="flex items-center shrink-0 px-4 py-2 mb-1 rounded-xl bg-overlay border border-accent-20 glow-accent-22">
          <div className="flex-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span className="text-tiny text-tertiary font-semibold tracking-widest uppercase">
                  Timeline · {display.length} scene{display.length !== 1 ? 's' : ''} · {formatTime(total)}
              </span>
          </div>

          <div className="flex items-center gap-2">
              <button
                  onClick={onStop}
                  title="Stop"
                  className="w-7 h-7 rounded-xl flex items-center justify-center transition-all bg-raised hover:shadow-sm hover:shadow-black/50 cursor-pointer"
              >
                  <Square size={11} fill="currentColor" className="text-tertiary" />
              </button>

              <button
                  onClick={playing ? onPause : onPlay}
                  title={playing ? 'Pause' : 'Play'}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 bg-accent cursor-pointer hover:scale-105 hover:shadow glow-accent-40"
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
              <Button
                  variant='primary'
                  size='sm'
                  onClick={onAddScene}
                  icon={<Plus size={18} strokeWidth={4} />}
                  className="py-1! px-2! shadow-md"
              >
                  Add scene
              </Button>
          </div>
      </div>

      <div className="flex-1 min-h-0 relative overflow-hidden flex">
        <div className="min-w-24 border-r border-(--text-ghost) pr-1">
          {!selectedTrack && (
            <div className="flex items-center justify-center h-full rounded-t-xl transition-colors px-1 bg-overlay glow-accent">
              <span className="text-small font-semibold tracking-wide text-tertiary text-center">Select<br/>a track</span>
            </div>
          )}
          <TrackCell selected={selectedTrack === 'video'}>
              {selectedTrack === 'video' ? (
                  <div className="flex flex-col text-center px-1">
                      <div className="flex items-center justify-center gap-1 mb-10">
                        <Video size={18} color="var(--text-muted)" />
                        <span className="text-tiny font-semibold text-muted">Video</span>
                      </div>
                      <span className="text-small font-bold line-clamp-3 whitespace-normal wrap-words max-w-full text-accent-fg mb-2">
                          {activeScene?.title ?? '—'}
                      </span>
                      <span className="text-tiny text-tertiary font-medium">{activeScene?.duration ?? 0}s</span>
                  </div>
              ) : (
                  <>
                      <Film size={18} color="var(--text-muted)" />
                      <span className="text-small font-semibold tracking-wide text-muted">Video</span>
                  </>
              )}
          </TrackCell>

          <TrackCell selected={selectedTrack === 'music'}>
              {selectedTrack === 'music' ? (
                  <div className="flex flex-col items-center w-full px-1">
                      <div className="flex items-center justify-center gap-1 mb-10">
                        <Music2 size={18} color="var(--text-muted)" />
                        <span className="text-tiny font-bold text-muted">Music</span>
                      </div>
                      <input
                          type="range" min="0" max="1" step="0.01"
                          value={musicVolume ?? 0.5}
                          onChange={e => onMusicVolumeChange?.(Number(e.target.value))}
                          style={{ '--volume': `${(musicVolume ?? 0.5) * 100}%` } as React.CSSProperties}
                          className="volume-slider shrink-0"
                      />
                      <span className="text-small font-mono text-secondary mt-1.5">{Math.round((musicVolume ?? 0.5) * 100)}%</span>
                  </div>
              ) : (
                  <>
                      <Music2 size={18} color="var(--text-muted)" />
                      <span className="text-small font-semibold tracking-wide text-muted">Music</span>
                  </>
              )}
          </TrackCell>

          <TrackCell selected={selectedTrack === 'voiceover'}>
              {selectedTrack === 'voiceover' ? (
                  <div className="flex flex-col items-center w-full px-1">
                      <div className="flex items-center justify-center gap-1 mb-10">
                        <Mic size={18} color="var(--text-muted)" />
                        <span className="text-tiny font-bold text-muted">Voiceover</span>
                      </div>
                      <input
                          type="range" min="0" max="1" step="0.01"
                          value={voiceoverVolume ?? 1.0}
                          onChange={e => onVoiceoverVolumeChange?.(Number(e.target.value))}
                          style={{ '--volume': `${(voiceoverVolume ?? 1.0) * 100}%` } as React.CSSProperties}
                          className="volume-slider shrink-0"
                      />
                      <span className="text-small font-mono text-secondary mt-1.5">{Math.round((voiceoverVolume ?? 1.0) * 100)}%</span>
                  </div>
              ) : (
                  <>
                      <Mic size={18} color="var(--text-muted)" />
                      <span className="text-small font-semibold uppercase tracking-wide text-tertiary">Voiceover</span>
                  </>
              )}
          </TrackCell>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto overflow-y-hidden"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--accent-35) transparent' }}
          onClick={handleTrackClick}
        >
          <div
            style={{
              width: Math.max(trackWidth + TRACK_PADDING * 2 + 80, containerWidth - GUTTER_WIDTH),
              position: 'relative',
            }}
          >
            <div className="relative border-b border-(--text-ghost) mb-2 h-5.5">
              {markers.map(t => (
                <div
                  key={t}
                  className="absolute flex flex-col items-center pointer-events-none"
                  style={{ left: TRACK_PADDING + t * pxPerSec, bottom: 0, transform: 'translateX(-50%)' }}
                >
                  <span className="font-mono text-secondary mb-0.75 text-tiny">
                    {t}s
                  </span>
                  <div className="w-px h-1 bg-(--text-ghost)" />
                </div>
              ))}
            </div>

            <div className="relative" style={{ height: CLIP_HEIGHT }}>
              {display.length === 0 ? (
                <div className="flex items-center justify-center w-full h-full pointer-events-none">
                  <span className="text-tertiary opacity-90 text-small text-center">
                    No scenes yet<br/>add your first scene
                  </span>
                </div>
              ) : (
                scenesWithPos.map(scene => {
                  const isActive = scene.id === activeSceneId

                  return (
                    <div
                      key={scene.id}
                      className="absolute group/clip"
                      style={{ left: scene.left, width: scene.width, top: 0, height: CLIP_HEIGHT }}
                    >
                      <div
                        className='group/clip absolute flex flex-col justify-between overflow-hidden rounded-xl transition-all duration-200'
                        style={{ inset: 0, cursor: 'grab' }}
                        onClick={e => {
                          e.stopPropagation()
                          onSceneClick(scene, scene.startTime)
                          setSelectedTrack('video')
                        }}
                        onMouseDown={e => handleDragMouseDown(e, scene)}
                    >

                        {scene.videoUrl ? (
                          <video
                            src={scene.videoUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                            muted preload="metadata"
                            style={{ opacity: isActive ? 1 : 0.75 }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center opacity-[0.12]">
                            <Film size={18} className="text-tertiary" />
                          </div>
                        )}

                        <div className="relative z-10 flex flex-col justify-end h-full p-2 pt-3">
                          {/* <span
                            className={`font-bold truncate select-none text-small backdrop-blur-sm px-2 py-0.5 w-fit rounded-xl ${isActive ? 'text-accent' : 'text-(--text)'}`}
                          >
                            {scene.title}
                          </span> */}
                          <div className="flex items-center justify-between">
                            <span className={`flex items-center gap-1 font-mono font-bold select-none text-(--text) text-tiny  py-0.5 px-1 rounded-xl ${isActive ? 'bg-sunken' : 'bg-raised'} `}>
                              <AudioLines size={10} />{scene.duration}s
                            </span>
                          </div>
                        </div>

                        <button
                          className="group/remove absolute top-2 right-4 z-20 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-500 bg-transparent hover:bg-(--error-fg) cursor-pointer opacity-0 group-hover/clip:opacity-100 "
                          onClick={e => handleDelete(e, scene.id)}
                          onMouseDown={e => e.stopPropagation()}
                        >
                          <PackageX size={20} strokeWidth={2.5} className='text-error group-hover/remove:text-white'/>
                        </button>
                      </div>

                      <div
                        className="absolute top-0 bottom-0 flex items-center justify-center z-20 opacity-0 group-hover/clip:opacity-100 transition-opacity bg-accent rounded-r-xl"
                        style={{ right: 0, width: HANDLE_WIDTH, cursor: 'ew-resize' }}
                        onMouseDown={e => handleTrimMouseDown(e, scene, 'right')}
                      >
                        <div className="bg-black rounded-sm w-0.5 h-7" />
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <AudioTrackRow
                url={musicUrl}
                pxPerSec={pxPerSec}
                color="var(--amber)"
                icon={Music2}
                label="Music"
                onAdd={onAddMusic}
                onRemove={onRemoveMusic}
                uploading={musicUploading}
                onSelect={() => setSelectedTrack('music')}
            />

            <AudioTrackRow
                url={voiceoverUrl}
                pxPerSec={pxPerSec}
                color="var(--mood-melancholic)"
                icon={Mic}
                label="Voiceover"
                onAdd={onAddVoiceover}
                onRemove={onRemoveVoiceover}
                uploading={voiceoverUploading}
                onSelect={() => setSelectedTrack('voiceover')}
            />

            {totalDuration > 0 && (
              <div
                className="absolute top-0 bottom-0 z-30 w-0.5 bg-accent rounded cursor-ew-resize"
                style={{ left: playheadLeft }}
                onMouseDown={handlePlayheadMouseDown}
              >
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rotate-45 bg-accent w-2.5 h-2.5 rounded-sm" />
                <div className="absolute inset-0 glow-accent-40" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}