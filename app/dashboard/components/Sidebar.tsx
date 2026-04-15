'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/hooks/useTheme'
import { useUser } from '../../../components/providers/UserContext'
import { LayoutDashboard, FolderOpen, Settings, ChevronRight, Trash2, Wand2, Zap } from 'lucide-react'
import whiteLogo from '@/public/whiteLogo.png'
import blackLogo from '@/public/blackLogo.png'

const navItems = [
    { label: 'Overview',  href: '/dashboard',          icon: LayoutDashboard, external: false },
    { label: 'Projects',  href: '/dashboard/projects', icon: FolderOpen,      external: false },
    { label: 'Templates', href: '/templates',          icon: Wand2,           external: true  },
    { label: 'Trash',     href: '/dashboard/trash',    icon: Trash2,          external: false },
    { label: 'Settings',  href: '/dashboard/settings', icon: Settings,        external: false },
]

function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
    const [visible, setVisible] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const show = () => { timerRef.current = setTimeout(() => setVisible(true), 120) }
    const hide = () => { if (timerRef.current) clearTimeout(timerRef.current); setVisible(false) }
    return (
        <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
            {children}
            {visible && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap pointer-events-none z-50"
                    style={{ backgroundColor: 'var(--text)', color: 'var(--bg)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                    {label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2"
                        style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderRight: '4px solid var(--text)' }} />
                </div>
            )}
        </div>
    )
}

