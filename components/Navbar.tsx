'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from '@/hooks/useTheme'
import { useSession } from 'next-auth/react'
import type { Session } from 'next-auth'
import { Moon, Sun, ChevronDown, ArrowLeftFromLine, User, X, Logs, LayoutDashboardIcon } from 'lucide-react'
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
}: {
    name?: string | null;
    email?: string | null;
    image?: string | null
}) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const ref = useRef<HTMLDivElement>(null)
    const [imageFailed, setImageFailed] = useState(false)

    const initials = name
        ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : (email?.[0] ?? '?').toUpperCase()

    const displayName = name ?? email?.split('@')[0] ?? 'User'
    const firstName = name?.split(' ')[0] ?? email?.split('@')[0] ?? 'User'

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
                className={`flex items-center gap-1 p-1 rounded-xl transition-all duration-150 focus:outline-none hover:shadow-md ${open ? 'shadow-md' : ''}`}
                aria-label="User menu"
                aria-expanded={open}
                aria-haspopup="true"
            >
                {image && !imageFailed ? (
                    <Image
                        src={image}
                        alt={displayName}
                        width={28}
                        height={28}
                        className="rounded-lg object-cover shrink-0"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="p-1 rounded-lg text-(--accent)! text-caption font-medium 3xl:text-lead bg-(--accent-10) border border-(--accent-22)">
                        {initials}
                    </div>
                )}
                <ChevronDown
                    size={18}
                    strokeWidth={2}
                    className={`transition-transform duration-200 opacity-30 hover:opacity-100 ${open ? 'rotate-180 ' : ''}`}
                />
            </button>

            {open && (
                <div
                    className="absolute right-0 top-full mt-2 w-52 3xl:w-60 rounded-2xl overflow-hidden z-50"
                    style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-default)', boxShadow: '0 16px 48px rgba(0,0,0,0.14)' }}
                >
                    <div className="flex justify-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <div className="flex flex-col items-center">
                            <span className="text-caption 3xl:text-lead font-bold truncate" style={{ color: 'var(--text-secondary)' }}>
                                Hello, {firstName}
                            </span>
                            <span className="text-small 3xl:text-caption font-medium truncate" style={{ color: 'var(--text-tertiary)' }}>{email}</span>
                        </div>
                    </div>

                    <div className="py-2 flex justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={<User size={22} strokeWidth={1.5} />}
                            onClick={() => { setOpen(false); router.push('/dashboard') }}
                        >
                            Profile
                        </Button>
                    </div>

                    <div className="py-3 flex justify-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <Button
                            variant="secondary"
                            size="sm"
                            icon={<ArrowLeftFromLine size={22} strokeWidth={1.5} />}
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

function MobileMenu({
    isActive,
    isDark,
    toggleTheme,
    isSignedIn,
    isLoading,
    session,
    router
}: {
    isActive: (href: string) => boolean
    isDark: boolean
    toggleTheme: () => void
    isSignedIn: boolean
    isLoading: boolean
    session: Session | null
    router: ReturnType<typeof useRouter>
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const closeMenu = () => setOpen(false)

    return (
        <div ref={ref} className="relative md:hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150 focus:outline-none hover:shadow-md"
                aria-label="Toggle menu"
                aria-expanded={open}
                aria-haspopup="true"
            >
                {open ? 
                    <X size={30} className="text-(--text)" /> 
                    : <Logs size={30} className="text-(--text) rotate-180" 
                />}
            </button>

            {open && (
                <div
                    className="absolute right-0 top-full mt-2 w-60 rounded-2xl overflow-hidden z-50"
                    style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-default)', boxShadow: '0 16px 48px rgba(0,0,0,0.14)' }}
                >
                    <ul className="flex flex-col m-0 p-2 list-none">
                        {links.map(link => {
                            const active = isActive(link.href)

                            return (
                                <li key={link.name} className="text-caption">
                                    <Link
                                        href={link.href}
                                        onClick={closeMenu}
                                        className={`block px-3.5 py-2.5 rounded-xl font-semibold no-underline transition-all duration-200 ${active ? 'text-(--accent) bg-(--accent-8)' : 'text-(--text-tertiary) hover:text-(--accent) focus-visible:text-(--accent) focus-visible:bg-(--accent-4)'}`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    <div className="px-3 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <span className="text-caption font-semibold text-(--text-tertiary)">
                            Theme
                        </span>

                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="relative flex items-center h-8 w-18 rounded-xl cursor-pointer focus:outline-none"
                            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
                        >
                            <div
                                suppressHydrationWarning
                                className={`absolute top-0.75 w-7 h-6 rounded-lg transition-all duration-300 ease-in-out border border-(--border-strong) shadow-sm ${isDark ? 'left-9.5 bg-(--accent-16)' : 'left-0.75'}`}
                            />

                            <div className="relative w-full flex items-center justify-around">
                                <Sun
                                    size={16}
                                    suppressHydrationWarning
                                    className={`text-(--text) transition-opacity duration-200 ${isDark ? 'opacity-30' : 'opacity-100'}`}
                                />
                                <Moon
                                    size={16}
                                    suppressHydrationWarning
                                    className={`text-(--text) transition-opacity duration-200 ${isDark ? 'opacity-100' : 'opacity-30'}`}
                                />
                            </div>
                        </button>
                    </div>

                    <div className="p-3 flex flex-col gap-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        {isLoading ? (
                            <div className="w-full h-9 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--surface-raised)' }} />
                        ) : isSignedIn ? (
                            <>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    icon={<LayoutDashboardIcon size={20} strokeWidth={2} />}
                                    onClick={() => { closeMenu(); router.push('/dashboard') }}
                                >
                                    Dashboard
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={<User size={20} strokeWidth={1.5} />}
                                    onClick={() => { closeMenu(); router.push('/dashboard') }}
                                >
                                    Profile
                                </Button>

                                <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={<ArrowLeftFromLine size={20} strokeWidth={1.5} />}
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                >
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { closeMenu(); router.push('/auth/signin') }}
                                >
                                    Sign In
                                </Button>

                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => { closeMenu(); router.push('/auth/signup') }}
                                >
                                    Get Started
                                </Button>
                            </>
                        )}
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
        <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-8 w-full pointer-events-none">
            <nav
                suppressHydrationWarning
                className={`relative pointer-events-auto w-4/5 max-w-350 flex items-center justify-between px-5 py-3 3xl:px-8 3xl:py-4 rounded-2xl border border-(--border-default) bg-(--bg) ${isDark ? 'shadow-accent ' : 'shadow-md'}`}
            >
                <div className="flex items-center gap-8">
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
                                <li key={link.name} className="text-caption 3xl:text-lead">
                                    <Link
                                        href={link.href}
                                        className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold no-underline transition-all duration-200 ${active ? 'text-(--accent) bg-(--accent-8)' : 'text-(--text-tertiary) hover:text-(--accent) focus-visible:text-(--accent) focus-visible:bg-(--accent-4)'}`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="relative flex items-center h-8 w-18 3xl:h-10 3xl:w-20 rounded-xl cursor-pointer focus:outline-none"
                            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
                        >
                            <div
                                suppressHydrationWarning
                                className={`absolute top-0.75 3xl:top-1 w-7 h-6 3xl:w-9 3xl:h-7.5 rounded-lg transition-all duration-300 ease-in-out border border-(--border-strong) shadow-sm ${isDark ? 'left-9.5 3xl:left-10 bg-(--accent-16)' : 'left-0.75 3xl:left-1'}`}
                            />

                            <div className="relative w-full flex items-center justify-around">
                                <Sun
                                    size={16}
                                    suppressHydrationWarning
                                    className={`text-(--text) transition-opacity duration-200 ${isDark ? 'opacity-30' : 'opacity-100'}`}
                                />
                                <Moon
                                    size={16}
                                    suppressHydrationWarning
                                    className={`text-(--text) transition-opacity duration-200 ${isDark ? 'opacity-100' : 'opacity-30'}`}
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
                                    icon={<LayoutDashboardIcon size={22} strokeWidth={2}  />}
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

                    <MobileMenu
                        isActive={isActive}
                        isDark={isDark}
                        toggleTheme={toggleTheme}
                        isSignedIn={isSignedIn}
                        isLoading={isLoading}
                        session={session}
                        router={router}
                    />
                </div>
            </nav>
        </header>
    )
}

export default Navbar