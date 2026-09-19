'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/hooks/useTheme'
import { useUser } from '../../../components/providers/UserContext'
import { LayoutDashboard, FolderOpen, ChevronRight, Wand2, Zap } from 'lucide-react'
import NotificationBell from './NotificationBell'
import AccountMenu from './AccountMenu'
import whiteLogo from '@/public/whiteLogo.png'
import blackLogo from '@/public/blackLogo.png'

const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, external: false },
    { label: 'Projects', href: '/dashboard/projects', icon: FolderOpen, external: false },
    { label: 'Templates', href: '/templates', icon: Wand2, external: true },
]

function NavTooltip({ label, expanded, children }: { label: string; expanded: boolean; children: React.ReactNode }) {
    return (
        <div className="relative group">
            {children}
            {!expanded && (
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-4 px-2.5 py-1.5 rounded-xl text-caption font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-80 bg-(--accent-65) text-(--text) ">
                    {label}
                </div>
            )}
        </div>
    )
}

export default function Sidebar() {
    const [expanded, setExpanded] = useState(false)
    const pathname = usePathname()
    const { isDark } = useTheme()
    const user = useUser()
    const isFree = user.role !== 'ADMIN'

    const isActive = (href: string) => href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
    const initials = user.name ? user.name.split(' ').map(w => w[0]).slice(0, 1).join('').toUpperCase() : user.email[0].toUpperCase()
    const displayName = user.name ?? user.email.split('@')[0]

    const NavLink = ({ label, href, icon: Icon, external }: typeof navItems[0]) => {
        const active = isActive(href)
        const sharedClass = `relative flex items-center gap-3 rounded-xl transition-all duration-150 no-underline min-w-0 w-12 h-12 justify-center cursor-pointer outline-none hover:shadow-lg ${
            active ? 'bg-(--accent-8) shadow-lg' : 'hover:bg-(--accent-8)'
        } ${expanded ? 'w-full h-12 justify-start px-3' : ''}`
        const inner = (
            <>
                <Icon
                    size={22}
                    strokeWidth={active ? 2.25 : 1.75}
                    className={`shrink-0 transition-all duration-150 ${active ? 'text-(--accent)' : 'text-(--text-tertiary)'}`}
                />
                {expanded && (
                    <span
                        className="text-caption font-semibold whitespace-nowrap overflow-hidden"
                        style={{ color: active ? 'var(--accent)' : 'var(--text-tertiary)' }}
                    >
                        {label}
                    </span>
                )}
            </>
        )
        const el = external ? (
            <a href={href} rel="noopener noreferrer" className={sharedClass}>{inner}</a>
        ) : (
            <Link href={href} className={sharedClass}>{inner}</Link>
        )
        return <NavTooltip label={label} expanded={expanded}>{el}</NavTooltip>
    }

    return (
        <aside
            className="relative flex flex-col h-full shrink-0 overflow-visible bg-(--bg) shadow-accent-40 rounded-xl p-1.5 transition-[width] duration-300"
            style={{ width: expanded ? '200px' : '60px' }}
        >
            <Link href="/dashboard" className="flex items-center h-16 px-1.5 shrink-0 overflow-hidden no-underline">
                <Image src={isDark ? whiteLogo : blackLogo} alt="Frameflow" width={32} height={32} priority />
                {expanded && (
                    <span
                        className="ml-3 font-normal whitespace-nowrap text-(--text) overflow-hidden"
                        style={{ fontFamily: 'var(--font-dm-serif-display), serif', fontSize: '1rem' }}
                    >
                        Frameflow
                    </span>
                )}
            </Link>

            <nav className="flex flex-col items-center gap-y-1.5 flex-1 w-full">
                {navItems.map(item => <NavLink key={item.href} {...item} />)}
            </nav>

            {isFree && (
                <div className="w-full px-0 pb-1.5 overflow-hidden flex justify-center">
                    <NavTooltip label="Upgrade to PRO" expanded={expanded}>
                        <Link
                            href="/pricing"
                            className={`flex items-center gap-2.5 rounded-xl transition-all duration-150 no-underline bg-(--amber-8) hover:bg-(--amber-16) hover:shadow-lg ${
                                expanded ? 'w-full h-12 px-3' : 'w-12 h-12 justify-center'
                            }`}
                        >
                            <Zap size={20} strokeWidth={2} className="shrink-0 text-(--amber)" />
                            {expanded && (
                                <div className="flex flex-col gap-0 min-w-0">
                                    <span className="text-caption font-bold leading-none text-(--amber-fg) whitespace-nowrap">Upgrade to PRO</span>
                                    <span className="text-tiny font-medium leading-snug whitespace-nowrap text-(--amber-fg)">Unlock all templates</span>
                                </div>
                            )}
                        </Link>
                    </NavTooltip>
                </div>
            )}

            <div className="flex flex-col items-center gap-y-1.5 w-full pb-0.5">
                <NavTooltip label="Notifications" expanded={expanded}>
                    <div className={`flex items-center rounded-xl ${expanded ? 'w-full h-12 px-3 justify-start' : 'w-12 h-12 justify-center'}`}>
                        <NotificationBell userId={user.id} />
                    </div>
                </NavTooltip>

                <AccountMenu
                    expanded={expanded}
                    displayName={displayName}
                    email={user.email}
                    image={user.image}
                    initials={initials}
                    isAdmin={user.role === 'ADMIN'}
                />
            </div>

            <button
                onClick={() => setExpanded(e => !e)}
                className="absolute -right-3 top-28 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer focus:outline-none z-20 bg-(--bg) shadow-accent-40 text-(--text-tertiary) hover:text-(--accent) transition-colors"
            >
                <ChevronRight
                    size={16}
                    strokeWidth={2.5}
                    className="transition-transform duration-300"
                    style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
            </button>
        </aside>
    )
}