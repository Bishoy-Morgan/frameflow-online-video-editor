'use client'

import { useCallback, useState } from 'react'
import type { OperationNoticeState } from '@/components/ui/OperationNotice'

export interface QueuedNotice extends OperationNoticeState {
    id: string
}

export function useNoticeQueue() {
    const [notices, setNotices] = useState<QueuedNotice[]>([])

    const pushNotice = useCallback((notice: OperationNoticeState) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        setNotices(prev => [...prev, { ...notice, id }])
    }, [])

    const dismissNotice = useCallback((id: string) => {
        setNotices(prev => prev.filter(n => n.id !== id))
    }, [])

    return { notices, pushNotice, dismissNotice }
}