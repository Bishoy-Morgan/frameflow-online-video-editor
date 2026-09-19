'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Clock, Star, Monitor, Smartphone, Square, Film, Pencil, Copy, Trash2, FolderOpen, Cog } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export interface Project {
    id: string
    name: string
    lastEdited: string
    thumbnail?: string
    previewVideoUrl?: string | null
    starred?: boolean
    deletedAt?: string | null
    aspectRatio?: string | null
    style?: string | null
    sceneCount?: number
    totalDuration?: number
}

interface DashboardCardProps {
    project: Project
    onRename?: () => void
    onDuplicate?: () => void
    onToggleStar?: () => void
    onTrash?: () => void
    onRestore?: () => void
    onPermanentDelete?: () => void
}

const RATIO_ICON: Record<string, React.ElementType> = {
    '16:9': Monitor,
    '9:16': Smartphone,
    '1:1': Square,
}

function formatDuration(seconds?: number) {
    if (!seconds) return null
    if (seconds < 60) return `${seconds}s`
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return s === 0 ? `${m}m` : `${m}m ${s}s`
}

function RailButton({ icon: Icon, label, onClick, active, danger }: {
    icon: React.ElementType
    label: string
    onClick: () => void
    active?: boolean
    danger?: boolean
}) {
    return (
        <div className="relative group/rail">
            <button
                onClick={e => { e.stopPropagation(); onClick() }}
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-150 border-none ${
                    danger
                        ? 'bg-(--error-8) text-(--error) hover:bg-(--error) hover:text-white'
                        : active
                            ? 'bg-(--accent-16) text-(--accent)'
                            : 'bg-(--surface-raised) text-(--text-secondary) hover:bg-(--accent-8) hover:text-(--accent)'
                }`}
            >
                <Icon size={18} strokeWidth={2} />
            </button>
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 rounded-xl text-small font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover/rail:opacity-100 transition-opacity z-100 bg-(--text) text-white">
                {label}
            </div>
        </div>
    )
}

export default function DashboardCard({ project, onRename, onDuplicate, onToggleStar, onTrash, onRestore, onPermanentDelete }: DashboardCardProps) {
    const [hovering, setHovering] = useState(false)
    const [railOpen, setRailOpen] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const railRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const hasMenu = !!(onRename || onDuplicate || onToggleStar || onTrash || onRestore || onPermanentDelete)
    const isTrashed = !!project.deletedAt

    useEffect(() => {
        const v = videoRef.current
        if (!v) return
        if (hovering) {
            v.play().catch(() => {})
        } else {
            v.pause()
            v.currentTime = 0
        }
    }, [hovering])

    useEffect(() => {
        if (!railOpen) return
        const handler = (e: MouseEvent) => {
            if (railRef.current && !railRef.current.contains(e.target as Node)) setRailOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [railOpen])

    const RatioIcon = project.aspectRatio ? RATIO_ICON[project.aspectRatio] : null
    const durationLabel = formatDuration(project.totalDuration)

    return (
        <div
        onClick={() => !isTrashed && router.push(`/editor/${project.id}`)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => { setHovering(false); setRailOpen(false) }}
        className={`group relative flex flex-col rounded-2xl overflow-visible transition-all duration-300 ring-1 ring-(--border-default) hover:ring-(--accent-42) hover:-translate-y-0.5 ${
            isTrashed ? 'cursor-default' : 'cursor-pointer'
        }`}
    >
        <div className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-(--surface-sunken) ${isTrashed ? 'grayscale' : ''}`}>
            {project.previewVideoUrl ? (
                <video
                    ref={videoRef}
                    src={project.previewVideoUrl}
                    poster={project.thumbnail}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : project.thumbnail ? (
                <Image src={project.thumbnail} alt={project.name} fill className="object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-(--surface-sunken)">
                    <Film size={26} className="text-(--text-tertiary)" />
                </div>
            )}

            {isTrashed && (
                <div className="absolute inset-0 bg-black/35" />
            )}

            {isTrashed && (
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-tiny font-bold text-white bg-(--error) shadow-md">
                    Trashed
                </div>
            )}

            {project.starred && !isTrashed && (
                <div className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full flex items-center justify-center bg-(--surface-overlay) shadow-md shadow-[#00D9AA]">
                    <Star size={16} fill="var(--accent)" className="text-(--accent)" />
                </div>
            )}

            {hasMenu && (
                <button
                    onClick={e => { e.preventDefault(); e.stopPropagation(); setRailOpen(o => !o) }}
                    className={`absolute top-3 right-3 z-20 p-1.5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:opacity-100 border-transparent cursor-pointer text-(--text) ${
                        railOpen ? 'bg-(--accent) opacity-100' : 'bg-(--surface-sunken)'
                    }`}
                >
                    <Cog size={18} className="hover:rotate-90 transition-transform duration-300" />
                </button>
            )}

            <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-2">
                <p className="text-caption font-bold leading-snug text-white line-clamp-1 shadow w-fit px-2 py-1 rounded-xl backdrop-blur-xs">
                    {project.name}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                    {RatioIcon && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-tiny font-bold text-white bg-(--accent-40) backdrop-blur-md">
                            <RatioIcon size={9} />
                            {project.aspectRatio}
                        </div>
                    )}
                    {project.sceneCount !== undefined && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-tiny font-bold text-white bg-(--accent-40) backdrop-blur-md">
                            <Film size={9} />
                            {project.sceneCount}
                        </div>
                    )}
                    {durationLabel && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-tiny font-bold text-white bg-(--accent-40) backdrop-blur-md">
                            <Clock size={9} />
                            {durationLabel}
                        </div>
                    )}
                </div>
            </div>
        </div>

            {hasMenu && railOpen && (
                <div
                    ref={railRef}
                    onClick={e => e.stopPropagation()}
                    className="absolute top-1/2 -translate-y-1/2 right-12 z-100 flex flex-col gap-1.5 p-2 rounded-full bg-(--surface-overlay) border border-(--border-default) shadow-accent-40 "
                >
                    {isTrashed ? (
                        <>
                            {onRestore && <RailButton icon={FolderOpen} label="Restore" onClick={onRestore} />}
                            {onPermanentDelete && <RailButton icon={Trash2} label="Delete Permanently" onClick={onPermanentDelete} danger />}
                        </>
                    ) : (
                        <>
                            {onRename && <RailButton icon={Pencil} label="Rename" onClick={onRename} />}
                            {onToggleStar && <RailButton icon={Star} label={project.starred ? 'Unstar' : 'Star'} onClick={onToggleStar} active={project.starred} />}
                            {onDuplicate && <RailButton icon={Copy} label="Duplicate" onClick={onDuplicate} />}
                            {onTrash && <RailButton icon={Trash2} label="Move to Trash" onClick={onTrash} danger />}
                        </>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between px-3 py-2 rounded-b-2xl bg-(--surface-overlay) border border-t-0 border-(--border-default)">
                <span className="text-tiny font-medium text-(--text-tertiary)">{project.lastEdited}</span>
                {project.style && (
                    <span className="text-tiny font-semibold text-(--accent)">{project.style}</span>
                )}
            </div>
        </div>
    )
}