'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Bell, X, CheckCheck, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { useNotifications, Notification } from '@/hooks/useNotifications'

const typeConfig = {
    RENDER_FAILED: {
        icon: AlertCircle,
        color: 'var(--error)',
        bg: 'var(--error-8)',
        label: 'Render Failed',
    },
    RENDER_COMPLETED: {
        icon: CheckCircle,
        color: 'var(--accent)',
        bg: 'var(--accent-8)',
        label: 'Render Complete',
    },
    ACCOUNT_UPDATE: {
        icon: Info,
        color: 'var(--text-secondary)',
        bg: 'var(--surface-raised)',
        label: 'Account',
    },
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
}

function NotificationItem({ notification, onRead }: {
    notification: Notification
    onRead: (id: string) => void
}) {
    const config = typeConfig[notification.type]
    const Icon = config.icon

    return (
        <div
            className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 relative hover:bg-(--surface-raised)"
            style={{ backgroundColor: notification.read ? 'transparent' : 'var(--surface-raised)' }}
            onClick={() => !notification.read && onRead(notification.id)}
        >
            {!notification.read && (
                <div className="absolute right-4 top-4 w-1.5 h-1.5 rounded-full bg-(--accent) shadow-[0_0_4px_var(--accent)]" />
            )}

            <div
                className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: config.bg }}
            >
                <Icon size={14} strokeWidth={1.75} style={{ color: config.color }} />
            </div>

            <div className="flex flex-col gap-0.5 flex-1 min-w-0 pr-4">
                <span className="text-caption font-bold text-(--text-secondary) leading-snug">
                    {config.label}
                </span>
                <span className="text-caption text-(--text-tertiary) leading-relaxed">
                    {notification.message}
                </span>
                <span className="text-tiny font-medium mt-0.5 text-(--text-ghost)">
                    {timeAgo(notification.createdAt)}
                </span>
            </div>
        </div>
    )
}

export default function NotificationBell({ userId }: { userId: string }) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications(userId)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div ref={ref} className="relative">

            <button
                onClick={() => setOpen(o => !o)}
                className={`relative flex items-center justify-center cursor-pointer focus:outline-none transition-colors duration-150 ${
                    open ? 'text-(--accent)' : 'text-(--text-tertiary) hover:text-(--accent)'
                }`}
            >
                <Bell size={20} strokeWidth={1.75} fill={open ? '#00D9AA' : 'transparent'} />

                {unreadCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full flex items-center justify-center text-tiny font-bold px-1 bg-(--accent) shadow-[0_0_6px_var(--accent)]"
                        style={{ color: '#020202' }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className="absolute left-full bottom-1/4 ml-6 w-80 rounded-xl overflow-hidden z-80 flex flex-col bg-(--bg) border border-(--border-default) shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
                    style={{ maxHeight: '420px' }}
                >
                    <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-(--border-subtle)">
                        <div className="flex items-center gap-2">
                            <span className="text-caption font-bold text-(--text-secondary)">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="text-tiny font-bold px-1.5 py-0.5 rounded-full bg-(--accent-8) text-(--accent) border border-(--accent-22)">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    title="Mark all as read"
                                    className="flex items-center gap-1 px-2 py-1 rounded-xl text-tiny font-bold cursor-pointer transition-colors duration-150 focus:outline-none bg-transparent border-none text-(--text-tertiary) hover:text-(--accent)"
                                >
                                    <CheckCheck size={13} strokeWidth={2} />
                                    All read
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                className="w-6 h-6 rounded-xl flex items-center justify-center cursor-pointer transition-colors duration-150 focus:outline-none bg-transparent border-none text-(--text-tertiary) hover:text-(--text)"
                            >
                                <X size={16} strokeWidth={2} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin text-(--text-tertiary)" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2">
                                <Bell size={24} strokeWidth={1.25} className="text-(--text-ghost)" />
                                <span className="text-caption font-semibold text-(--text-tertiary)">No notifications yet</span>
                            </div>
                        ) : (
                            <div className="flex flex-col divide-y divide-(--border-subtle)">
                                {notifications.map(n => (
                                    <NotificationItem
                                        key={n.id}
                                        notification={n}
                                        onRead={markAsRead}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}