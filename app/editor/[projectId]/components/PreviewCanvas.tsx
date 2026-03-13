'use client'

import React, {
    useRef, useState, useEffect, useCallback,
    useImperativeHandle, forwardRef,
} from 'react'
import { Upload, Film } from 'lucide-react'

export interface PreviewCanvasHandle {
    seekTo:         (seconds: number) => void
    getCurrentTime: () => number
    getDuration:    () => number
    play:           () => void
    pause:          () => void
    isPlaying:      () => boolean
}

interface PreviewCanvasProps {
    videoUrl:           string | null
    aspectRatio:        string
    clipDuration:       number          // out point — stop playback at this time
    onTimeUpdate:       (clipTime: number) => void
    onEnded?:           () => void
    onPlayStateChange?: (playing: boolean) => void
}

const PreviewCanvas = forwardRef<PreviewCanvasHandle, PreviewCanvasProps>(
    ({ videoUrl, aspectRatio, clipDuration, onTimeUpdate, onEnded, onPlayStateChange }, ref) => {
        const videoRef       = useRef<HTMLVideoElement>(null)
        const rafRef         = useRef<number>(0)
        const clipDurationRef = useRef(clipDuration)
        const [dragOver, setDragOver] = useState(false)

        // Keep clipDurationRef in sync so the RAF closure always sees the latest value
        // without needing to restart the loop on every trim change
        useEffect(() => {
            clipDurationRef.current = clipDuration
        }, [clipDuration])

        const stopRaf = useCallback(() => {
            cancelAnimationFrame(rafRef.current)
        }, [])

        const startRaf = useCallback(() => {
            const tick = () => {
                const v = videoRef.current
                if (!v) return

                const t       = v.currentTime
                const outPoint = clipDurationRef.current

                // Enforce out point — stop when we hit scene.duration
                if (t >= outPoint) {
                    v.pause()
                    v.currentTime = outPoint
                    stopRaf()
                    onTimeUpdate(outPoint)
                    onPlayStateChange?.(false)
                    onEnded?.()
                    return
                }

                onTimeUpdate(t)
                rafRef.current = requestAnimationFrame(tick)
            }
            rafRef.current = requestAnimationFrame(tick)
        }, [onTimeUpdate, onEnded, onPlayStateChange, stopRaf])

        useImperativeHandle(ref, () => ({
            seekTo: (seconds: number) => {
                const v = videoRef.current
                if (!v) return
                // Clamp seek to within the clip's out point
                const clamped = Math.max(0, Math.min(seconds, clipDurationRef.current))
                v.currentTime = clamped
                onTimeUpdate(clamped)
            },
            getCurrentTime: () => videoRef.current?.currentTime ?? 0,
            getDuration:    () => videoRef.current?.duration    ?? 0,
            play: () => {
                const v = videoRef.current
                if (!v) return
                // If we're at or past the out point, seek back to 0 first
                if (v.currentTime >= clipDurationRef.current) {
                    v.currentTime = 0
                }
                v.play().then(() => {
                    startRaf()
                    onPlayStateChange?.(true)
                }).catch(() => {})
            },
            pause: () => {
                const v = videoRef.current
                if (!v) return
                v.pause()
                stopRaf()
                onPlayStateChange?.(false)
            },
            isPlaying: () => {
                const v = videoRef.current
                if (!v) return false
                return !v.paused && !v.ended
            },
        }))

        // When videoUrl changes — load and auto-play from 0
        useEffect(() => {
            const v = videoRef.current
            if (!v) return
            stopRaf()
            onPlayStateChange?.(false)

            if (!videoUrl) {
                v.removeAttribute('src')
                v.load()
                return
            }

            v.src = videoUrl
            v.load()

            const onLoaded = () => {
                v.currentTime = 0
                v.play()
                    .then(() => { startRaf(); onPlayStateChange?.(true) })
                    .catch(() => {})
            }
            v.addEventListener('loadedmetadata', onLoaded, { once: true })
            return () => v.removeEventListener('loadedmetadata', onLoaded)
        }, [videoUrl, startRaf, stopRaf, onPlayStateChange])

        useEffect(() => () => stopRaf(), [stopRaf])

        // Native video end (file shorter than clipDuration) — still fire onEnded
        const handleNativeEnded = useCallback(() => {
            stopRaf()
            onPlayStateChange?.(false)
            onEnded?.()
        }, [stopRaf, onEnded, onPlayStateChange])

        const handleDrop = (e: React.DragEvent) => {
            e.preventDefault()
            setDragOver(false)
            const file = e.dataTransfer.files[0]
            if (file?.type.startsWith('video/')) {
                const v = videoRef.current
                if (v) { v.src = URL.createObjectURL(file); v.load() }
            }
        }

        const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (!file) return
            const v = videoRef.current
            if (v) { v.src = URL.createObjectURL(file); v.load() }
        }

        const paddingMap: Record<string, string> = {
            '9:16': '177.78%', '16:9': '56.25%', '1:1': '100%',
        }
        const paddingBottom = paddingMap[aspectRatio] ?? '56.25%'

        return (
            <div className="flex items-center justify-center h-full w-full p-4">
                <div
                    className="relative w-full"
                    style={{
                        maxWidth:        aspectRatio === '9:16' ? '240px' : aspectRatio === '1:1' ? '360px' : '100%',
                        paddingBottom,
                        height:          0,
                        borderRadius:    '10px',
                        overflow:        'hidden',
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
                            <video
                                ref={videoRef}
                                className="w-full h-full object-contain"
                                onEnded={handleNativeEnded}
                                style={{ backgroundColor: '#000' }}
                                muted
                            />
                        ) : (
                            <label
                                className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer"
                                style={{ backgroundColor: dragOver ? 'var(--turquoise-8)' : 'transparent' }}
                            >
                                <input type="file" accept="video/*" className="hidden" onChange={handleFileInput} />
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}>
                                    {dragOver
                                        ? <Film   size={20} style={{ color: 'var(--turquoise)' }} />
                                        : <Upload size={20} style={{ color: 'var(--text-tertiary)', opacity: 0.6 }} strokeWidth={1.5} />}
                                </div>
                                <div className="flex flex-col items-center gap-1 text-center px-4">
                                    <span className="text-xs font-bold"
                                        style={{ color: dragOver ? 'var(--turquoise)' : 'var(--text-secondary)' }}>
                                        {dragOver ? 'Drop to load' : 'Drop video here'}
                                    </span>
                                    <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>or click to browse</span>
                                </div>
                            </label>
                        )}
                    </div>
                </div>
            </div>
        )
    }
)

PreviewCanvas.displayName = 'PreviewCanvas'
export default PreviewCanvas