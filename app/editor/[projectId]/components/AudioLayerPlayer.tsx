'use client'

import { useAudioTrack } from '@/hooks/useAudioTrack'

export interface AudioLayerData {
    id: string
    type: 'MUSIC' | 'VOICEOVER'
    url: string
    volume: number
    startTime: number
    row: number
    sourceDuration?: number | null
}

export default function AudioLayerPlayer({ layer, playing, globalTime }: {
    layer: AudioLayerData
    playing: boolean
    globalTime: number
}) {
    useAudioTrack(layer.url, playing, globalTime, layer.volume, layer.startTime)
    return null
}