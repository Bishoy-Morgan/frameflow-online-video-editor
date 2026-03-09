'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from '@/hooks/useTheme'
import { useSession } from 'next-auth/react'
import { Moon, Sun, LayoutDashboard, ChevronDown, LogOut } from 'lucide-react'
import Link from 'next/link'
import Button from './ui/Button'
import { useState, useRef, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import whiteLogo from '@/public/whiteLogo.png'
import blackLogo from '@/public/blackLogo.png'

const links = [
    { name: 'Home',      href: '/'         },
    { name: 'Features',  href: '/features' },
    { name: 'Pricing',   href: '/pricing'  },
    { name: 'About',     href: '/about'    },
]

// User avatar dropdown (shown when signed in)

function UserMenu({ name, email, image }: { name?: string | null; email?: string | null; image?: string | null }) {
    const [open, setOpen] = useState(false)
    const router          = useRouter()
    const ref             = useRef<HTMLDivElement>(null)

    const initials    = name
        ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : (email?.[0] ?? '?').toUpperCase()
    const displayName = name ?? email?.split('@')[0] ?? 'User'

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
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-150 focus:outline-none"
                style={{
                    backgroundColor: open ? 'var(--surface-raised)' : 'transparent',
                    border: `1px solid ${open ? 'var(--border-default)' : 'transparent'}`,
                    cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-raised)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
                onMouseLeave={e => { if (!open) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent' } }}
            >
                {/* Avatar */}
                {image ? (
                    <Image src={image} alt={displayName} width={28} height={28}
                        className="rounded-lg object-cover shrink-0"
                        style={{ border: '1px solid var(--border-default)' }} />
                ) : (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ backgroundColor: 'var(--turquoise-10)', border: '1px solid var(--turquoise-22)', color: 'var(--turquoise)' }}>
                        {initials}
                    </div>
                )}
                <ChevronDown size={13} strokeWidth={2}
                    style={{ color: 'var(--text-tertiary)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-50"
                    style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-default)', boxShadow: '0 16px 48px rgba(0,0,0,0.14)' }}
                >
                    {/* Identity */}
                    <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        {image ? (
                            <Image src={image} alt={displayName} width={32} height={32}
                                className="rounded-lg object-cover shrink-0"
                                style={{ border: '1px solid var(--border-default)' }} />
                        ) : (
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                                style={{ backgroundColor: 'var(--turquoise-10)', border: '1px solid var(--turquoise-22)', color: 'var(--turquoise)' }}>
                                {initials}
                            </div>
                        )}
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold truncate" style={{ color: 'var(--text-secondary)' }}>{displayName}</span>
                            <span className="text-[0.62rem] font-medium truncate" style={{ color: 'var(--text-tertiary)' }}>{email}</span>
                        </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-1">
                        <button
                            onClick={() => { setOpen(false); router.push('/dashboard') }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors duration-150 focus:outline-none"
                            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-raised)'; e.currentTarget.style.color = 'var(--text)' }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
                        >
                            <LayoutDashboard size={14} strokeWidth={1.75} />
                            <span className="text-sm font-semibold">Dashboard</span>
                        </button>
                    </div>

                    {/* Sign out */}
                    <div className="p-1" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors duration-150 focus:outline-none"
                            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#ef4444' }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
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

// Navbar

const Navbar = () => {
    const router            = useRouter()
    const pathname          = usePathname()
    const { isDark, toggleTheme } = useTheme()
    const { data: session, status } = useSession()
    const isSignedIn        = status === 'authenticated'
    const isLoading         = status === 'loading'

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href)

    return (
        <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-5 px-4 pointer-events-none">
            <nav
                suppressHydrationWarning
                className="pointer-events-auto w-full max-w-275 flex items-center justify-between px-5 py-3 rounded-2xl"
                style={{
                    backgroundColor: 'var(--bg)',
                    border: '1px solid var(--border-default)',
                    boxShadow: isDark
                        ? '0 0 0 1px var(--border-subtle), 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)'
                        : '0 0 0 1px var(--border-subtle), 0 8px 32px rgba(2,2,2,0.08)',
                }}
            >
                {/* ── Left — logo + links ── */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="shrink-0">
                        <Image
                            src={isDark ? whiteLogo : blackLogo}
                            alt="Frameflow"
                            width={32} height={32}
                            priority suppressHydrationWarning
                        />
                    </Link>

                    <div className="hidden md:block w-px h-4 shrink-0" style={{ backgroundColor: 'var(--border-strong)' }} />

                    <ul className="hidden md:flex items-center gap-0.5 m-0 p-0 list-none">
                        {links.map(link => {
                            const active = isActive(link.href)
                            return (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
                                        style={{
                                            color:           active ? 'var(--turquoise)' : 'var(--text-tertiary)',
                                            backgroundColor: active ? 'var(--turquoise-8)' : 'transparent',
                                            textDecoration:  'none',
                                        }}
                                        onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.backgroundColor = 'var(--surface-raised)' } }}
                                        onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.backgroundColor = 'transparent' } }}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* ── Right — theme toggle + auth ── */}
                <div className="flex items-center gap-3">

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="relative flex items-center h-8 w-18 rounded-lg cursor-pointer focus:outline-none"
                        style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
                    >
                        <div
                            suppressHydrationWarning
                            className="absolute top-0.75 bottom-0.75 w-[1.85rem] rounded-md transition-all duration-300 ease-in-out"
                            style={{
                                left:            isDark ? 'calc(100% - 2.1rem)' : '3px',
                                backgroundColor: 'var(--bg)',
                                border:          '1px solid var(--border-strong)',
                                boxShadow:       '0 1px 3px rgba(0,0,0,0.12)',
                            }}
                        />
                        <div className="relative w-full flex items-center justify-between px-2">
                            <Sun  size={13} suppressHydrationWarning style={{ color: 'var(--text)', opacity: isDark ? 0.3 : 1,   transition: 'opacity 0.2s ease' }} />
                            <Moon size={13} suppressHydrationWarning style={{ color: 'var(--text)', opacity: isDark ? 1   : 0.3, transition: 'opacity 0.2s ease' }} />
                        </div>
                    </button>

                    {/* Auth area */}
                    {isLoading ? (
                        // Skeleton while session loads — prevents layout shift
                        <div className="w-24 h-8 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--surface-raised)' }} />
                    ) : isSignedIn ? (
                        // Signed in — show Dashboard link + avatar dropdown
                        <div className="flex items-center gap-2">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => router.push('/dashboard')}
                                icon={<LayoutDashboard size={13} strokeWidth={2} />}
                            >
                                Dashboard
                            </Button>
                            <UserMenu
                                name={session.user?.name}
                                email={session.user?.email}
                                image={session.user?.image}
                            />
                        </div>
                    ) : (
                        // Not signed in — show Sign In + Get Started
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/auth/signin')}
                            >
                                Sign In
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => router.push('/auth/signin')}
                            >
                                Get Started
                            </Button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar