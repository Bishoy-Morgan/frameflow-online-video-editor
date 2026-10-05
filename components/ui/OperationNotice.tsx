'use client'

import { useEffect } from 'react'
import { AlertCircle, CircleCheckBig, X } from 'lucide-react'

export interface OperationNoticeState {
    type: 'success' | 'error'
    message: string
    autoDismiss?: boolean
}

export interface QueuedNotice extends OperationNoticeState {
    id: string
}

interface OperationNoticeProps {
    notices: QueuedNotice[]
    onDismiss: (id: string) => void
    autoDismissMs?: number
}

function NoticeItem({ notice, onDismiss, autoDismissMs }: {
    notice: QueuedNotice
    onDismiss: (id: string) => void
    autoDismissMs: number
}) {
    useEffect(() => {
        const shouldAutoDismiss = notice.type === 'success' || notice.autoDismiss
        if (!shouldAutoDismiss) return
        const t = setTimeout(() => onDismiss(notice.id), autoDismissMs)
        return () => clearTimeout(t)
    }, [notice, onDismiss, autoDismissMs])

    const isSuccess = notice.type === 'success'
    const Icon = isSuccess ? CircleCheckBig : AlertCircle

    return (
        <div role="status" aria-live="polite" className="w-full max-w-sm min-w-xs animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className={`flex items-start gap-3 rounded-xl bg-overlay/95 backdrop-blur-sm p-4 ${isSuccess ? 'glow-accent-40' : 'glow-error'}`}>
                <Icon size={28} className={`shrink-0 mt-0.5 ${isSuccess ? 'text-accent' : 'text-error'}`} aria-hidden="true" />
                <p className={`text-caption font-medium flex-1 ${isSuccess ? 'text-success' : 'text-error'}`}>
                    {notice.message}
                </p>
                <button
                    onClick={() => onDismiss(notice.id)}
                    aria-label="Dismiss"
                    className="group shrink-0 cursor-pointer text-tertiary hover:text-(--text) transition-colors"
                >
                    <X size={16} className='group-hover:scale-110 group-hover:stroke-3 transition-all duration-200' />
                </button>
            </div>
        </div>
    )
}

export default function OperationNotice({ notices, onDismiss, autoDismissMs = 4000 }: OperationNoticeProps) {
    if (notices.length === 0) return null

    return (
        <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-2">
            {notices.map(notice => (
                <NoticeItem key={notice.id} notice={notice} onDismiss={onDismiss} autoDismissMs={autoDismissMs} />
            ))}
        </div>
    )
}