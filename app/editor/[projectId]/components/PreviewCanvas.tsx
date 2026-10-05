'use client'

import React, {
    useRef, useEffect, useCallback, useState,
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
    nextVideoUrl?: string | null
    aspectRatio: string
    clipDuration: number
    sourceDuration?: number | null
    seekOffset: number
    shouldPlay: boolean
    onTimeUpdate: (clipTime: number) => void
    onEnded?: () => void
    onPlayStateChange?: (playing: boolean) => void
    onAddScene?: () => void
}

type SlotId = 'A' | 'B'

const PreviewCanvas = forwardRef<PreviewCanvasHandle, PreviewCanvasProps>(
    ({
        videoUrl, nextVideoUrl, aspectRatio, clipDuration, sourceDuration,
        seekOffset, shouldPlay, onTimeUpdate, onEnded, onPlayStateChange, onAddScene,
    }, ref) => {
        const videoARef = useRef<HTMLVideoElement>(null)
        const videoBRef = useRef<HTMLVideoElement>(null)
        const [activeSlot, setActiveSlot] = useState<SlotId>('A')
        const activeSlotRef = useRef<SlotId>('A')
        useEffect(() => { activeSlotRef.current = activeSlot }, [activeSlot])

        const slotUrlRef = useRef<Record<SlotId, string | null>>({ A: null, B: null })

        const rafRef = useRef<number>(0)
        const clipDurationRef = useRef(clipDuration)
        const shouldPlayRef = useRef(shouldPlay)
        const sourceDurationRef = useRef(sourceDuration)

        useEffect(() => { clipDurationRef.current = clipDuration }, [clipDuration])
        useEffect(() => { shouldPlayRef.current = shouldPlay }, [shouldPlay])
        useEffect(() => { sourceDurationRef.current = sourceDuration }, [sourceDuration])

        const getEl = (slot: SlotId) => (slot === 'A' ? videoARef.current : videoBRef.current)
        const activeEl = () => getEl(activeSlotRef.current)
        const standbySlot = (): SlotId => (activeSlotRef.current === 'A' ? 'B' : 'A')

        const currentRate = useCallback(() => {
            const src = sourceDurationRef.current
            const dur = clipDurationRef.current
            return (src != null && src > 0 && dur > 0) ? src / dur : 1
        }, [])

        const stopRaf = useCallback(() => { cancelAnimationFrame(rafRef.current) }, [])

        const startRaf = useCallback(() => {
            const tick = () => {
                const v = activeEl()
                if (!v) return
                const rate = currentRate()
                const rawClipTime = v.currentTime / rate
                const outPoint = clipDurationRef.current

                if (rawClipTime >= outPoint) {
                    v.pause()
                    stopRaf()
                    onTimeUpdate(outPoint)
                    onEnded?.()
                    return
                }
                onTimeUpdate(Math.min(rawClipTime, outPoint))
                rafRef.current = requestAnimationFrame(tick)
            }
            rafRef.current = requestAnimationFrame(tick)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [onTimeUpdate, onEnded, stopRaf, currentRate])

        const loadIntoSlot = useCallback((slot: SlotId, url: string, onReady?: () => void) => {
            const v = getEl(slot)
            if (!v) return
            if (slotUrlRef.current[slot] === url) {
                onReady?.()
                return
            }
            slotUrlRef.current[slot] = url
            v.src = url
            v.load()
            if (onReady) {
                const handler = () => { v.removeEventListener('loadedmetadata', handler); onReady() }
                v.addEventListener('loadedmetadata', handler, { once: true })
            }
        }, [])

        useImperativeHandle(ref, () => ({
            seekTo: (clipSeconds: number) => {
                const v = activeEl()
                if (!v) return
                const rate = currentRate()
                const clampedClip = Math.max(0, Math.min(clipSeconds, clipDurationRef.current))
                v.currentTime = clampedClip * rate
                onTimeUpdate(clampedClip)
            },
            getCurrentTime: () => {
                const v = activeEl()
                if (!v) return 0
                return v.currentTime / currentRate()
            },
            getDuration: () => activeEl()?.duration ?? 0,
            play: () => {
                const v = activeEl()
                if (!v) return
                const rate = currentRate()
                if (v.currentTime / rate >= clipDurationRef.current) v.currentTime = 0
                v.playbackRate = rate
                v.play().then(() => { startRaf(); onPlayStateChange?.(true) }).catch(() => {})
            },
            pause: () => {
                const v = activeEl()
                if (!v) return
                v.pause()
                stopRaf()
                onPlayStateChange?.(false)
            },
            isPlaying: () => {
                const v = activeEl()
                if (!v) return false
                return !v.paused && !v.ended
            },
        }))

        useEffect(() => {
            stopRaf()

            if (!videoUrl) {
                onPlayStateChange?.(false)
                return
            }

            const alreadyActive = slotUrlRef.current[activeSlotRef.current] === videoUrl
            if (alreadyActive) {
                const v = activeEl()
                if (v) {
                    v.playbackRate = currentRate()
                    if (v.paused) v.currentTime = Math.max(0, seekOffset) * currentRate()
                    if (shouldPlayRef.current) v.play().then(startRaf).catch(() => {})
                }
                return
            }

            const preloadedInStandby = slotUrlRef.current[standbySlot()] === videoUrl
            const targetSlot = preloadedInStandby ? standbySlot() : standbySlot()

            const activateTargetSlot = () => {
                const v = getEl(targetSlot)
                if (!v) return
                v.playbackRate = currentRate()
                v.currentTime = Math.max(0, seekOffset) * currentRate()
                setActiveSlot(targetSlot)
                activeSlotRef.current = targetSlot
                if (shouldPlayRef.current) {
                    v.play().then(() => { startRaf(); onPlayStateChange?.(true) }).catch(() => {})
                } else {
                    onTimeUpdate(Math.max(0, seekOffset))
                }
            }

            if (preloadedInStandby) {
                activateTargetSlot()
            } else {
                loadIntoSlot(targetSlot, videoUrl, activateTargetSlot)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [videoUrl])

        useEffect(() => {
            if (!nextVideoUrl) return
            if (nextVideoUrl === videoUrl) return
            loadIntoSlot(standbySlot(), nextVideoUrl)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [nextVideoUrl, activeSlot])

        useEffect(() => {
            const v = activeEl()
            if (!v || !videoUrl) return
            if (v.paused) {
                v.currentTime = Math.max(0, seekOffset) * currentRate()
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [seekOffset])

        useEffect(() => () => stopRaf(), [stopRaf])

        const handleNativeEnded = useCallback(() => {
            stopRaf()
            onEnded?.()
        }, [stopRaf, onEnded])

        const aspectClassMap: Record<string, string> = {
            '9:16': 'aspect-[9/16]',
            '16:9': 'aspect-video',
            '1:1': 'aspect-square',
        }
        const aspectClass = aspectClassMap[aspectRatio] ?? 'aspect-video'

        return (
            <div className={`relative h-full overflow-hidden border border-transparent hover:border-accent-22 glow-accent-22 hover:bg-(--accent-4) transition-all duration-300 ease-in-out ${aspectClass} ${videoUrl ? 'w-fit' : 'w-full rounded-xl'}`}>
                {videoUrl ? (
                    <>
                        <video
                            ref={videoARef}
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ opacity: activeSlot === 'A' ? 1 : 0, zIndex: activeSlot === 'A' ? 1 : 0 }}
                            onEnded={activeSlot === 'A' ? handleNativeEnded : undefined}
                            muted
                        />
                        <video
                            ref={videoBRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ opacity: activeSlot === 'B' ? 1 : 0, zIndex: activeSlot === 'B' ? 1 : 0 }}
                            onEnded={activeSlot === 'B' ? handleNativeEnded : undefined}
                            muted
                        />
                    </>
                ) : (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                        <Button size="md" variant="primary" onClick={onAddScene} className="p-2!">
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