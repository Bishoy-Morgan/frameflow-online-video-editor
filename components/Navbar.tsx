'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from '@/hooks/useTheme'
import { Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import Button from './ui/Button'
import whiteLogo from '@/public/whiteLogo.png'
import blackLogo from '@/public/blackLogo.png'

const links = [
    { name: 'Home',     href: '/'         },
    { name: 'Features', href: '/features' },
    { name: 'Pricing',  href: '/pricing'  },
    { name: 'About',    href: '/about'    },
]

const Navbar = () => {
    const router   = useRouter()
    const pathname = usePathname()
    const { isDark, toggleTheme, mounted } = useTheme()

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href)

    return (
        <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-5 px-4 pointer-events-none">
            <nav
                className="pointer-events-auto w-full max-w-[1100px] flex items-center justify-between px-5 py-3 rounded-2xl"
                style={{
                    backgroundColor: 'var(--bg)',
                    border: '1px solid var(--border-default)',
                    boxShadow: mounted && isDark
                        ? '0 0 0 1px var(--border-subtle), 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)'
                        : '0 0 0 1px var(--border-subtle), 0 8px 32px rgba(2,2,2,0.08)',
                }}
            >
                {/* ── Left — logo + links ── */}
                <div className="flex items-center gap-8">

                    {/* Logo */}
                    <Link href="/" className="shrink-0">
                        <Image
                            src={mounted ? (isDark ? whiteLogo : blackLogo) : blackLogo}
                            alt="Frameflow"
                            width={32}
                            height={32}
                            priority
                        />
                    </Link>

                    {/* Divider */}
                    <div
                        className="hidden md:block w-px h-4 shrink-0"
                        style={{ backgroundColor: 'var(--border-strong)' }}
                    />

                    {/* Nav links */}
                    <ul className="hidden md:flex items-center gap-0.5 m-0 p-0 list-none">
                        {links.map((link) => {
                            const active = isActive(link.href)
                            return (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
                                        style={{
                                            color: active ? 'var(--turquoise)' : 'var(--text-tertiary)',
                                            backgroundColor: active ? 'var(--turquoise-8)' : 'transparent',
                                            textDecoration: 'none',
                                        }}
                                        onMouseEnter={e => {
                                            if (!active) {
                                                e.currentTarget.style.color = 'var(--text)'
                                                e.currentTarget.style.backgroundColor = 'var(--surface-raised)'
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (!active) {
                                                e.currentTarget.style.color = 'var(--text-tertiary)'
                                                e.currentTarget.style.backgroundColor = 'transparent'
                                            }
                                        }}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* ── Right — theme toggle + CTA ── */}
                <div className="flex items-center gap-3">

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="relative flex items-center h-8 w-18 rounded-lg cursor-pointer focus:outline-none"
                        style={{
                            backgroundColor: 'var(--surface-raised)',
                            border: '1px solid var(--border-default)',
                        }}
                    >
                        {/* Sliding pill */}
                        {mounted && (
                            <div
                                className="absolute top-[3px] bottom-[3px] w-[1.85rem] rounded-md transition-all duration-300 ease-in-out"
                                style={{
                                    left: isDark ? 'calc(100% - 2.1rem)' : '3px',
                                    backgroundColor: 'var(--bg)',
                                    border: '1px solid var(--border-strong)',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                                }}
                            />
                        )}
                        <div className="relative w-full flex items-center justify-between px-2">
                            <Sun
                                size={13}
                                style={{
                                    color: 'var(--text)',
                                    opacity: mounted ? (isDark ? 0.3 : 1) : 1,
                                    transition: 'opacity 0.2s ease',
                                }}
                            />
                            <Moon
                                size={13}
                                style={{
                                    color: 'var(--text)',
                                    opacity: mounted ? (isDark ? 1 : 0.3) : 0.3,
                                    transition: 'opacity 0.2s ease',
                                }}
                            />
                        </div>
                    </button>

                    {/* Sign In */}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.push('/auth/signin')}
                    >
                        Sign In
                    </Button>
                </div>
            </nav>
        </header>
    )
}

export default Navbar