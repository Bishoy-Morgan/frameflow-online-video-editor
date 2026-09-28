'use client'

import { useEffect } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'

export interface OperationNoticeState {
    type: 'success' | 'error'
    message: string
}

interface OperationNoticeProps {
    notice: OperationNoticeState | null
    onClose: () => void
    autoDismissMs?: number
}

export default function OperationNotice({ notice, onClose, autoDismissMs = 10000 }: OperationNoticeProps) {
    useEffect(() => {
        if (!notice || notice.type === 'error') return
        const t = setTimeout(onClose, autoDismissMs)
        return () => clearTimeout(t)
    }, [notice, onClose, autoDismissMs])

    if (!notice) return null

    const isSuccess = notice.type === 'success'
    const Icon = isSuccess ? CheckCircle2 : AlertCircle

    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed bottom-6 right-6 z-100 w-full max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-300"
        >
            <div
                className={`flex items-start gap-3 rounded-xl border bg-overlay/95 backdrop-blur-sm p-4 glow-accent-40 ${
                    isSuccess ? 'border-accent-40' : 'border-error'
                }`}
            >
                <Icon
                    size={28}
                    className={`shrink-0 mt-0.5 stroke-(--surface-overlay) ${
                        isSuccess ? 'fill-(--accent)' : 'fill-(--error)'
                    } `}
                    aria-hidden="true"
                />
                <p className={`text-caption font-medium flex-1 ${isSuccess ? 'text-(--success)' : 'text-(--error)'}`}>
                    {notice.message}
                </p>
                <button
                    onClick={onClose}
                    aria-label="Dismiss"
                    className="group shrink-0 cursor-pointer text-tertiary hover:text-(--text) transition-colors"
                >
                    <X size={16} className='group-hover:scale-110 group-hover:stroke-3 transition-all duration-200'/>
                </button>
            </div>
        </div>
    )
}