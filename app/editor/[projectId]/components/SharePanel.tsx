'use client'

import React from 'react'
import { X, Copy, Download, Clock } from 'lucide-react'
import Button from '@/components/ui/Button'

interface SharePanelProps {
    projectId: string
    totalDuration: number
    onExport: () => void
    onClose: () => void
}

export default function SharePanel({ projectId, totalDuration, onExport, onClose }: SharePanelProps) {
    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/editor/${projectId}`
        : ''

    const [copied, setCopied] = React.useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div
        className="absolute top-16 right-6 w-80 rounded-xl p-4 flex flex-col gap-4 z-50 bg-overlay shadow-accent-40">
            <div className="flex items-center justify-between">
                <span className="text-body font-semibold text-(--text) ">Share project</span>
                <button
                onClick={onClose}
                className="cursor-pointer bg-transparent p-1 rounded-xl hover:shadow hover:shadow-black/25 transition-all duration-150 eas"
                >
                <X size={18} className="text-(--text)" />
                </button>
            </div>

            <div className="flex flex-col gap-1.5">
                <span className="text-caption font-semibold text-(--text-tertiary)">
                    Link
                </span>
                <div className="flex items-center gap-2 rounded-xl px-2.5 py-2 shadow-accent-22 border border-(--accent-40) ">
                <span
                    className="flex-1 text-small font-semibold truncate"
                >
                    {shareUrl}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-small font-semibold cursor-pointer bg-transparent border-none shrink-0 text-(--accent-65) hover:text-(--accent-fg) "
                >
                    <Copy size={14} />
                    {copied ? 'Copied' : 'Copy'}
                </button>
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <span className="text-caption font-semibold text-(--text-tertiary)">
                    Export
                </span>
                <div className="flex items-center gap-2 rounded-xl px-2.5 py-2 shadow-accent-22 border border-(--accent-40) ">
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-(--accent-65) " />
                        <span className="text-small font-medium" >
                            {totalDuration}s · size available after export
                        </span>
                    </div>
                </div>

                <Button
                variant='primary'
                size='sm'
                icon={<Download size={18} strokeWidth={2.5} />}
                className="mt-4"
                onClick={onExport}
                >
                    Export video
                </Button>
            </div>
        </div>
    )
}