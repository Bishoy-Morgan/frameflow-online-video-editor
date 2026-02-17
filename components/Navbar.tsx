'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import Button from './ui/Button'
import { useTheme } from '@/hooks/useTheme'
import whiteLogo from '@/public/whiteLogo.png'
import blackLogo from '@/public/blackLogo.png'
import { Moon, Sun } from 'lucide-react'
import Link from 'next/link'


const Navbar = () => {
    const router   = useRouter()
    const pathname = usePathname()
    const { isDark, toggleTheme, mounted } = useTheme()

    const links = [
        { name: 'Home',     href: '/'         },
        { name: 'Features', href: '/features' },
        { name: 'Pricing',  href: '/pricing'  },
        { name: 'About',    href: '/about'    },
    ]

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href)

    return (
        <div
            className="
                absolute top-[3%] left-1/2 -translate-x-1/2
                container z-50
                flex items-center justify-between
                py-3 px-6 md:px-8
                rounded-xl
                overflow-hidden
            "
            style={{
                backgroundColor: mounted
                    ? isDark
                        ? 'rgba(2, 2, 2)'
                        : 'rgb(254, 254, 254)'
                    : 'rgb(254, 254, 254)',
                boxShadow: mounted
                    ? isDark
                        ? 'inset 4px 4px 10px rgba(254, 254, 254, 0.1)'
                        : '0 8px 32px rgba(2, 2, 2, 0.4)'
                    : '0 8px 32px rgba(2, 2, 2, 0.1)',
                color: 'var(--text)',
            }}
        >
            {/* Glass inner top — dark mode only */}
            {mounted && isDark && (
                <div
                    className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(254, 254, 254, 0.1) 0%, transparent 100%)',
                        borderRadius: '1rem 1rem 0 0',
                    }}
                />
            )}

            {/* Shine overlay */}
            {mounted && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: isDark
                            ? 'radial-gradient(circle at 100% 0%, rgba(254, 254, 254, 0.15) 0%, transparent 50%)'
                            : 'radial-gradient(circle at 100% 0%, rgba(254, 254, 254, 0.8) 0%, transparent 50%)',
                        mixBlendMode: isDark ? 'soft-light' : 'overlay',
                    }}
                />
            )}

            {/* Left — logo + nav */}
            <div className="flex items-center space-x-3 relative z-10">
                <Image
                    src={mounted ? (isDark ? whiteLogo : blackLogo) : blackLogo}
                    alt="Logo"
                    width={40}
                    height={40}
                    priority
                />
                <ul className="flex items-center space-x-6 ml-10">
                    {links.map((link) => {
                        const active = isActive(link.href)
                        return (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className="relative text-body font-semibold transition-colors duration-200"
                                    style={{
                                        color: active ? 'var(--turquoise)' : 'var(--text)',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {link.name}

                                    {active && (
                                        <span
                                            style={{ boxShadow: '0 0 5px var(--turquoise)' }}
                                        />
                                    )}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* Right — theme toggle + sign in */}
            <div className="flex items-center gap-6 relative z-10">
                <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="relative h-9 w-20 rounded-xl flex items-center border transition-all duration-300"
                    style={{
                        borderColor: 'color-mix(in srgb, var(--text) 20%, transparent)',
                        backgroundColor: 'transparent',
                    }}
                >
                    {/* Sliding pill */}
                    {mounted && (
                        <div
                            className="absolute top-1 bottom-1 w-8 rounded-lg transition-all duration-300 ease-in-out"
                            style={{
                                left: isDark ? 'calc(100% - 2.25rem)' : '0.25rem',
                                backgroundColor: 'color-mix(in srgb, var(--text) 15%, transparent)',
                            }}
                        />
                    )}
                    <div className="relative w-full flex items-center justify-between px-2.5">
                        <Sun
                            size={18}
                            className="transition-opacity duration-300 z-10"
                            style={{ color: 'var(--text)', opacity: mounted ? (isDark ? 0.4 : 1) : 1 }}
                        />
                        <Moon
                            size={18}
                            className="transition-opacity duration-300 z-10"
                            style={{ color: 'var(--text)', opacity: mounted ? (isDark ? 1 : 0.4) : 0.4 }}
                        />
                    </div>
                </button>

                <Button
                    variant="primary"
                    className="py-1!"
                    onClick={() => router.push('/auth/signin')}
                >
                    Sign In
                </Button>
            </div>
        </div>
    )
}

export default Navbar