'use client'

import { useEffect, useRef } from 'react'

export function useAudioTrack(
    url: string | null,
    playing: boolean,
    globalTime: number,
    volume: number,
    startTime: number = 0,
) {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if (!url) return
        const a = new Audio(url)
        audioRef.current = a
        return () => { a.pause(); audioRef.current = null }
    }, [url])

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume
    }, [url, volume])

    useEffect(() => {
        const a = audioRef.current
        if (!a) return
        const localTime = globalTime - startTime

        if (!playing || localTime < 0) { a.pause(); return }
        if (Number.isFinite(a.duration) && localTime > a.duration) { a.pause(); return }

        if (Math.abs(a.currentTime - localTime) > 0.3) a.currentTime = localTime
        if (a.paused) a.play().catch(() => {})
    }, [playing, globalTime, startTime, url])
}