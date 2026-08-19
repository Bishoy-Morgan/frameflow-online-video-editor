'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from '@/hooks/useTheme'
import { useSession } from 'next-auth/react'
import { Moon, Sun, LayoutDashboard, ChevronDown, LogOut, User } from 'lucide-react'
import Link from 'next/link'
import Button from './ui/Button'
import { useState, useRef, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import whiteLogo from '@/public/whiteLogo.png'
import blackLogo from '@/public/blackLogo.png'

const links = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
]

function UserMenu({ 
        name, 
        email, 
        image 
    }
    : { 
        name?: string | null; 
        email?: string | null; 
        image?: string | null 
    }) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const ref = useRef<HTMLDivElement>(null)
    const [imageFailed, setImageFailed] = useState(false)

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
                className="flex items-center gap-2 px-2 py-1.5 rounded-2xl transition-all duration-150 focus:outline-none"
                style={{
                    backgroundColor: open ? 'var(--surface-raised)' : 'transparent',
                    border: `1px solid ${open ? 'var(--border-default)' : 'transparent'}`,
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-raised)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
                onMouseLeave={e => { if (!open) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent' } }}
            >

                {image && !imageFailed ? (
                    <Image 
                        src={image} 
                        alt={displayName} 
                        width={28} 
                        height={28}
                        className="rounded-lg object-cover shrink-0"
                        style={{ border: '1px solid var(--border-default)' }}
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold shrink-0"
                        style={{ backgroundColor: 'var(--accent-10)', border: '1px solid var(--accent-22)', color: 'var(--accent)' }}>
                        {initials}
                    </div>
                )}
                <ChevronDown size={13} strokeWidth={2}
                    style={{ color: 'var(--text-tertiary)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
            </button>

            {open && (
                <div
                    className="absolute right-0 top-full mt-2 w-52 3xl:w-60 rounded-2xl overflow-hidden z-50"
                    style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-default)', boxShadow: '0 16px 48px rgba(0,0,0,0.14)' }}
                >
                    <div className="flex justify-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <div className="flex flex-col items-center">
                            <span className="text-caption 3xl:text-body font-bold truncate" style={{ color: 'var(--text-secondary)' }}>
                                {displayName}
                            </span>
                            <span className="text-small 3xl:text-caption font-medium truncate" style={{ color: 'var(--text-tertiary)' }}>{email}</span>
                        </div>
                    </div>

                    <div className="py-2 flex justify-center">
                        <Button
                            variant="secondary"
                            size="sm"
                            icon={<User size={14} strokeWidth={1.75} />}
                            onClick={() => { setOpen(false); router.push('/dashboard') }}
                        >
                            Profile
                        </Button>
                    </div>

                    <div className="p-1 flex justify-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={<LogOut size={14} strokeWidth={1.75} />}
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

const Navbar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const { isDark, toggleTheme } = useTheme()
    const { data: session, status } = useSession()
    const isSignedIn = status === 'authenticated'
    const isLoading = status === 'loading'

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href)

    return (
        <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-[2%] px-4 pointer-events-none">
            <nav
                suppressHydrationWarning
                className="pointer-events-auto w-3/4 max-w-350 flex items-center justify-between px-5 py-3 3xl:px-8 3xl:py-4 rounded-2xl"
                style={{
                    backgroundColor: 'var(--bg)',
                    border: '1px solid var(--border-default)',
                    boxShadow: isDark
                        ? '0 0 0 1px var(--border-subtle), 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)'
                        : '0 0 0 1px var(--border-subtle), 0 8px 32px rgba(2,2,2,0.08)',
                }}
            >

                <div className="flex items-center gap-8 ">
                    <Link href="/" className="relative shrink-0 w-10 h-10">
                        <Image
                            src={isDark ? whiteLogo : blackLogo}
                            alt="Frameflow"
                            fill
                            priority
                        />
                    </Link>

                    <div className="hidden md:block w-px h-4 shrink-0" style={{ backgroundColor: 'var(--border-strong)' }} />

                    <ul className="hidden md:flex items-center gap-0.5 m-0 p-0 list-none">
                        {links.map(link => {
                            const active = isActive(link.href)
                            return (
                                <li key={link.name} className="text-caption 3xl:text-lead ">
                                    <Link
                                        href={link.href}
                                        className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all duration-200"
                                        style={{
                                            color: active ? 'var(--accent)' : 'var(--text-tertiary)',
                                            backgroundColor: active ? 'var(--accent-8)' : 'transparent',
                                            textDecoration: 'none',
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

                <div className="flex items-center gap-3">

                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="relative flex items-center h-8 w-18 3xl:h-10 3xl:w-20 rounded-xl cursor-pointer focus:outline-none"
                        style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
                    >
                        <div
                            suppressHydrationWarning
                            className="absolute top-0.75 3xl:top-1 w-7 h-6 3xl:w-8 3xl:h-7 rounded-lg transition-all duration-300 ease-in-out"
                            style={{
                                left: isDark ? 'calc(100% - 2rem)' : '3px',
                                backgroundColor: 'var(--bg)',
                                border: '1px solid var(--border-strong)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                            }}
                        />
                        <div 
                            className="relative w-full flex items-center justify-around "
                        >
                            <Sun 
                                size={13}
                                suppressHydrationWarning 
                                style={{ color: 'var(--text)', opacity: isDark ? 0.3 : 1, transition: 'opacity 0.2s ease' }} 
                            />
                            <Moon 
                                size={13} 
                                suppressHydrationWarning 
                                style={{ color: 'var(--text)', opacity: isDark ? 1 : 0.3, transition: 'opacity 0.2s ease' }} 
                            />
                        </div>
                    </button>

                    {isLoading ? (
                        <div className="w-24 h-8 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--surface-raised)' }} />
                    ) : isSignedIn ? (
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
                                onClick={() => router.push('/auth/signup')}
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