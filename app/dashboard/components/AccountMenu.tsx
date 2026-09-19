'use client'

import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useTheme } from '@/hooks/useTheme'
import { User, Settings, CircleDot, CreditCard, LogOut, Sun, Moon } from 'lucide-react'

interface AccountMenuProps {
    expanded: boolean
    displayName: string
    email: string
    image: string | null
    initials: string
    isAdmin: boolean
}

function MenuRow({ icon: Icon, label, onClick, trailing }: {
    icon: React.ElementType
    label: string
    onClick?: () => void
    trailing?: React.ReactNode
}) {
    const content = (
        <>
            <Icon size={17} strokeWidth={1.75} className="shrink-0 text-(--text-tertiary)" />
            <span className="text-caption font-semibold flex-1 text-left">{label}</span>
            {trailing}
        </>
    )

    if (trailing) {
        return (
            <div className="w-full flex items-center gap-3 px-4 py-2.5 text-(--text-secondary)">
                {content}
            </div>
        )
    }

    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-150 focus:outline-none bg-transparent border-none text-(--text-secondary) hover:bg-(--accent-8)"
        >
            {content}
        </button>
    )
}

export default function AccountMenu({ expanded, displayName, email, image, initials, isAdmin }: AccountMenuProps) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { isDark, toggleTheme } = useTheme()

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const go = (href: string) => { setOpen(false); router.push(href) }

    return (
        <div ref={ref} className="relative w-full ">
            <button
                onClick={() => setOpen(o => !o)}
                className={`flex items-center gap-2.5 rounded-xl transition-all duration-150 cursor-pointer focus:outline-none w-full ${
                    expanded ? 'h-12 px-3' : 'h-12 justify-center'
                } ${open ? 'bg-(--accent-8)' : 'hover:bg-(--accent-8)'}`}
            >
                {image
                    ? <Image src={image} alt={displayName} width={28} height={28} className="rounded-xl object-cover shrink-0" />
                    : <div className="w-10 h-10 rounded-xl flex items-center justify-center text-hero font-bold shrink-0 bg-(--accent-10) text-(--accent)">
                        {initials}
                    </div>}
                {expanded && (
                    <div className="flex flex-col min-w-0 gap-0.5">
                        <span className="text-caption font-bold text-(--text-secondary) truncate leading-none whitespace-nowrap">{displayName}</span>
                        <span className="text-tiny text-(--text-tertiary) font-medium leading-none whitespace-nowrap">{isAdmin ? 'Admin' : 'Free plan'}</span>
                    </div>
                )}
            </button>

            {open && (
                <div className="absolute left-full bottom-0 ml-3 w-72 rounded-xl overflow-hidden z-80 flex flex-col bg-(--surface-overlay) border border-(--accent-10) shadow-accent-40">

                    <div className="px-2 pt-3 pb-2">
                        <span className="text-tiny font-bold uppercase tracking-wide text-(--text-tertiary) px-2">Account</span>
                    </div>

                    <div className="w-full flex items-center gap-3 px-4 py-2.5">
                        {image
                            ? <Image src={image} alt={displayName} width={36} height={36} className="rounded-xl object-cover shrink-0" />
                            : <div className="w-9 h-9 rounded-xl flex items-center justify-center text-body font-bold shrink-0 bg-(--accent-10) text-(--accent)">
                                {initials}
                            </div>}
                        <div className="flex flex-col min-w-0 flex-1 text-left">
                            <span className="text-caption font-bold text-(--text-secondary) truncate">{displayName}</span>
                            <span className="text-tiny text-(--text-tertiary) font-medium truncate">{email}</span>
                        </div>
                    </div>

                    <div className="h-px bg-(--border-subtle) my-1" />

                    <MenuRow icon={User} label="Your account" onClick={() => go('/dashboard/settings')} />
                    <MenuRow icon={Settings} label="Settings" onClick={() => go('/dashboard/settings')} />

                    <MenuRow
                        icon={CircleDot}
                        label="Theme"
                        trailing={
                            <button
                                onClick={e => { e.stopPropagation(); toggleTheme() }}
                                aria-label="Toggle theme"
                                className="relative flex items-center h-6 w-12 rounded-xl cursor-pointer focus:outline-none bg-(--surface-raised) border border-(--border-default)"
                                suppressHydrationWarning
                            >
                                <div
                                    suppressHydrationWarning
                                    className="absolute top-0.5 bottom-0.5 w-5 rounded-lg transition-all duration-300 ease-in-out bg-(--bg) border border-(--border-strong)"
                                    style={{ left: isDark ? 'calc(100% - 1.4rem)' : '2px' }}
                                />
                                <div className="relative w-full flex items-center justify-between px-1">
                                    <Sun suppressHydrationWarning size={9} className="text-(--text)" style={{ opacity: isDark ? 0.3 : 1 }} />
                                    <Moon suppressHydrationWarning size={9} className="text-(--text)" style={{ opacity: isDark ? 1 : 0.3 }} />
                                </div>
                            </button>
                        }
                    />

                    <MenuRow icon={CreditCard} label="Plans and pricing" onClick={() => go('/pricing')} />

                    <div className="h-px bg-(--border-subtle) my-1" />

                    <button
                        onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                        className="w-full flex items-center gap-3 px-4 py-2.5 mb-1 cursor-pointer transition-colors duration-150 focus:outline-none bg-transparent border-none text-(--text-secondary) hover:bg-(--error-8) hover:text-(--error)"
                    >
                        <LogOut size={17} strokeWidth={1.75} className="shrink-0" />
                        <span className="text-caption font-semibold">Log out</span>
                    </button>
                </div>
            )}
        </div>
    )
}