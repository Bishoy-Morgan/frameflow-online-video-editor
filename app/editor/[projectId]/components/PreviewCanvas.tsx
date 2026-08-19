'use client'

import React, {
    useRef, useEffect, useCallback,
    useImperativeHandle, forwardRef,
} from 'react'
import { Plus } from 'lucide-react'

export interface PreviewCanvasHandle {
    seekTo: (seconds: number) => void
    getCurrentTime: () => number
    getDuration: () => number
    play: () => void
    pause: () => void
    isPlaying: () => boolean
}

interface PreviewCanvasProps {
    videoUrl: string | null
    aspectRatio: string
    clipDuration: number
    onTimeUpdate: (clipTime: number) => void
    onEnded?: () => void
    onPlayStateChange?: (playing: boolean) => void
    onAddScene?: () => void
}

const PreviewCanvas = forwardRef<PreviewCanvasHandle, PreviewCanvasProps>(
    ({ videoUrl, aspectRatio, clipDuration, onTimeUpdate, onEnded, onPlayStateChange, onAddScene }, ref) => {
        const videoRef = useRef<HTMLVideoElement>(null)
        const rafRef = useRef<number>(0)
        const clipDurationRef = useRef(clipDuration)

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

                const t = v.currentTime
                const outPoint = clipDurationRef.current

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
                const clamped = Math.max(0, Math.min(seconds, clipDurationRef.current))
                v.currentTime = clamped
                onTimeUpdate(clamped)
            },
            getCurrentTime: () => videoRef.current?.currentTime ?? 0,
            getDuration: () => videoRef.current?.duration    ?? 0,
            play: () => {
                const v = videoRef.current
                if (!v) return
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

        const handleNativeEnded = useCallback(() => {
            stopRaf()
            onPlayStateChange?.(false)
            onEnded?.()
        }, [stopRaf, onEnded, onPlayStateChange])

        const paddingMap: Record<string, string> = {
            '9:16': '177.78%', '16:9': '56.25%', '1:1': '100%',
        }
        const paddingBottom = paddingMap[aspectRatio] ?? '56.25%'

        return (
            <div className="flex items-center justify-center h-full w-full p-4 bg-accent! transition-colors duration-200">
                <div
                    className="relative w-full"
                    style={{
                        maxWidth: aspectRatio === '9:16' ? '240px' : aspectRatio === '1:1' ? '360px' : '100%',
                        paddingBottom,
                        height: 0,
                        borderRadius: '10px',
                        overflow: 'hidden',
                        backgroundColor: 'var(--bg)',
                        border: '1px solid var(--border-default)',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
                    }}
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
                            <div className="group/scene absolute inset-0 flex flex-col items-center justify-center gap-3">
                                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-(--accent)/20 to-transparent opacity-0 transition-opacity duration-1000 ease-in-out group-hover/scene:opacity-100" />

                                <div
                                    className="group/button relative z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-(--border-default) bg-(--surface-raised) transition-all duration-500"
                                    onClick={onAddScene}
                                >
                                    <Plus
                                        size={30}
                                        className="opacity-60 group-hover/button:text-(--accent) group-hover/button:opacity-100 transition-colors duration-200"
                                    />
                                </div>

                                <span
                                    className="relative z-10 text-xs font-bold"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Click to add a scene
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
)

PreviewCanvas.displayName = 'PreviewCanvas'
export default PreviewCanvas