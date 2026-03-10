'use client'

import React, {
  useRef, useState, useEffect, useCallback,
  useImperativeHandle, forwardRef,
} from 'react'
import { Play, Pause, Volume2, VolumeX, Upload, Film } from 'lucide-react'

export interface PreviewCanvasHandle {
  seekTo:         (seconds: number) => void
  getCurrentTime: () => number
  getDuration:    () => number
}

interface PreviewCanvasProps {
  videoUrl:     string | null
  aspectRatio:  string
  onVideoLoad:  (url: string, duration: number) => void
  onTimeUpdate: (currentTime: number) => void
}

function formatTime(s: number) {
  const m   = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const PreviewCanvas = forwardRef<PreviewCanvasHandle, PreviewCanvasProps>(
  ({ videoUrl, aspectRatio, onVideoLoad, onTimeUpdate }, ref) => {
    const videoRef   = useRef<HTMLVideoElement>(null)
    const rafRef     = useRef<number>(0)
    const [playing,  setPlaying]  = useState(false)
    const [muted,    setMuted]    = useState(false)
    const [progress, setProgress] = useState(0)
    const [current,  setCurrent]  = useState(0)
    const [duration, setDuration] = useState(0)
    const [dragOver, setDragOver] = useState(false)
    const [volume,   setVolume]   = useState(1)

    // Expose imperative handle so parent can call seekTo()
    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        const v = videoRef.current
        if (!v) return
        v.currentTime = Math.max(0, Math.min(seconds, v.duration || 0))
        setCurrent(v.currentTime)
        setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0)
        onTimeUpdate(v.currentTime)
      },
      getCurrentTime: () => videoRef.current?.currentTime ?? 0,
      getDuration:    () => videoRef.current?.duration    ?? 0,
    }))

    const paddingMap: Record<string, string> = {
      '9:16': '177.78%', '16:9': '56.25%', '1:1': '100%',
    }
    const paddingBottom = paddingMap[aspectRatio] ?? '56.25%'

    useEffect(() => {
      const v = videoRef.current
      if (!v || !videoUrl) return
      v.src = videoUrl
      v.load()
      setPlaying(false); setProgress(0); setCurrent(0)
    }, [videoUrl])

    // RAF loop — smooth playhead at 60fps
    const stopRaf  = useCallback(() => cancelAnimationFrame(rafRef.current), [])
    const startRaf = useCallback(() => {
      const tick = () => {
        const v = videoRef.current
        if (!v) return
        const t = v.currentTime
        setCurrent(t)
        setProgress(v.duration ? (t / v.duration) * 100 : 0)
        onTimeUpdate(t)
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }, [onTimeUpdate])

    useEffect(() => () => stopRaf(), [stopRaf])

    const togglePlay = useCallback(() => {
      const v = videoRef.current
      if (!v) return
      if (playing) { v.pause(); stopRaf() } else { v.play(); startRaf() }
      setPlaying(p => !p)
    }, [playing, startRaf, stopRaf])

    const handleLoaded = useCallback(() => {
      const v = videoRef.current
      if (!v) return
      setDuration(v.duration)
      onVideoLoad(videoUrl!, v.duration)
    }, [videoUrl, onVideoLoad])

    const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const v = videoRef.current
      if (!v) return
      const rect = e.currentTarget.getBoundingClientRect()
      const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      v.currentTime = pct * (v.duration || 0)
      onTimeUpdate(v.currentTime)
    }, [onTimeUpdate])

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault(); setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file?.type.startsWith('video/')) onVideoLoad(URL.createObjectURL(file), 0)
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) onVideoLoad(URL.createObjectURL(file), 0)
    }

    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-4 gap-3">

        {/* Canvas frame */}
        <div
          className="relative w-full"
          style={{
            maxWidth:        aspectRatio === '9:16' ? '240px' : aspectRatio === '1:1' ? '360px' : '100%',
            paddingBottom, height: 0,
            borderRadius:    '10px', overflow: 'hidden',
            backgroundColor: 'var(--bg)',
            border:          dragOver ? '2px solid var(--turquoise)' : '1px solid var(--border-default)',
            boxShadow:       '0 8px 40px rgba(0,0,0,0.3)',
            transition:      'border-color 0.2s ease',
          }}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="absolute inset-0">
            {videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  onLoadedMetadata={handleLoaded}
                  onEnded={() => { setPlaying(false); stopRaf() }}
                  onClick={togglePlay}
                  style={{ cursor: 'pointer', backgroundColor: '#000' }}
                  muted={muted}
                />
                {!playing && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.35)', cursor: 'pointer' }}
                    onClick={togglePlay}
                  >
                    <div className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                      <Play size={22} fill="white" color="white" style={{ marginLeft: 2 }} />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer"
                style={{ backgroundColor: dragOver ? 'var(--turquoise-8)' : 'transparent' }}>
                <input type="file" accept="video/*" className="hidden" onChange={handleFileInput} />
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}>
                  {dragOver
                    ? <Film size={20} style={{ color: 'var(--turquoise)' }} />
                    : <Upload size={20} style={{ color: 'var(--text-tertiary)', opacity: 0.6 }} strokeWidth={1.5} />}
                </div>
                <div className="flex flex-col items-center gap-1 text-center px-4">
                  <span className="text-xs font-bold" style={{ color: dragOver ? 'var(--turquoise)' : 'var(--text-secondary)' }}>
                    {dragOver ? 'Drop to load' : 'Drop video here'}
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>or click to browse</span>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Controls */}
        {videoUrl && (
          <div className="flex flex-col gap-2 w-full px-1"
            style={{ maxWidth: aspectRatio === '9:16' ? '320px' : '100%' }}>

            {/* Scrubber */}
            <div className="w-full h-1.5 rounded-full cursor-pointer relative group"
              style={{ backgroundColor: 'var(--border-default)' }}
              onClick={handleSeek}>
              <div className="h-full rounded-full"
                style={{ width: `${progress}%`, backgroundColor: 'var(--turquoise)', transition: 'width 0.04s linear' }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ left: `calc(${progress}% - 6px)`, backgroundColor: 'var(--turquoise)', border: '2px solid var(--bg)', boxShadow: '0 0 0 2px var(--turquoise-42)' }} />
            </div>

            {/* Buttons row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={togglePlay}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}>
                  {playing
                    ? <Pause size={12} fill="currentColor" style={{ color: 'var(--text)' }} />
                    : <Play  size={12} fill="currentColor" style={{ color: 'var(--text)', marginLeft: 1 }} />}
                </button>

                <button onClick={() => { if (videoRef.current) { videoRef.current.muted = !muted; setMuted(m => !m) } }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}>
                  {muted ? <VolumeX size={11} style={{ color: 'var(--text-tertiary)' }} /> : <Volume2 size={11} style={{ color: 'var(--text)' }} />}
                </button>

                <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
                  onChange={e => { const v = parseFloat(e.target.value); setVolume(v); if (videoRef.current) videoRef.current.volume = v; setMuted(v === 0) }}
                  className="w-16 h-1 appearance-none rounded-full cursor-pointer"
                  style={{ accentColor: 'var(--turquoise)' }} />
              </div>

              <span className="text-[11px] font-mono tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
                {formatTime(current)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }
)

PreviewCanvas.displayName = 'PreviewCanvas'
export default PreviewCanvas