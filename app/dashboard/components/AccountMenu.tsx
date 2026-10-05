'use client'

import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useTheme } from '@/hooks/useTheme'
import { User, Settings, CircleDot, CreditCard, LogOut, Sun, Spotlight } from 'lucide-react'

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
            <Icon size={20} strokeWidth={2} className="shrink-0 text-tertiary group-hover:text-(--accent) group-hover:scale-110 transition-all duration-150" />
            <span className="text-caption font-semibold flex-1 text-left group-hover:text-(--accent) group-hover:translate-x-1 transition-transform duration-200">{label}</span>
            {trailing}
        </>
    )

    if (trailing) {
        return (
            <div className="w-full flex items-center gap-3 px-4 py-2.5 text-secondary ">
                {content}
            </div>
        )
    }

    return (
        <button
            onClick={onClick}
            className="group w-full flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-150 focus:outline-none bg-transparent border-none text-secondary hover:bg-(--accent-8) rounded-xl"
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
                className={`group/user flex items-center gap-2.5 rounded-xl transition-all duration-150 cursor-pointer focus:outline-none w-full ${
                    expanded ? 'h-12 px-3' : 'h-12 justify-center'
                }`}
            >
                {image ? 
                    <Image 
                        src={image} 
                        alt={displayName} 
                        width={28} 
                        height={28} 
                        className="rounded-xl object-cover shrink-0" 
                    />
                    : <div className="w-10 h-10 rounded-xl flex items-center justify-center text-hero font-bold shrink-0 bg-accent-10 text-accent group-hover/user:bg-(--accent) group-hover/user:text-(--bg) shadow-xl transition-all duration-500">
                        {initials}
                    </div>}
                {expanded && (
                    <div className="flex flex-col min-w-0 gap-0.5 group-hover/user:translate-x-1 transition-all duration-500">
                        <span className="text-caption font-bold text-secondary truncate leading-none whitespace-nowrap">{displayName}</span>
                        <span className="text-tiny text-tertiary font-medium leading-none whitespace-nowrap">{isAdmin ? 'Admin' : 'Free plan'}</span>
                    </div>
                )}
            </button>

            {open && (
                <div className="absolute left-full bottom-0 ml-3 w-72 rounded-xl p-1 overflow-hidden z-80 flex flex-col bg-(--bg) border border-accent-10 glow-accent-40">

                    <div className="px-2 pt-3 pb-2">
                        <span className="text-tiny font-bold uppercase tracking-wide text-tertiary px-2">Account</span>
                    </div>

                    <div className="w-full flex items-center gap-3 px-4 py-2.5">
                        {image
                            ? <Image src={image} alt={displayName} width={36} height={36} className="rounded-xl object-cover shrink-0" />
                            : <div className="w-9 h-9 rounded-xl flex items-center justify-center text-body font-bold shrink-0 bg-(--accent-10) text-accent">
                                {initials}
                            </div>}
                        <div className="flex flex-col min-w-0 flex-1 text-left">
                            <span className="text-caption font-bold text-(--text-secondary) truncate">{displayName}</span>
                            <span className="text-tiny text-tertiary font-medium truncate">{email}</span>
                        </div>
                    </div>

                    <div className="h-px bg-(--border-subtle) my-1" />

                    <MenuRow icon={User} label="Your account" onClick={() => go('/dashboard/account')} />
                    <MenuRow icon={Settings} label="Settings" onClick={() => go('/dashboard/settings')} />

                    <MenuRow
                        icon={CircleDot}
                        label="Theme"
                        trailing={
                            <button
                                onClick={e => { e.stopPropagation(); toggleTheme() }}
                                aria-label={isDark ? 'Switch to daylight' : 'Turn on lamp'}
                                className={`group relative flex h-8 w-8 items-center justify-center rounded-xl border border-default bg-raised/80 cursor-pointer transition-all focus:outline-none shadow ${
                                    isDark ? 'shadow-white/50' : 'shadow-black/10'
                                }`}
                                suppressHydrationWarning
                            >
                                <span>
                                    {isDark ? (
                                        <Spotlight suppressHydrationWarning size={18} strokeWidth={2} />
                                    ) : (
                                        <Sun suppressHydrationWarning size={18} strokeWidth={2} />
                                    )}
                                </span>

                                <span className="pointer-events-none absolute right-full top-1/2 z-50 mr-2 -translate-y-1/2 rounded-xl bg-overlay px-2.5 py-1.5 text-small whitespace-nowrap text-secondary opacity-0 shadow transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                                    {isDark ? 'Switch to daylight' : 'Turn on lamp'}
                                </span>
                            </button>
                        }
                    />

                    <MenuRow icon={CreditCard} label="Plans and pricing" onClick={() => go('/pricing')} />

                    <div className="h-px bg-(--border-subtle) my-1" />

                    <button
                        onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                        className="group/error w-full flex items-center gap-3 px-4 py-2.5 mb-1 rounded-b-xl cursor-pointer transition-colors duration-150 focus:outline-none bg-transparent border-none text--secondary hover:bg-(--error-22)"
                    >
                        <LogOut size={17} strokeWidth={2} className="shrink-0 group-hover/error:text-(--error-fg)" />
                        <span className="text-caption font-semibold">Log out</span>
                    </button>
                </div>
            )}
        </div>
    )
}