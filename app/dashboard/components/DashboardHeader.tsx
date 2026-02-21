'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useTheme } from '@/hooks/useTheme'
import { useUser } from './UserContext'
import NotificationBell from './NotificationBell'
import {
    Sun, Moon, Bell, ChevronDown,
    User, Settings, LogOut,
    CheckCheck, Trash2, Info, AlertCircle, CheckCircle,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
type NotifType = 'info' | 'success' | 'warning'

interface Notification {
    id:      string
    type:    NotifType
    title:   string
    body:    string
    time:    string
    read:    boolean
}

// ── Mock notifications — replace with real fetch later ────────────────────────
const INITIAL_NOTIFS: Notification[] = [
    { id: '1', type: 'success', title: 'Export complete',      body: 'Product Demo v3 is ready to download.',       time: '2 min ago',  read: false },
    { id: '2', type: 'info',    title: 'New feature available', body: 'Auto-captions now support Arabic.',            time: '1 hour ago', read: false },
    { id: '3', type: 'warning', title: 'Storage at 80%',        body: 'You\'re using 8GB of your 10GB free plan.',   time: '3 hours ago', read: true  },
    { id: '4', type: 'success', title: 'Project saved',         body: 'Onboarding Flow was auto-saved.',             time: 'Yesterday',  read: true  },
]

const notifIcon = (type: NotifType) => {
    if (type === 'success') return <CheckCircle  size={13} strokeWidth={2} style={{ color: 'var(--turquoise)' }} />
    if (type === 'warning') return <AlertCircle  size={13} strokeWidth={2} style={{ color: '#f59e0b' }} />
    return                         <Info         size={13} strokeWidth={2} style={{ color: 'var(--text-tertiary)' }} />
}

// Notification panel
function NotificationDropdown() {
    const [open, setOpen]     = useState(false)
    const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS)
    const ref                 = useRef<HTMLDivElement>(null)

    const unread = notifs.filter(n => !n.read).length

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const markAllRead  = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })))
    const markRead     = (id: string) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
    const deleteNotif  = (id: string) => setNotifs(ns => ns.filter(n => n.id !== id))
    const clearAll     = () => setNotifs([])

    return (
        <div ref={ref} className="relative">
            {/* Bell trigger */}
            <button
                onClick={() => setOpen(o => !o)}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150 focus:outline-none relative"
                style={{
                    background: open ? 'var(--surface-raised)' : 'none',
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
                {unread > 0 && (
                    <span
                        className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[0.5rem] font-bold"
                        style={{ backgroundColor: 'var(--turquoise)', color: '#020202', boxShadow: '0 0 6px var(--turquoise)' }}
                    >
                        {unread}
                    </span>
                )}
            </button>

            {/* Panel */}
            {open && (
                <div
                    className="absolute right-0 top-full mt-2 w-80 rounded-xl overflow-hidden z-50 flex flex-col"
                    style={{
                        backgroundColor: 'var(--bg)',
                        border: '1px solid var(--border-default)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
                        maxHeight: '420px',
                    }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-4 py-3 shrink-0"
                        style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    >
                        <span className="text-xs font-bold text-secondary">
                            Notifications {unread > 0 && <span className="text-turquoise ml-1">({unread} new)</span>}
                        </span>
                        <div className="flex items-center gap-2">
                            {unread > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="flex items-center gap-1 text-[0.65rem] font-bold cursor-pointer focus:outline-none transition-colors duration-150"
                                    style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--turquoise)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                                >
                                    <CheckCheck size={11} strokeWidth={2} />
                                    Mark all read
                                </button>
                            )}
                            {notifs.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="flex items-center gap-1 text-[0.65rem] font-bold cursor-pointer focus:outline-none transition-colors duration-150"
                                    style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                                >
                                    <Trash2 size={11} strokeWidth={2} />
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto flex-1">
                        {notifs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2">
                                <Bell size={20} strokeWidth={1.5} style={{ color: 'var(--text-ghost)' }} />
                                <span className="text-xs font-semibold text-tertiary">All caught up</span>
                            </div>
                        ) : (
                            notifs.map((n, i) => (
                                <div
                                    key={n.id}
                                    className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 group"
                                    style={{
                                        borderBottom: i < notifs.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                        backgroundColor: n.read ? 'transparent' : 'var(--turquoise-4)',
                                    }}
                                    onClick={() => markRead(n.id)}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-raised)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = n.read ? 'transparent' : 'var(--turquoise-4)'}
                                >
                                    {/* Icon */}
                                    <div className="mt-0.5 shrink-0">{notifIcon(n.type)}</div>

                                    {/* Content */}
                                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                        <span className={`text-xs font-bold truncate ${n.read ? 'text-secondary' : ''}`}
                                            style={{ color: n.read ? 'var(--text-secondary)' : 'var(--text)' }}
                                        >
                                            {n.title}
                                        </span>
                                        <span className="text-[0.65rem] text-tertiary leading-snug">{n.body}</span>
                                        <span className="text-[0.6rem] text-tertiary font-medium mt-0.5">{n.time}</span>
                                    </div>

                                    {/* Unread dot + delete */}
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        {!n.read && (
                                            <span
                                                className="w-1.5 h-1.5 rounded-full bg-turquoise mt-1"
                                                style={{ boxShadow: '0 0 4px var(--turquoise)' }}
                                            />
                                        )}
                                        <button
                                            onClick={e => { e.stopPropagation(); deleteNotif(n.id) }}
                                            className="opacity-0 group-hover:opacity-100 cursor-pointer focus:outline-none transition-all duration-150"
                                            style={{ background: 'none', border: 'none', color: 'var(--text-ghost)', padding: 0 }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-ghost)'}
                                        >
                                            <Trash2 size={11} strokeWidth={2} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

// ── User dropdown ─────────────────────────────────────────────────────────────
function UserDropdown({ initials, image, name, email, isAdmin, projectCount }: {
    initials:     string
    image:        string | null
    name:         string
    email:        string
    isAdmin:      boolean
    projectCount: number
}) {
    const router         = useRouter()
    const [open, setOpen] = useState(false)
    const ref             = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const go = (href: string) => { setOpen(false); router.push(href) }

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-150 focus:outline-none"
                style={{
                    background: 'none',
                    border: `1px solid ${open ? 'var(--border-default)' : 'transparent'}`,
                    backgroundColor: open ? 'var(--surface-raised)' : 'transparent',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--border-default)'
                    e.currentTarget.style.backgroundColor = 'var(--surface-raised)'
                }}
                onMouseLeave={e => {
                    if (!open) {
                        e.currentTarget.style.borderColor = 'transparent'
                        e.currentTarget.style.backgroundColor = 'transparent'
                    }
                }}
            >
                {/* Avatar */}
                {image ? (
                    <Image src={image} alt={name} width={28} height={28}
                        className="rounded-md object-cover shrink-0"
                        style={{ border: '1px solid var(--border-default)' }}
                    />
                ) : (
                    <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ backgroundColor: 'var(--turquoise-10)', border: '1px solid var(--turquoise-22)', color: 'var(--turquoise)' }}
                    >
                        {initials}
                    </div>
                )}

                {/* Name + meta */}
                <div className="flex flex-col gap-0.5 leading-none text-left">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-secondary">{name}</span>
                        {isAdmin && (
                            <span className="text-[0.5rem] font-bold tracking-wider uppercase px-1 py-0.5 rounded"
                                style={{ backgroundColor: 'var(--turquoise-10)', border: '1px solid var(--turquoise-22)', color: 'var(--turquoise)' }}
                            >
                                Admin
                            </span>
                        )}
                    </div>
                    <span className="text-[0.62rem] text-tertiary font-medium">
                        {projectCount} {projectCount === 1 ? 'project' : 'projects'}
                    </span>
                </div>

                <ChevronDown
                    size={13}
                    strokeWidth={2}
                    style={{
                        color: 'var(--text-tertiary)',
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        marginLeft: 2,
                    }}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-50"
                    style={{
                        backgroundColor: 'var(--bg)',
                        border: '1px solid var(--border-default)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
                    }}
                >
                    {/* Identity */}
                    <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        {image ? (
                            <Image src={image} alt={name} width={32} height={32}
                                className="rounded-lg object-cover shrink-0"
                                style={{ border: '1px solid var(--border-default)' }}
                            />
                        ) : (
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                                style={{ backgroundColor: 'var(--turquoise-10)', border: '1px solid var(--turquoise-22)', color: 'var(--turquoise)' }}
                            >
                                {initials}
                            </div>
                        )}
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-secondary truncate">{name}</span>
                            <span className="text-[0.62rem] text-tertiary font-medium truncate">{email}</span>
                        </div>
                    </div>

                    {/* Menu */}
                    <div className="p-1">
                        {[
                            { label: 'Profile',  icon: User,     href: '/dashboard/settings' },
                            { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
                        ].map(({ label, icon: Icon, href }) => (
                            <button
                                key={label}
                                onClick={() => go(href)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-150 focus:outline-none"
                                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = 'var(--surface-raised)'
                                    e.currentTarget.style.color = 'var(--text)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                    e.currentTarget.style.color = 'var(--text-tertiary)'
                                }}
                            >
                                <Icon size={14} strokeWidth={1.75} />
                                <span className="text-sm font-semibold">{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Sign out */}
                    <div className="p-1" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <button
                            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-150 focus:outline-none"
                            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)' }}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)'
                                e.currentTarget.style.color = '#ef4444'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                                e.currentTarget.style.color = 'var(--text-tertiary)'
                            }}
                        >
                            <LogOut size={14} strokeWidth={1.75} />
                            <span className="text-sm font-semibold">Sign out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Header ────────────────────────────────────────────────────────────────────
interface DashboardHeaderProps {
    title:     string
    subtitle?: string
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
    const { isDark, toggleTheme, mounted } = useTheme()
    const user = useUser()

    const initials     = user.name
        ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : user.email[0].toUpperCase()
    const displayName  = user.name ?? user.email.split('@')[0]
    const isAdmin      = user.role === 'ADMIN'
    const projectCount = user._count.projects

    return (
        <header
            className="flex items-center justify-between px-8 h-16 shrink-0"
            style={{ borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--bg)' }}
        >
            {/* Left — title */}
            <div className="flex flex-col gap-1">
                <h4 className="m-0 font-semibold leading-none" style={{ fontSize: '1rem', color: 'var(--text)' }}>
                    {title}
                </h4>
                {subtitle && (
                    <span className="text-xs text-tertiary font-medium">{subtitle}</span>
                )}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">

                {/* Notifications */}
                <NotificationBell userId={user.id} />

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="relative flex items-center h-8 w-18 rounded-lg cursor-pointer focus:outline-none"
                    style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
                >
                    {mounted && (
                        <div
                            className="absolute top-0.75 bottom-0.75 w-[1.85rem] rounded-md transition-all duration-300 ease-in-out"
                            style={{
                                left: isDark ? 'calc(100% - 2.1rem)' : '3px',
                                backgroundColor: 'var(--bg)',
                                border: '1px solid var(--border-strong)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                            }}
                        />
                    )}
                    <div className="relative w-full flex items-center justify-between px-2">
                        <Sun  size={13} style={{ color: 'var(--text)', opacity: mounted ? (isDark ? 0.3 : 1) : 1, transition: 'opacity 0.2s' }} />
                        <Moon size={13} style={{ color: 'var(--text)', opacity: mounted ? (isDark ? 1 : 0.3) : 0.3, transition: 'opacity 0.2s' }} />
                    </div>
                </button>

                {/* Divider */}
                <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--border-default)' }} />

                {/* User dropdown */}
                <UserDropdown
                    initials={initials}
                    image={user.image}
                    name={displayName}
                    email={user.email}
                    isAdmin={isAdmin}
                    projectCount={projectCount}
                />
            </div>
        </header>
    )
}