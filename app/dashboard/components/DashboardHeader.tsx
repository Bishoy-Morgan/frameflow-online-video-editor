'use client'

import React from 'react'
import Image from 'next/image'
import { useTheme } from '@/hooks/useTheme'
import { useUser } from './UserContext'
import { Sun, Moon, Bell } from 'lucide-react'

interface DashboardHeaderProps {
    title:     string
    subtitle?: string
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
    const { isDark, toggleTheme, mounted } = useTheme()
    const user = useUser()

    // Derive initials from name or email
    const initials = user.name
        ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : user.email[0].toUpperCase()

    // Role badge — only show for ADMIN
    const isAdmin = user.role === 'ADMIN'

    // Project count from _count
    const projectCount = user._count.projects

    return (
        <header
            className="flex items-center justify-between px-8 h-16 shrink-0"
            style={{ borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--bg)' }}
        >
            {/* Left — page title */}
            <div className="flex flex-col gap-0.5">
                <h4
                    className="m-0 font-semibold leading-none"
                    style={{ fontSize: '1rem', color: 'var(--text)' }}
                >
                    {title}
                </h4>
                {subtitle && (
                    <span className="text-xs text-tertiary font-medium">{subtitle}</span>
                )}
            </div>

            {/* Right — actions + user */}
            <div className="flex items-center gap-3">

                {/* Notifications */}
                <button
                    className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150 focus:outline-none relative"
                    style={{ background: 'none', border: '1px solid transparent', color: 'var(--text-tertiary)' }}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--border-default)'
                        e.currentTarget.style.backgroundColor = 'var(--surface-raised)'
                        e.currentTarget.style.color = 'var(--text)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'transparent'
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--text-tertiary)'
                    }}
                >
                    <Bell size={15} strokeWidth={1.75} />
                    <span
                        className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-turquoise"
                        style={{ boxShadow: '0 0 4px var(--turquoise)' }}
                    />
                </button>

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
                <div className="w-px h-5" style={{ backgroundColor: 'var(--border-default)' }} />

                {/* User identity */}
                <div className="flex items-center gap-2.5">

                    {/* Avatar */}
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt={user.name ?? user.email}
                            width={32}
                            height={32}
                            className="rounded-lg object-cover"
                            style={{ border: '1px solid var(--border-default)' }}
                        />
                    ) : (
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                            style={{
                                backgroundColor: 'var(--turquoise-10)',
                                border: '1px solid var(--turquoise-22)',
                                color: 'var(--turquoise)',
                            }}
                        >
                            {initials}
                        </div>
                    )}

                    {/* Name + meta */}
                    <div className="flex flex-col gap-0.5 leading-none">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-secondary">
                                {user.name ?? user.email.split('@')[0]}
                            </span>
                            {isAdmin && (
                                <span
                                    className="text-[0.55rem] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded"
                                    style={{
                                        backgroundColor: 'var(--turquoise-10)',
                                        border: '1px solid var(--turquoise-22)',
                                        color: 'var(--turquoise)',
                                    }}
                                >
                                    Admin
                                </span>
                            )}
                        </div>
                        <span className="text-[0.65rem] text-tertiary font-medium">
                            {projectCount} {projectCount === 1 ? 'project' : 'projects'}
                        </span>
                    </div>
                </div>

            </div>
        </header>
    )
}