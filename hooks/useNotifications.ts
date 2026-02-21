'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

export interface Notification {
    id:        string
    userId:    string
    type:      'RENDER_FAILED' | 'RENDER_COMPLETED' | 'ACCOUNT_UPDATE'
    message:   string
    read:      boolean
    renderId:  string | null
    createdAt: string
}

// Supabase client — only used for Realtime on the frontend
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function useNotifications(userId: string) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading,       setLoading]       = useState(true)

    // Fetch existing notifications on mount
    const fetchNotifications = useCallback(async () => {
        setLoading(true)
        try {
            const res  = await fetch('/api/notifications')
            const data = await res.json()
            setNotifications(data)
        } catch (err) {
            console.error('Failed to fetch notifications:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications])

    // Supabase Realtime — listen for new notifications for this user
    useEffect(() => {
        if (!userId) return

        const channel = supabase
            .channel(`notifications:${userId}`)
            .on(
                'postgres_changes',
                {
                    event:  'INSERT',
                    schema: 'public',
                    table:  'Notification',
                    filter: `userId=eq.${userId}`,
                },
                (payload) => {
                    // Prepend new notification to the top
                    setNotifications(prev => [payload.new as Notification, ...prev])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId])

    // Mark a single notification as read
    const markAsRead = useCallback(async (id: string) => {
        // Optimistic update
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
        await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
    }, [])

    // Mark all as read
    const markAllAsRead = useCallback(async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        await fetch('/api/notifications/read-all', { method: 'PATCH' })
    }, [])

    const unreadCount = notifications.filter(n => !n.read).length

    return { notifications, loading, unreadCount, markAsRead, markAllAsRead }
}