export default function Sidebar() {
    const [expanded, setExpanded] = useState(false)
    const pathname                = usePathname()
    const { isDark, mounted }     = useTheme()
    const user                    = useUser()
    const isFree                  = user.role !== 'ADMIN'

    const isActive    = (href: string) => href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
    const initials    = user.name ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : user.email[0].toUpperCase()
    const displayName = user.name ?? user.email.split('@')[0]

    const NavLink = ({ label, href, icon: Icon, external }: typeof navItems[0]) => {
        const active = isActive(href)
        const sharedStyle = {
            backgroundColor: active ? 'var(--turquoise-8)' : 'transparent',
            border:          `1px solid ${active ? 'var(--turquoise-22)' : 'transparent'}`,
            textDecoration:  'none',
            color:           active ? 'var(--turquoise)' : 'var(--text-tertiary)',
            minWidth: 0,
        }
        const sharedEnter = (e: React.MouseEvent<HTMLAnchorElement>) => { if (!active) { e.currentTarget.style.backgroundColor = 'var(--surface-raised)'; e.currentTarget.style.color = 'var(--text)' } }
        const sharedLeave = (e: React.MouseEvent<HTMLAnchorElement>) => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)' } }
        const inner = (
            <>
                {active && <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-turquoise" style={{ boxShadow: '0 0 6px var(--turquoise)' }} />}
                <Icon size={17} strokeWidth={active ? 2 : 1.75} className="shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap overflow-hidden"
                    style={{ opacity: expanded ? 1 : 0, maxWidth: expanded ? '120px' : '0px', transition: 'opacity 0.15s ease, max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    {label}
                </span>
            </>
        )
        const el = external ? (
            <a href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg transition-all duration-150 relative"
                style={sharedStyle} onMouseEnter={sharedEnter} onMouseLeave={sharedLeave}>
                {inner}
            </a>
        ) : (
            <Link href={href}
                className="flex items-center gap-3 p-3 rounded-lg transition-all duration-150 relative"
                style={sharedStyle} onMouseEnter={sharedEnter} onMouseLeave={sharedLeave}>
                {inner}
            </Link>
        )
        return !expanded ? <Tooltip label={label}>{el}</Tooltip> : el
    }

    return (
        <aside className="relative flex flex-col h-full shrink-0 overflow-visible"
            style={{ width: expanded ? '200px' : '60px', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', backgroundColor: 'var(--bg)', borderRight: '1px solid var(--border-default)' }}>

            {/* Logo */}
            <Link 
                href="/dashboard" className="flex items-center h-16 px-4 shrink-0 overflow-hidden"
                style={{ borderBottom: '1px solid var(--border-subtle)', textDecoration: 'none' }}
            >
                {mounted ? (
                    <Image
                        src={isDark ? whiteLogo : blackLogo}
                        alt="Frameflow"
                        width={32} height={32}
                        priority suppressHydrationWarning
                    />
                ) : (
                    <div style={{ width: 32, height: 32 }} />
                )}
                <span className="ml-3 font-normal whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-dm-serif-display), serif', fontSize: '1rem', color: 'var(--text)', opacity: expanded ? 1 : 0, maxWidth: expanded ? '120px' : '0px', overflow: 'hidden', transition: 'opacity 0.2s ease 0.05s, max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    Frameflow
                </span>
            </Link>

            {/* Nav */}
            <nav className="flex flex-col gap-0.5 p-2 flex-1">
                {navItems.map(item => <NavLink key={item.href} {...item} />)}
            </nav>

            {/* PRO CTA — free users only */}
            {isFree && (
                <div className="px-2 pb-2 overflow-hidden">
                    {!expanded ? (
                        <Tooltip label="Upgrade to PRO">
                            <Link href="/pricing" className="flex items-center justify-center w-full py-2.5 rounded-lg transition-all duration-150"
                                style={{ backgroundColor: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.22)', color: 'rgb(236,72,153)', textDecoration: 'none' }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(236,72,153,0.14)'; e.currentTarget.style.borderColor = 'rgba(236,72,153,0.4)' }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(236,72,153,0.08)'; e.currentTarget.style.borderColor = 'rgba(236,72,153,0.22)' }}>
                                <Zap size={15} strokeWidth={2} />
                            </Link>
                        </Tooltip>
                    ) : (
                        <Link href="/pricing" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150"
                            style={{ backgroundColor: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.22)', textDecoration: 'none' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(236,72,153,0.14)'; e.currentTarget.style.borderColor = 'rgba(236,72,153,0.4)' }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(236,72,153,0.08)'; e.currentTarget.style.borderColor = 'rgba(236,72,153,0.22)' }}>
                            <Zap size={14} strokeWidth={2} className="shrink-0" style={{ color: 'rgb(236,72,153)' }} />
                            <div className="flex flex-col gap-0 min-w-0">
                                <span className="text-xs font-bold leading-none" style={{ color: 'rgb(236,72,153)' }}>Upgrade to PRO</span>
                                <span className="text-[0.6rem] font-medium leading-snug whitespace-nowrap" style={{ color: 'rgba(236,72,153,0.7)' }}>Unlock all templates</span>
                            </div>
                        </Link>
                    )}
                </div>
            )}

            {/* User avatar */}
            <div className="p-2 shrink-0 overflow-hidden" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                {!expanded ? (
                    <Tooltip label={displayName}>
                        <div className="flex items-center justify-center w-full py-1 cursor-default">
                            {user.image
                                ? <Image src={user.image} alt={displayName} width={32} height={32} className="rounded-lg object-cover" style={{ border: '1px solid var(--border-default)' }} />
                                : <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                                    style={{ backgroundColor: 'var(--turquoise-10)', border: '1px solid var(--turquoise-22)', color: 'var(--turquoise)' }}>{initials}</div>}
                        </div>
                    </Tooltip>
                ) : (
                    <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg"
                        style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-subtle)' }}>
                        {user.image
                            ? <Image src={user.image} alt={displayName} width={28} height={28} className="rounded-md object-cover shrink-0" style={{ border: '1px solid var(--border-default)' }} />
                            : <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
                                style={{ backgroundColor: 'var(--turquoise-10)', border: '1px solid var(--turquoise-22)', color: 'var(--turquoise)' }}>{initials}</div>}
                        <div className="flex flex-col min-w-0 gap-0.5">
                            <span className="text-xs font-bold text-secondary truncate leading-none">{displayName}</span>
                            <span className="text-[0.6rem] text-tertiary font-medium leading-none">{user.role === 'ADMIN' ? 'Admin' : 'Free plan'}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Expand toggle */}
            <button onClick={() => setExpanded(e => !e)}
                className="absolute -right-3 top-18 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer focus:outline-none z-20"
                style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-default)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', color: 'var(--text-tertiary)', transition: 'border-color 0.15s ease, color 0.15s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--turquoise-42)'; e.currentTarget.style.color = 'var(--turquoise)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-tertiary)' }}>
                <ChevronRight size={13} strokeWidth={2.5}
                    style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            </button>
        </aside>
    )
}