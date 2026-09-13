'use client'

import React, {
    useRef, useEffect, useCallback,
    useImperativeHandle, forwardRef,
} from 'react'
import { Plus } from 'lucide-react'
import Button from '@/components/ui/Button'

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
    seekOffset: number
    onTimeUpdate: (clipTime: number) => void
    onEnded?: () => void
    onPlayStateChange?: (playing: boolean) => void
    onAddScene?: () => void
}

const PreviewCanvas = forwardRef<PreviewCanvasHandle, PreviewCanvasProps>(
    ({ videoUrl, aspectRatio, clipDuration, seekOffset, onTimeUpdate, onEnded, onPlayStateChange, onAddScene }, ref) => {
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
            getDuration: () => videoRef.current?.duration ?? 0,
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
                v.currentTime = Math.max(0, Math.min(seekOffset, clipDurationRef.current))
            }
            v.addEventListener('loadedmetadata', onLoaded, { once: true })
            return () => v.removeEventListener('loadedmetadata', onLoaded)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [videoUrl, stopRaf, onPlayStateChange])

        useEffect(() => {
            const v = videoRef.current
            if (!v || !videoUrl) return
            if (v.paused) {
                v.currentTime = Math.max(0, Math.min(seekOffset, clipDurationRef.current))
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [seekOffset])

        useEffect(() => () => stopRaf(), [stopRaf])

        const handleNativeEnded = useCallback(() => {
            stopRaf()
            onPlayStateChange?.(false)
            onEnded?.()
        }, [stopRaf, onEnded, onPlayStateChange])

        const aspectClassMap: Record<string, string> = {
            '9:16': 'aspect-[9/16]',
            '16:9': 'aspect-video',
            '1:1': 'aspect-square',
        }
        const aspectClass = aspectClassMap[aspectRatio] ?? 'aspect-video'

        return (
            <div className={`relative h-full overflow-hidden border border-transparent hover:border-(--accent-22) shadow-accent-22 hover:bg-(--accent-4) transition-all duration-300 ease-in-out ${aspectClass} ${videoUrl ? 'w-fit px-1.5' : 'w-full rounded-xl'}`}>
                {videoUrl ? (
                    <video
                        ref={videoRef}
                        className="w-full h-full object-contain"
                        onEnded={handleNativeEnded}
                        muted
                    />
                ) : (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                        <Button
                            size="md"
                            variant="primary"
                            onClick={onAddScene}
                            className="p-2!"
                        >
                            <Plus size={28} strokeWidth={4} />
                        </Button>
                        <p className="text-caption font-semibold text-(--text) text-center mt-4">
                            Click to add a scene<br />
                            Or search in video stock library
                        </p>
                    </div>
                )}
            </div>
        )
    }
)

PreviewCanvas.displayName = 'PreviewCanvas'
export default PreviewCanvas