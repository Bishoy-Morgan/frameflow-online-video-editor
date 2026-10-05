'use client'

import { useEffect, useRef } from 'react'

export function useAudioTrack(url: string | null, playing: boolean, time: number, volume = 1) {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const timeRef = useRef(time)
    const playingRef = useRef(playing)

    useEffect(() => { timeRef.current = time }, [time])
    useEffect(() => { playingRef.current = playing }, [playing])

    // one element per url
    useEffect(() => {
        if (!url) return
        const a = new Audio(url)
        a.preload = 'auto'
        audioRef.current = a
        if (playingRef.current) {
            a.currentTime = timeRef.current
            a.play().catch(() => {})
        }
        return () => {
            a.pause()
            a.removeAttribute('src')
            a.load()
            audioRef.current = null
        }
    }, [url])

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume
    }, [volume, url])

    // play / pause
    useEffect(() => {
        const a = audioRef.current
        if (!a) return
        if (playing) {
            a.currentTime = timeRef.current
            a.play().catch(() => {})
        } else {
            a.pause()
        }
    }, [playing])

    // scrubbing while paused, drift correction while playing
    useEffect(() => {
        const a = audioRef.current
        if (!a) return
        if (Number.isFinite(a.duration) && time > a.duration) return
        if (Math.abs(a.currentTime - time) > (playing ? 0.3 : 0.05)) a.currentTime = time
    }, [time, playing])
}