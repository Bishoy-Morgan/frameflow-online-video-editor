'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Bell, X, CheckCheck, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { useNotifications, Notification } from '@/hooks/useNotifications'

const typeConfig = {
    RENDER_FAILED: {
        icon:  AlertCircle,
        color: '#ef4444',
        bg:    'rgba(239,68,68,0.08)',
        label: 'Render Failed',
    },
    RENDER_COMPLETED: {
        icon:  CheckCircle,
        color: 'var(--turquoise)',
        bg:    'var(--turquoise-8)',
        label: 'Render Complete',
    },
    ACCOUNT_UPDATE: {
        icon:  Info,
        color: 'var(--text-secondary)',
        bg:    'var(--surface-raised)',
        label: 'Account',
    },
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins  = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days  = Math.floor(diff / 86400000)
    if (mins < 1)   return 'just now'
    if (mins < 60)  return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
}

function NotificationItem({ notification, onRead }: {
    notification: Notification
    onRead: (id: string) => void
}) {
    const config = typeConfig[notification.type]
    const Icon   = config.icon

    return (
        <div
            className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 relative"
            style={{ backgroundColor: notification.read ? 'transparent' : 'var(--surface-raised)' }}
            onClick={() => !notification.read && onRead(notification.id)}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-raised)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = notification.read ? 'transparent' : 'var(--surface-raised)'}
        >
            {/* Unread dot */}
            {!notification.read && (
                <div
                    className="absolute right-4 top-4 w-1.5 h-1.5 rounded-full bg-turquoise"
                    style={{ boxShadow: '0 0 4px var(--turquoise)' }}
                />
            )}

            {/* Icon */}
            <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: config.bg }}
            >
                <Icon size={14} strokeWidth={1.75} style={{ color: config.color }} />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-0.5 flex-1 min-w-0 pr-4">
                <span className="text-xs font-bold text-secondary leading-snug">
                    {config.label}
                </span>
                <span className="text-xs text-tertiary leading-relaxed">
                    {notification.message}
                </span>
                <span className="text-[0.6rem] font-medium mt-0.5" style={{ color: 'var(--text-ghost)' }}>
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

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div ref={ref} className="relative">

            {/* Bell trigger */}
            <button
                onClick={() => setOpen(o => !o)}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150 focus:outline-none relative"
                style={{
                    backgroundColor: open ? 'var(--surface-raised)' : 'transparent',
                    border: `1px solid ${open ? 'var(--border-default)' : 'transparent'}`,
                    color: open ? 'var(--text)' : 'var(--text-tertiary)',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--border-default)'
                    e.currentTarget.style.backgroundColor = 'var(--surface-raised)'
                    e.currentTarget.style.color = 'var(--text)'
                }}
                onMouseLeave={e => {
                    if (!open) {
                        e.currentTarget.style.borderColor = 'transparent'
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--text-tertiary)'
                    }
                }}
            >
                <Bell size={15} strokeWidth={1.75} />

                {/* Unread badge */}
                {unreadCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full flex items-center justify-center text-[0.55rem] font-bold px-1"
                        style={{
                            backgroundColor: 'var(--turquoise)',
                            color: '#020202',
                            boxShadow: '0 0 6px var(--turquoise)',
                        }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute right-0 top-full mt-2 w-80 rounded-xl overflow-hidden z-50 flex flex-col"
                    style={{
                        backgroundColor: 'var(--bg)',
                        border: '1px solid var(--border-default)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                        maxHeight: '420px',
                    }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-4 py-3 shrink-0"
                        style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-secondary">Notifications</span>
                            {unreadCount > 0 && (
                                <span
                                    className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full"
                                    style={{ backgroundColor: 'var(--turquoise-8)', color: 'var(--turquoise)', border: '1px solid var(--turquoise-22)' }}
                                >
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center gap-1 px-2 py-1 rounded-md text-[0.65rem] font-bold cursor-pointer transition-colors duration-150 focus:outline-none"
                                    style={{ color: 'var(--text-tertiary)', background: 'none', border: 'none' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--turquoise)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                                    title="Mark all as read"
                                >
                                    <CheckCheck size={13} strokeWidth={2} />
                                    All read
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors duration-150 focus:outline-none"
                                style={{ color: 'var(--text-tertiary)', background: 'none', border: 'none' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                            >
                                <X size={13} strokeWidth={2} />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin text-tertiary" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2">
                                <Bell size={24} strokeWidth={1.25} style={{ color: 'var(--text-ghost)' }} />
                                <span className="text-xs font-semibold text-tertiary">No notifications yet</span>
                            </div>
                        ) : (
                            <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
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